function RhisomaGui(gui){

	var master = this;

	// var rfn = new RhisomaGuiFunctions();
	// rfn.prototype = RhisomaGui.prototype;
	// rfn.prototype.constructor = rfn;

	var locales = undefined;

	var current_node = undefined;
	var the_node = undefined;
	var current_link = undefined;
	var the_link = undefined;
	var all_links = undefined;
	var offset_x = 50;
	var hidden_control_panel = true;
	var running = false;
	var type_dropdown = false;
	var current_type = undefined;
	var group_dropdown = false;
	var current_group = undefined;
	var current_editing = undefined;
	var save_node_edition = false;
	var save_link_edition = false;
	var editing_mode = undefined;
	var delete_link = undefined;
	var invert_dependency_link = undefined;
	var collapse_node = undefined;
	var close_node = undefined;
	var stop_simulation = false;
	var groups = undefined;

	var tooltips = {};

	var togglemenus = {};
	togglemenus.node = false;
	togglemenus.link = false;
	togglemenus.state = false;
	togglemenus.environment = false;
	togglemenus.group = false;

	var editing = {};
	editing.nodeadd =    	 		false;
	editing.nodedelete = 	 		false;
	editing.linkadd =    	 		false;
	editing.linkdelete = 	 		false;
	editing.stateidle =  	 		false;
	editing.stateexplode =   		false;
	editing.statecontract =  		false;
	editing.environmentcenter = 	false;
	editing.environmentstop = 		false;
	editing.groupadd = 				false;
	editing.groupedit = 			false;

	var node_types = [];

	var edit_item = undefined;
	var lock = true;
	// array contendo as infos que devem ser displayed para cada tipo de nódulo

	/* LISTENING */

	this.saveNode = function(){
		if(save_node_edition === false){
			return save_node_edition;
		}
		else{
			return current_editing;
		}
	}

	this.saveLink = function(){
		if(save_link_edition === false){
			return save_link_edition;
		}
		else{
			return current_editing;
		}
	}

	this.deleteLink = function(){
		return delete_link;
	}

	this.invertDependencyLink = function(){
		return invert_dependency_link;
	}

	this.resetLink = function(){
		current_link = undefined;
		delete_link = undefined;
		invert_dependency_link = undefined;
	}

	this.setAllLinks = function(in_links){
		all_links = in_links;
	}

	this.setLocales = function(in_locales){
		locales = in_locales;
		tooltips.node = {text:locales['edit-panel-node'],fa:"fa-bullseye"};
		tooltips.link = {text:locales['edit-panel-link'],fa:"fa-code-fork"};
		tooltips.state = {text:locales['edit-panel-state'],fa:"fa-leaf"};
		tooltips.environment = {text:locales['edit-panel-environment'],fa:"fa-map"};
		tooltips.group = {text:locales['edit-panel-group'],fa:"fa-object-group"};
		tooltips.nodeadd = {text:locales['edit-panel-nodeadd'],fa:"fa-plus"};
		tooltips.nodedelete = {text:locales['edit-panel-nodedelete'],fa:"fa-minus"};
		tooltips.linkadd = {text:locales['edit-panel-linkadd'],fa:"fa-plus"};
		tooltips.linkdelete = {text:locales['edit-panel-linkdelete'],fa:"fa-minus"};
		tooltips.stateidle = {text:locales['edit-panel-stateidle'],fa:"fa-hourglass-2"};
		tooltips.stateexplode = {text:locales['edit-panel-stateexplode'],fa:"fa-folder-open"};
		tooltips.statecontract = {text:locales['edit-panel-statecontract'],fa:"fa-folder"};
		tooltips.environmentstop = {text:locales['edit-panel-environmentstop'],fa:"fa-hand-stop-o"};
		tooltips.environmentcontinue = {text:locales['edit-panel-environmentcontinue'],fa:"fa-hand-pointer-o"};
		tooltips.environmentcenter = {text:locales['edit-panel-environmentcenter'],fa:"fa-certificate"};
		tooltips.groupadd = {text:locales['edit-panel-groupadd'],fa:"fa-plus"};
		tooltips.groupedit = {text:locales['edit-panel-groupedit'],fa:"fa-edit"};

		node_types[0] = {type:"categoria",name:locales['node-type-category']};
		node_types[1] = {type:"tarefa",name:locales['node-type-task']};
		node_types[2] = {type:"texto",name:locales['node-type-text']};
		node_types[3] = {type:"link",name:locales['node-type-link']};
		node_types[4] = {type:"buraco",name:locales['node-type-wormhole']};
	}

	this.resetCurrentEditing = function(){
		save_node_edition = false;
		save_link_edition = false;
		current_editing = undefined;
	}

	this.collapseNode = function(){
		return collapse_node;
	}

	this.closeNode = function(){
		return close_node;
	}

	this.setGroups = function(in_groups){
		groups = in_groups;
		var default_color = {"color":"#000000","name":"Default"};
		groups["_DEFAULT"] = default_color;
	}

	/* CONTROL PANEL */

	this.updateControlPanel = function(element, type, new_element){ 
		var border_color;
		current_type = undefined;
		current_group = undefined;
		if(element != undefined && element.color != null && element.color != undefined){
			border_color = groups[element.group].color;
		}
		else{
			border_color = "black";
		}
		if(document.getElementById("control-panel") === null){
			var container = {id:"control-panel",class:"scroll-control-panel",display: "inline",width:300, height:window.innerHeight,/*pointerevents:"none",*/left:-300,top:0, backgroundColor:"rgba(255,255,255,0.9)", font:"Source Sans Pro", padding:10, borderright: "1px "+border_color+" dashed"};
			gui.addContainer(container);
			document.getElementById("control-panel").style.overflow = "auto";
			$("#control-panel").scrollTop(0);
		}
		if(document.getElementById("control-panel-lock") === null){
			var button = {id:"control-panel-lock", pointerevents:"all",zindex:2,height:20,width:20,top:50,fontsize:18,left:290,textalign:"right",font:"Font Awesome",text:'<i class="fa fa-lock" aria-hidden="true"></i>'};
			gui.addButton(button,"control-panel");
			master.lockMouseBehavior();
		}
		document.getElementById("control-panel").style.borderRight = "1px "+border_color+" dashed";

		// Nodes control panel
		if(type === "NODE"){
			editing_mode = "NODE";
			the_link = undefined;
			current_link = undefined;
			if(current_node != element.id && lock === true){
				current_node = element.id;
				the_node = element;
				master.drawNodeControl();
			}
			else if(current_node === element.id && lock === true && hidden_control_panel === false && !new_element){
				master.drawNodeControl();
			}
			else if(current_node === element.id && lock === true && hidden_control_panel === false && new_element){
				the_node = element;
				master.drawNodeControl();
			}
			else if(current_node === element.id && lock === false && hidden_control_panel === false){
				master.drawNodeEditControl();
			}
			else if(current_node != element.id && lock === false && hidden_control_panel === false){
				master.lockControlPanel();
				master.updateControlPanel(element, "NODE", false);
			}
			else if(current_node === element.id && hidden_control_panel === true){
				master.showControlPanel();
			}
		}

		// Links control panel
		else if(type === "LINK"){
			editing_mode = "LINK";
			the_node = undefined;
			current_node = undefined;
			if(current_link != element.id && lock === true){
				current_link = element.id;
				the_link = element;
				master.drawLinkControl();
			}
			else if(current_link === element.id && lock === true && hidden_control_panel === false && !new_element){
				master.drawLinkControl();
			}
			else if(current_link === element.id && lock === true && hidden_control_panel === false && new_element){
				the_link = element;
				master.drawLinkControl();
			}
			else if(current_link === element.id && lock === false && hidden_control_panel === false){
				master.drawLinkEditControl();
			}
			else if(current_link != element.id && lock === false && hidden_control_panel === false){
				master.lockControlPanel();
				master.updateControlPanel(element, "LINK", false);
			}
			else if(current_link === element.id && hidden_control_panel === true){
				master.showControlPanel();
			}
		}
	}

	this.drawNodeControl = function(){
		offset_x = 50;
		master.clearControlPanel();
		// gui.$pointerevents("control-panel","none");

		master.addType(the_node);
		master.addTitle(the_node);

		if(the_node.type === "tarefa"){
			if(the_node.date_start != "" && the_node.date_start != undefined && the_node.date_start != null){
				master.addDateStart(the_node);
			}
			if(the_node.date_end != "" && the_node.date_end != undefined && the_node.date_end != null){
				master.addDateEnd(the_node);
			}
		}
		else if(the_node.type === "link"){
			// master.addLink(the_node);
		}

		master.addDescription(the_node);

		if(all_links != undefined){
			master.addLinks(the_node);
		}

		if(hidden_control_panel){
			master.showControlPanel();
		}

		master.addFooter();
	}

	this.drawNodeEditControl = function(){
		offset_x = 40;
		master.clearControlPanel();
		// gui.$pointerevents("control-panel","all");

		if(the_node.type === "categoria"){
			master.addEditType(the_node);
			master.addEditTitle(the_node);
			master.addEditDescription(the_node);
			master.addEditGroup(the_node);
		}
		else if(the_node.type === "tarefa"){
			master.addEditType(the_node);
			master.addEditTitle(the_node);
			master.addEditDateStart(the_node);
			master.addEditDateEnd(the_node);
			master.addEditTaskCompleted(the_node);
			master.addEditDescription(the_node);
			master.addEditGroup(the_node);
		}
		else if(the_node.type === "texto"){
			master.addEditType(the_node);
			master.addEditTitle(the_node);
			master.addEditDescription(the_node);
			master.addEditGroup(the_node);
		}
		else if(the_node.type === "link"){
			master.addEditType(the_node);
			master.addEditTitle(the_node);
			master.addEditDescription(the_node);
			master.addEditGroup(the_node);
		}
		else if(the_node.type === "buraco"){
			master.addEditType(the_node);
			master.addEditTitle(the_node);
			master.addEditDescription(the_node);
			master.addEditGroup(the_node);
		}
		if(all_links != undefined){
			master.addEditLinks(the_node);
		}

		master.addFooter();
	}

	this.drawLinkControl = function(){
		offset_x = 50;
		master.clearControlPanel();
		// gui.$pointerevents("control-panel","none");

		master.addLinkType(the_link);
		master.addSource(the_link);
		master.addTarget(the_link);

		if(hidden_control_panel){
			master.showControlPanel();
		}

		master.addFooter();
	}

	this.drawLinkEditControl = function(){
		offset_x = 40;
		master.clearControlPanel();
		// gui.$pointerevents("control-panel","all");

		master.addEditLinkType(the_link);
		master.addSource(the_link);
		master.addTarget(the_link);
		master.addInvertDependency(the_link);
		master.addRemoveLink(the_link);

		master.addFooter();
	}

	this.hideControlPanel = function(){
		if(!running && document.getElementById("control-panel") != null){
			running = true;
			var id = setInterval(frame, 5);
			var position_x = 0;

			function frame() {
			    if (position_x >= 300) {
			        clearInterval(id);
			        document.getElementById("control-panel").style.display = "none";
			        running = false;
			    } else {
			    	position_x += 5;
			    	document.getElementById("control-panel").style.left = -position_x + "px"; 
			    }
			}
			master.lockControlPanel(editing_mode);
			hidden_control_panel = true;
			editing_mode = undefined;
			all_links = undefined;
		}
	}

	this.showControlPanel = function(){
		if(!running && document.getElementById("control-panel") != null){
			running = true;
			var id = setInterval(frame, 5);
			var position_x = 300;
			document.getElementById("control-panel").style.display = "inline";

			function frame() {
			    if (position_x <= 0) {
			        clearInterval(id);
			        running = false;
			    } else {
			    	position_x -= 5;
			    	document.getElementById("control-panel").style.left = -position_x + "px";
			    }
			}
			hidden_control_panel = false;
		}
	}

	this.clearControlPanel = function(){
		offset_x = 50;
		var check_all_elements = ["title","description","date-start","date-end","type","link-type","source-label","source","target-label","target","links","remove","invert-dependency","task-completed","group","footer"];
		for(var i = 0; i < check_all_elements.length; i++){
			master.removeElement(check_all_elements[i]);
		}
	}

	/* LOCK */

	this.lockControlPanel = function(lock_mode){
		lock = true;
		if(lock_mode === "NODE"){
			master.updateControlPanel(the_node, "NODE", false);
		}
		else if(lock_mode === "LINK"){
			master.updateControlPanel(the_link, "LINK", false);
		}
		master.removeTypeDropDown();
		master.removeGroupDropDown();
		current_type = undefined;
		current_group = undefined;
		group_dropdown = false;
		type_dropdown = false;
		document.getElementById("control-panel-lock").innerHTML = '<i class="fa fa-lock" aria-hidden="true"></i>';
	}

	this.unlockControlPanel = function(lock_mode){
		lock = false;
		if(lock_mode === "NODE"){
			current_editing = {};
			for (var property in the_node) {
			    if (the_node.hasOwnProperty(property)) {
			        current_editing[property] = the_node[property];
			    }
			}
			master.updateControlPanel(the_node, "NODE", false);
		}
		else if(lock_mode === "LINK"){
			current_editing = {};
			for (var property in the_link) {
			    if (the_link.hasOwnProperty(property)) {
			        current_editing[property] = the_link[property];
			    }
			}
			master.updateControlPanel(the_link, "LINK", false);
		}
		document.getElementById("control-panel-lock").innerHTML = '<i class="fa fa-unlock" aria-hidden="true"></i>';
	}

	/* FIELDS CONTROL PANEL */

	this.addFooter = function(){
		var footer = {id:"control-panel-footer",height:100,width:300,backgroundColor:"transparent",top:offset_x,left:10};
		gui.addField(footer,"control-panel");
		offset_x+=100;
	}

	this.addType = function(node){
		var field = {id:"control-panel-type",top:offset_x,fontsize:12,height:12,width:300,texttransform:"uppercase",fontweight:200,color:"#9c9c9c"};
		gui.addField(field,"control-panel");
		var text;
		if(node.type === "categoria" && node.parentConnections != 0){
			text = locales['node-type-category'];
			text.toUpperCase();
		}
		else if(node.type === "categoria" && node.parentConnections === 0){
			text = locales['node-type-main-category'];
			text.toUpperCase();
		}
		else if(node.type === "tarefa"){
			text = locales['node-type-task'];
			text.toUpperCase();
		}
		else if(node.type === "texto"){
			text = locales['node-type-text'];
			text.toUpperCase();
		}
		else if(node.type === "link"){
			text = locales['node-type-link'];
			text.toUpperCase();
		}
		else if(node.type === "buraco"){
			text = locales['node-type-wormhole'];
			text.toUpperCase();
		}
		gui.addText("control-panel-type",text);
		offset_x += 16;
	}

	this.addTitle = function(node){
		var field = {id:"control-panel-title",top:offset_x,height:"auto",width:300,texttransform:"uppercase",fontweight:800,color:groups[node.group].color};
		gui.addField(field,"control-panel");
		gui.addText("control-panel-title",node.name);

		var title_offset_y = document.getElementById("control-panel-title").offsetHeight;
		if(title_offset_y < 24){
			title_offset_y = 24;
		}
		offset_x += title_offset_y;
	}

	this.addDescription = function(node){
		var description = {id:"control-panel-description",top:offset_x,height:"auto",width:300};
		gui.addField(description,"control-panel");
		var process_value = node.description;
		process_value = process_value.replace(/\r?\n/g, '<br />');
		gui.addText("control-panel-description",process_value);

		var description_height = document.getElementById("control-panel-description").offsetHeight;
		if(description_height <= 120){
			description_height = 120;
		}
		else{
			description_height += 10;
		}
		offset_x += description_height;
	}

	this.addDateStart = function(node){
		var current_date = [];
		if(node.date_start != ""){
			current_date[0] = moment(node.date_start).format("L");
			current_date[1] = moment(node.date_start).format("h:mm A");
		}
		var field = {id:"control-panel-date-start",position:"absolute",top:offset_x,height:30,width:300,color:"black"};
		gui.addField(field,"control-panel");

		var field_label = {id:"control-panel-date-start-label",height:12,top:0,fontsize:12,fontweight:200,texttransform:"uppercase"};
		gui.addField(field_label,"control-panel-date-start");
		gui.addText("control-panel-date-start-label",locales['control-panel-date-start']);

		var field_date_start = {id:"control-panel-date-start-date",top:12,fontsize:14,fontweight:600,texttransform:"uppercase"};
		gui.addField(field_date_start,"control-panel-date-start");
		gui.addText("control-panel-date-start-date",current_date[0] + '<span style="font-size:12px;font-weight:200;margin-left:20px;text-transform:none">' + current_date[1] + "</span>");

		if(node.date_start != ""){
			var from_now = moment(node.date_start).fromNow();
			var field_from_now = {id:"control-panel-date-start-fromnow",top:14,left:150,fontsize:12,fontweight:200,texttransform:"none"};
			gui.addField(field_from_now,"control-panel-date-start");
			gui.addText("control-panel-date-start-fromnow",'( ' + from_now + ' )');
		}

		offset_x += 34;
	}

	this.addDateEnd = function(node){
		var current_date = [];
		if(node.date_end != ""){
			current_date[0] = moment(node.date_end).format("L");
			current_date[1] = moment(node.date_end).format("h:mm A");
		}
		var field = {id:"control-panel-date-end",position:"absolute",top:offset_x,height:30,width:300,color:"black"};
		gui.addField(field,"control-panel");

		var field_label = {id:"control-panel-date-end-label",height:12,top:0,fontsize:12,fontweight:200,texttransform:"uppercase"};
		gui.addField(field_label,"control-panel-date-end");
		gui.addText("control-panel-date-end-label",locales['control-panel-date-end']);

		var field_date_end = {id:"control-panel-date-end-date",top:12,fontsize:14,fontweight:600,texttransform:"uppercase"};
		gui.addField(field_date_end,"control-panel-date-end");
		gui.addText("control-panel-date-end-date",current_date[0] + '<span style="font-size:12px;font-weight:200;margin-left:20px;text-transform:none">' + current_date[1] + "</span>");
		
		if(node.date_end != ""){
			var from_now = moment(node.date_end).fromNow();
			var field_from_now = {id:"control-panel-date-end-fromnow",top:14,left:150,fontsize:12,fontweight:200,texttransform:"none"};
			gui.addField(field_from_now,"control-panel-date-end");
			gui.addText("control-panel-date-end-fromnow",'( ' + from_now + ' )');
		}

		offset_x += 34;
	}

	this.addLinks = function(node){
		var field = {id:"control-panel-links",top:offset_x,height:24,width:300,fontsize:12,fontweight:400,color:"black"};
		gui.addField(field,"control-panel");

		var offset_link_x = 0;
		if(all_links != undefined){
			for(var i = 0; i < all_links.length; i++){
				var this_link = {id:"control-panel-links-"+i,position:"absolute",texttransform:"uppercase",top:offset_link_x,height:16,width:300,fontsize:12,fontweight:400,color:"black"};
				gui.addField(this_link,"control-panel-links");
				if(all_links[i].source.id === node.id){
					gui.addText("control-panel-links-"+i,'<div style="position:absolute;width:12px;left:0px;top:2px;height:12px;border-radius:6px;background-color:'+groups[node.group].color+'"></div>'+master.getLinkLine(all_links[i].type,"RIGHT")+'<div style="position:absolute;text-align:left;width:248px;left:52px">'+all_links[i].target.name+'</div>');
				}
				else{
					gui.addText("control-panel-links-"+i,'<div style="position:absolute;width:248px;text-align:right;left:0px">'+all_links[i].source.name+'</div>'+master.getLinkLine(all_links[i].type,"LEFT")+'<div style="position:absolute;left:288px;top:2px;width:12px;height:12px;border-radius:6px;background-color:'+groups[node.group].color+'"></div>');
				}
				offset_link_x += 18;
			}
			offset_x+=offset_link_x;
		}
	}

	this.getLinkLine = function(in_link_type, in_align){
		var style_line = "";
		if(in_align === "LEFT"){
			style_line = '<div style="left:248px;';
		}
		else{
			style_line = '<div style="left:12px;';
		}
		if(in_link_type === 1){
			style_line += 'margin:3px;position:absolute;top:4px;border-top:1px solid black;width:34px"></div>';
		}
		else if(in_link_type === 2){
			style_line += 'position:absolute;top:-4px;text-align:center;width:40px;font-size:16px">- - - -</div>';
		}
		else{
			style_line += 'position:absolute;text-align:center;width:40px">• • • • • •</div>';
		}
		return style_line;
	}

	this.addSource = function(link){
		var source_label = {id:"control-panel-source-label",top:offset_x,fontsize:12,height:12,width:300,texttransform:"uppercase",fontweight:200,color:"#9c9c9c"};
		gui.addField(source_label,"control-panel");
		gui.addText("control-panel-source-label",locales['control-panel-source-label']);

		var source_field = {id:"control-panel-source",top:offset_x+14,height:24,width:300,texttransform:"uppercase",fontweight:800,color:link.source.color};
		gui.addField(source_field,"control-panel");
		gui.addText("control-panel-source",link.source.name);

		offset_x += 40;
	}

	this.addTarget = function(link){
		var target_label = {id:"control-panel-target-label",top:offset_x,fontsize:12,height:12,width:300,texttransform:"uppercase",fontweight:200,color:"#9c9c9c"};
		gui.addField(target_label,"control-panel");
		gui.addText("control-panel-target-label",locales['control-panel-target-label']);

		var target_field = {id:"control-panel-target",top:offset_x+14,height:24,width:300,texttransform:"uppercase",fontweight:800,color:link.target.color};
		gui.addField(target_field,"control-panel");
		gui.addText("control-panel-target",link.target.name);

		offset_x += 40;
	}

	this.addRemoveLink = function(link){
		var field = {id: "control-panel-remove",height:40,width:40,top:offset_x};
		gui.addField(field,"control-panel");

		var remove_field = {id:"control-panel-remove-link-"+link.id,top:0,fontsize:36,height:40,width:40,font:"Font Awesome"};
		gui.addField(remove_field,"control-panel-remove");
		gui.addText("control-panel-remove-link-"+link.id,'<i class="fa fa-trash-o" aria-hidden="true"></i>');

		master.removeLinkMouseBehavior(link);
		offset_x += 40;
	}

	this.addLinkType = function(link){
		var container = {id:"control-panel-link-type",top:offset_x,height:42,left:20,width:280,fontsize:12,fontweight:400,color:"black"};
		gui.addField(container,"control-panel");

		if(link.type === 1){
			gui.addText("control-panel-link-type",'<div style="position:absolute;top:0px;left:200px;font-size:36px">></div>');
			var link_one_show = {id:"control-panel-link-type-one",top:22,height:1,width:210,left:4,bordertop:"2px black solid"};
			gui.addField(link_one_show,"control-panel-link-type");
		}
		else if(link.type === 2){
			gui.addText("control-panel-link-type",'<div style="position:absolute;font-size:24px;top:6px"><div style="position:absolute;left:0px;top:-6px;font-size:36px"><</div>- - - - - - - - - - - - - - - - -<div style="position:absolute;left:200px;top:-6px;font-size:36px">></div></div>');
		}
		else if(link.type === 3){
			gui.addText("control-panel-link-type",'<div style="position:absolute;font-size:24px;top:10px"><div style="position:absolute;left:0px;top:-10px;font-size:36px">></div><div style="position:absolute;width:182px;left:20px;font-size:18px">• • • • • • • • • • • • • • • • • • • •</div><div style="position:absolute;left:200px;top:-10px;font-size:36px"><</div></div>');
			// gui.addText("control-panel-link-type","• • • • • • • • >");
		}

		offset_x += 50;
	}

	/* EDIT FIELDS CONTROL PANEL */
		// botão de lock e unlock [toggle] que previne edições
	// em modo de edição os campos se tornam campos de texto
	// para fechar a edição o usuário deve clicar no botão lock [equivalente a salvar; compara com os valores anteriores, se os novos estiverem diferentes salva as versões novas]

	this.addEditType = function(node){
		var field = {id:"control-panel-type",top:offset_x,fontsize:12,height:12,width:300,texttransform:"uppercase",fontweight:200,color:"#9c9c9c"};
		gui.addField(field,"control-panel");
		var text;
		if(node.type === "categoria" && node.parentConnections != 0){
			text = locales['node-type-category'];
			text.toUpperCase();
		}
		else if(node.type === "categoria" && node.parentConnections === 0){
			text = locales['node-type-main-category'];
			text.toUpperCase();
		}
		else if(node.type === "tarefa"){
			text = locales['node-type-task'];
			text.toUpperCase();
		}
		else if(node.type === "texto"){
			text = locales['node-type-text'];
			text.toUpperCase();
		}
		else if(node.type === "link"){
			text = locales['node-type-link'];
			text.toUpperCase();
		}
		else if(node.type === "buraco"){
			text = locales['node-type-wormhole'];
			text.toUpperCase();
		}
		gui.addText("control-panel-type",text + ' <span id="control-panel-type-dropdown" style="margin-left:10px;font-size:12px;color:black"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>');
		offset_x += 15;

		master.editTypeMouseBehavior();
	}

	this.addEditTitle = function(node){
		var field = {id:"control-panel-title",top:offset_x,height:24,width:300,texttransform:"uppercase",fontweight:800,color:groups[node.group].color};
		gui.addField(field,"control-panel");
		var input_title = {class:"edit-title",id:"control-panel-edit-title",width:299.33};
		gui.addInput(input_title,"","control-panel-title",node.name);
		document.getElementById("control-panel-edit-title").style.color = groups[node.group].color;
		document.getElementById("control-panel-edit-title").style.borderBottom = "1px "+groups[node.group].color+" solid";
		offset_x += 32;
	}

	this.addEditDescription = function(node){
		var description = {id:"control-panel-description",top:offset_x,height:120,width:300};
		gui.addField(description,"control-panel");
		var text_area_description = {class: "edit-description",id: "control-panel-edit-description",cols:39,rows:8,padding:4};
		gui.addTextArea(text_area_description,locales['control-panel-description-placeholder'],"control-panel-description",node.description);
		document.getElementById("control-panel-edit-description").style.border = "1px "+groups[node.group].color+" solid";
		offset_x += 190;
	}

	this.addEditDateStart = function(node){
		var field = {id:"control-panel-date-start",position:"absolute",top:offset_x,height:30,width:300,color:"black",zindex:11};
		gui.addField(field,"control-panel");

		var field_label = {id:"control-panel-date-start-label",height:12,top:0,fontsize:12,fontweight:200,texttransform:"uppercase"};
		gui.addField(field_label,"control-panel-date-start");
		gui.addText("control-panel-date-start-label",locales['control-panel-date-start']);

		var input_date_start = {class:"edit-date",id:"control-panel-edit-date-start",margintop:14};
		// var parse_date = moment().format('L • H:mm');
		var parse_date = "";
		if(node.date_start != ""){
			parse_date = moment(node.date_start,[moment.ISO_8601]).format('L • H:mm');
		}
		gui.addInput(input_date_start,"","control-panel-date-start",parse_date);
		document.getElementById("control-panel-edit-date-start").style.color = groups[node.group].color;
		document.getElementById("control-panel-edit-date-start").style.borderBottom = "1px "+groups[node.group].color+" solid";

		offset_x += 40;

		master.dateStartMouseBehavior(node);
	}

	this.addEditDateEnd = function(node){
		var field = {id:"control-panel-date-end",position:"absolute",top:offset_x,height:30,width:300,color:"black",zindex:10};
		gui.addField(field,"control-panel");

		var field_label = {id:"control-panel-date-end-label",height:12,top:0,fontsize:12,fontweight:200,texttransform:"uppercase"};
		gui.addField(field_label,"control-panel-date-end");
		gui.addText("control-panel-date-end-label",locales['control-panel-date-end']);

		var input_date_end = {class:"edit-date",id:"control-panel-edit-date-end",margintop:14};
		// var parse_date = moment().format('L • H:mm');
		var parse_date = "";
		if(node.date_end != ""){
			parse_date = moment(node.date_end,[moment.ISO_8601]).format('L • H:mm');
		}
		gui.addInput(input_date_end,"","control-panel-date-end",parse_date);
		document.getElementById("control-panel-edit-date-end").style.color = groups[node.group].color;
		document.getElementById("control-panel-edit-date-end").style.borderBottom = "1px "+groups[node.group].color+" solid";

		offset_x += 40;

		master.dateEndMouseBehavior(node);
	}

	this.addEditTaskCompleted = function(node){
		var field = {id:"control-panel-task-completed",position:"absolute",top:offset_x,margintop:5,height:30,width:300,color:"black"};
		gui.addField(field,"control-panel");

		var field_label = {id:"control-panel-task-completed-label",height:12,top:0,fontsize:12,fontweight:200,texttransform:"uppercase"};
		gui.addField(field_label,"control-panel-task-completed");
		gui.addText("control-panel-task-completed-label",locales['control-panel-task-completed']);

		var field_offset_x = document.getElementById("control-panel-task-completed-label").clientWidth + 10;
		var current_icon = undefined;
		if(node.completed){
			current_icon = 'fa-check-square';
		}
		else{
			current_icon = 'fa-minus-square';
		}
		var field_checkbox = {id:"control-panel-task-completed-checkbox",top:-2,left:field_offset_x,width:14,height:14,fontsize:14,fontweight:600,texttransform:"uppercase"};
		gui.addField(field_checkbox,"control-panel-task-completed");
		gui.addText("control-panel-task-completed-checkbox",'<i class="fa '+current_icon+'" aria-hidden="true"></i>');
		offset_x += 35;

		master.toggleTaskCompletedMouseBehavior(node);
	}

	this.addEditGroup = function(node){
		// no clique: dropdown
		var field = {id:"control-panel-group",top:offset_x,fontsize:12,height:12,width:300,texttransform:"uppercase",fontweight:200,color:"#9c9c9c"};
		gui.addField(field,"control-panel");

		var color_field = {id:"control-panel-group-dropdown",top:0,left:0,width:30,height:15,backgroundColor:groups[node.group].color};
		gui.addField(color_field,"control-panel-group");

		var color_label = {id:"control-panel-group-label",top:0,left:40,width:260,height:15,font:'Source Sans Pro',fontsize:12,color:groups[node.group].color,fontweight:600};
		gui.addField(color_label,"control-panel-group");
		gui.addText("control-panel-group-label",groups[node.group].name);

		offset_x += 30;

		master.editGroupMouseBehavior();
	}

	this.addEditLinks = function(node){
		var field = {id:"control-panel-links",top:offset_x,height:24,width:300,fontsize:12,fontweight:400,color:"black"};
		gui.addField(field,"control-panel");

		var offset_link_x = 0;
		if(all_links != undefined){
			for(var i = 0; i < all_links.length; i++){
				var this_link = {id:"control-panel-links-"+all_links[i].id,position:"absolute",texttransform:"uppercase",top:offset_link_x,height:16,width:300,fontsize:12,fontweight:400,color:"black",bordertop:"1px solid transparent",borderbottom:"1px solid transparent"};
				gui.addField(this_link,"control-panel-links");
				if(all_links[i].source.id === node.id){
					gui.addText("control-panel-links-"+all_links[i].id,'<div style="position:absolute;width:12px;left:0px;top:2px;height:12px;border-radius:6px;background-color:'+groups[node.group].color+'"></div>'+master.getLinkLine(all_links[i].type,"RIGHT")+'<div style="position:absolute;text-align:left;width:248px;left:52px">'+all_links[i].target.name+'</div>');
				}
				else{
					gui.addText("control-panel-links-"+all_links[i].id,'<div style="position:absolute;width:248px;text-align:right;left:0px">'+all_links[i].source.name+'</div>'+master.getLinkLine(all_links[i].type,"LEFT")+'<div style="position:absolute;left:288px;top:2px;width:12px;height:12px;border-radius:6px;background-color:'+groups[node.group].color+'"></div>');
				}
				offset_link_x += 18;
				master.linksMouseBehavior(all_links[i].id,groups[node.group].color);
			}
			offset_x+=offset_link_x;
		}
	}

	this.addInvertDependency = function(link){
		var field = {id: "control-panel-invert-dependency",height:40,width:40,position:"absolute",top:offset_x-54};
		gui.addField(field,"control-panel");

		var invert_field = {id:"control-panel-invert-dependency-"+link.id,textalign:"RIGHT",top:0,left:260,fontsize:28,height:40,width:40,font:"Font Awesome"};
		gui.addField(invert_field,"control-panel-invert-dependency");
		gui.addText("control-panel-invert-dependency-"+link.id,'<i class="fa fa-refresh" aria-hidden="true"></i>');

		master.invertDependencyLinkMouseBehavior(link);
	}

	this.addEditLinkType = function(link){
		var container = {id:"control-panel-link-type",top:offset_x,height:42,width:300,fontsize:12,fontweight:400,color:"black"};
		gui.addField(container,"control-panel");

		var link_one = {id:"control-panel-link-type-1",textalign: "CENTER",top:0,height:40,width:40,left:0,border:"1px black dotted"};
		gui.addField(link_one,"control-panel-link-type");

		var link_one_show = {id:"control-panel-link-type-1-show",top:19,height:1,width:32,left:4,bordertop:"2px black solid"};
		gui.addField(link_one_show,"control-panel-link-type-1");

		var link_two = {id:"control-panel-link-type-2",textalign: "CENTER",top:0,paddingtop:8,height:32,width:40,left:50,border:"1px black dotted",fontsize:18};
		gui.addField(link_two,"control-panel-link-type");
		gui.addText("control-panel-link-type-2","- - - -");

		var link_three = {id:"control-panel-link-type-3",textalign: "CENTER",top:0,paddingtop:8,height:32,width:40,left:100,border:"1px black dotted",fontsize:18};
		gui.addField(link_three,"control-panel-link-type");
		gui.addText("control-panel-link-type-3","• • • •");

		if(link.type === 1){
			gui.$border("control-panel-link-type-1","1px black solid");
		}
		else if(link.type === 2){
			gui.$border("control-panel-link-type-2","1px black solid");
		}
		else if(link.type === 3){
			gui.$border("control-panel-link-type-3","1px black solid");
		}

		master.selectLinkTypeMouseBehavior("control-panel-link-type-1");
		master.selectLinkTypeMouseBehavior("control-panel-link-type-2");
		master.selectLinkTypeMouseBehavior("control-panel-link-type-3");

		offset_x += 50;
	}

	// this.addPlaces = function(node){
	// 	// later version
	// }

	// this.addPeople = function(node){
	// 	// later version
	// }

	// this.addStats = function(node){
	// 	// estatísticas do nódulo: quantos children, grupo, etc, tipos de nódulos dentro [e número de nódulos de cada tipo, etc]
	// }

	/* EDITING PANEL */

	this.menu = function(){
		var container = {id:"edit-panel", class:"noselect", display: "inline",height:240,width:40, pointerevents:"none",left:(window.innerWidth-50),top:((window.innerHeight-240)/2), backgroundColor:"transparent", font:"Source Sans Pro"};
		gui.addContainer(container);

		var node_button = {id:"edit-panel-node", class:"buttons", paddingtop: 6, display: "inline",height:34, width:40, pointerevents:"all",left:0,top:0, font:"Font Awesome", fontsize:24, textalign: "CENTER"};
		gui.addField(node_button,"edit-panel");
		gui.addText("edit-panel-node",'<i class="fa fa-bullseye" aria-hidden="true"></i>');

		var link_button = {id:"edit-panel-link", class:"buttons", paddingtop: 6, display: "inline",height:34, width:40, pointerevents:"all",left:0,top:50, font:"Font Awesome", fontsize:24, textalign: "CENTER"};
		gui.addField(link_button,"edit-panel");
		gui.addText("edit-panel-link",'<i class="fa fa-code-fork" aria-hidden="true"></i>');

		var state_button = {id:"edit-panel-state", class:"buttons", paddingtop: 6, display: "inline",height:34, width:40, pointerevents:"all",left:0,top:100, font:"Font Awesome", fontsize:24, textalign: "CENTER"};
		gui.addField(state_button,"edit-panel");
		gui.addText("edit-panel-state",'<i class="fa fa-leaf" aria-hidden="true"></i>');

		var environment_button = {id:"edit-panel-environment", class:"buttons", paddingtop: 6, display: "inline",height:34, width:40, pointerevents:"all",left:0,top:200, font:"Font Awesome", fontsize:24, textalign: "CENTER"};
		gui.addField(environment_button,"edit-panel");
		gui.addText("edit-panel-environment",'<i class="fa fa-map" aria-hidden="true"></i>');

		var group_button = {id:"edit-panel-group", class:"buttons", paddingtop: 6, display: "inline",height:34, width:40, pointerevents:"all",left:0,top:150, font:"Font Awesome", fontsize:24, textalign: "CENTER"};
		gui.addField(group_button,"edit-panel");
		gui.addText("edit-panel-group",'<i class="fa fa-object-group" aria-hidden="true"></i>');

		master.mainMouseBehavior("edit-panel-node");
		master.mainMouseBehavior("edit-panel-link");
		master.mainMouseBehavior("edit-panel-state");
		master.mainMouseBehavior("edit-panel-environment");
		master.mainMouseBehavior("edit-panel-group");
		
	}

	this.toggleNodesMenu = function(){
		if(togglemenus.node === false && document.getElementById("edit-panel-nodes") != null){
			document.getElementById("edit-panel-nodes").style.display = "inline";
			togglemenus.node = true;
		}
		else if(togglemenus.node === false && document.getElementById("edit-panel-nodes") === null){
			master.nodesMenu();
			togglemenus.node = true;
		}
		else{
			document.getElementById("edit-panel-nodes").style.display = "none";
			togglemenus.node = false;
		}
	}

	this.toggleLinksMenu = function(){
		if(togglemenus.link === false && document.getElementById("edit-panel-links") != null){
			document.getElementById("edit-panel-links").style.display = "inline";
			togglemenus.link = true;
		}
		else if(togglemenus.link === false && document.getElementById("edit-panel-links") === null){
			master.linksMenu();
			togglemenus.link = true;
		}
		else{
			document.getElementById("edit-panel-links").style.display = "none";
			togglemenus.link = false;
		}
	}

	this.toggleStatesMenu = function(){
		if(togglemenus.state === false && document.getElementById("edit-panel-states") != null){
			document.getElementById("edit-panel-states").style.display = "inline";
			togglemenus.state = true;
		}
		else if(togglemenus.state === false && document.getElementById("edit-panel-states") === null){
			master.statesMenu();
			togglemenus.state = true;
		}
		else{
			document.getElementById("edit-panel-states").style.display = "none";
			togglemenus.state = false;
		}
	}

	this.toggleEnvironmentMenu = function(){
		if(togglemenus.environment === false && document.getElementById("edit-panel-environments") != null){
			document.getElementById("edit-panel-environments").style.display = "inline";
			togglemenus.environment = true;
		}
		else if(togglemenus.environment === false && document.getElementById("edit-panel-environments") === null){
			master.environmentsMenu();
			togglemenus.environment = true;
		}
		else{
			document.getElementById("edit-panel-environments").style.display = "none";
			togglemenus.environment = false;
		}
	}

	this.toggleGroupsMenu = function(){
		if(togglemenus.group === false && document.getElementById("edit-panel-groups") != null){
			document.getElementById("edit-panel-groups").style.display = "inline";
			togglemenus.group = true;
		}
		else if(togglemenus.group === false && document.getElementById("edit-panel-groups") === null){
			master.groupsMenu();
			togglemenus.group = true;
		}
		else{
			document.getElementById("edit-panel-groups").style.display = "none";
			togglemenus.group = false;
		}
	}

	this.nodesMenu = function(){
		var container = {id:"edit-panel-nodes", class:"noselect", position: "absolute", backgroundColor: "black",display: "inline",height:40,width:90, pointerevents:"none",left:(window.innerWidth-150),top:((window.innerHeight-240)/2), backgroundColor:"transparent", font:"Source Sans Pro"};
		gui.addContainer(container);

		var nodeadd_button = {id:"edit-panel-nodeadd", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:0,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(nodeadd_button,"edit-panel-nodes");
		gui.addText("edit-panel-nodeadd",'<i class="fa fa-plus" aria-hidden="true"></i>');

		var nodedelete_button = {id:"edit-panel-nodedelete", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:50,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(nodedelete_button,"edit-panel-nodes");
		gui.addText("edit-panel-nodedelete",'<i class="fa fa-minus" aria-hidden="true"></i>');

		master.secondaryMouseBehavior("edit-panel-nodeadd");
		master.secondaryMouseBehavior("edit-panel-nodedelete");
	}

	this.linksMenu = function(){
		var container = {id:"edit-panel-links", class:"noselect", position: "absolute", backgroundColor: "black",display: "inline",height:40,width:90, pointerevents:"none",left:(window.innerWidth-150),top:(((window.innerHeight-240)/2)+50), backgroundColor:"transparent", font:"Source Sans Pro"};
		gui.addContainer(container);

		var linkadd_button = {id:"edit-panel-linkadd", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:0,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(linkadd_button,"edit-panel-links");
		gui.addText("edit-panel-linkadd",'<i class="fa fa-plus" aria-hidden="true"></i>');

		var linkdelete_button = {id:"edit-panel-linkdelete", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:50,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(linkdelete_button,"edit-panel-links");
		gui.addText("edit-panel-linkdelete",'<i class="fa fa-minus" aria-hidden="true"></i>');

		master.secondaryMouseBehavior("edit-panel-linkadd");
		master.secondaryMouseBehavior("edit-panel-linkdelete");
	}

	this.statesMenu = function(){
		var container = {id:"edit-panel-states", class:"noselect", position: "absolute", backgroundColor: "black",display: "inline",height:40,width:140, pointerevents:"none",left:(window.innerWidth-200),top:(((window.innerHeight-240)/2)+100), backgroundColor:"transparent", font:"Source Sans Pro"};
		gui.addContainer(container);

		var stateidle_button = {id:"edit-panel-stateidle", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:0,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(stateidle_button,"edit-panel-states");
		gui.addText("edit-panel-stateidle",'<i class="fa fa-hourglass-2" aria-hidden="true"></i>');

		var stateexplode_button = {id:"edit-panel-stateexplode", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:50,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(stateexplode_button,"edit-panel-states");
		gui.addText("edit-panel-stateexplode",'<i class="fa fa-folder-open" aria-hidden="true"></i>');

		var statecontract_button = {id:"edit-panel-statecontract", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:100,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(statecontract_button,"edit-panel-states");
		gui.addText("edit-panel-statecontract",'<i class="fa fa-folder" aria-hidden="true"></i>');

		master.secondaryMouseBehavior("edit-panel-stateidle");
		master.secondaryMouseBehavior("edit-panel-stateexplode");
		master.secondaryMouseBehavior("edit-panel-statecontract");
	}

	this.environmentsMenu = function(){
		var container = {id:"edit-panel-environments", class:"noselect", position: "absolute", backgroundColor: "black",display: "inline",height:40,width:90, pointerevents:"none",left:(window.innerWidth-150),top:(((window.innerHeight-240)/2)+200), backgroundColor:"transparent", font:"Source Sans Pro"};
		gui.addContainer(container);

		var environmentstop_button = {id:"edit-panel-environmentstop", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:0,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(environmentstop_button,"edit-panel-environments");
		gui.addText("edit-panel-environmentstop",'<i class="fa fa-hand-stop-o" aria-hidden="true"></i>');

		var environmentcenter_button = {id:"edit-panel-environmentcenter", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:50,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(environmentcenter_button,"edit-panel-environments");
		gui.addText("edit-panel-environmentcenter",'<i class="fa fa-certificate" aria-hidden="true"></i>');

		master.secondaryMouseBehavior("edit-panel-environmentstop");
		master.secondaryMouseBehavior("edit-panel-environmentcenter");
	}

	this.groupsMenu = function(){
		var container = {id:"edit-panel-groups", class:"noselect", position: "absolute", backgroundColor: "black",display: "inline",height:40,width:90, pointerevents:"none",left:(window.innerWidth-150),top:(((window.innerHeight-240)/2)+150), backgroundColor:"transparent", font:"Source Sans Pro"};
		gui.addContainer(container);

		var groupadd_button = {id:"edit-panel-groupadd", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:0,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(groupadd_button,"edit-panel-groups");
		gui.addText("edit-panel-groupadd",'<i class="fa fa-plus" aria-hidden="true"></i>');

		var groupedit_button = {id:"edit-panel-groupedit", class:"secondary-buttons", paddingtop: 10, display: "inline",height:28, width:38, pointerevents:"all",left:50,top:0, font:"Font Awesome", fontsize:20, textalign: "CENTER"};
		gui.addField(groupedit_button,"edit-panel-groups");
		gui.addText("edit-panel-groupedit",'<i class="fa fa-edit" aria-hidden="true"></i>');

		master.secondaryMouseBehavior("edit-panel-groupadd");
		master.secondaryMouseBehavior("edit-panel-groupedit");
	}

	this.closeMenus = function(){
		if(edit_item != undefined){
			var previous_element = document.getElementById("edit-panel-"+edit_item);
			previous_element.style.fontFamily = "Font Awesome";
			previous_element.innerHTML = '<i class="fa '+tooltips[edit_item].fa+'" aria-hidden="true"></i>';
			previous_element.style.fontSize = "20px";
			previous_element.style.height = "28px";
			previous_element.style.paddingTop = "10px";
			previous_element.style.texttransform = "none";
			editing[edit_item] = !editing[edit_item];
			edit_item = undefined;
		}
		if(togglemenus.node){
			master.toggleNodesMenu();
			var element = document.getElementById("edit-panel-node");
			element.style.fontFamily = "Font Awesome";
			element.innerHTML = '<i class="fa '+tooltips["node"].fa+'" aria-hidden="true"></i>';
			element.style.fontSize = "24px";
			element.style.height = "34px";
			element.style.paddingTop = "6px";
			element.style.texttransform = "none";
			togglemenus.node = false;
		}
		if(togglemenus.link){
			master.toggleLinksMenu();
			var element = document.getElementById("edit-panel-link");
			element.style.fontFamily = "Font Awesome";
			element.innerHTML = '<i class="fa '+tooltips["link"].fa+'" aria-hidden="true"></i>';
			element.style.fontSize = "24px";
			element.style.height = "34px";
			element.style.paddingTop = "6px";
			element.style.texttransform = "none";
			togglemenus.link = false;
		}
		if(togglemenus.state){
			master.toggleStatesMenu();
			var element = document.getElementById("edit-panel-state");
			element.style.fontFamily = "Font Awesome";
			element.innerHTML = '<i class="fa '+tooltips["state"].fa+'" aria-hidden="true"></i>';
			element.style.fontSize = "24px";
			element.style.height = "34px";
			element.style.paddingTop = "6px";
			element.style.texttransform = "none";
			togglemenus.state = false;
		}
		if(togglemenus.environment){
			master.toggleEnvironmentMenu();
			var element = document.getElementById("edit-panel-environment");
			element.style.fontFamily = "Font Awesome";
			element.innerHTML = '<i class="fa '+tooltips["environment"].fa+'" aria-hidden="true"></i>';
			element.style.fontSize = "24px";
			element.style.height = "34px";
			element.style.paddingTop = "6px";
			element.style.texttransform = "none";
			togglemenus.environment = false;
		}
		if(togglemenus.group){
			master.toggleGroupsMenu();
			var element = document.getElementById("edit-panel-group");
			element.style.fontFamily = "Font Awesome";
			element.innerHTML = '<i class="fa '+tooltips["group"].fa+'" aria-hidden="true"></i>';
			element.style.fontSize = "24px";
			element.style.height = "34px";
			element.style.paddingTop = "6px";
			element.style.texttransform = "none";
			togglemenus.group = false;
		}
	}

	this.editionMode = function(){
		return edit_item;
	}

	/* SELECT LINE */
	// this.createSelectLine = function(){

	// }

	// this.updateSelectLine = function(){
		
	// }

	this.removeSelectLine = function(){
		if(document.getElementById("select-lines")!= null){
			document.getElementById("select-lines").parentElement.removeChild(document.getElementById("select-lines"));
		}
	}

	/* MOUSE BEHAVIOR */

	this.toggleTypeDropDown = function(){
		type_dropdown = !type_dropdown;
		if(type_dropdown){
			master.drawTypeDropDown();
		}
		else{
			master.removeTypeDropDown();
		}
	}

	this.toggleGroupDropDown = function(){
		group_dropdown = !group_dropdown;
		if(group_dropdown){
			master.drawGroupDropDown();
		}
		else{
			master.removeGroupDropDown();
		}
	}

	this.drawTypeDropDown = function(){
		var container = {id:"dropdown-type",left:10,top:70,width:100,height: node_types.length*20,backgroundColor:"white",font:"Source Sans Pro",fontsize:12};
		var offset_item_x = 0;
		gui.addContainer(container);
		for(var i = 0; i < node_types.length; i++){
			var fontweight = 400;
			var bordertop = null;
			var borderbottom = null;
			if(current_type === undefined){
				if(node_types[i].type === the_node.type){
					fontweight = 800;
				}
			}
			else{
				if(node_types[i].type === current_type){
					fontweight = 800;
				}
			}
			if(i === 0){
				bordertop = "1px "+the_node.color+" dotted"
				borderbottom = "1px "+the_node.color+" dotted";
			}
			else{
				borderbottom = "1px "+the_node.color+" dotted";
			}
			var field = {id:"dropdown-type-"+node_types[i].type,top:offset_item_x,paddingtop:3,height:17,fontweight:fontweight,width:100,bordertop:bordertop,borderbottom:borderbottom};
			gui.addField(field,"dropdown-type");
			gui.addText("dropdown-type-"+node_types[i].type,node_types[i].name.toUpperCase());
			master.selectTypeMouseBehavior("dropdown-type-"+node_types[i].type);
			offset_item_x += 20;
		}
		// node_types[0] = {type:"categoria",name:"categoria"};
	}

	this.drawGroupDropDown = function(){
		var container_height = Object.keys(groups).length*20;
		var offset_top = document.getElementById("control-panel-group").offsetTop + 24;
		var container = {id:"dropdown-group",left:10,top:offset_top,width:200,height: container_height,backgroundColor:"white",font:"Source Sans Pro",fontsize:12};
		var offset_item_x = 0;
		gui.addContainer(container);
		var inc = 0;
		for(group in groups){
			if(group != "_DEFAULT"){	
				var fontweight = 400;
				var bordertop = null;
				var borderbottom = null;
				if(current_group === undefined){
					if(groups[group].color === the_node.color){
						fontweight = 800;
					}
				}
				else{
					if(group === current_group){
						fontweight = 800;
					}
				}
				if(inc === 0){
					bordertop = "1px "+the_node.color+" dotted"
					borderbottom = "1px "+the_node.color+" dotted";
				}
				else{
					borderbottom = "1px "+the_node.color+" dotted";
				}
				var field = {id:"dropdown-color-"+group,top:offset_item_x+3,height:15,fontweight:fontweight,width:30,backgroundColor:groups[group].color};
				gui.addField(field,"dropdown-group");

				var field = {id:"dropdown-group-"+group,top:offset_item_x,paddingleft:40,paddingtop:3,height:17,fontweight:fontweight,width:160,bordertop:bordertop,borderbottom:borderbottom,color:"black"};
				gui.addField(field,"dropdown-group");
				gui.addText("dropdown-group-"+group,groups[group].name);
				master.selectGroupMouseBehavior("dropdown-group-"+group);
				offset_item_x += 20;
				inc++;
			}
		}
	}

	this.removeTypeDropDown = function(){
		if(document.getElementById("dropdown-type")!=null){
			document.getElementById("dropdown-type").parentElement.removeChild(document.getElementById("dropdown-type"));
		}
	}

	this.removeGroupDropDown = function(){
		if(document.getElementById("dropdown-group")!=null){
			document.getElementById("dropdown-group").parentElement.removeChild(document.getElementById("dropdown-group"));
		}
	}

	this.selectGroupMouseBehavior = function(id){
		var button = document.getElementById(id);
		var mouseOverGroup = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			this.style.cursor = "pointer";
			this.style.color = "rgb(156,156,156)";
			document.getElementById("dropdown-color-"+current_id).style.backgroundColor = "black";
		}
		var mouseOutGroup = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			this.style.color = "black";
			document.getElementById("dropdown-color-"+current_id).style.backgroundColor = groups[current_id].color;
		}
		var mouseDownGroup = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			current_group = current_id;
			current_editing.group = current_id;
			current_editing.color = groups[current_id].color;
			document.getElementById("control-panel-group").innerHTML = "";
			var color_field = {id:"control-panel-group-dropdown",top:0,left:0,width:30,height:15,backgroundColor:current_editing.color};
			gui.addField(color_field,"control-panel-group");

			var color_label = {id:"control-panel-group-label",top:0,left:40,width:260,height:15,font:'Source Sans Pro',fontsize:12,color:current_editing.color,fontweight:600};
			gui.addField(color_label,"control-panel-group");
			gui.addText("control-panel-group-label",groups[current_editing.group].name);
			master.editGroupMouseBehavior();
			master.toggleGroupDropDown();
		}
		button.onmouseover = mouseOverGroup;
		button.onmouseout = mouseOutGroup;
		button.onmousedown = mouseDownGroup;
	}

	this.selectTypeMouseBehavior = function(id){
		var button = document.getElementById(id);
		var mouseOverType = function(){
			this.style.cursor = "pointer";
			this.style.color = "rgb(156,156,156)";
		}
		var mouseOutType = function(){
			this.style.color = "black";
		}
		var mouseDownType = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			current_type = current_id;
			var text = "";
			for(var i = 0; i < node_types.length; i++){
				if(node_types[i].type === current_id){
					text = node_types[i].name;
					current_editing.type = node_types[i].type;
				}
			}
			document.getElementById("control-panel-type").innerHTML = text + ' <span id="control-panel-type-dropdown" style="margin-left:10px;font-size:12px;color:black"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>';
			master.editTypeMouseBehavior();
			master.toggleTypeDropDown();
		}
		button.onmouseover = mouseOverType;
		button.onmouseout = mouseOutType;
		button.onmousedown = mouseDownType;
	}

	this.selectLinkTypeMouseBehavior = function(id){
		var button = document.getElementById(id);
		var mouseOverType = function(){
			this.style.cursor = "pointer";
			this.style.border = "1px solid black";
		}
		var mouseOutType = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			if(current_id != current_editing.type){
				this.style.border = "1px dotted black";
			}
		}
		var mouseDownType = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			if(current_id != current_editing.type){
				document.getElementById("control-panel-link-type-"+current_editing.type).style.border = "1px dotted black";
				current_editing.type = parseInt(current_id);
			}
		}
		button.onmouseover = mouseOverType;
		button.onmouseout = mouseOutType;
		button.onmousedown = mouseDownType;
	}

	this.editTypeMouseBehavior = function(){
		var button = document.getElementById("control-panel-type-dropdown");
		var mouseOverType = function(){
			this.style.cursor = "pointer";
			this.style.color = "#aeaeae";
		}
		var mouseOutType = function(){
			this.style.color = "black";
		}
		var mouseDownType = function(){
			master.toggleTypeDropDown();
		}
		button.onmouseover = mouseOverType;
		button.onmouseout = mouseOutType;
		button.onmousedown = mouseDownType;
	}

	this.editGroupMouseBehavior = function(){
		var button = document.getElementById("control-panel-group-dropdown");
		var mouseOverGroup = function(){
			this.style.cursor = "pointer";
			this.style.backgroundColor = "black";
		}
		var mouseOutGroup = function(){
			this.style.backgroundColor = groups[current_editing.group].color;
		}
		var mouseDownGroup = function(){
			master.toggleGroupDropDown();
		}
		button.onmouseover = mouseOverGroup;
		button.onmouseout = mouseOutGroup;
		button.onmousedown = mouseDownGroup;
	}

	this.lockMouseBehavior = function(){
		var button = document.getElementById("control-panel-lock");
		var mouseOverLock = function(){
			this.style.cursor = "pointer";
		}
		var mouseOutLock = function(){
			
		}
		var mouseDownLock = function(){
			if(lock){
				master.unlockControlPanel(editing_mode);
			}
			else{
				//get edited fields and check if something changed
				var found_node_match = false;
				var found_link_match = false;
				if(editing_mode === "NODE"){
					if(document.getElementById("control-panel-edit-title")!=null && document.getElementById("control-panel-edit-title").value != the_node.name){ // 
						current_editing.name = document.getElementById("control-panel-edit-title").value;
						the_node.name = current_editing.name;
						found_node_match = true;
					}
					if(document.getElementById("control-panel-edit-description")!=null && document.getElementById("control-panel-edit-description").value != the_node.description){ // 
						current_editing.description = document.getElementById("control-panel-edit-description").value;
						the_node.description = current_editing.description;
						found_node_match = true;
					}
					if(document.getElementById("control-panel-edit-date-start")!=null){
						var parse_date = moment(document.getElementById("control-panel-edit-date-start").value,['L • H:mm']).format();
						if(parse_date != the_node.date_start){
							current_editing.date_start = parse_date;
							the_node.date_start = current_editing.date_start;
							found_node_match = true;
						}
					}
					if(document.getElementById("control-panel-edit-date-end")!=null){
						var parse_date = moment(document.getElementById("control-panel-edit-date-end").value,['L • H:mm']).format();
						if(parse_date != the_node.date_end){
							current_editing.date_end = parse_date;
							the_node.date_end = current_editing.date_end;
							found_node_match = true;
						}
					}
					if(current_editing.type != the_node.type){
						the_node.type = current_editing.type;
						found_node_match = true;
					}
					if(current_editing.group != the_node.group){
						the_node.group = current_editing.group;
						the_node.color = current_editing.color;
						found_node_match = true;
					}
					if(current_editing.completed != the_node.completed){
						the_node.completed = current_editing.completed;
						found_node_match = true;
					}
				}
				else if(editing_mode === "LINK"){
					if(current_editing.type != the_link.type){
						the_link.type = current_editing.type;
						found_link_match = true;
					}
				}

				master.lockControlPanel(editing_mode);
				// if things changed, fire update to rhisoma
				if(found_node_match){
					save_node_edition = true;
					master.eventFire(document.body, 'click');
				}
				else if(found_link_match){
					current_editing.source = the_link.source.id;
					current_editing.target = the_link.target.id;
					save_link_edition = true;
					master.eventFire(document.body, 'click');
				}
			}
		}
		button.onmouseover = mouseOverLock;
		button.onmouseout = mouseOutLock;
		button.onmousedown = mouseDownLock;
	}

	this.linksMouseBehavior = function(id,the_color){
		var button = document.getElementById("control-panel-links-"+id);
		var mouseOverLink = function(){
			this.style.cursor = "pointer";
			this.style.borderTop = "1px solid "+the_color;
			this.style.borderBottom = "1px solid "+the_color;
		}
		var mouseOutLink = function(){
			this.style.borderTop = "1px solid transparent";
			this.style.borderBottom = "1px solid transparent";
		}
		var mouseDownLink = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			var index = undefined;
			for(var i = 0; i < all_links.length; i++){
				if(all_links[i].id === current_id){
					index = i;
				}
			}
			if(index != undefined){
				the_link = all_links[index];
			}
			editing_mode = "LINK";
			master.lockControlPanel(editing_mode);
		}
		button.onmouseover = mouseOverLink;
		button.onmouseout =   mouseOutLink;
		button.onmousedown = mouseDownLink;
	}

	this.removeLinkMouseBehavior = function(link){
		var button = document.getElementById("control-panel-remove-link-"+link.id);
		var mouseOverLink = function(){
			this.style.cursor = "pointer";
			this.style.color = "#c9c9c9";
		}
		var mouseOutLink = function(){
			this.style.color = "black";
		}
		var mouseDownLink = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			delete_link = current_id;
			master.hideControlPanel();
			master.eventFire(document.body, 'click');
		}
		button.onmouseover = mouseOverLink;
		button.onmouseout =   mouseOutLink;
		button.onmousedown = mouseDownLink;
	}

	this.toggleTaskCompletedMouseBehavior = function(node){
		var button = document.getElementById("control-panel-task-completed-checkbox");
		var mouseOverCompleted = function(){
			this.style.cursor = "pointer";
			this.style.color = node.color;
		}
		var mouseOutCompleted = function(){
			this.style.color = "black";
		}
		var mouseDownCompleted = function(){
			if(current_editing.completed === 1){
				current_editing.completed = 0;
				document.getElementById("control-panel-task-completed-checkbox").innerHTML = '<i class="fa fa-minus-square" aria-hidden="true"></i>';
			}
			else{
				current_editing.completed = 1;
				document.getElementById("control-panel-task-completed-checkbox").innerHTML = '<i class="fa fa-check-square" aria-hidden="true"></i>';
			}
		}
		button.onmouseover = mouseOverCompleted;
		button.onmouseout =   mouseOutCompleted;
		button.onmousedown = mouseDownCompleted;
	}

	this.invertDependencyLinkMouseBehavior = function(link){
		var button = document.getElementById("control-panel-invert-dependency-"+link.id);
		var mouseOverLink = function(){
			this.style.cursor = "pointer";
			this.style.color = "#c9c9c9";
		}
		var mouseOutLink = function(){
			this.style.color = "black";
		}
		var mouseDownLink = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			invert_dependency_link = current_id;
			master.hideControlPanel();
			master.eventFire(document.body, 'click');
		}
		button.onmouseover = mouseOverLink;
		button.onmouseout =   mouseOutLink;
		button.onmousedown = mouseDownLink;
	}

	this.dateStartMouseBehavior = function(node){
		var button = document.getElementById("control-panel-edit-date-start");
		var onFocus = function(){
			if(document.getElementById("datepicker-container") === null){
				var parse_date = null;
				if(document.getElementById("control-panel-edit-date-start").value != ""){
					parse_date = moment(document.getElementById("control-panel-edit-date-start").value,['L • H:mm']).format('YYYY-M-D H:mm');
				}
				var max_date = null;
				if(document.getElementById("control-panel-edit-date-end").value != ""){
					max_date = moment(document.getElementById("control-panel-edit-date-end").value,['L • H:mm']).format('YYYY-M-D');
				}
				if(locales.language === "PT"){
					$(function(){
					    $('#control-panel-edit-date-start').appendDtpicker({
					        "inline": true,
					        "locale": "pt",
					        "minuteInterval": 15,
					        "calendarMouseScroll": false,
					        "todayButton": false,
					        "animation":false,
					        "maxDate":max_date
					    });
					});
				}
				else{
					$(function(){
					    $('#control-panel-edit-date-start').appendDtpicker({
					        "inline": true,
					        "locale": "en",
					        "minuteInterval": 15,
					        "calendarMouseScroll": false,
					        "todayButton": false,
					        "animation":false,
					        "maxDate":max_date
					    });
					});
				}
				var close_datepicker = {id:"control-panel-close-datepicker",position:"absolute",top:40,left:278,fontsize:18};
				gui.addField(close_datepicker,"datepicker-container");
				gui.addText("control-panel-close-datepicker",'<i class="fa fa-close" aria-hidden="true"></i>');

				date = $('#control-panel-edit-date-start').handleDtpicker('setDate',parse_date);

				master.closeDatepickerMouseBehavior();
			}
		};
		button.onfocus = onFocus;
	}

	this.closeDatepickerMouseBehavior = function(){
		button = document.getElementById("control-panel-close-datepicker");
		var mouseOver = function(){
			this.style.cursor = "pointer";
			this.style.color = "#aeaeae";
		};
		var mouseOut = function(){
			this.style.color = "black";
		};
		var mouseDown = function(){
			$('#control-panel-edit-date-start').handleDtpicker('destroy');
			$('#control-panel-edit-date-end').handleDtpicker('destroy');
			master.removeElement("close-datepicker");
			if(document.getElementById('datepicker-container') != null){
				document.getElementById('datepicker-container').parentElement.removeChild(document.getElementById('datepicker-container'));
			}
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.dateEndMouseBehavior = function(node){
		var button = document.getElementById("control-panel-edit-date-end");
		var onFocus = function(){
			if(document.getElementById("datepicker-container") === null){
				var parse_date = null;
				if(document.getElementById("control-panel-edit-date-end").value != ""){
					parse_date = moment(document.getElementById("control-panel-edit-date-end").value,['L • H:mm']).format('YYYY-M-D H:mm');
				}
				var min_date = null;
				if(document.getElementById("control-panel-edit-date-start").value != ""){
					min_date = moment(document.getElementById("control-panel-edit-date-start").value,['L • H:mm']).format('YYYY-M-D');
				}
				if(locales.language === "PT"){
					$(function(){
					    $('#control-panel-edit-date-end').appendDtpicker({
					        "inline": true,
					        "locale": "pt",
					        "minuteInterval": 15,
					        "calendarMouseScroll": false,
					        "todayButton": false,
					        "animation":false,
					        "minDate":min_date
					    });
					});
				}
				else{
					$(function(){
					    $('#control-panel-edit-date-end').appendDtpicker({
					        "inline": true,
					        "locale": "en",
					        "minuteInterval": 15,
					        "calendarMouseScroll": false,
					        "todayButton": false,
					        "animation":false,
					        "minDate":min_date
					    });
					});
				}
				var close_datepicker = {id:"control-panel-close-datepicker",position:"absolute",top:40,left:278,fontsize:18};
				gui.addField(close_datepicker,"datepicker-container");
				gui.addText("control-panel-close-datepicker",'<i class="fa fa-close" aria-hidden="true"></i>');

				date = $('#control-panel-edit-date-end').handleDtpicker('setDate',parse_date);

				master.closeDatepickerMouseBehavior();
			}
		};
		button.onfocus = onFocus;
	}

	this.mainMouseBehavior = function(id){
		var button = document.getElementById(id);
		var mouseOverMain = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			this.style.cursor = "pointer";
			this.innerHTML = tooltips[current_id].text;
			this.style.fontFamily = "Source Sans Pro";
			this.style.fontSize = "10px";
			this.style.height = "26px";
			this.style.paddingTop = "14px";
			this.style.textTransform = "uppercase";
		};
		var mouseOutMain = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			if(togglemenus[current_id] === false){
				this.style.fontFamily = "Font Awesome";
				this.innerHTML = '<i class="fa '+tooltips[current_id].fa+'" aria-hidden="true"></i>';
				this.style.fontSize = "24px";
				this.style.height = "34px";
				this.style.paddingTop = "6px";
				this.style.texttransform = "none";
			}
		};
		var mouseDownMain = function(){
			if(edit_item === "linkadd"){
				edit_item = "cancellink";
				master.eventFire(document.body, 'click');
				edit_item = "linkadd";
			}
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			// show link, node or state
			if(current_id === "node"){
				master.toggleNodesMenu();
			}
			else if(current_id === "link"){
				master.toggleLinksMenu();
			}
			else if(current_id === "state"){
				master.toggleStatesMenu();
			}
			else if(current_id === "environment"){
				master.toggleEnvironmentMenu();
			}
			else if(current_id === "group"){
				master.toggleGroupsMenu();
			}

			if(edit_item != undefined){
				var previous_element = document.getElementById("edit-panel-"+edit_item);
				previous_element.style.fontFamily = "Font Awesome";
				previous_element.innerHTML = '<i class="fa '+tooltips[edit_item].fa+'" aria-hidden="true"></i>';
				previous_element.style.fontSize = "20px";
				previous_element.style.height = "28px";
				previous_element.style.paddingTop = "10px";
				previous_element.style.texttransform = "none";
				editing[edit_item] = !editing[edit_item];
				edit_item = undefined;
			}
		};
		button.onmouseover = mouseOverMain;
		button.onmouseout =   mouseOutMain;
		button.onmousedown = mouseDownMain;

	}

	this.secondaryMouseBehavior = function(id){
		var button = document.getElementById(id);
		var mouseOverSecondary = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			this.style.cursor = "pointer";
			if(current_id != "environmentstop"){
				this.innerHTML = tooltips[current_id].text;
			}
			else{
				if(stop_simulation){
					this.innerHTML = tooltips["environmentcontinue"].text;
				}
				else{
					this.innerHTML = tooltips[current_id].text;
				}
			}
			this.style.fontFamily = "Source Sans Pro";
			this.style.fontSize = "8px";
			this.style.height = "24px";
			this.style.paddingTop = "14px";
			this.style.textTransform = "uppercase";
		};
		var mouseOutSecondary = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			if(!editing[current_id]){
				this.style.fontFamily = "Font Awesome";
				if(current_id != "environmentstop"){
					this.innerHTML = '<i class="fa '+tooltips[current_id].fa+'" aria-hidden="true"></i>';
				}
				else{
					if(stop_simulation){
						this.innerHTML = '<i class="fa '+tooltips["environmentcontinue"].fa+'" aria-hidden="true"></i>';
					}
					else{
						this.innerHTML = '<i class="fa '+tooltips[current_id].fa+'" aria-hidden="true"></i>';
					}
				}
				this.style.fontSize = "20px";
				this.style.height = "28px";
				this.style.paddingTop = "10px";
				this.style.texttransform = "none";
			}	
		};
		var mouseDownSecondary = function(){
			if(edit_item === "linkadd"){
				edit_item = "cancellink";
				master.eventFire(document.body, 'click');
				edit_item = "linkadd";
			}
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			
			if(edit_item === undefined){
				edit_item = current_id;
				editing[current_id] = !editing[current_id];
			}
			else if(edit_item === current_id){
				edit_item = undefined;
				editing[current_id] = !editing[current_id];
			}
			else{
				var previous_element = document.getElementById("edit-panel-"+edit_item);
				previous_element.style.fontFamily = "Font Awesome";
				previous_element.innerHTML = '<i class="fa '+tooltips[edit_item].fa+'" aria-hidden="true"></i>';
				previous_element.style.fontSize = "20px";
				previous_element.style.height = "28px";
				previous_element.style.paddingTop = "10px";
				previous_element.style.texttransform = "none";
				editing[edit_item] = !editing[edit_item];
				edit_item = current_id;
				editing[edit_item] = !editing[edit_item];
			}
			if(current_id === "environmentstop"){
				stop_simulation = !stop_simulation;
			}
			
		};
		button.onmouseover = mouseOverSecondary;
		button.onmouseout =   mouseOutSecondary;
		button.onmousedown = mouseDownSecondary;

	}

	/* FUNCTIONS */

	this.eventFire = function(el, etype){
	  if (el.fireEvent) {
	    el.fireEvent('on' + etype);
	  } else {
	    var evObj = document.createEvent('Events');
	    evObj.initEvent(etype, true, false);
	    el.dispatchEvent(evObj);
	  }
	}

	this.removeElement = function(element){
		if(document.getElementById("control-panel-"+element) != null){
			document.getElementById("control-panel-"+element).parentElement.removeChild(document.getElementById("control-panel-"+element));
		}
	}

}