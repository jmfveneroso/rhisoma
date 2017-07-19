var Converter = (function (){
  var master = this;
  var json;
  var converted_json;

  this.convertNode = function (data) {
    var node = {};
    node.id          = data.id;
    node.name        = data.title || '';
    node.description = data.description || '';
    node.group       = data.styling_group_id || '_DEFAULT';
    switch (data.type) {
      case 'CategoryNode': node.type = 'categoria'; break;
      case 'TaskNode':     node.type = 'tarefa'; break;
      case 'TextNode':     node.type = 'texto'; break;
      case 'LinkNode':     node.type = 'link'; break;
      case 'WormHoleNode': node.type = 'buraco'; break;
      default: break;
    }

    node.date_start    = data.start_date || '';
    node.date_end      = data.end_date || '';
    node.date_complete = data.complete_date || '';
    switch (data.collapse) {
      case false: node.collapse = 0; break;
      case true:     node.collapse = 1; break;
      default: node.collapse = 1; break;
    }
    switch (data.standby) {
      case false: node.standby = 0; break;
      case true:     node.standby = 1; break;
      default: node.standby = 0; break;
    }

    // node.collapse      = data.collapse || 1;
    // node.standby       = data.standby || 0;
    node.fx            = data.fx || undefined;
    node.fy            = data.fy || undefined;
    node.x             = data.x  || undefined;
    node.y             = data.y  || undefined;
    node.vx            = data.vx || undefined;
    node.vy            = data.vy || undefined;
    node.target_territory_id = data.target_territory_id || undefined;
    return node;
  }

  this.convertNodeType = function(type){
    switch (type) {
      case 'categoria': return 'CategoryNode';
      case 'tarefa':    return 'TaskNode';
      case 'texto':     return 'TextNode';
      case 'link':      return 'LinkNode';
      case 'buraco':    return 'WormHoleNode';
      default:          throw new Error('Invalid node type: ' + type);
    }
  }

  this.serializeNode = function(data){
    var node = {};

    for (key in data) {
      // if (isNull(data[key])) continue;

      switch (key) {
        case 'name': node['node[title]'] = data.name; break;
        case 'group': node['node[styling_group_id]'] = data.group; break;
        case 'type': node['node[type]'] = master.convertNodeType(data.type); break;
        case 'date_start': node['node[start_date]'] = data.date_start; break;
        case 'date_end': node['node[end_date]'] = data.date_end; break;
        case 'date_complete': node['node[complete_date]'] = data.date_complete; break;
        default: node['node[' + key + ']'] = data[key]; break;
      }
    }
    return node;
  }

  this.serializeEdge = function(data){
    var edge = {};
    edge['edge[source_id]'] = data.source;
    edge['edge[target_id]'] = data.target;
    switch (data.type) {
      case 1:  edge['edge[category]'] = "Dependency"; break;
      case 3:  edge['edge[category]'] = "Positioning"; break;
      case 2:  edge['edge[category]'] = "Relationship"; break;
      default: edge['edge[category]'] = "Dependency"; break;
    }
    edge['edge[id]'] = data.id;
    // edge['edge[category]']  = data.type || "Dependency";
    return edge;
  }

  this.convertEdge = function(data){
    var edge = {};
    edge.id = data.id;
    edge.source = data.source_id;
    edge.target = data.target_id;
    switch (data.category) {
      case 'Dependency':    edge.type = 1; break;
      case 'Positioning':     edge.type = 3; break;
      case 'Relationship':     edge.type = 2; break;
      default: break;
    }
    return edge;
  }

  this.isNull = function (data){
    return (data === null || data === undefined || data === "");
  }

  this.convertJSON = function(in_data){
    converted_json = {};
    converted_json.nodes = [];
    converted_json.links = [];
    converted_json.groups = in_data.styling_groups;

    for(var i = 0; i < in_data.nodes.length; i++){
      converted_json.nodes.push(master.convertNode(in_data.nodes[i]));
    }

    for(var i = 0; i < in_data.edges.length; i++){
      converted_json.links.push({});
      converted_json.links[i].id = in_data.edges[i].id;
      converted_json.links[i].source = in_data.edges[i].source_id;
      converted_json.links[i].target = in_data.edges[i].target_id;
      switch (in_data.edges[i].category) {
        case 'Positioning':    converted_json.links[i].type = 3; break;
        case 'Dependency':     converted_json.links[i].type = 1; break;
        case 'Relationship':   converted_json.links[i].type = 2; break;
        default: break;
      }
    }

    return converted_json;
  }

  this.getJSON = function(fn){
    $.ajax({
      url: "/territories",
      type: "GET",
      contentType: 'application/json; charset=utf-8',
      success: function (resultData) {
        // json = resultData;
        converted_data = master.convertJSON(resultData);        
        fn(converted_data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
      },
      timeout: 120000,
    });
  }

  this.addNode = function(fx, fy, callback){
    $.post("/nodes",{
      'node[title]': "Untitled", // GLOBALS default_node_name,
      'node[active]': 1,
      'node[collapse]': 1,
      'node[standby]': 0,
      'node[type]': "CategoryNode",
      'node[fx]':fx,
      'node[fy]':fy,
      'node[territory_id]': 1
    }).done(function (resultData) {
      console.log(resultData);
      callback(master.convertNode(resultData));
    });
  }

  this.deleteNode = function(id, callback){
    $.ajax({
      url: '/nodes/' + id,
      method: 'DELETE'
    }).done(function (resultData) {
      callback();
    }); 
  }

  this.updateNode = function(node, callback){
    $.ajax({
      url: '/nodes/' + node.id,
      method: 'PATCH',
      data: master.serializeNode(node)
    }).done(function (resultData) {
        callback();
    }); 
  }

  this.bulkUpdateNodePosition = function(nodes){
    $.ajax({
      url: '/nodes/position',
      method: 'PATCH',
      data: nodes
    }).done(function (resultData) {
      // callback();
    }).fail(function(resultData){
      console.log("Failed bulk update:")
      console.log(resultData)
    }); 
  }

  this.addEdge = function(edge, callback){
    $.post('/edges/', master.serializeEdge(edge))
      .done(function (resultData) {
        callback(master.convertEdge(resultData));
      });
  }

  this.deleteEdge = function(edge, callback){
    $.ajax({
      url: '/edges/' + edge,
      method: 'DELETE'
    }).done(function (resultData) {
        callback();
    });
  }

  this.updateEdge = function(edge, callback){
    $.ajax({
      url: '/edges/' + edge.id,
      method: 'PATCH',
      data: master.serializeEdge(edge)
    }).done(function (resultData) {
      callback();
    });
  }

  this.addStylingGroup = function(group, callback){
    $.post('/styling_groups/', {
      'styling_group[name]': group.name,
      'styling_group[color]': group.color
    }).done(function (resultData) {
      callback(resultData);
    });
  }

  this.updateStylingGroup = function(group, callback){
    $.ajax({
      url: '/styling_groups/' + group.id,
      method: 'PATCH',
      data: {
        'styling_group[name]': group.name,
        'styling_group[color]': group.color
      }
    }).done(function (resultData) {
      callback();
    });
  }

  return this;
})();
