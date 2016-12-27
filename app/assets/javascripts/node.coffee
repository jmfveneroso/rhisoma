Number.prototype.clamp = (min, max) -> Math.min(Math.max(this, min), max)

class Api
  @get_graph: -> $.get '/nodes/graph/show',

  @delete_node: (id) -> $.ajax(url: '/nodes/' + id, method: 'DELETE')

  @create_edge: (id, target_id) ->
    $.post '/nodes/' + id + '/connect', 'edge[target_id]': target_id

  @delete_edge: (id, target_id) ->
    $.ajax
      url: '/nodes/' + id + '/disconnect'
      method: 'DELETE',
      data: 'edge[target_id]': target_id

  @create_node: (title) ->
    $.post '/nodes', 'node[title]': title

  @edit_node: (id, title) ->
    $.ajax
      url: '/nodes/' + id
      method: 'PATCH',
      data: 'node[title]': title

class Canvas
  constructor: ->
    this.view = $('#main_canvas')[0]
    this.ctx = this.view.getContext '2d'

  draw_circle: (pos, radius, fill) ->
    this.ctx.beginPath()
    this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = if fill then '#ff0000' else '#ffffff'
    this.ctx.fill()
    this.ctx.fillStyle = '#000000'
    this.ctx.stroke()

  draw_line: (x1, y1, x2, y2) ->
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()

  draw_text: (text, pos) ->
    this.ctx.font = '10px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(text, pos.x, pos.y)

  clear: -> this.ctx.clearRect(0, 0, this.view.width, this.view.height)

class Vector
  constructor: (x, y) ->
    this.x = x
    this.y = y

  make_null: -> this.x = this.y = 0

  add: (v) -> new Vector(this.x + v.x, this.y + v.y)

  sub: (v) -> new Vector(this.x - v.x, this.y - v.y)

  multiply: (scalar) -> new Vector(this.x * scalar, this.y * scalar)

  norm: -> Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))

  normalize: ->
    return new Vector(this.x, this.y) if this.norm() == 0
    new Vector(this.x / this.norm(), this.y / this.norm())

  distance_to: (v) -> Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2))

class Node
  constructor: (id, title, pos) ->
    this.id = id
    this.title = title
    this.pos = pos || new Vector(10, 10)
    this.velocity = new Vector(0, 0)
    this.force = new Vector(0, 0)
    this.children = []

  destroy: -> Api.delete_node(this.id)

  remove_node: (node) ->
    this.children.splice(idx, 1) if (idx = this.children.indexOf(node)) != -1

  connect_to: (node) ->
    Api.create_edge this.id, node.id
    this.children.push node

  disconnect: (node) ->
    Api.delete_edge this.id, node.id
    Api.delete_edge node.id, this.id
    this.remove_node node
    node.remove_node this

  has_child: (node) -> this.children.find (val) -> val.id == node.id

class Physics
  @repulsion_constant = 10
  @attraction_constant = 0.0001
  @friction_constant = 0.01

  @add_repulsive_force: (node, v, force) ->
    distance_squared = Math.pow(node.pos.x - v.x, 2) + Math.pow(node.pos.y - v.y, 2)
    repel_vector = node.pos.sub(v).normalize().multiply(force / (distance_squared + 0.00001))
    node.force = node.force.add repel_vector

  @add_attractive_force: (node, v, force) ->
    scalar = force * node.pos.distance_to(v)
    attraction_vector = v.sub(node.pos).normalize().multiply(scalar)
    node.force = node.force.add attraction_vector

  @calculate_repulsive_forces: (node, nodes) ->
    for key, n of nodes
      return if n.id == node.id
      @add_repulsive_force node, n.pos, @repulsion_constant

  @calculate_elastic_forces: (node) ->
    for key, n of node.children
      @add_attractive_force node, n.pos, @attraction_constant
      @add_attractive_force n, node.pos, @attraction_constant

  @calculate_constraint_forces: (node, width, height) ->
    constraint_distances = {
      up:    new Vector(node.pos.x, height),
      down:  new Vector(node.pos.x, 0),
      left:  new Vector(0, node.pos.y),
      right: new Vector(width, node.pos.y)
    }

    for key, val of constraint_distances
      @add_repulsive_force node, val, @repulsion_constant

    # Central repelling force.
    # center = new Vector(width * 0.5, height * 0.5)
    # @add_repulsive_force node, center, @repulsion_constant * 0.01

  @calculate_friction_force: (node) ->
    friction_vector = node.velocity.multiply(-@friction_constant)
    node.force = node.force.add(friction_vector)

  @calculate_forces: (nodes, width, height) ->
    for key, node of nodes
      this.calculate_repulsive_forces node, nodes
      this.calculate_elastic_forces node
      this.calculate_constraint_forces node, width, height
      this.calculate_friction_force node

  @update_motion: (nodes) ->
    for key, node of nodes
      node.velocity = node.velocity.add(node.force)
      node.pos = node.pos.add(node.velocity)
      node.force.make_null()

class Graph
  nodes = {}
  selected_node_id: null
  dragging: false
  self = null

  constructor: (canvas) ->
    this.canvas = canvas
    self = this

    $('#main_canvas').on
      mousedown: (e) ->
        offset = $(this).offset()
        event = { x: e.pageX - offset.left, y: e.pageY - offset.top }
        self.canvas_mousedown event
      mouseup: -> self.dragging = false
      mouseleave: -> self.dragging = false
      mousemove: (e) ->
        offset = $(this).offset()
        event = { x: e.pageX - offset.left, y: e.pageY - offset.top }
        self.canvas_mousemove event

  random_pos: () -> new Vector(Math.random() * this.canvas.view.width,
                               Math.random() * this.canvas.view.height)

  limit_to_bounds: (node) ->
    node.pos.x = node.pos.x.clamp 1, this.canvas.view.width - 1
    node.pos.y = node.pos.y.clamp 1, this.canvas.view.height - 1

  load: ->
    return Api.get_graph().done (data) ->
      for node in data.nodes
        new_node = new Node(node.id, node.title, self.random_pos())
        nodes[node.id] = new_node

      for edge in data.edges
        nodes[edge.source_id].children.push(nodes[edge.target_id])

  refresh_canvas: ->
    this.canvas.clear()
    for key, node of nodes
      for target in node.children
        this.canvas.draw_line node.pos.x, node.pos.y,
        target.pos.x, target.pos.y
    for key, node of nodes
      this.canvas.draw_circle node.pos, 10, this.selected_node_id == node.id
      this.canvas.draw_text node.id, node.pos.add(new Vector(0, 4))

  update_position: ->
    Physics.calculate_forces nodes, this.canvas.view.width, this.canvas.view.height
    Physics.update_motion nodes
    this.limit_to_bounds(node) for key, node of nodes
    this.refresh_canvas()

  select_node: (node) ->
    this.selected_node_id = node.id
    $('#node\\[id\\]').val node.id
    $('#node\\[title\\]').val node.title

  canvas_mousedown: (e) ->
    this.dragging = true
    for key, node of nodes
      if node.pos.distance_to(new Vector(e.x, e.y)) < 10
        this.select_node node
        break

  canvas_mousemove: (e) ->
    return if !this.dragging
    node = nodes[this.selected_node_id]
    node.pos = new Vector(e.x, e.y)
    node.velocity.make_null()
    node.force.make_null()

    for key, n of nodes
      if node.pos.distance_to(n.pos) < 20 && n.id != node.id
        if !node.has_child(n) && !n.has_child(node)
          node.connect_to n
        else
          node.disconnect n
        this.dragging = false
        break

  selected_node: -> nodes[this.selected_node_id]

  create_node: ->
    Api.create_node('New title').done (data) ->
      nodes[data.id]= new Node(data.id, data.title, self.random_pos())
      self.select_node nodes[data.id]

  edit_selected_node: (id, title) ->
    Api.edit_node(this.selected_node_id, $('#node\\[title\\]').val())
      .done (data) -> self.selected_node().title = data.title

  delete_selected_node: ->
    this.selected_node().destroy().done (data) ->
      node.remove_node self.selected_node() for key, node of nodes
      delete nodes[self.selected_node().id]

$(document).ready ->
  try
    graph = new Graph(new Canvas)
    setInterval () ->
      graph.update_position()
    , 10

    $('#create_node').on 'click': -> graph.create_node()
    $('#edit_node').on   'click': -> graph.edit_selected_node()
    $('#delete_node').on 'click': -> graph.delete_selected_node()
    $('#refresh').on     'click': -> graph.load()

    graph.load()
  catch err
    console.log err
