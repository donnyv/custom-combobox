/*
*   jQuery.CustomCombobox
*   ----------------------
*   version: 1.0
*
*   Copyright (c) 2010 Donny Velazquez
*   http://www.ComicsInventory.com   
*   http://donnyvblog.blogspot.com/
*   http://code.google.com/p/custom-combobox
*   
*   Licensed under the Apache License 2.0
*
*/ 
(function($){  
	$.fn.customcombobox = function(jsonData,options) { 
	
		var options =  $.extend({},$.fn.customcombobox.defaults, options);

		//Iterate over the current set of matched elements  
		return this.each(function() {  
			var o = options;  
			var obj = $(this);
			
			//If list items exists use them to populate combobox          
			var items = $("li", obj);
			if(items.length != 0){
				/*
				*	todo
				*	Populate combobo with list items.
				*
				*/
			}
			else{
				var boxHtml = 	"<div class='CustomCombobox'>";
					boxHtml +=		"<div class='cc-Box'>";
					boxHtml +=		"<input type='text' class='cc-Textbox' value='' readonly='readonly'/><span class='cc-Arrow'></span>";
					boxHtml +=	"</div>";
					
				var dropDownList = 	"<div class='cc-ItemListContainer'><ul class='cc-ItemList'></ul></div></div>";

				//Create Combobox object
				var ComboBox = obj.html(boxHtml + dropDownList);
				
				//Exit if empty
				if(jsonData.length == 0)
					return;
				
				//Add items and save json data to access later
				for (i=0;i<=jsonData.length - 1;i++){
					var Item = null;
					
					//array of data
					if(typeof(jsonData[0]) != 'object' && o.template == ""){
						Item = $("<li class='cc-Item'>" + jsonData[i] + "</li>");
						Item.data("source",jsonData[i]);
					}
					
					//array of data with template
					if(typeof(jsonData[0]) != 'object' && o.template != ""){
						Item = $("<li class='cc-Item'>" + BindDataToTemplate(jsonData[i],o.template) + "</li>");
						Item.data("source",jsonData[i]);
					}
					
					//array of objects
					if(typeof(jsonData[0]) == 'object' && o.template == "" && o.displayPropertyName != ""){
						Item = $("<li class='cc-Item'>" + jsonData[i][o.displayPropertyName] + "</li>");
						Item.data("source",jsonData[i]);
					}
					
					//array of objects with template
					if(typeof(jsonData[0]) == 'object' && o.template != ""){
						Item = $("<li class='cc-Item'>" + BindDataToTemplate(jsonData[i],o.template) + "</li>");
						Item.data("source",jsonData[i]);
					}
					
					ComboBox.find(".cc-ItemList").append(Item);
				};
				
				//Set initial value
				if(o.initialIndex != -1){
					if(o.displayPropertyName != ""){
						ComboBox.find(".cc-Textbox").val(jsonData[o.initialIndex][o.displayPropertyName]);
					}else{
						ComboBox.find(".cc-Textbox").val(jsonData[i]);
					}
				}
				if(o.initialIndex == -1 && o.initialValue != ""){
					for (i=0;i<=jsonData.length - 1;i++){
						if(typeof(jsonData[0]) == 'object' && o.displayPropertyName != ""){
							if(jsonData[i][o.displayPropertyName] == o.initialValue){
								ComboBox.find(".cc-Textbox").val(jsonData[i][o.displayPropertyName]);
							}
						}
						if(typeof(jsonData[0]) != 'object'){
							if(jsonData[i] == o.initialValue){
								ComboBox.find(".cc-Textbox").val(jsonData[i]);
							}
						}
					}
				}
				if(o.initialIndex == -1 && o.initialValue == "" && o.displayPropertyName != "" && o.idPropertyName != "" && o.initialValueByID != ""){
					for (i=0;i<=jsonData.length - 1;i++){
						if(typeof(jsonData[0]) == 'object'){
							if(jsonData[i][o.idPropertyName] == o.initialValueByID){
								ComboBox.find(".cc-Textbox").val(jsonData[i][o.displayPropertyName]);
							}
						}
					}
				}
				
				//Wire up events
				var Arrow = $("span[class=cc-Arrow]", ComboBox);
				Arrow.click(function(){handleShowDropdownList($(this),o);});
				
				var Input = $("input", ComboBox);
				Input.click(function(){handleShowDropdownList($(this),o);});
				
				var ListContainer = $("div[class=cc-ItemListContainer]", ComboBox);
				ListContainer.hover(null,function(){handleListContainerHover($(this));});
				
				var ListItems = $("li[class=cc-Item]", ComboBox);
				ListItems.click(function(){handleOnItemSelect($(this),o);});

			}
		});
	}
		
	$.fn.setSelectedIndex = function(i) {
		//alert($(this).html());
	};
	
	$.fn.setSelectedValue = function(v) {
		
	};
	
	$.fn.setSelectedValueByID = function(v) {
		
	};
	
	function BindDataToTemplate(jsonObject, Template){
		if (jsonObject === '') return this;
		
		return Template.replace(/{([^{}]*)}/g,
				function(FoundWithBrackets, Found) {
					if(typeof(jsonObject) == 'object'){
						return jsonObject[Found];
					}else{
						return jsonObject;
					}
				}
			);
	}
	  
	function handleShowDropdownList(sender,options){
		var WindowHeight = $(window).height();
		var WindowWidth = $(window).width();
		var WindowTopEdge = $(window).scrollTop();
		
		//Position list container under input box
		var Combobox = sender.parents(".CustomCombobox");
		var InputBox = Combobox.find(".cc-Textbox");
		var _top = InputBox.offset().top + InputBox.height() + 2;//add 2px because of css padding
		var _left = InputBox.offset().left;
		
		//Set width of list container
		var w;
		if(options.width != -1){
			w = options.width;
		}else{
			w = getAutoWidth(sender);
		}
		
		// Get height  ** BUG in Google Chrome when creating height. 
		// For some reason it adds 20px to the first item only the first time it finds the height.
		var h = 0;
		Combobox.find(".cc-ItemListContainer").css({ border: "0px white solid", display: "block", visibility: "hidden" });
		Combobox.find(".cc-Item").each(function(i){
			h = h + $(this).outerHeight(true);
			
			if(i == options.maxVisibleRows - 1)
				return false;
		});
		Combobox.find(".cc-ItemListContainer").removeAttr("style").hide();
		
		//-- Edge detection ----------
		if(options.useEdgeDetection){
			//Check if width goes to far outside window boundary, then adjust. 
			if((_left + w) > WindowWidth){
				w = (_left + w) - ((_left + w) - WindowWidth) - _left - 2 - 2; //subtract 2px because of css padding, then substract another 2px just to look good ;-)
			}
			
			var belowHeight = (WindowTopEdge + WindowHeight) - _top;
			var aboveHeight = InputBox.offset().top - WindowTopEdge;
			
			//Check to see if dropdown should show above or below input box
			if(h > belowHeight){
				if(h < aboveHeight){
					_top = InputBox.offset().top - h;
				}else{
					//Doesn't fit above or below, so find out which one is bigger and change height to that one.
					h = Math.max(belowHeight,aboveHeight);
					switch(h){
						case aboveHeight:
							_top = InputBox.offset().top - h;
						break;
					}
				}
			}
		}
		//----------------------------
		
		Combobox.find(".cc-ItemListContainer").width(w);
		
		//Show list
		Combobox.find(".cc-ItemListContainer").css({ top: _top, left: _left }).animate({ height: h + "px"},100);
	}
	
	function handleListContainerHover(sender){
		sender.hide();
	}
	
	function handleOnItemSelect(sender,options){
		if(options)
		{
			//Set value of selected item and hide list container
			var Combobox = sender.parents(".CustomCombobox");
			
			var jsonObject = sender.data("source");
			if(typeof(jsonObject) == 'object'){
				Combobox.find(".cc-Textbox").val(jsonObject[options.displayPropertyName]);
			}else{
				Combobox.find(".cc-Textbox").val(jsonObject);
			}
			Combobox.find(".cc-ItemListContainer").hide();
			
			options.onSelect(sender);
		}
	}
	
	function getAutoWidth(sender){
		var Combobox = sender.parents(".CustomCombobox");
		return Combobox.find(".cc-Textbox").width() + Combobox.find(".cc-Arrow").width() + 5;//add 5px because of css padding
	}
 
	$.fn.customcombobox.defaults = {
		width: -1,
		// When set to -1 width is automaticaly set using the width of the input box plus width of the arrow sprite image.
		
		template: "",
		// Html template for each item (put json properties in curly braces)
		/*	Example:
		*	"<div>{IssueNum}<br/><b>Notes:</b>{Notes}</div>"
		*/
		
		displayPropertyName: "",
		// Json property whose value is displayed on select
		
		initialIndex: -1,
		// The index used to get the value that is shown in the 
		// input box when the list is first loaded.
		
		initialValue: "",
		// The value that is shown in the input box when 
		// the list is first loaded. The plugin uses the "displayPropertyName" value to search on.
		
		idPropertyName: "",
		// This will set the property to be used with "initialValueByID" setting
		
		initialValueByID: "",
		// Use this to look up the initial value by an id
		// The property used as an id is set using the "idPropertyName" setting
		
		maxVisibleRows: -1,
		// This controls how many items you see when you first click the arrow. 
		// If there are more then "maxVisibleRows" value it will include a scrollbar to see the rest.
		
		useEdgeDetection: true,
		// Use this option to turn on/off edge detection
		// Edge detection keeps the dropdown box from exceeding the window boundary
		
		onSelect: false
		// Function to run when an item is selected. Returns jQuery object of selected item. 
		// You can also retrieve the orignal json object.
		/*
		*	Example returning json object:
		*	onSelect: function(item){
		*		alert(item.data("source").YourJsonProperty);
		*	}
		*	
		*	Example returning array value
		*	onSelect: function(item){
		*		alert(item.data("source"));
		*	}
		*	
		*/
	};         
})(jQuery);
