function SystemGui(){

	var master = this;
	var gui = new Gui();
	var logged = true;
	var node_names = undefined;
	var query_results = [];
	var update_zoom = undefined;
	var current_query = -1;

	var buttons = {
		"system-menu-user-avatar":"Usuário",
		"system-menu-settings":"Configurações",
		"system-menu-signout":"Sair",
		"system-menu-login":"Entrar",
		"system-menu-signup":"Cadastrar",
		"system-menu-search-button":"Buscar"
	};

	this.setCurrentGraph = function(in_nodes){
		node_names = in_nodes;
	}

	this.getUpdateZoom = function(){
		var temp_zoom = update_zoom;
		update_zoom = undefined;
		return temp_zoom;
	}

	this.drawSystemMenu = function(logged_in){
		var container = {id:"system-menu",top:0,position:"absolute",left:0,height:39,width:window.innerWidth,backgroundColor:"rgba(243,243,243,0.85)",borderbottom:"1px solid #aeaeae"};
		gui.addContainer(container);

		var logo_field = {id:"system-menu-logo",height:39,width:39,position:"absolute",top:0,left:300};
		gui.addField(logo_field,"system-menu");
		gui.addText("system-menu-logo",'<img src="./public/media/logo.png" width="40px" height="40px" />');

		var search_offset_x = 300 + ((window.innerWidth-700)/2);
		var search_field = {id:"system-menu-search",class:"search-field",height:14,position:"absolute",top:10,left:search_offset_x};
		gui.addInput(search_field,"Busca","system-menu","");

		var search_button = {id:"system-menu-search-button",height:30,width:40,position:"absolute",top:0,paddingtop:10,left:search_offset_x+260,textalign:"center",font:'Font Awesome',fontsize:18,color:"#000000"}
		gui.addField(search_button,"system-menu");
		gui.addText("system-menu-search-button",'<i class="fa fa-search" aria-hidden="true"></i>');

		master.searchMouseBehavior();
		master.searchWriteBehavior();

		if(logged){
			master.drawLoggedInMenu();
		}
		else{
			master.drawLoggedOutMenu();
		}
	}

	this.drawLoggedInMenu = function(){
		var logged_in_field = {id:"system-menu-user",top:0,left:window.innerWidth-160,width:124,height:39,font:'Font Awesome',texttransform:'uppercase',fontsize:18,color:'black'};
		gui.addField(logged_in_field,"system-menu");

		var user_field = {id:"system-menu-user-avatar",width:40,height:30,paddingtop:10,textalign:"CENTER",borderleft:"1px solid #aeaeae"};
		gui.addField(user_field,"system-menu-user");
		gui.addText("system-menu-user-avatar",'<i class="fa fa-user" aria-hidden="true"></i>');

		var settings_field = {id:"system-menu-settings",width:40,height:30,left:41,paddingtop:10,textalign:"CENTER",borderleft:"1px solid #aeaeae"};
		gui.addField(settings_field,"system-menu-user");
		gui.addText("system-menu-settings",'<i class="fa fa-gear" aria-hidden="true"></i>');

		var signout_field = {id:"system-menu-signout",width:40,height:30,paddingtop:10,left:82,textalign:"CENTER",borderleft:"1px solid #aeaeae",borderright:"1px solid #aeaeae"};
		gui.addField(signout_field,"system-menu-user");
		gui.addText("system-menu-signout",'<i class="fa fa-sign-out" aria-hidden="true"></i>');

		master.signoutMouseBehavior();
		master.settingsMouseBehavior();
		master.userMouseBehavior();
	}

	this.drawLoggedOutMenu = function(){
		var logged_out_field = {id:"system-menu-user",top:0,left:window.innerWidth-200,width:160,height:39,font:'Source Sans Pro',texttransform:'uppercase',fontsize:12,color:'black'};
		gui.addField(logged_out_field,"system-menu");

		var login_field = {id:"system-menu-login",width:80,height:28,paddingtop:12,textalign:"CENTER",borderleft:"1px solid #aeaeae"};
		gui.addField(login_field,"system-menu-user");
		gui.addText("system-menu-login",buttons["system-menu-login"]);

		var signup_field = {id:"system-menu-signup",width:80,height:28,paddingtop:12,left:81,textalign:"CENTER",borderleft:"1px solid #aeaeae",borderright:"1px solid #aeaeae"};
		gui.addField(signup_field,"system-menu-user");
		gui.addText("system-menu-signup",buttons["system-menu-signup"]);

		master.signinMouseBehavior();
		master.signupMouseBehavior();
	}

	this.signinMouseBehavior = function(){
		var button = document.getElementById("system-menu-login");
		var mouseOver = function(){
			// master.drawTooltip(this.id);
			this.style.backgroundColor = "#ffffff";
			this.style.cursor = "pointer";
		};
		var mouseOut = function(){
			// master.removeElement("system-tooltip");
			this.style.backgroundColor = "transparent";
			this.style.textDecoration = "none";
		};
		var mouseDown = function(){
			console.log("login");
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.signupMouseBehavior = function(){
		var button = document.getElementById("system-menu-signup");
		var mouseOver = function(){
			// master.drawTooltip(this.id);
			this.style.backgroundColor = "#ffffff";
			this.style.cursor = "pointer";
		};
		var mouseOut = function(){
			// master.removeElement("system-tooltip");
			this.style.backgroundColor = "transparent";
			this.style.textDecoration = "none";
		};
		var mouseDown = function(){
			console.log("signup");
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.signoutMouseBehavior = function(){
		var button = document.getElementById("system-menu-signout");
		var mouseOver = function(){
			master.drawTooltip(this.id);
			this.style.backgroundColor = "#ffffff";
			this.style.cursor = "pointer";
		};
		var mouseOut = function(){
			master.removeElement("system-tooltip");
			this.style.backgroundColor = "transparent";
			this.style.textDecoration = "none";
		};
		var mouseDown = function(){
			console.log("signout");
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.settingsMouseBehavior = function(){
		var button = document.getElementById("system-menu-settings");
		var mouseOver = function(){
			master.drawTooltip(this.id);
			this.style.backgroundColor = "#ffffff";
			this.style.cursor = "pointer";
		};
		var mouseOut = function(){
			master.removeElement("system-tooltip");
			this.style.backgroundColor = "transparent";
			this.style.textDecoration = "none";
		};
		var mouseDown = function(){
			console.log("settings");
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.userMouseBehavior = function(){
		var button = document.getElementById("system-menu-user-avatar");
		var mouseOver = function(){
			master.drawTooltip(this.id);
			this.style.backgroundColor = "#ffffff";
			this.style.cursor = "pointer";
		};
		var mouseOut = function(){
			master.removeElement("system-tooltip");
			this.style.backgroundColor = "transparent";
			this.style.textDecoration = "none";
		};
		var mouseDown = function(){
			console.log("user");
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.searchMouseBehavior = function(){
		var button = document.getElementById("system-menu-search-button");
		var mouseOver = function(){
			this.style.color = "#aeaeae";
			this.style.cursor = "pointer";
		};
		var mouseOut = function(){
			this.style.color = "#000000";
			this.style.textDecoration = "none";
		};
		var mouseDown = function(){
			// var query = document.getElementById("system-menu-search").value;
			// if(query != "" && node_names != undefined){
			// 	var query_results = [];
			// 	for(var i = 0; i < node_names.length; i++){
   //  				var expr= query.toUpperCase();
   //  				var check = node_names[i].name.toUpperCase();
   //  				if(check.includes(expr)){
   //  					query_results.push(node_names[i]);
   //  					if(check === expr){
   //  						query_results[query_results.length-1].exactMatch = true;
   //  					}
   //  					else{
   //  						query_results[query_results.length-1].exactMatch = false;
   //  					}
   //  				}
			// 	}
			// 	console.log(query_results);
			// 	document.getElementById("system-menu-search").value = "";
			// }
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.searchWriteBehavior = function(){
		var search_field = document.getElementById("system-menu-search");
		var searchUp = function(){
			if(window.event.keyCode === 40){
				if(current_query+1 < query_results.length){
					if(current_query >= 0){
						master.eventFire(document.getElementById("system-menu-autocomplete-"+query_results[current_query].id),"mouseout");
					}
					current_query++;
					master.eventFire(document.getElementById("system-menu-autocomplete-"+query_results[current_query].id),"mouseover");
				}
			}
			else if(window.event.keyCode === 38){
				if(current_query-1 >= 0 && query_results.length > 0){
					master.eventFire(document.getElementById("system-menu-autocomplete-"+query_results[current_query].id),"mouseout");
					current_query--;
					if(current_query >= 0){
						master.eventFire(document.getElementById("system-menu-autocomplete-"+query_results[current_query].id),"mouseover");
					}
				}
			}
			else if(window.event.keyCode === 13){
				if(query_results.length > 0){
					master.eventFire(document.getElementById("system-menu-autocomplete-"+query_results[current_query].id),"mousedown");
				}
			}
			else{
				current_query = -1;
				master.findSearch();
			}
		};

		search_field.onkeyup = searchUp;
	}

	this.findSearch = function(){
		var query = document.getElementById("system-menu-search").value;
		if(query != "" && node_names != undefined){
			query_results = [];
			current_query = -1;
			for(var i = 0; i < node_names.length; i++){
				var expr= query.toUpperCase();
				var check = node_names[i].name.toUpperCase();
				if(check.includes(expr)){
					query_results.push(node_names[i]);
					if(check === expr){
						query_results[query_results.length-1].exactMatch = true;
					}
					else{
						query_results[query_results.length-1].exactMatch = false;
					}
				}
			}
			master.autocompleteDropDown();
		}
		else{
			master.removeElement("system-menu-autocomplete");
		}
	}

	this.autocompleteDropDown = function(){
		var element = document.getElementById("system-menu-autocomplete");
		if(element === null){
			var offset_x = document.getElementById("system-menu-search").offsetLeft;
			var autocomplete_field = {id:"system-menu-autocomplete",top:40,left:offset_x,width:250,height:20,font:'Source Sans Pro',fontsize:14,backgroundColor:"rgba(243,243,243,0.8)"};
			gui.addField(autocomplete_field,"system-menu");
		}
		else{
			element.innerHTML = "";
		}
		var offset_entry_y = 0;
		for(var i = 0; i < query_results.length; i++){
			var current_entry = {id:"system-menu-autocomplete-"+query_results[i].id,height:16,width:240,top:offset_entry_y,padding:4,borderbottom:"1px solid #aeaeae",borderleft:"1px solid #aeaeae",borderright:"1px solid #aeaeae"};
			gui.addField(current_entry,"system-menu-autocomplete");
			gui.addText("system-menu-autocomplete-"+query_results[i].id,query_results[i].name);
			offset_entry_y += 25;
			master.selectSearchResultMouseBehavior(query_results[i].id);
		}
		document.getElementById("system-menu-autocomplete").style.height = offset_entry_y+"px";
	}

	this.selectSearchResultMouseBehavior = function(id){
		var button = document.getElementById("system-menu-autocomplete-"+id);
		var mouseOver = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			this.style.cursor = "pointer";
			document.getElementById("system-menu-autocomplete-"+current_id).style.backgroundColor = "white";
		};
		var mouseOut = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			document.getElementById("system-menu-autocomplete-"+current_id).style.backgroundColor = "rgba(243,243,243,0.8)";
		};
		var mouseDown = function(){
			var current_id = this.id.split("-");
			current_id = current_id[current_id.length-1];
			document.getElementById("system-menu-search").value = "";
			master.removeElement("system-menu-autocomplete");
			if(document.getElementById("node-symbol-"+current_id)!=null){
				update_zoom = current_id;
				master.eventFire(document.getElementById("node-symbol-"+current_id),"mouseover");
				master.eventFire(document.getElementById("node-symbol-"+current_id),"click");
			}
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.drawTooltip = function(element){
		var reference_element = document.getElementById(element);
		var reference_x = reference_element.offsetLeft;
		var reference_width = reference_element.offsetWidth;

		var tooltip_field = {id:"system-tooltip",top:48,textalign:"CENTER",font:'Source Sans Pro',fontsize:10,texttransform:"uppercase"};
		gui.addField(tooltip_field,"system-menu-user");
		gui.addText("system-tooltip",buttons[element]);

		var tooltip_width = document.getElementById("system-tooltip").offsetWidth;
		var offset_x = ((reference_width-tooltip_width)/2)+reference_x;
		document.getElementById("system-tooltip").style.left = offset_x + "px";
	}

	this.removeElement = function(element){
		if(document.getElementById(element) != null){
			document.getElementById(element).parentElement.removeChild(document.getElementById(element));
		}
	}

	this.eventFire = function(el, etype){
	  if (el.fireEvent) {
	    el.fireEvent('on' + etype);
	  } else {
	    var evObj = document.createEvent('Events');
	    evObj.initEvent(etype, true, false);
	    el.dispatchEvent(evObj);
	  }
	}

}