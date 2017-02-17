function RhisomaGuiCalendar(){
	var master = this;

	this.getMonthDays = function(){
    	return new Date(year, month, 0).getDate();
	}

	this.getToday = function(){
		return "today";
	}
}