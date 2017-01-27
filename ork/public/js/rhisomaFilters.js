function RhisomaFilters(){
	var master = this;
	var gui = new Gui();

	var locales = undefined;
	var graph = undefined;

	var hidden_filters_menu = true;
	var animation_running = false;

	var show_all = false;

	var user_start_period = undefined;
	var user_end_period = undefined;

	this.setCurrentGraph = function(in_graph){
		graph = in_graph;
	}

	this.setLocales = function(in_locales){
		locales = in_locales;
	}

	this.drawFiltersMenu = function(){
		var container = {id:"filters-menu",height:29,width:window.innerWidth,left:0,top:window.innerHeight,zindex:11,position:"absolute",backgroundColor:"rgba(243,243,243,0.85)",bordertop:"1px solid #aeaeae"};
		gui.addContainer(container);

		var visibility_button = {id:"filters-menu-visibility",title:locales["filters-menu-visibility-show"],height:26,paddingtop:3,width:30,borderright:"1px solid #aeaeae",bordertop:"1px solid #aeaeae",top:window.innerHeight-30,left:0,zindex:11,textalign:"center",fontsize:18,font:"Font Awesome",backgroundColor:"white"};
		gui.addField(visibility_button);
		gui.addText("filters-menu-visibility",'<i class="fa fa-chevron-up" aria-hidden="true"></i>');

		var show_all_button = {id:"filters-menu-show-all",top:0,left:30,width:50,height:24,paddingtop:5,borderright:"1px solid #aeaeae",font:"Source Sans Pro",fontweight:"400",fontsize:9,texttransform:"uppercase",textalign:"center",lineheight:"10"};
		gui.addField(show_all_button,"filters-menu");
		gui.addText("filters-menu-show-all",locales["filters-menu-show-all"]);

		master.visibilityMouseBehavior();
		master.showAllMouseBehavior();
	}

	this.showFiltersMenu = function(){
		if(!animation_running && document.getElementById("filters-menu") != null){
			animation_running = true;
			var id = setInterval(frame, 5);
			var position_y = window.innerHeight;
			document.getElementById("filters-menu").style.display = "inline";

			function frame(){
			    if (position_y <= window.innerHeight-30){
			        clearInterval(id);
			        animation_running = false;
			        gui.addText("filters-menu-visibility",'<i class="fa fa-chevron-down" aria-hidden="true"></i>');
			        gui.$title("filters-menu-visibility",locales["filters-menu-visibility-hide"]);
			    }
			    else {
			    	position_y -= 1;
			    	document.getElementById("filters-menu").style.top = position_y + "px";
			    }
			}
			hidden_filters_menu = false;
		}
	}

	this.hideFiltersMenu = function(){
		if(!animation_running && document.getElementById("filters-menu") != null){
			animation_running = true;
			var id = setInterval(frame, 5);
			var position_y = document.getElementById("filters-menu").offsetTop;

			function frame() {
			    if (position_y >= window.innerHeight) {
			        clearInterval(id);
			        document.getElementById("filters-menu").style.display = "none";
			        animation_running = false;
			        gui.addText("filters-menu-visibility",'<i class="fa fa-chevron-up" aria-hidden="true"></i>');
			        gui.$title("filters-menu-visibility",locales["filters-menu-visibility-show"]);
			    }
			    else {
			    	position_y += 1;
			    	document.getElementById("filters-menu").style.top = position_y + "px"; 
			    }
			}
			hidden_filters_menu = true;
		}
	}

	this.visibilityMouseBehavior = function(){
		var button = document.getElementById("filters-menu-visibility");
		var mouseOver = function(){
			this.style.cursor = "pointer";
			this.style.backgroundColor = "rgb(243,243,243)";
		};
		var mouseOut = function(){
			this.style.backgroundColor = "white";
		};
		var mouseDown = function(){
			if(hidden_filters_menu){
				master.showFiltersMenu();
			}
			else{
				master.hideFiltersMenu();
			}
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}

	this.showAllMouseBehavior = function(){
		var button = document.getElementById("filters-menu-show-all");
		var mouseOver = function(){
			this.style.cursor = "pointer";
			this.style.backgroundColor = "#aeaeae";
			this.style.color = "white";
		};
		var mouseOut = function(){
			if(!show_all){
				this.style.backgroundColor = "transparent";
				this.style.color = "black";
			}
		};
		var mouseDown = function(){
			show_all = !show_all;
		};
		button.onmouseover = mouseOver;
		button.onmouseout = mouseOut;
		button.onmousedown = mouseDown;
	}
}