Custom-combobox is a jQuery plugin that replaces the html dropdown, as featured on [ComicsInventory.com](http://www.ComicsInventory.com)

An array or a collection of objects can be used to fill the dropdown.
It also supports formating the data in the dropdown with a template. The plugin also has edge detection which keeps the dropdown from spilling over the edges of the window. **Only 5k!**

**Works with jQuery 1.3.2 & 1.4.2**

[Follow Me on Twitter](https://twitter.com/Donny_V)

### Revisions ###
  * 2/10/10 - Added "topMsg" option, lets you add a message in the input box when first loaded


---

# **Browser Support** #
IE 6,7,8, Google Chrome, Firefox, Safari, Opera

# **Screenshot** #
![http://img41.imageshack.us/img41/3948/jquerycustomcombobox121.png](http://img41.imageshack.us/img41/3948/jquerycustomcombobox121.png)

# **Options** #$.fn.customcombobox.defaults = {
		width: -1,
		// When set to -1 width is automaticaly set using the width of the 
		// input box plus width of the arrow sprite image.
		
		template: "",
		// Html template will be used for each item.
		/*	
		*   Example using json object (put json properties in curly braces):
		*	"<div>{IssueNum}<br/><b>Notes:</b>{Notes}</div>"
		*
		*   Example using basic array (put empty curly braces where data should go)
		*   "<b>{}</b>"
		*/
                
                topMsg: "",
                // A message placed in the input box when first loaded.
                // example: topMsg: "Pick an issue..."

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
}}}     ```