function RhisomaCommunicator(){

	var master = this;

	/* --- CREATE --- */

	this.createNode = function(node){
		// passa node inteiro para o BD [retorna node_id? informação importante para continuar a desenhar o graph]
	}

	this.createNodeGroup = function(){
		// passa group e gera cor [retorna group_id? informação importante para continuar a desenhar o graph]
	}

	this.createLink = function(link){
		// passa link inteiro para o BD [retorna link_id? informação importante para continuar a desenhar o graph]
	}

	/* --- UPDATE --- */

	// --- NODE

	this.updateNodeName = function(node_id,node_name){
		// passa node.id e node.name para o BD
	}

	this.updateNodeDescription = function(node_id,node_description){
		// passa node.id e node.description para o BD	
	}

	this.updateNodePosition = function(node_id,node_position){ // node_position.x, .y, .vx, .vy

	}

	this.updateNodeActive = function(node_id, node_active){

	}

	this.updateNodeDateStart = function(node_id, node_date_start){

	}

	this.updateNodeDateEnd = function(node_id, node_date_end){

	}

	this.updateNodeFinished = function(node_id, node_finished){

	}

	this.updateNodeCollapse = function(node_id, node_collapse){

	}

	this.updateNodeStandby = function(node_id, node_standby){

	}

	this.updateNodeGroup = function(node_id, node_group_id){

	}

	this.updateNodeType = function(node_id, node_type){

	}

	this.updateGroupColor = function(group_id, group_color){

	}

		// ADD : node.strength (influencia proximidade com outros nódulos)

	// --- LINK

	this.updateLinkSource = function(link_id,source_id){

	}

	this.updateLinkTarget = function(link_id,target_id){
		
	}

	this.updateLinkType = function(link_id,link_type){
		
	}

	this.updateLinkPosition = function(link_id, link_position){ // link_position: source e target.x, .y, .vx, .vy

	}

	/* --- DELETE --- */

	this.deleteNode = function(node_id){
		// passa node.id para o BD
	}

	this.deleteLink = function(link_id){
		// passa link id para o BD
	}

	this.deleteNodeGroup = function(group_id){

	}

}