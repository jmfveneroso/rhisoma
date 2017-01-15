function SystemGui(){

	var master = this;
	var gui = new Gui();
	var logged = true;

	var buttons = {
		"system-menu-user-avatar":"Usuário",
		"system-menu-settings":"Configurações",
		"system-menu-signout":"Sair",
		"system-menu-login":"Entrar",
		"system-menu-signup":"Cadastrar"
	};

	this.drawSystemMenu = function(logged_in){
		var container = {id:"system-menu",top:0,position:"absolute",left:0,height:39,width:window.innerWidth,backgroundColor:"rgba(243,243,243,0.85)",borderbottom:"1px solid #aeaeae"};
		gui.addContainer(container);

		var logo_field = {id:"system-menu-logo",height:39,width:39,position:"absolute",top:0,left:300};
		gui.addField(logo_field,"system-menu");
		gui.addText("system-menu-logo",'<img src="./public/media/logo.png" width="40px" height="40px" />');

		var search_field = {id:"system-menu-search",class:"search-field",height:20,width:300,position:"absolute",top:9,left:((window.innerWidth-300)/2),padding:5};
		gui.addInput(search_field,"BUSCA","system-menu","");

		if(logged){
			master.drawLoggedInMenu();
		}
		else{
			master.drawLoggedOutMenu();
		}
	}

	this.drawLoggedInMenu = function(){
		var logged_in_field = {id:"system-menu-user",top:0,left:window.innerWidth-160,width:120,height:39,font:'Font Awesome',texttransform:'uppercase',fontsize:18,color:'black'};
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

	}

	this.drawTooltip = function(element){
		var reference_element = document.getElementById(element);
		var reference_x = reference_element.offsetLeft;
		var reference_width = reference_element.offsetWidth;

		var tooltip_field = {id:"system-tooltip",top:44,textalign:"CENTER",font:'Source Sans Pro',fontsize:10,texttransform:"uppercase"};
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

}