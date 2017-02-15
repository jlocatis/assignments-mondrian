// Adds event listeners for the page.
window.addEventListener("load", function() {
	document.getElementById("color_palette").addEventListener("click", setColor);
	document.getElementById("painting").addEventListener("click", changeColor);
	document.getElementById("save_button").addEventListener("click", savePainting);
	document.getElementById("load_button").addEventListener("click", loadPainting);
});

// Sets the variables color equal to white and creates the empty save object.
// The color variable will be changes based on what color the user selects from the color palette.
// The save object will store a box's location and it's new color everytime something is changed.
var color = "white";
var save = {};

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

// (Not finished) Loads the save file from the server. Right now the server just returns a list of timestamps
// for every save.
function loadPainting() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/loadsaves');
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onload = function() {
		response = xhr.responseText;
		document.getElementById("show_load_files").textContent = response;
	}
	xhr.send();
}