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
		node.collapse      = data.collapse || 1;
		node.standby       = data.standby || 0;
		node.fx            = data.fx || undefined;
		node.fy            = data.fy || undefined;
		node.x             = data.x || undefined;
		node.y             = data.y || undefined;
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
			// converted_json.nodes[i].id = in_data.nodes[i].id;
			// converted_json.nodes[i].name = in_data.nodes[i].title || '';
			// converted_json.nodes[i].description = in_data.nodes[i].description || '';
			// converted_json.nodes[i].group = in_data.nodes[i].styling_group_id || '_DEFAULT';
		 // 	switch (in_data.nodes[i].type) {
		 // 		case 'CategoryNode': converted_json.nodes[i].type = 'categoria'; break;
		 // 		case 'TaskNode':     converted_json.nodes[i].type = 'tarefa'; break;
		 // 		case 'TextNode':     converted_json.nodes[i].type = 'texto'; break;
		 // 		case 'LinkNode':     converted_json.nodes[i].type = 'link'; break;
		 // 		case 'WormHoleNode': converted_json.nodes[i].type = 'buraco'; break;
		 // 		default: break;
		 // 	}
			// converted_json.nodes[i].date_start = in_data.nodes[i].start_date || '';
			// converted_json.nodes[i].date_end = in_data.nodes[i].end_date || '';
			// converted_json.nodes[i].date_complete = in_data.nodes[i].complete_date || '';
			// converted_json.nodes[i].collapse = in_data.nodes[i].collapse || 1;
			// converted_json.nodes[i].standby = in_data.nodes[i].standby || 0;
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
	    	//'node[collapse]': 1,
	    	//'node[standby]': 0,
	    	'node[type]': "CategoryNode",
	    	'node[fx]':fx,
	    	'node[fy]':fy,
	    	'node[territory_id]': 1
	    })
	    .success( function (resultData) {
	        callback(master.convertNode(resultData));
	    });
	}

	this.deleteNode = function(id, callback){
		$.ajax({
	        url: '/nodes/' + id,
	        method: 'DELETE'
	      }).success( function (resultData) {
	        callback();
	    }); 
	}

	this.updateNode = function(node, callback){
		$.ajax({
        	url: '/nodes/' + node.id,
        	method: 'PATCH',
       		data: master.serializeNode(node)
      	}).success( function (resultData) {
	        callback();
	    }); 
	}

    return this;
})();