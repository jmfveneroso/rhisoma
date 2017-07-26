function SystemSettingsSidebar(){
	var master = this;
	var gui = new Gui();
	var menu = [
		{
			ref:'manage',
			link:'/',
			name:globals.localize.settings_manage.toUpperCase(), // MANAGE
			submenus:[
				{
					ref:'rhisomas',
					link:'/',
					name:globals.localize.settings_manage_rhisomas.toUpperCase()
				} // MANAGE/RHISOMAS
			]
		},
		{
			ref:'profile',
			link:'/settings/profile',
			name:globals.localize.settings_profile.toUpperCase(), // PROFILE
			submenus:[
				{
					ref:'change-username',
					link:'/settings/profile',
					name:globals.localize.settings_profile_change_username.toUpperCase()
				}, // ACCOUNT/CHANGE PASSWORD
			]
		},
		{
			ref:'account',
			link:'/settings/account',
			name:globals.localize.settings_account.toUpperCase(), // ACCOUNT
			submenus:[
				{
					ref:'change-password',
					link:'/settings/account',
					name:globals.localize.settings_account_change_password.toUpperCase()
				}, // ACCOUNT/CHANGE PASSWORD
				{
					ref:'change-email',
					link:'/email_resets/new',
					name:globals.localize.settings_account_change_email.toUpperCase()
				}, // ACCOUNT/CHANGE EMAIL
				{
					ref:'delete',
					link:'/settings/confirm_delete_account',
					name:globals.localize.settings_account_delete.toUpperCase()
				} // ACCOUNT/DELETE
			]
		}
	];
	var active_menu = 1;
	var active_submenu = 0;

	this.setMenu = function(in_menu, in_submenu){
		active_menu = in_menu;
		active_submenu = in_submenu;
	}

	this.drawSidebar = function(in_active_menu,in_active_submenu){
		active_menu = in_active_menu;
		active_submenu = in_active_submenu;
		master.drawContainer();
		master.drawButtons();
		master.drawPanel();
	}

	this.drawContainer = function(){
		var sidebar = {id:"system-sidebar",class:"system-sidebar",height:window.innerHeight-40};
		gui.addContainer(sidebar);
	}

	this.drawButtons = function(){
		var spacing = 150;
		for(var i = 0; i < menu.length; i++){
			var current_button = "system-"+menu[i].ref+"-button";
			if(active_menu != i){
				var button = {id:current_button,class:"system-sidebar-primary-button",top:spacing};
				gui.addLink(button,"system-sidebar");
				document.getElementById(current_button).setAttribute('href',menu[i].link);
			}
			else{
				var button = {id:current_button,class:"system-sidebar-primary-button-active",top:spacing};
				gui.addField(button,"system-sidebar");
			}
			gui.addText(current_button,menu[i].name);
			current_button = "";
			spacing += 51;
			for(var j = 0; j < menu[i].submenus.length; j++){
				current_button = "system-"+menu[i].ref+'-'+menu[i].submenus[j].ref+"-button";		
				if(active_menu == i & active_submenu == j){
					var secondary_button = {id:current_button,class:"system-sidebar-secondary-button-active",top:spacing};
					gui.addField(secondary_button,"system-sidebar");
				}
				else{
					var secondary_button = {id:current_button,class:"system-sidebar-secondary-button-inactive",top:spacing};
					gui.addLink(secondary_button,"system-sidebar");
					document.getElementById(current_button).setAttribute('href',menu[i].submenus[j].link);
				}
				
				gui.addText(current_button,menu[i].submenus[j].name);
				if(j == menu[i].submenus.length-1){
					spacing += 45;
				}
				else{
					spacing += 30;
				}
			}
		}
	}

	this.drawPanel = function(){
		var form = document.createElement("form");
		if(active_menu == 0){
			master.formStructure(form,"/",false);
			master.panelRhisomas(form);
			document.getElementById("system-rhisomas").appendChild(form);
		}
		else if(active_menu == 1){
			master.formStructure(form,"/users/4",true);
			master.panelProfile(form);
			document.getElementById("system-profile").appendChild(form);
		}
		else if(active_menu == 2){
			if(active_submenu == 0){
				master.formStructure(form,"/settings/change_password",false);
				master.panelChangePassword(form);
				document.getElementById("system-change-password").appendChild(form);
			}
			else if(active_submenu == 1){
				master.formStructure(form,"/email_resets",false);
				master.panelChangeEmail(form);
				document.getElementById("system-change-email").appendChild(form);
			}
			else{
				master.formStructure(form,"/settings/delete_account?method=post",false);
				master.panelDeleteAccount(form);
				document.getElementById("system-delete-account").appendChild(form);
			}
		}	
	}

	this.formStructure = function(form,path,enable_patch){
		form.setAttribute('method',"post");
		form.setAttribute('action',path);
		form.setAttribute('accept-charset',"UTF-8");

		var general_input = document.createElement("input");
		general_input.setAttribute('type',"hidden");
		general_input.setAttribute('name',"utf8");
		general_input.setAttribute('value',"✓");
		form.appendChild(general_input);

		if(enable_patch){
			var patch_input = document.createElement("input");
			patch_input.setAttribute('type',"hidden");
			patch_input.setAttribute('name',"_method");
			patch_input.setAttribute('value',"patch");
			form.appendChild(patch_input);
		}

		var auth_input = document.createElement("input");
		auth_input.setAttribute('type',"hidden");
		auth_input.setAttribute('name',"authenticity_token");
		auth_input.setAttribute('value','<%= form_authenticity_token %>');
		form.appendChild(auth_input);		
	}

	this.panelProfile = function(form){
		var container = {id:"system-profile",width:258,height:98,top:(window.innerHeight-160)/2,left:(window.innerWidth-320-320)/2+320,backgroundColor:"white",padding:30,border:"1px solid #aeaeae",boxshadow:"-5px 5px #aeaeae"};
		gui.addContainer(container);

		var form_label = {id:"system-label",class:"form-label",width:298};
		gui.addField(form_label,"system-profile");
		gui.addText("system-label",menu[active_menu].name);
		document.getElementById("system-label").style.textAlign = "center";

		var name_input = document.createElement("input");
		name_input.setAttribute('type',"text");
		name_input.setAttribute('name',"user[name]");
		name_input.setAttribute('id',"user_name");
		name_input.setAttribute('class',"form-control");
		name_input.setAttribute('placeholder',globals.localize.settings_profile_new_username);

		var submit_button = document.createElement("input");
		submit_button.setAttribute('type',"submit");
		submit_button.setAttribute('name',"commit");
		submit_button.setAttribute('data-disable-with',globals.localize.settings_profile_updating.toUpperCase());
		submit_button.setAttribute('class',"button-right");
		submit_button.setAttribute('id',"submit-button");
		submit_button.setAttribute('value',globals.localize.settings_profile_update.toUpperCase());
		submit_button.style.width = document.getElementById("system-profile").offsetWidth+"px";
		submit_button.style.left = "-1px";
		submit_button.style.top = document.getElementById("system-profile").offsetHeight-42-1+"px";

		form.appendChild(name_input);
		form.appendChild(submit_button);
	}

	this.panelChangePassword = function(form){
		var container = {id:"system-change-password",width:258,height:163,top:(window.innerHeight-225)/2,left:(window.innerWidth-320-320)/2+320,backgroundColor:"white",padding:30,border:"1px solid #aeaeae",boxshadow:"-5px 5px #aeaeae"};
		gui.addContainer(container);

		var form_label = {id:"system-label",class:"form-label",width:298};
		gui.addField(form_label,"system-change-password");
		gui.addText("system-label",globals.localize.settings_account_change_password.toUpperCase());
		document.getElementById("system-label").style.textAlign = "center";

		var old_password_input = document.createElement("input");
		old_password_input.setAttribute('type',"password");
		old_password_input.setAttribute('name',"user[password]");
		old_password_input.setAttribute('id',"user_password");
		old_password_input.setAttribute('class',"form-control");
		old_password_input.setAttribute('placeholder',globals.localize.settings_account_old_password);

		var password_input = document.createElement("input");
		password_input.setAttribute('type',"password");
		password_input.setAttribute('name',"user[password]");
		password_input.setAttribute('id',"user_password");
		password_input.setAttribute('class',"form-control");
		password_input.setAttribute('placeholder',globals.localize.settings_account_new_password);

		var new_password_input = document.createElement("input");
		new_password_input.setAttribute('type',"password");
		new_password_input.setAttribute('name',"user[password]");
		new_password_input.setAttribute('id',"user_password");
		new_password_input.setAttribute('class',"form-control");
		new_password_input.setAttribute('placeholder',globals.localize.settings_account_confirm_password);

		var submit_button = document.createElement("input");
		submit_button.setAttribute('type',"submit");
		submit_button.setAttribute('name',"commit");
		submit_button.setAttribute('data-disable-with',globals.localize.settings_account_updating_password.toUpperCase());
		submit_button.setAttribute('class',"button-center");
		submit_button.setAttribute('id',"submit-button");
		submit_button.setAttribute('value',globals.localize.settings_account_update_password.toUpperCase());
		submit_button.style.width = document.getElementById("system-change-password").offsetWidth+"px";
		submit_button.style.left = "-1px";
		submit_button.style.top = document.getElementById("system-change-password").offsetHeight-42-1+"px";

		form.appendChild(old_password_input);
		form.appendChild(password_input);
		form.appendChild(new_password_input);
		form.appendChild(submit_button);
	}

	this.panelChangeEmail = function(form){
		var container = {id:"system-change-email",width:258,height:98,top:(window.innerHeight-160)/2,left:(window.innerWidth-320-320)/2+320,backgroundColor:"white",padding:30,border:"1px solid #aeaeae",boxshadow:"-5px 5px #aeaeae"};
		gui.addContainer(container);

		var form_label = {id:"system-label",class:"form-label",width:298};
		gui.addField(form_label,"system-change-email");
		gui.addText("system-label",globals.localize.settings_account_change_email.toUpperCase());
		document.getElementById("system-label").style.textAlign = "center";

		var email_input = document.createElement("input");
		email_input.setAttribute('type',"email");
		email_input.setAttribute('name',"email_reset[new_email]");
		email_input.setAttribute('id',"email_reset_new_email");
		email_input.setAttribute('class',"form-control");
		email_input.setAttribute('placeholder',globals.localize.settings_account_new_email);

		var submit_button = document.createElement("input");
		submit_button.setAttribute('type',"submit");
		submit_button.setAttribute('name',"commit");
		submit_button.setAttribute('data-disable-with',globals.localize.settings_account_updating_email.toUpperCase());
		submit_button.setAttribute('class',"button-right");
		submit_button.setAttribute('id',"submit-button");
		submit_button.setAttribute('value',globals.localize.settings_account_update_email.toUpperCase());
		submit_button.style.width = document.getElementById("system-change-email").offsetWidth+"px";
		submit_button.style.left = "-1px";
		submit_button.style.top = document.getElementById("system-change-email").offsetHeight-42-1+"px";

		form.appendChild(email_input);
		form.appendChild(submit_button);
	}

	this.panelDeleteAccount = function(form){
		var container = {id:"system-delete-account",width:258,height:98,top:(window.innerHeight-160)/2,left:(window.innerWidth-320-320)/2+320,backgroundColor:"white",padding:30,border:"1px solid #aeaeae",boxshadow:"-5px 5px #aeaeae"};
		gui.addContainer(container);

		var form_label = {id:"system-label",class:"form-label",width:298};
		gui.addField(form_label,"system-delete-account");
		gui.addText("system-label",globals.localize.settings_account_delete.toUpperCase());
		document.getElementById("system-label").style.textAlign = "center";

		var password_input = document.createElement("input");
		password_input.setAttribute('type',"password");
		password_input.setAttribute('name',"user[password]");
		password_input.setAttribute('id',"user_password");
		password_input.setAttribute('class',"form-control");
		password_input.setAttribute('placeholder',globals.localize.system_password);

		var submit_button = document.createElement("input");
		submit_button.setAttribute('type',"submit");
		submit_button.setAttribute('name',"commit");
		submit_button.setAttribute('data-disable-with',globals.localize.settings_account_delete.toUpperCase());
		submit_button.setAttribute('class',"button-right");
		submit_button.setAttribute('id',"submit-button");
		submit_button.setAttribute('value',globals.localize.settings_account_delete.toUpperCase());
		submit_button.style.width = document.getElementById("system-delete-account").offsetWidth+"px";
		submit_button.style.left = "-1px";
		submit_button.style.top = document.getElementById("system-delete-account").offsetHeight-42-1+"px";

		form.appendChild(password_input);
		form.appendChild(submit_button);
	}

	this.panelRhisomas = function(form){

	}	
}