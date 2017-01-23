function RhisomaStyle(){

	  /* LINK STYLING */

	var master = this;
	var inside_node = undefined;
	var current_node = undefined;
	var main_structure = undefined;
	var svg = d3.select("svg");

	this.setInsideNode = function(in_inside){
		inside_node = in_inside;
	}

	this.setStructure = function(in_structure){
		main_structure = in_structure;
	}

	this.setEnvironment = function(in_inside,in_current,in_structure){
		inside_node = in_inside;
		current_node = in_current;
		main_structure = in_structure;
	}

	this.linkStroke = function(d){
	  if(d.type===1){
	  	if(main_structure.getTargetColor(d.source) != undefined){
	  		return main_structure.getTargetColor(d.source);
	  	}
	    else{
	    	return "#c9c9c9";
	    }
	  }
	  else if(d.type===2){
	    return "black";
	  }
	  else{
	    return "#000000";
	  }
	}

	this.linkStrokeWidth = function(d){
	  return Math.sqrt(d.value);
	}

	this.linkStrokeDash = function(d){
	  if(d.type === 3){       // ligação do tipo 3 [posicionamento]
	    return "0,5";         // linha pontilhada
	  }
	  else if(d.type === 2){  // ligação do tipo 2 [relação]
	    return "5,5";         // linha tracejada
	  }
	  else{                   // outras ligações (tipo 1) [dependência]
	    return "0,0"          // linha contínua
	  }
	}
	  /* NODE STYLING */

	this.nodeType = function(d){
	  if(d.type==="categoria"){
	    return d3.symbolCircle;
	  }
	  else if(d.type==="tarefa"){
	    return d3.symbolSquare;
	  }
	  else if(d.type ==="texto"){
	    return d3.symbolTriangle;
	  }
	  else if(d.type ==="link"){
	    return d3.symbolDiamond;
	  }
	  else if(d.type ==="buraco"){
	    return d3.symbolStar;
	  }
	}

	this.nodeSize = function(d){
	  if(d.type != "buraco"){
	    return (100*(d.size));
	  }
	  else{
	    return 100*3;
	  }
	}

	this.nodeFill = function(d){
	  if(inside_node != d.id){
  		if(d.collapse === 1){
	  		if(d.type != "buraco"){
	  			if(d.standby === 0){
	  				return d.color;
	  			}
	  			else{
			  		return "#c9c9c9";
			  	}
		    }
		    else{
		      return "white";
		    }
	  	}
	    else{
	    	return "white";
	    }
	  }
	  else{
	  	if(d.collapse === 1){
	  		if(d.standby === 0){
	  			return d3.rgb(d.color).brighter(0.5);
	  		}
	  		else{
	  			return d3.rgb("#c9c9c9").brighter(0.5);
	  		}
	  	}
	    else{
	    	return "white";
	    }
	  }
	}

	this.nodeStroke = function(d){
	  if(inside_node != d.id){
  		if(d.collapse === 1){
		    if(d.type != "buraco"){
		    	if(current_node === d.id){
		    		if(d.standby === 0){
		    			return d3.rgb(d.color).darker(1);
		    		}
		    		else{
		    			return d3.rgb("#c9c9c9").darker(1);
		    		}	
		    	}
		    	else{
		    		return "transparent";
		    	}
		    }
		    else{
		    	if(d.standby === 0){
		    		return d.color;
		    	}
		    	else{
		    		return "#c9c9c9";
		    	}
		    }
		}
		else{
			if(current_node === d.id){
				if(d.standby === 0){
		    		return d3.rgb(d.color).darker(1);
		    	}
		    	else{
		    		return d3.rgb("#c9c9c9").darker(1);
		    	}
			}
			else{
				if(d.standby === 0){
		    		return d.color;
		    	}
		    	else{
		    		return "#c9c9c9";
		    	}
		    }
		}
	  }
	  else{
	  	if(d.standby === 0){
	  		return d3.rgb(d.color).darker(2.5);
	  	}
	    else{
	    	return d3.rgb("#c9c9c9").darker(2.5);
	    }
	  }
	}

	this.nodeStrokeWidth = function(d){
	  if(inside_node != d.id){
	  	if(d.collapse === 1){
	  		if(d.type != "buraco"){
	  			if(current_node === d.id){
	  				return 2;
	  			}
	  			else{
	  				return 0;
	  			}
		    }
		    else{
		      return 2;
		    }
	  	}
	    else{
	    	if(current_node === d.id){
	    		return 4;
	    	}
	    	else{
	    		return 2;
	    	}
	    }
	  }
	  else{
	    return 2;
	  }
	}

	this.nodeLineJoin = function(d){
	  if(d.type != "buraco"){
	    return "miter";
	  }
	  else{
	    return "round";
	  }
	}

	  /* LABEL STYLING */

	this.updateLabel = function(in_id){
	  update_label = svg.selectAll("rect")
	  	.filter("#rect-"+in_id)
	      .style("width",function(d){return document.getElementById("label-"+d.id).getBBox().width+10;})
	      .style("height",function(d){return document.getElementById("label-"+d.id).getBBox().height+6;})
	      .attr("x", master.labelRectX)
	      .attr("y", master.labelRectY);
	}

	this.labelTextY = function(d){
	  if(d.parentConnections === 0){
	    return Math.sqrt((100*d.size)/Math.PI)+20;
	  }
	  else{
	    return Math.sqrt((100*d.size)/Math.PI)+18;
	  }
	}

	this.labelTextFontSize = function(d){
	  if(d.parentConnections === 0){
	    return 12;
	  }
	  else{
	    return 10;
	  }
	}

	this.labelTextFill = function(d){
	  if(d.type === "categoria" && d.parentConnections != 0){
	  	if(d.standby === 0){
	  		return d.color;
	  	}
	    else{
	    	return "#c9c9c9";
	    }
	  }
	  else{
	  	if(d.standby === 0){
	  		return "black";
	  	}
	    else{
	    	return "#c9c9c9";
	    }
	  }
	}

	this.labelText = function(d){
	  if(d.parentConnections === 0 || d.type === "categoria"){
	    return d.name.toUpperCase();
	  }
	  else{
	    return d.name;
	  }
	}

	this.labelTextOpacity = function(d){
	  var opacity = 0;
	  if(d.parentConnections === 0 || d.type === "categoria"){ // + atividades que encerram hoje
	    opacity = 1;
	  }
	  return opacity;
	}

	this.labelTextZoomOpacity = function(d){
	  var opacity = 1;
	  if(d.parentConnections === 0 || d.type === "categoria"){ // + atividades que encerram hoje
	    opacity = 0.8;
	  }
	  else if(d.standby === 1){
	  	opacity = 0;
	  }
	  return opacity;
	}

	this.labelTextZoomFill = function(d){
	  if(d.parentConnections === 0){
	  	if(d.standby === 0){
	  		return d.color;
	  	}
	    else{
	    	return "#c9c9c9";
	    }
	  }
	  else if(d.type === "categoria"){
	  	if(d.standby === 0){
	  		return d.color;
	  	}
	    else{
	    	return "#c9c9c9";
	    }
	  }
	  else{
	  	if(d.standby === 0){
	  		return "black";
	  	}
	    else{
	    	return "#c9c9c9";
	    }
	  }
	}

	this.labelTextZoomTextAnchor = function(d){
		if(d.type != "categoria" && d.parentConnections != 0){
			return "left";
		}
		else{
			return "middle";
		}
	}

	this.labelTextZoomFontSize = function(d){
	  var font_size = null;
	  if(d.parentConnections === 0){
	  	font_size = 12;
	  }
	  else if(d.type === "categoria"){
	  	font_size = 10;
	  }
	  else{ // + atividades que encerram hoje
	    font_size = 6;
	  }
	  return font_size;
	}

	this.labelTextZoomY = function(d){
		if(d.parentConnections === 0){
	   		return Math.sqrt((100*d.size)/Math.PI)+20;
		  }
		  else if(d.type === "categoria"){
		    return Math.sqrt((100*d.size)/Math.PI)+18;
		  }
		  else{
		  	// return Math.sqrt((100*d.size)/Math.PI)+6;
		  	return 2;//Math.sqrt((100*d.size)/Math.PI)-3;
		  }
	}

	this.labelTextZoomX = function(d){
		var offset_x = 0;
		if(d.parentConnections != 0 && d.type != "categoria"){
			offset_x = Math.sqrt((100*d.size)/Math.PI)+4;//((document.getElementById("label-"+d.id).getBBox().width/2)+(d.size))+7;
		}
		
		return offset_x;
	}

	this.labelRectZoomOpacity = function(d){
	  var opacity = 0;
	  if(d.parentConnections === 0 && d.childConnections > 0){
	    opacity = 0.1;
	  }
	  else if(d.type === "categoria"){
	    opacity = 0.1;
	  }
	  return opacity;
	}

	this.labelTextFontWeight = function(d){
	  if(d.parentConnections === 0){
	    return 800;
	  }
	  else{
	    return 400;
	  }
	}

	this.labelRectX = function(d){
	  return -((document.getElementById("label-"+d.id).getBBox().width/2)+5);
	}

	this.labelRectY = function(d){
	  return Math.sqrt((100*d.size)/Math.PI)+5;
	}

	this.labelRectOpacity = function(d){
	  var opacity = 0;
	  if(d.parentConnections === 0 && d.childConnections > 0){
	    opacity = 0.8;
	  }
	  else if(d.type === "categoria"){
	    opacity = 0.8;
	  }
	  return opacity;
	}

	this.labelRectStroke = function(d){
		if(d.standby === 0){
			return d.color;
		}
		else{
			return "#c9c9c9";
		}
	}

	this.labelRectStrokeDash = function(d){
	  if(d.type === "categoria" && d.parentConnections != 0){
	    return "1,2";
	  }
	  else{
	    return "0,0";
	  }
	}
}