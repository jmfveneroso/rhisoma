function Rhizoma(){

	var master = this;
	var json = null;
	var processing_graph = [];
	var entire_graph = {};
	var active_graph = {};
	var current_crawl = 0;
	var primary = undefined;
	var communicator = new RhizomaCommunicator();

	var block_node = []; // em caso de collapse false, coloca o nódulo e seus children na lista: checa quando vai criar o active_graph; se estiver bloqueado, não desenhar (só desenhar o parent)
	var check_block = false;
	var apply_standby = [];
	var check_standby = false;

	this.setJSON = function(data){
		json = data;
		entire_graph = json; // referência do gráfico completo [substitui json como ref para o programa]
		active_graph.nodes = [];
		active_graph.links = [];
		master.initialize();
		// inicialização
		// processa o graph para poder desenhar a interface
		// seleciona o modo que mostra o dia atual
				// CRIAR interface simples para seleção do período a ser mostrado no graph (default = hoje)
	}

	this.getGraph = function(){
		graph = {};
		graph.nodes = [];
		graph.links = [];
		for(var i = 0; i < active_graph.nodes.length; i++){
			graph.nodes[i] = {};
			for (var property in active_graph.nodes[i]) {
			    if (active_graph.nodes[i].hasOwnProperty(property)) {
			        graph.nodes[i][property] = active_graph.nodes[i][property];
			    }
			}
		}
		for(var i = 0; i < active_graph.links.length; i++){
			graph.links[i] = {};
			for (var property in active_graph.links[i]) {
			    if (active_graph.links[i].hasOwnProperty(property)) {
			        graph.links[i][property] = active_graph.links[i][property];
			    }
			}
		}
		return graph;
	}

	this.initialize = function(){
		for(var i = 0; i < json.nodes.length; i++){
			if(json.nodes[i].standby === 1){
				check_standby = true;
			}
			if(json.nodes[i].collapse === 0){
				check_block = true;
				entire_graph.nodes[i].size = 1;
				master.nodeStructure(entire_graph.nodes[i].id);
			}
			else{
				entire_graph.nodes[i].size = master.nodeStructure(entire_graph.nodes[i].id);
			}
			entire_graph.nodes[i].parentConnections = 0;
			entire_graph.nodes[i].childConnections = 0;
				// corrigir .size [o maior fica sendo uma tamanho máximo predefinido, o menor, o menor tamanho predefinido]
		}
		for(var i = 0; i < json.links.length; i++){
			if(entire_graph.links[i].type != 3){
				for(var j = 0; j < entire_graph.nodes.length; j++){
					if(entire_graph.links[i].target === entire_graph.nodes[j].id){
						entire_graph.nodes[j].parentConnections++;
					}
					if(entire_graph.links[i].source === entire_graph.nodes[j].id){
						entire_graph.nodes[j].childConnections++;
					}
				}
			}
		}			
			// conferir se a data do target é hoje; se sim, marcar em .urgent
			// traçar caminho até a origem e atualizar o .urgent deles
			// espessura é relativa ao número de children do node que são .urgent

			// funções para inicializar graph
			// contabiliza tamanho dos nódulos, cores, espessura das linhas, etc
			// parte ativa (dia atual e pinned[pinned é básico para categorias, pode ser toggled off])

		/* PROCESSA ACTIVE_GRAPH */
		var inc = 0;
		for(var i = 0; i < entire_graph.nodes.length; i++){
			var found_match = false;
			for(var j = 0; j < block_node.length; j++){
				if(entire_graph.nodes[i].id === block_node[j]){
					found_match = true;
				}
			}
			if(!found_match){
				active_graph.nodes[inc] = {};
				for (var property in entire_graph.nodes[i]) {
				    if (entire_graph.nodes[i].hasOwnProperty(property)) {
				        active_graph.nodes[inc][property] = entire_graph.nodes[i][property];
				    }
				}
				inc++;
			}
		}
		inc = 0;
		for(var i = 0; i < entire_graph.links.length; i++){
			var found_match = false;
			for(var j = 0; j < block_node.length; j++){
				if(entire_graph.links[i].source === block_node[j] || entire_graph.links[i].target === block_node[j]){
					found_match = true;
				}
			}
			if(!found_match){
				active_graph.links[inc] = {};
				for (var property in entire_graph.links[i]) {
				    if (entire_graph.links[i].hasOwnProperty(property)) {
				        active_graph.links[inc][property] = entire_graph.links[i][property];
				    }
				}
				inc++;
			}
		}

		master.applyStandby(true);
	}

	this.updateGraph = function(){
		apply_standby = [];
		for(var i = 0; i < entire_graph.nodes.length; i++){
			if(entire_graph.nodes[i].standby === 1){
				check_standby = true;
			}
			if(entire_graph.nodes[i].collapse === 0){
				check_block = true;
				entire_graph.nodes[i].size = 1;
				master.nodeStructure(entire_graph.nodes[i].id);
			}
			else{
				entire_graph.nodes[i].size = master.nodeStructure(entire_graph.nodes[i].id);
			}
			entire_graph.nodes[i].parentConnections = 0;
			entire_graph.nodes[i].childConnections = 0;
		}
		for(var i = 0; i < entire_graph.links.length; i++){
			if(entire_graph.links[i].type != 3){
				for(var j = 0; j < entire_graph.nodes.length; j++){
					if(entire_graph.links[i].target === entire_graph.nodes[j].id){
						entire_graph.nodes[j].parentConnections++;
					}
					if(entire_graph.links[i].source === entire_graph.nodes[j].id){
						entire_graph.nodes[j].childConnections++;
					}
				}
			}
		}	
			// conferir se a data do target é hoje; se sim, marcar em .urgent
			// traçar caminho até a origem e atualizar o .urgent deles
			// espessura é relativa ao número de children do node que são .urgent

			// funções para inicializar graph
			// contabiliza tamanho dos nódulos, cores, espessura das linhas, etc
			// parte ativa (dia atual e pinned[pinned é básico para categorias, pode ser toggled off])

		/* PROCESSA ACTIVE_GRAPH */
		for(var i = 0; i < active_graph.nodes.length; i++){
			var index = null;
			var current_node = null;
			for(var j = 0; j < entire_graph.nodes.length; j++){
				if(entire_graph.nodes[j].id === active_graph.nodes[i].id){
					index = j;
				}
			}
			if(index != null){
				current_node = entire_graph.nodes[index];
			}
			active_graph.nodes[i] = {};
			for (var property in current_node) {
			    if (current_node.hasOwnProperty(property)) {
			        active_graph.nodes[i][property] = current_node[property];
			    }
			}
		}  master.applyStandby(true);
	}

	this.getTargetGroup = function(selected_node){
		/*
		Descobre e passa o grupo do nódulo alvo
		--- Otimimzar: informação constará no array de nódulos ativos
		*/
		var edge_group = null;
		var index = 0;
		while(edge_group===null){
			if(active_graph.nodes[index] != null && active_graph.nodes[index] != undefined){
				if(active_graph.nodes[index].id === selected_node){
					if(active_graph.nodes[index].standby === 0){
						edge_group = active_graph.nodes[index].group;
					}
					else{
						edge_group = undefined;
					}
				}
			}
			else{
				return null;
				break;
			}
			index++;
		}
		return edge_group;
	}

	// this.distanceToPrimary = function(selected_node){
	// 	current_crawl = 0;
	// 	var continue_crawling = true;
	// 	primary = undefined;
	// 	processing_graph = [];
 //    	processing_graph.push(selected_node);
 //    	while((processing_graph.length-current_crawl) > 0){
 //    		if(!continue_crawling){
 //    			// console.log("teste");
 //    			return primary;
 //    		}
 //    		else{
 //    			master.crawlToPrimary(processing_graph);
 //    		}
 //    		current_crawl++;
 //    	}
 //    	// console.log(processing_graph);
 //      	// return processing_graph.length;

	// }

	// this.crawlToPrimary = function(this_nodes){
	// 	// console.log(this_nodes);
	// 	var no_source = 0;
	// 	for(var i = 0; i < json.links.length; i++){
	// 		if(json.links[i].target === this_nodes[current_crawl] && json.links[i].type === 1){
	// 			this_nodes.push(json.links[i].source);
	// 			no_source++;
	// 			// for(var j = 0; j < json.links.length; j++){
	// 			// 	if(json.links[j].target === json.links[i].source && json.links[j].type === 1){
	// 			// 		no_source++;
	// 			// 	}
	// 			// }
	// 		}
	// 		// checar se o source tem ou não um source
	// 	}
	// 	// console.log(no_source);
	// 	if(no_source===0){
	// 		primary = this_nodes[current_crawl];
	// 		continue_crawling = false;
	// 	}
	// }

	this.nodeStructure = function(selected_node){
		current_crawl = 0;
		processing_graph = [];
    	processing_graph.push(selected_node);
    	var index = null;
    	for(var i = 0; i < entire_graph.nodes.length; i++){
    		if(entire_graph.nodes[i].id === selected_node){
    			index = i;
    		}
    	}
    	while((processing_graph.length-current_crawl) > 0){
    		master.crawlNode(processing_graph);
    		current_crawl++;
    	}
    	entire_graph.nodes[index].children = [];
    	if(processing_graph.length > 0){
    		for(var i = 0; i < processing_graph.length; i++){
    			if(check_standby){
    				var match_found = false;
    				for(var j = 0; j < apply_standby.length; j++){
    					if(apply_standby[j] === processing_graph[i]){
    						match_found = true;
    					}
    				}
    				if(!match_found){
    					apply_standby.push(processing_graph[i]);
    				}
    			}
    			if(check_block === true && i > 0){
    					block_node.push(processing_graph[i]);
    			}
    			else{
					entire_graph.nodes[index].children.push(processing_graph[i]);
    			}
	    	}
    	}
    	check_block = false;
    	check_standby = false;
      	return processing_graph.length;
	}

	this.crawlNode = function(this_nodes){
		for(var i = 0; i < entire_graph.links.length; i++){
			// Links of type 1 > dependency
			if(entire_graph.links[i].source === this_nodes[current_crawl] && entire_graph.links[i].type === 1){
				var include = true;
				for(var j = 0; j < this_nodes.length; j++){
					if(entire_graph.links[i].target === this_nodes[j]){
						include = false;
					}
				}
				if(include){
					this_nodes.push(entire_graph.links[i].target);	
				}
			}
			// Links of type 2 <> relation
			else if(entire_graph.links[i].source === this_nodes[current_crawl] && entire_graph.links[i].type === 2){
				var node_exists = false;
				for(var j = 0; j < this_nodes.length; j++){
					if(entire_graph.links[i].target === this_nodes[j]){
						node_exists = true;
					}
				}
				if(!node_exists){
					this_nodes.push(entire_graph.links[i].target);
				}
			}
			else if(entire_graph.links[i].target === this_nodes[current_crawl] && entire_graph.links[i].type === 2){
				var node_exists = false;
				for(var j = 0; j < this_nodes.length; j++){
					if(entire_graph.links[i].source === this_nodes[j]){
						node_exists = true;
					}
				}
				if(!node_exists){
					this_nodes.push(entire_graph.links[i].source);
				}
			}
		}
	}

	this.navigateRhizomaEnter = function(selected_node){ // contracts rhizoma
		var increment = 0;
		var found_match = false;
		var index = undefined;
		while(!found_match){
			if(entire_graph.nodes[increment].id === selected_node){
				found_match = true;
				index = increment;
			}
			increment++;
		}

			// update active_graph
			// check and pop nodes that are not in the group to be shown
		var splice = [];
		for(var i = 0; i < active_graph.nodes.length; i++){
			var included = false;
			var increment = 0;
			while(!included && increment < entire_graph.nodes[index].children.length){
				if(active_graph.nodes[i].id === entire_graph.nodes[index].children[increment]){
					included = true;
				}
				increment++;
			}
			if(!included){
				splice[splice.length] = i;
			}
		}
		var sum = 0;
		for(var i = 0; i < splice.length; i++){
			active_graph.nodes.splice(splice[i]-sum,1);
			sum++;
		}
		splice = [];
		var keep = [];
		for(var i = 0; i < active_graph.nodes.length; i++){
			// check and pop links that are not part of the group to be shown
			var included = false;
			var increment = 0;
			for(var j = 0; j < active_graph.links.length; j ++){
				if(active_graph.links[j].source === active_graph.nodes[i].id && active_graph.links[j].type === 1){
					// this is the one we want to keep
					keep[keep.length] = active_graph.links[j];
				}
				else if(active_graph.links[j].source === active_graph.nodes[i].id && active_graph.links[j].type === 2){
					// this is the one we want to keep
					keep[keep.length] = active_graph.links[j];
				}
				else if(active_graph.links[j].target === active_graph.nodes[i].id && active_graph.links[j].type === 2){
					// this is the one we want to keep
					keep[keep.length] = active_graph.links[j];
				}
			}
		}
		active_graph.links = [];
		for(var i = 0; i < keep.length; i++){
			active_graph.links[i] = {};
			for (var property in keep[i]) {
			    if (keep[i].hasOwnProperty(property)) {
			        active_graph.links[i][property] = keep[i][property];
			    }
			}
		}
	}

	this.navigateRhizomaExitCheck = function(this_node){
		if(this_node != undefined){
			master.navigateRhizomaExit(this_node);
		}
		else{
			master.navigateRoot();
		}
	}

	this.navigateRhizomaExit = function(selected_node){ // expands rhizoma
		var increment = 0;
		var found_match = false;
		var index = undefined;
		
		while(!found_match && increment < entire_graph.nodes.length){
			if(entire_graph.nodes[increment].id === selected_node){
				found_match = true;
				index = increment;
			}
			increment++;
		}

			// update active_graph
			// check and push nodes that are in the group to be shown
		var include = [];
		for(var i = 0; i < entire_graph.nodes[index].children.length; i++){ // bug children of undefined
			found_match = false;
			increment = 0;
			while(!found_match && increment < active_graph.nodes.length){
				if(active_graph.nodes[increment].id === entire_graph.nodes[index].children[i]){
					found_match = true;
				}
				increment++;
			}
			if(!found_match){
				for(var j = 0; j < block_node.length; j++){
					if(block_node[j] === entire_graph.nodes[index].children[i]){
						found_match = true;
					}
				}
				if(!found_match){
					include[include.length] = entire_graph.nodes[index].children[i];
				}
			}
		}

			// check and push links to be shown
		for(var i = 0; i < include.length; i++){
			found_match = false;
			increment = 0;
			var include_index;
			while(!found_match && increment < entire_graph.nodes.length){
				if(include[i] === entire_graph.nodes[increment].id){
					found_match = true;
					include_index = increment;
				}
				increment++;
			}
			if(found_match){
				var construct_node = {};
				for (var property in entire_graph.nodes[include_index]) {
				    if (entire_graph.nodes[include_index].hasOwnProperty(property)) {
				        construct_node[property] = entire_graph.nodes[include_index][property];
				    }
				}
				active_graph.nodes.push(construct_node);
			}
			
		}
		var links = [];
		for(var i = 0; i < include.length; i++){
			for(var j = 0; j < entire_graph.links.length; j++){
				if(include[i] === entire_graph.links[j].source && entire_graph.links[j].type === 1){
					match_found = false;
					for(var m = 0; m < block_node.length;m++){
						if(entire_graph.links[j].target === block_node[m]){
							match_found = true;
						}
					}
					if(!match_found){
						var current_id = master.getNodeIndex(entire_graph.links[j].source);
						if(entire_graph.nodes[current_id].collapse != 0){
							var construct_link = {};
							for (var property in entire_graph.links[j]) {
							    if (entire_graph.links[j].hasOwnProperty(property)) {
							        construct_link[property] = entire_graph.links[j][property];
							    }
							}
							links[links.length] = construct_link;//entire_graph.links[j];
						}
					}
				}
				else if(include[i] === entire_graph.links[j].source && entire_graph.links[j].type === 2){
					match_found = false;
					for(var m = 0; m < block_node.length;m++){
						if(entire_graph.links[j].target === block_node[m]){
							match_found = true;
						}
					}
					if(!match_found){
						var current_id = master.getNodeIndex(entire_graph.links[j].source);
						if(entire_graph.nodes[current_id].collapse != 0){
							var construct_link = {};
							for (var property in entire_graph.links[j]) {
							    if (entire_graph.links[j].hasOwnProperty(property)) {
							        construct_link[property] = entire_graph.links[j][property];
							    }
							}
							links[links.length] = construct_link;//entire_graph.links[j];
						}
					}
				}
				else if(include[i] === entire_graph.links[j].target && entire_graph.links[j].type === 2){
					match_found = false;
					for(var m = 0; m < block_node.length;m++){
						if(entire_graph.links[j].source === block_node[m]){
							match_found = true;
						}
					}
					if(!match_found){
						var current_id = master.getNodeIndex(entire_graph.links[j].target);
						if(entire_graph.nodes[current_id].collapse != 0){
							var construct_link = {};
							for (var property in entire_graph.links[j]) {
							    if (entire_graph.links[j].hasOwnProperty(property)) {
							        construct_link[property] = entire_graph.links[j][property];
							    }
							}
							links[links.length] = construct_link;//entire_graph.links[j];
						}
					}
				}
			}
		}
		for(var i = 0; i < links.length; i++){
			active_graph.links.push(links[i]);
		}

		master.applyStandby(true);
	}

	this.navigateRoot = function(){ // atualizar para ser coerente com collapse
		active_graph = {};
		active_graph.nodes = [];
		active_graph.links = [];
		var inc = 0;
		for(var i = 0; i < entire_graph.nodes.length; i++){
			var found_match = false;
			for(var j = 0; j < block_node.length; j++){
				if(entire_graph.nodes[i].id === block_node[j]){
					found_match = true;
				}
			}
			if(!found_match){
				active_graph.nodes[inc] = {};
				for (var property in entire_graph.nodes[i]) {
				    if (entire_graph.nodes[i].hasOwnProperty(property)) {
				        active_graph.nodes[inc][property] = entire_graph.nodes[i][property];
				    }
				}
				inc++;
			}
		}
		inc = 0;
		for(var i = 0; i < entire_graph.links.length; i++){
			var found_match = false;
			for(var j = 0; j < block_node.length; j++){
				if(entire_graph.links[i].source === block_node[j] || entire_graph.links[i].target === block_node[j]){
					found_match = true;
				}
			}
			if(!found_match){
				active_graph.links[inc] = {};
				for (var property in entire_graph.links[i]) {
				    if (entire_graph.links[i].hasOwnProperty(property)) {
				        active_graph.links[inc][property] = entire_graph.links[i][property];
				    }
				}
				inc++;
			}
		}

		master.applyStandby(true);
	}

	this.updateNodeXY = function(selected_node){
		for(var i = 0; i < active_graph.nodes.length; i++){
			if(active_graph.nodes[i].id === selected_node.id){
				active_graph.nodes[i].x = selected_node.x;
				active_graph.nodes[i].y = selected_node.y;
				active_graph.nodes[i].vx = selected_node.vx;
				active_graph.nodes[i].vy = selected_node.vy;
			}
		}
		for(var i = 0; i < entire_graph.nodes.length; i++){
			if(entire_graph.nodes[i].id === selected_node.id){
				entire_graph.nodes[i].x = selected_node.x;
				entire_graph.nodes[i].y = selected_node.y;
				entire_graph.nodes[i].vx = selected_node.vx;
				entire_graph.nodes[i].vy = selected_node.vy;
			}
		}
	}

	this.updateLinkXY = function(selected_node){
		for(var i = 0; i < entire_graph.links.length; i++){
			if(entire_graph.links[i].source.id === selected_node.source.id && entire_graph.links[i].target.id === selected_node.target.id){
				entire_graph.links[i].source.x = selected_node.source.x;
				entire_graph.links[i].source.y = selected_node.source.y;
				entire_graph.links[i].source.vx = selected_node.source.vx;
				entire_graph.links[i].source.vy = selected_node.source.vy;
				entire_graph.links[i].target.x = selected_node.target.x;
				entire_graph.links[i].target.y = selected_node.target.y;
				entire_graph.links[i].target.vx = selected_node.target.vx;
				entire_graph.links[i].target.vy = selected_node.target.vy;
			}
		}
		for(var i = 0; i < active_graph.links.length; i++){
			if(active_graph.links[i].source.id === selected_node.source.id && active_graph.links[i].target.id === selected_node.target.id){
				active_graph.links[i].source.x = selected_node.source.x;
				active_graph.links[i].source.y = selected_node.source.y;
				active_graph.links[i].source.vx = selected_node.source.vx;
				active_graph.links[i].source.vy = selected_node.source.vy;
				active_graph.links[i].target.x = selected_node.target.x;
				active_graph.links[i].target.y = selected_node.target.y;
				active_graph.links[i].target.vx = selected_node.target.vx;
				active_graph.links[i].target.vy = selected_node.target.vy;
			}
		}
	}

	this.addNode = function(fx,fy){
		var new_node = {};
		var generate_id = entire_graph.nodes.length + Math.floor(Math.random() * (900 - 1)) + 1;
		new_node.id = generate_id.toString();
		new_node.name = "Untitled";
		new_node.active = "1";
		new_node.childConnections = "0";
		new_node.parentConnections = "1";
		new_node.children = [];
		new_node.collapse = 1;
		new_node.date_end = "";
		new_node.date_start = "";
		new_node.description = "";
		new_node.group = 0; // colocar GROUP = NULL [função para gerar automaticamente]
		new_node.size = 1;
		new_node.standby = 0;
		new_node.type = "categoria";
		new_node.fx = fx;
		new_node.fy = fy;
		entire_graph.nodes.push(new_node);
		active_graph.nodes.push(new_node);
		master.updateGraph();
		return new_node.id;
	}

	this.deleteNode = function(this_node){	
		// update nodes
		var index = undefined;
		for(var i = 0; i < entire_graph.nodes.length; i++){
			if(entire_graph.nodes[i].id === this_node){
				index = i;
			}
		}
		entire_graph.nodes.splice(index,1);

		index = undefined;
		for(var i = 0; i < active_graph.nodes.length; i++){
			if(active_graph.nodes[i].id === this_node){
				index = i;
			}
		}
		active_graph.nodes.splice(index,1);

		// update links
		var sum = 0;
		var splice = [];
		for(var i = 0; i < entire_graph.links.length; i++){
			if(entire_graph.links[i].source === this_node || entire_graph.links[i].target === this_node){
				splice[splice.length] = i;
			}
		}
		for(var i = 0; i < splice.length; i++){
			entire_graph.links.splice(splice[i]-sum,1);
			sum++;
		}

		sum = 0;
		splice = [];
		for(var i = 0; i < active_graph.links.length; i++){
			if(active_graph.links[i].source === this_node || active_graph.links[i].target === this_node){
				splice[splice.length] = i;
			}
		}
		for(var i = 0; i < splice.length; i++){
			active_graph.links.splice(splice[i]-sum,1);
			sum++;
		}
		master.updateGraph();
		// quando um node é deletado, os children dele devem ser deletados? ou então: conectar os próximos na cadeia no source do deletado
	}

	this.addLink = function(links){
		var link_match = master.linkExists(links);
		var link_update = false;
		if(!link_match.exists){
			var index_target = null;
			var index_source = null;
			for(var i = 0; i < entire_graph.nodes.length; i++){
				if(entire_graph.nodes[i].id === links.target){
					index_target = i;
				}
				if(entire_graph.nodes[i].id === links.source){
					index_source = i;
				}
			}
			if(link_match.new_target){
				entire_graph.nodes[index_target].group = entire_graph.nodes[index_source].group;
			}
			entire_graph.nodes[index_target].fx = null;
			entire_graph.nodes[index_target].fy = null;
			entire_graph.nodes[index_source].fx = null;
			entire_graph.nodes[index_source].fy = null;

			var link = {}; // pegar id do BD
			link.source = links.source.toString();
			link.target = links.target.toString();
			link.value = 1;
			link.type = 1;
			var link_id = entire_graph.links.length + Math.floor(Math.random() * (900 - 1)) + 1;
			link.id = link_id.toString();
			entire_graph.links.push(link);
			active_graph.links.push(link);	
			master.updateGraph();
			link_update = true;
		}
		else if(link_match.exists && link_match.change_type != undefined && entire_graph.links[link_match.change_type].type != 3){
			entire_graph.links[link_match.change_type].type = 2;
			var active_link_index = master.getActiveLinkIndex(entire_graph.links[link_match.change_type].id);
			active_graph.links[active_link_index].type = 2;
			master.updateGraph();
			link_update = true;
		}

		return link_update;
	}

	this.linkExists = function(links){
		/* Checks if link already exists */
		var link_match = {};
		link_match.new_target = true;
		link_match.new_source = true;
		link_match.exists = false;
		link_match.change_type = undefined;
		for(var i = 0; i < entire_graph.links.length; i++){
			if(entire_graph.links[i].target === links.target && entire_graph.links[i].source === links.source){
				link_match.exists = true;
			}
			else if(entire_graph.links[i].source === links.target && entire_graph.links[i].target === links.source){
				link_match.exists = true;
				link_match.change_type = i;
			}
			if(entire_graph.links[i].source === links.target || entire_graph.links[i].target === links.target){
				link_match.new_target = false;
			}
			if(entire_graph.links[i].source === links.source || entire_graph.links[i].target === links.source){
				link_match.new_source = false;
			}
		}
		return link_match;
	}

	this.deleteLink = function(this_link){
		for(var i = 0; i < entire_graph.links.length; i++){
			if(entire_graph.links[i].id === this_link){
				entire_graph.links.splice(i,1);
			}
		}
		for(var i = 0; i < active_graph.links.length; i++){
			if(active_graph.links[i].id === this_link){
				active_graph.links.splice(i,1);
			}
		}
		master.updateGraph();
	}

	/* GET */

	this.getNode = function(node){
		var found_match = false;
		var index = 0;
		var this_node = undefined;
		while(!found_match){
			if(node.id === entire_graph.nodes[index].id){
				found_match = true;
			}
			else{
				index++;	
			}
		}
		return entire_graph.nodes[index];
	}

	this.getNodeIndex = function(node_id){
		var found_match = false;
		var index = 0;
		var this_node = undefined;
		while(!found_match){
			if(node_id === entire_graph.nodes[index].id){
				found_match = true;
			}
			else{
				index++;	
			}
		}
		return index;
	}

	this.getActiveNodeIndex = function(node_id){
		var found_match = false;
		var index = 0;
		var this_node = undefined;
		while(!found_match){
			if(node_id === active_graph.nodes[index].id){
				found_match = true;
			}
			else{
				index++;	
			}
		}
		return index;
	}

	this.getActiveLinkIndex = function(link_id){
		var found_match = false;
		var index = 0;
		var this_link = undefined;
		while(!found_match){
			if(link_id === active_graph.links[index].id){
				found_match = true;
			}
			else{
				index++;	
			}
		}
		return index;
	}

	this.getLinks = function(node){
		var these_links = [];
		var temp_id = undefined;
		for(var i = 0; i < entire_graph.links.length; i++){
			if(entire_graph.links[i].source === node.id || entire_graph.links[i].target === node.id){
				these_links[these_links.length] = {};
				for (var property in entire_graph.links[i]) {
				    if (entire_graph.links[i].hasOwnProperty(property)) {
				        these_links[these_links.length-1][property] = entire_graph.links[i][property];
				    }
				}
			}
		}

		for(var i = 0; i < these_links.length; i++){
			for(var j = 0; j < entire_graph.nodes.length; j++){
				if(these_links[i].source === entire_graph.nodes[j].id){
					temp_id = these_links[i].source;
					these_links[i].source = {};
					these_links[i].source.id = temp_id;
					these_links[i].source.name = entire_graph.nodes[j].name;
				}
				else if(these_links[i].target === entire_graph.nodes[j].id){
					temp_id = these_links[i].target;
					these_links[i].target = {};
					these_links[i].target.id = temp_id;
					these_links[i].target.name = entire_graph.nodes[j].name;
				}
			}
		}
		return these_links;
	}

	// UPDATE NODE & LINKS

	this.updateNode = function(in_node){
		var inc = 0;
		var index = undefined;
		var found_match = false;
		while(!found_match){
			if(entire_graph.nodes[inc].id === in_node.id){
				index = inc;
				found_match = true;
			}
			inc++;
		}
		if(index != undefined){
			for (var property in in_node) {
			    if (in_node.hasOwnProperty(property)) {
			        entire_graph.nodes[index][property] = in_node[property];
			    }
			}
		}

		inc = 0;
		index = undefined;
		found_match = false;
		while(!found_match){
			if(active_graph.nodes[inc].id === in_node.id){
				index = inc;
				found_match = true;
			}
			inc++;
		}
		if(index != undefined){
			for (var property in in_node) {
			    if (in_node.hasOwnProperty(property)) {
			        active_graph.nodes[index][property] = in_node[property];
			    }
			}
		}

		for(var i = 0; i < apply_standby.length; i++){
			if(active_graph.nodes[index].id === apply_standby[i]){
				active_graph.nodes[index].standby = 1;
			}
		}
	}

	this.updateLink = function(in_link){
		var inc = 0;
		var index = undefined;
		var found_match = false;
		while(!found_match){
			if(entire_graph.links[inc].id === in_link.id){
				index = inc;
				found_match = true;
			}
			inc++;
		}
		if(index != undefined){
			for (var property in in_link) {
			    if (in_link.hasOwnProperty(property)) {
			        entire_graph.links[index][property] = in_link[property];
			    }
			}
		}
		inc = 0;
		index = undefined;
		found_match = false;
		while(!found_match){
			if(active_graph.links[inc].id === in_link.id){
				index = inc;
				found_match = true;
			}
			inc++;
		}
		if(index != undefined){
			for (var property in in_link) {
			    if (in_link.hasOwnProperty(property)) {
			        active_graph.links[index][property] = in_link[property];
			    }
			}
		}
		master.updateGraph();
	}

	this.collapseNode = function(node){
		entire_graph.nodes[master.getNodeIndex(node)].collapse = 1;
		active_graph.nodes[master.getActiveNodeIndex(node)].collapse = 1;
		block_node = [];
		master.updateNodes();
	}

	this.closeNode = function(node){
		entire_graph.nodes[master.getNodeIndex(node)].collapse = 0;
		active_graph.nodes[master.getActiveNodeIndex(node)].collapse = 0;
		block_node = [];
		master.updateNodes();
	}

	this.updateNodes = function(){
		// atualizar para closeNode e collapseNode [tem que reconhecer o estado atual da rede]
		for(var i = 0; i < entire_graph.nodes.length; i++){
			if(entire_graph.nodes[i].standby === 1){
				check_standby = true;
			}
			if(entire_graph.nodes[i].collapse === 0){
				check_block = true;
				entire_graph.nodes[i].size = 1;
				master.nodeStructure(entire_graph.nodes[i].id);
			}
			else{
				entire_graph.nodes[i].size = master.nodeStructure(entire_graph.nodes[i].id);
			}
			entire_graph.nodes[i].parentConnections = 0;
			entire_graph.nodes[i].childConnections = 0;
				// corrigir .size [o maior fica sendo uma tamanho máximo predefinido, o menor, o menor tamanho predefinido]
		}
		for(var i = 0; i < entire_graph.links.length; i++){
			if(entire_graph.links[i].type != 3){
				for(var j = 0; j < entire_graph.nodes.length; j++){
					if(entire_graph.links[i].target === entire_graph.nodes[j].id){
						entire_graph.nodes[j].parentConnections++;
					}
					if(entire_graph.links[i].source === entire_graph.nodes[j].id){
						entire_graph.nodes[j].childConnections++;
					}
				}
			}
		}		
		active_graph = {};
		active_graph.nodes = [];
		active_graph.links = [];
		var inc = 0;
		for(var i = 0; i < entire_graph.nodes.length; i++){
			var found_match = false;
			for(var j = 0; j < block_node.length; j++){
				if(entire_graph.nodes[i].id === block_node[j]){
					found_match = true;
				}
			}
			if(!found_match){
				active_graph.nodes[inc] = {};
				for (var property in entire_graph.nodes[i]) {
				    if (entire_graph.nodes[i].hasOwnProperty(property)) {
				        active_graph.nodes[inc][property] = entire_graph.nodes[i][property];
				    }
				}
				inc++;
			}
		}
		inc = 0;
		for(var i = 0; i < entire_graph.links.length; i++){
			var found_match = false;
			for(var j = 0; j < block_node.length; j++){
				if(entire_graph.links[i].source === block_node[j] || entire_graph.links[i].target === block_node[j]){
					found_match = true;
				}
			}
			if(!found_match){
				active_graph.links[inc] = {};
				for (var property in entire_graph.links[i]) {
				    if (entire_graph.links[i].hasOwnProperty(property)) {
				        active_graph.links[inc][property] = entire_graph.links[i][property];
				    }
				}
				inc++;
			}
		}

		master.applyStandby(true);
	}

	this.applyStandby = function(standby_mode){
		for(var i = 0; i < apply_standby.length; i++){
			var found_match = false;
			var index = undefined;
			var inc = 0;
			while(!found_match){
				if(active_graph.nodes[inc].id === apply_standby[i]){
					found_match = true;
					index = inc;
				}
				else{
					if(active_graph.nodes[inc+1] != null){
						inc++;
					}
					else{
						found_match = true;
					}
				}
			}
			if(index != undefined){
				if(standby_mode){
					active_graph.nodes[index].standby = 1;
				}
				else{
					active_graph.nodes[index].standby = 0;
				}
			}
		}	
	}

	this.toggleNodeStandby = function(node){
		var index = undefined;
		for(var i = 0; i < entire_graph.nodes.length; i++){
			if(entire_graph.nodes[i].id === node.id){
				index = i;
			}
		}
		if(index != undefined){
			if(entire_graph.nodes[index].standby === 0){
				entire_graph.nodes[index].standby = 1;
			}
			else{
				entire_graph.nodes[index].standby = 0;
			}
		}
		master.updateGraph();
	}

}