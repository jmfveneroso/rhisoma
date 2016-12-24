function Gui(){

	var master = this;
	var containers;

	this.addContainer = function(style){
		var container = document.createElement("div");
		container.id = style.id;
		container.style.position = "absolute";
		container.style.display = "inline";
		document.body.appendChild(container);

		master.$styleElement(style);
	}

	this.addField = function(style, container_id){
		var field = document.createElement("div");
		field.id = style.id;
		field.style.position = "absolute";
		field.style.display = "inline";

		if(container_id != undefined && document.getElementById(container_id) != null){
			document.getElementById(container_id).appendChild(field);
		}
		else{
			document.body.appendChild(field);
		}

		master.$styleElement(style);
	}

	this.addImage = function(src, container_id){
		document.getElementById(container_id).innerHTML += '<img src="'+src+'" />';
	}

	this.addButton = function(style, container_id){
		var button = document.createElement('div');
		button.id = style.id;
		button.style.position = "absolute";
		button.style.display = "inline";
		button.innerHTML = style.text;

		if(container_id != undefined && document.getElementById(container_id) != null){
			document.getElementById(container_id).appendChild(button);
		}
		else{
			document.body.appendChild(button);
		}

		master.$styleElement(style);
		master.mouseBehavior(style.id,style.over,style.out,style.down);
	}

	this.addInput = function(style,placeholder,container_id,value){
		var element = document.getElementById(container_id);
		element.innerHTML += '<input id="' + style.id + '" class="'+style.class+'" type="text" placeholder="' + placeholder + '" value="'+value+'">';

		master.$styleElement(style);

		// var email = document.getElementById("input-email");
		// email.setAttribute( "autocomplete", "off" );
	}

	this.addTextArea = function(style,placeholder,container_id,value){
		var element = document.getElementById(container_id);
		element.innerHTML += '<textarea id="' + style.id + '" class="'+style.class+'" rows="'+style.rows+'" cols="'+style.cols+'" placeholder="' + placeholder +'">'+value+'</textarea>';

		master.$styleElement(style);
	}

	this.addText = function(container_id,text){
		document.getElementById(container_id).innerHTML = text;
	}

	this.getFieldValue = function(field_id){
		var field = document.getElementById(field_id);
		return field.value;
	}

	// Mouse behavior

	this.mouseBehavior = function(button_id, over, out, down){
		var element = document.getElementById(button_id);
		var mouseOver = function(){
			this.style.cursor = "pointer";
			// this.style.backgroundColor = "yellow";
		};
		var mouseOut = function(){
			// this.style.backgroundColor = "#dedede";
		};
		var mouseDown = function(){
			// console.log(master.getFieldValue("input-email"));
		};

		if(over != undefined){
			element.onmouseover = over;
		}
		else{
			element.onmouseover = mouseOver;
		}
		if(over != undefined){
			element.onmouseout = out;
		}
		else{
			element.onmouseout = mouseOut;
		}
		if(down != undefined){
			element.onmousedown = down;	
		}
		else{
			element.onmousedown = mouseDown;
		}
	}



	// Style

	this.$styleElement = function(style){
		// var element = document.getElementById(style.id);
		if(style.width != undefined){
			master.$width(style.id, style.width);
		}
		if(style.height != undefined){
			master.$height(style.id, style.height);
		}
		if(style.top != undefined){
			master.$top(style.id, style.top);
		}
		if(style.left != undefined){
			master.$left(style.id, style.left);
		}
		if(style.align != undefined){
			master.$align(style.id, style.align);
		}
		if(style.valign != undefined){
			master.$valign(style.id, style.valign);
		}
		if(style.backgroundColor != undefined){
			master.$backgroundColor(style.id, style.backgroundColor);
		}
		if(style.color != undefined){
			master.$color(style.id, style.color);
		}
		if(style.font != undefined){
			master.$font(style.id, style.font);
		}
		if(style.class != undefined){
			master.$class(style.id, style.class);
		}
		if(style.textalign != undefined){
			master.$textalign(style.id, style.textalign);
		}
		if(style.textdecoration != undefined){
			master.$textdecoration(style.id, style.textdecoration);
		}
		if(style.texttransform != undefined){
			master.$texttransform(style.id, style.texttransform);
		}
		if(style.fontsize != undefined){
			master.$fontsize(style.id, style.fontsize);
		}
		if(style.fontweight != undefined){
			master.$fontweight(style.id, style.fontweight);
		}
		if(style.paddingtop != undefined){
			master.$paddingtop(style.id, style.paddingtop);
		}
		if(style.paddingleft != undefined){
			master.$paddingleft(style.id, style.paddingleft);
		}
		if(style.paddingright != undefined){
			master.$paddingright(style.id, style.paddingright);
		}
		if(style.paddingbottom != undefined){
			master.$paddingbottom(style.id, style.paddingbottom);
		}
		if(style.padding != undefined){
			master.$padding(style.id, style.padding);
		}
		if(style.pointerevents != undefined){
			master.$pointerevents(style.id, style.pointerevents);
		}
		if(style.display != undefined){
			master.$display(style.id, style.display);
		}
		if(style.border != undefined){
			master.$border(style.id, style.border);
		}
		if(style.borderbottom != undefined){
			master.$borderbottom(style.id, style.borderbottom);
		}
		if(style.bordertop != undefined){
			master.$bordertop(style.id, style.bordertop);
		}
		if(style.borderleft != undefined){
			master.$borderleft(style.id, style.borderleft);
		}
		if(style.borderright != undefined){
			master.$borderright(style.id, style.borderright);
		}
		if(style.position != undefined){
			master.$position(style.id, style.position);
		}
		if(style.zindex != undefined){
			master.$zindex(style.id, style.zindex);
		}

	}

	this.$class = function(id, this_class){
		document.getElementById(id).className = this_class;
	}

	this.$pointerevents = function(id, pointerevents){
		document.getElementById(id).style.pointerEvents = pointerevents;
	}
	
	this.$display = function(id, display){
		document.getElementById(id).style.display = display;
	}

	this.$position = function(id, position){
		document.getElementById(id).style.position = position;
	}

	this.$zindex = function(id, zindex){
		document.getElementById(id).style.zIndex = zindex;
	}

	this.$border = function(id, border){
		document.getElementById(id).style.border = border;
	}

	this.$borderbottom = function(id, borderbottom){
		document.getElementById(id).style.borderBottom = borderbottom;
	}

	this.$bordertop = function(id, bordertop){
		document.getElementById(id).style.borderTop = bordertop;
	}

	this.$borderleft = function(id, borderleft){
		document.getElementById(id).style.borderLeft = borderleft;
	}

	this.$borderright = function(id, borderright){
		document.getElementById(id).style.borderRight = borderright;
	}

	this.$textdecoration = function(id, textdecoration){
		document.getElementById(id).style.textDecoration = textdecoration;
	}

	this.$texttransform = function(id, texttransform){
		document.getElementById(id).style.textTransform = texttransform;
	}

	this.$textalign = function(id, textalign){
		document.getElementById(id).style.textAlign = textalign;
	}

	this.$fontsize = function(id, fontsize){
		document.getElementById(id).style.fontSize = fontsize + "px";
	}

	this.$fontweight = function(id, fontweight){
		document.getElementById(id).style.fontWeight = fontweight;
	}

	this.$paddingtop = function(id, paddingtop){
		document.getElementById(id).style.paddingTop = paddingtop + "px";
	}

	this.$paddingleft = function(id, paddingleft){
		document.getElementById(id).style.paddingLeft = paddingleft + "px";
	}

	this.$paddingright = function(id, paddingright){
		document.getElementById(id).style.paddingRight = paddingright + "px";
	}

	this.$paddingbottom = function(id, paddingbottom){
		document.getElementById(id).style.paddingBottom = paddingbottom + "px";
	}

	this.$padding = function(id, padding){
		document.getElementById(id).style.padding = padding + "px";
	}

	this.$width = function(id, wd){
		document.getElementById(id).style.width = wd + "px";
		// console.log(id + " :: " + document.getElementById(id).style.width);
	}

	this.$height = function(id, hg){
		document.getElementById(id).style.height = hg + "px";
	}

	this.$align = function(id, align){
		if(align === 'LEFT'){
			document.getElementById(id).style.left = "0 px";
		}
		else if(align === 'CENTER'){
			var element_width = document.getElementById(id).offsetWidth;
			var offset_x = (window.innerWidth - element_width)/2;
			document.getElementById(id).style.left = offset_x + "px";
		}
		else if(align === 'RIGHT'){
			var element_width = document.getElementById(id).offsetWidth;
			var offset_x = window.innerWidth - element_width;
			document.getElementById(id).style.left = offset_x + "px";
		}
	}

	this.$valign = function(id, align){
		if(align === 'TOP'){
			document.getElementById(id).style.top = "0 px";
		}
		else if(align === 'MIDDLE'){
			var element_height = document.getElementById(id).offsetHeight;
			var offset_y = (window.innerHeight - element_height)/2;
			document.getElementById(id).style.top = offset_y + "px";
		}
		else if(align === 'BOTTOM'){
			var element_height = document.getElementById(id).offsetHeight;
			var offset_y = window.innerHeight - element_height;
			document.getElementById(id).style.top = offset_y + "px";
		}
	}

	this.$backgroundColor = function(id, color){
		document.getElementById(id).style.backgroundColor = color;
	}

	this.$color = function(id, color){
		document.getElementById(id).style.color = color;
	}

	this.$top = function(id, top){
		document.getElementById(id).style.top = top + "px";
	}

	this.$left = function(id, left){
		document.getElementById(id).style.left = left + "px";
	}

	this.$font = function(id, font){
		document.getElementById(id).style.fontFamily = font;
	}




/*

var form_div = document.createElement("div");

var email_field = document.createElement("div");
	email_field.id = "email-form";
	email_field.style.width = "350px";
	email_field.style.position = "absolute";
	email_field.style.display = "inline";
	email_field.style.top = "200px";
	email_field.style.left = "35px";
	email_field.style.background = "none";
	email_field.innerHTML = '<input id="input-email" class="block" type="text" name="email" placeholder="CONTE-NOS SEU EMAIL" value>';
	email_field.innerHTML += '<div id="send-email">ENVIAR</div>';
	form_div.appendChild(email_field);

	//

	var system_message = document.createElement("div");
	system_message.id = "system_message";
	system_message.style.width = "350px";
	system_message.style.height = "30px";
	system_message.style.background = "transparent";
	system_message.style.position = "absolute";
	system_message.style.display = "inline-block";
	system_message.style.top = "260px";
	system_message.style.left = "0px";
	system_message.style.textTransform = "uppercase";
	system_message.style.textAlign = "center";
	system_message.style.fontSize = "12px";
	system_message.style.fontWeight = "300px";
	system_message.style.color = "#992388";
	system_message.innerHTML = 'cadastre-se para receber acesso assim<br/>que a versão beta for lançada';
	form_div.appendChild(system_message);

	document.body.appendChild(form_div);



*/
}




