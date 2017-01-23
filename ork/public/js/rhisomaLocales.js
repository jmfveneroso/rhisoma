function RhisomaLocales(){
	
	var master = this;

	// configura locale do date picker
	// configura locale do moment.js

	this.getContents = function(){
		$.ajax({
	        url: "../ork/public/json/language-pt.json",
	        type: "POST",
	        contentType: 'application/json; charset=utf-8',
	        success: function (resultData) {
	            var data_settings = $.parseJSON(resultData);
	            console.log(data_settings);
	            return data_settings;
	        },
	        error: function (jqXHR, textStatus, errorThrown) {
	        },
	        timeout: 120000,
	    });
	}

}