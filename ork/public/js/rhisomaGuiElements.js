function RhisomaGuiElements(){
	var master = this;

	this.addTitle = function(node){
		var field = {id:"control-panel-title",top:offset_x,height:24,width:300,texttransform:"uppercase",fontweight:800,color:color(node.group)};
		gui.addField(field,"control-panel");
		gui.addText("control-panel-title",node.name);
		offset_x += 24;
	}
}