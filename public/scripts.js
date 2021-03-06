// Adds event listeners for the page.
window.addEventListener("load", function() {
	document.getElementById("color_palette").addEventListener("click", setColor);
	document.getElementById("painting").addEventListener("click", changeColor);
	document.getElementById("save_button").addEventListener("click", savePainting);
	document.getElementById("load_button").addEventListener("click", loadPainting);
	document.getElementById("reset_button").addEventListener("click", resetCanvas);
});

// Sets the variables color equal to white and creates the empty save object.
// The color variable will be changes based on what color the user selects from the color palette.
// The save object will store a box's location and it's new color everytime something is changed.
// The response object will hold the save information for loading if requested by the user.
var color = "white";
var save = {};
var response = [];

// Changes the color variable to whichever color the user selects.
function setColor() {
	current_color = window.event;
	yellow = document.getElementById("yellow");
	blue = document.getElementById("blue");
	white = document.getElementById("white");
	red = document.getElementById("red");
	if (current_color.target == yellow) {
		color = "yellow"
	} else if (current_color.target == blue) {
		color = "blue"
	} else if (current_color.target == white) {
		color = "white"
	} else if (current_color.target == red) {
		color = "red"
	}
}

// Will change the color of the corresponding box (div) to whatever the color variable is currently set to.
function changeColor() {
	current_box = window.event.target;
	current_box.style.backgroundColor = color;
	current_box_name = current_box.id;
	save[current_box_name] = color;
}

// Will breakdown the save object into arrays with box and color date and send that to Sinatra to be saved
// server-side. Also adds a current timestamp for reference.
function savePainting() {
	var xhr = new XMLHttpRequest();
	var row = Object.keys(save);
	var colors = Object.values(save);
	var time = new Date();
	var params = "time=" + time + "&row=" + row + "&colors=" + colors;
	xhr.open('GET', '/savepainting?' + params);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send();
}

// Loads the save file from the server and builds links to each save found for the user to click.
// Opens a modal window for load selection.
function loadPainting() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/loadsaves');
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onload = function() {
		response = JSON.parse(xhr.responseText);
		var counter = 0;
		var text = "";
		var save_count = response.length / 3;
		for (x = 0; x < save_count; x++) {
			text = text + "<br>" + "<a href=\"javascript:;\" class=\"load_links\" data-save=\"" + counter + "\">" + response[counter][1] + "</a><br>"
			document.getElementsByClassName("modal_body")[0].innerHTML = text;
			counter += 3;
		}
		createLoadEventListeners(response);
		document.getElementsByClassName("modal")[0].style.display = "block";
		document.getElementsByClassName("modal_content")[0].style.display = "block";
		document.getElementById("x_button").addEventListener("click", hideModal);
		document.getElementsByClassName("modal")[0].addEventListener("click", hideModal);
	}
	xhr.send();
}


// Creates event listeners for each link built in the loadPainting function.
function createLoadEventListeners(response) {
	var links = document.getElementsByClassName("load_links");
	for (x = 0; x < links.length; x++) {
		document.getElementsByClassName("load_links")[x].addEventListener("click", loadSave);
	}

	var remove_links = document.getElementsByClassName("remove_links");
	for (x = 0; x < remove_links.length; x++) {
		document.getElementsByClassName("remove_links")[x].addEventListener("click", removeSave);
	}
}

// Loads the save the user selects. Paints it a block at a time for nice effect.
function loadSave() {
	resetCanvas();
	save = this.getAttribute("data-save");
	save = parseInt(save);
	document.getElementsByClassName("modal")[0].style.display = "none";
	document.getElementsByClassName("modal_content")[0].style.display = "none";
	divs_to_change = response[save + 1][1].split(",");
	colors_to_change = response[save + 2][1].split(",");
	for (var x = 0; x < divs_to_change.length; x++) {
  		setTimeout( function(i) {    
    		document.getElementById(divs_to_change[i]).style.backgroundColor = colors_to_change[i];
  		}, x * 500, x);
	}
}

// Closes the load selection modal window if the user does not select a save to load.
function hideModal() {
	document.getElementsByClassName("modal")[0].style.display = "none";
	document.getElementsByClassName("modal_content")[0].style.display = "none";
}

// Resets the Mondrian canvas back to it's original state. This is used before a save is loaded
// (in case the user had already changed something) and there is a reset option provided to the user
// on the page.
function resetCanvas() {
	var row = 1;
	for (x = 0; x < 4; x++) {
		var box = 1;
		for (i = 0; i < 4; i++) {
			document.getElementById("painting").childNodes[row].childNodes[box].style.backgroundColor = "white";
			box += 2;
		}
		row += 2;
	}
	save = {};
}