function RhisomaGuiFunctions(){

	var master = this;

	// var rel = new RhisomaGuiElements();
	// rel.prototype = RhisomaGuiElements.prototype;
	// rel.prototype.constructor = rel;

	// var rfn = new RhisomaGui();
	this.prototype = new RhizomaGui();//rfn.prototype;
	this.prototype.constructor = this;


	this.formatTimestamp = function(in_date){
		console.log(master);
		var elements = in_date.split(" ");
		var date = undefined;
		var time = undefined;
		if(elements[0] != null){
			date = elements[0].split("-");
		}
		if(elements[1] != null){
			time = elements[1].split(":");
		}
		var processed_timestamp = [];

		if(date.length === 3 && time.length === 3){
			processed_timestamp[0] = date[2] + "/" + date[1] + "/" + date[0];
			processed_timestamp[1] = time[0] + "h" + time[1];
		}
		else{
			processed_timestamp[0] = "-";
			processed_timestamp[1] = "";
		}

		return processed_timestamp;
	}

	this.teste = function(){
		console.log(master);
	}

}