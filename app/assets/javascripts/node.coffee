class Canvas
  ctx: null
 
  constructor: ->
    view = $('#main_canvas')[0]
    this.ctx = view.getContext '2d'

  draw_circle: ->
    this.ctx.beginPath()
    this.ctx.arc(95, 50, 40, 0, 2*Math.PI);
    this.ctx.stroke()

class Node
  id: null
  title: null
  children: []

  x: 0
  y: 0
  velocity: 0
 
  constructor: (id, title) ->
    this.id = id
    this.title = title

  connect_to: (target_id) ->
    console.log 'wtf' + this.id
    $.post '/nodes/' + this.id + '/connect', 
      'edge[target_id]': 25
      (data) -> 
        console.log data

class Graph
  nodes = {}
    
  create_node: ->
    $.post '/nodes', 
      'node[title]': 'somuchenergy'
      (data) -> 
        console.log data
        node = new Node(data.id, data.title)
        nodes[node.id] = node
        node.connect_to 25

  edit_node: (id, title) ->
    $.ajax(
      url: '/nodes/' + id
      method: 'PATCH',
      data: {
        'node[title]': title
        'node[active]': true
        'node[hidden]': false
      }
    ).done (data) -> 'EDIT: ' + console.log data

class App
  graph = new Graph
  canvas = null

  run: ->
    $(document).ready ->
      $('#create_node').on 'click': graph.create_node
        

      $('#edit_node').on 'click': -> 
        graph.edit_node(25, 'new-bonga')
      
      canvas = new Canvas
      canvas.draw_circle()

(new App).run()
