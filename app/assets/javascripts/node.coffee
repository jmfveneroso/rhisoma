Number.prototype.clamp = (min, max) ->
  Math.min(Math.max(this, min), max)

class Api
  @get_graph: -> $.get '/nodes/graph/show',
  @delete_node: (id) -> $.ajax(url: '/nodes/' + id, method: 'DELETE')

  @create_edge: (id, target_id) ->
    $.post '/nodes/' + id + '/connect', 'edge[target_id]': target_id

  @delete_edge: (id, target_id) ->
    $.ajax
      url: '/nodes/' + id + '/disconnect'
      method: 'DELETE',
      data: {
        'edge[target_id]': target_id
      }

class Vector
  constructor: (x, y) ->
    this.x = x
    this.y = y

  add: (v) -> new Vector(this.x + v.x, this.y + v.y)
  sub: (v) -> new Vector(this.x - v.x, this.y - v.y)
  multiply: (scalar) -> new Vector(this.x * scalar, this.y * scalar)
  norm: -> Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))

  normalize: ->
    return new Vector(this.x, this.y) if this.norm() == 0
    new Vector(this.x / this.norm(), this.y / this.norm())

  distance_to: (v) -> Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2))

class Canvas
  constructor: ->
    this.view = $('#main_canvas')[0]
    this.ctx = this.view.getContext '2d'

  draw_circle: (pos, radius, fill) ->
    this.ctx.beginPath()
    this.ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = '#ff0000' if fill
    this.ctx.fill() if fill
    this.ctx.fillStyle = '#000000'
    this.ctx.stroke()

  draw_line: (x1, y1, x2, y2) ->
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()

  draw_text: (text, pos) ->
    this.ctx.font = "10px Arial"
    this.ctx.fillText(text, pos.x, pos.y)

  clear: ->
    this.ctx.clearRect(0, 0, this.view.width, this.view.height)

  Object.defineProperty Canvas.prototype, 'width',  get: -> this.view.width
  Object.defineProperty Canvas.prototype, 'height', get: -> this.view.height

class Node
  @repel_constant = 10
  @constraint_constant = 10
  @friction_constant = 0.01
  @attraction_constant = 0.0001

  constructor: (id, title) ->
    this.id = id
    this.title = title
    this.pos = new Vector(10, 10)
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

  add_repel_force: (vector, force) ->
    distance_squared = Math.pow(this.pos.x - vector.x, 2) + Math.pow(this.pos.y - vector.y, 2)
    scalar = force / (distance_squared + 0.00001)
    repel_vector = this.pos.sub(vector).normalize().multiply(scalar)
    this.force = this.force.add repel_vector

  add_attraction_force: (vector, force) ->
    scalar = Node.attraction_constant * this.pos.distance_to(vector)
    attraction_vector = vector.sub(this.pos).normalize().multiply(scalar)
    this.force = this.force.add attraction_vector

  has_child: (node) ->
    Boolean(this.children.find (val) ->
      val.id == node.id
    )

class Graph
  nodes = {}
  selected_node_id: null
  dragging: false

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

  load: ->
    canvas = this.canvas
    return Api.get_graph().done (data) ->
        console.log data
        for node in data.nodes
          new_node = new Node(node.id, node.title)
          new_node.pos.x = Math.random() * canvas.width
          new_node.pos.y = Math.random() * canvas.height
          nodes[node.id] = new_node

        for edge in data.edges
          nodes[edge.source_id].children.push(nodes[edge.target_id])

  calculate_repel_forces: (node) ->
    node.add_repel_force n.pos, Node.repel_constant for key, n of nodes

  calculate_elastic_forces: (node) ->
    for key, n of node.children
      node.add_attraction_force n.pos, Node.attraction_constant
      n.add_attraction_force node.pos, Node.attraction_constant

  calculate_constraint_forces: (node) ->
    constraint_distances = {
      up:    new Vector(node.pos.x, this.canvas.height),
      down:  new Vector(node.pos.x, 0),
      left:  new Vector(0, node.pos.y),
      right: new Vector(this.canvas.width, node.pos.y)
    }

    for key, val of constraint_distances
      node.add_repel_force val, Node.repel_constant / 10

    # Center constraint
    center = new Vector(this.canvas.width / 2, this.canvas.height / 2)
    node.add_repel_force center, Node.repel_constant / 100

  limit_to_bounds: (node) ->
    node.pos.x = node.pos.x.clamp 1, this.canvas.width - 1
    node.pos.y = node.pos.y.clamp 1, this.canvas.height - 1

  calculate_forces: ->
    for key, node of nodes
      this.calculate_repel_forces node
      this.calculate_constraint_forces node
      this.calculate_elastic_forces node

  refresh_canvas: ->
    this.canvas.clear()
    for key, node of nodes
      this.canvas.draw_circle node.pos, 10, this.selected_node_id == node.id
      this.canvas.draw_text node.id, node.pos.add(new Vector(-5, 4))
      for target in node.children
        this.canvas.draw_line node.pos.x, node.pos.y,
        target.pos.x, target.pos.y

  update_position: ->
    this.calculate_forces()
    for key, node of nodes
      friction_vector = node.velocity.multiply(-Node.friction_constant)
      node.force = node.force.add(friction_vector)

      node.velocity = node.velocity.add(node.force)
      node.pos = node.pos.add(node.velocity)
      node.force = new Vector(0, 0)
      this.limit_to_bounds(node)
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
    node.velocity = new Vector(0, 0)
    node.force = new Vector(0, 0)

    for key, n of nodes
      if node.pos.distance_to(n.pos) < 20 && n.id != node.id
        if !node.has_child(n) && !n.has_child(node)
          node.connect_to n
        else
          node.disconnect n
        this.dragging = false
        break

  create_node: ->
    self = this
    $.post '/nodes',
      'node[title]': 'New title'
      (data) ->
        console.log data
        node = new Node(data.id, data.title)
        node.pos.x = Math.random() * self.canvas.width
        node.pos.y = Math.random() * self.canvas.height
        self.select_node node
        nodes[node.id] = node

  edit_selected_node: (id, title) ->
    self = this
    $.ajax(
      url: '/nodes/' + self.selected_node_id
      method: 'PATCH',
      data: {
        'node[title]': $('#node\\[title\\]').val()
      }
    ).done (data) ->
      console.log data
      self.selected_node().title = data.title

  selected_node: -> nodes[this.selected_node_id]

  delete_selected_node: ->
    self = this
    this.selected_node().destroy().done (data) ->
      console.log data
      node.remove_node self.selected_node() for key, node of nodes
      delete nodes[self.selected_node().id]

$(document).ready ->
  graph = new Graph(new Canvas)
  setInterval () ->
    graph.update_position()
  , 30

  $('#create_node').on 'click': -> graph.create_node()
  $('#edit_node').on   'click': -> graph.edit_selected_node()
  $('#delete_node').on 'click': -> graph.delete_selected_node()
  $('#refresh').on     'click': -> graph.load()
