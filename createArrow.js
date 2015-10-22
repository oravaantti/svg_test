// Create vertical linear gradient
var gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
gradient.setAttribute("id", "grad");
gradient.setAttribute("x1", "0%");
gradient.setAttribute("y1", "0%");
gradient.setAttribute("x2", "0%");
gradient.setAttribute("y2", "100%");

// Create stops for the gradient #FFFFFF00 to #FFFFFFFF
var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
stop1.setAttribute("style", "stop-color: #fff; stop-opacity: 1;");
stop1.setAttribute("offset", "0");
stop1.setAttribute("id", "stop1");
stop2.setAttribute("style", "stop-color: #ffffff; stop-opacity: 0;");
stop2.setAttribute("offset", "1");
stop2.setAttribute("id", "stop2");

// Create definition tag for gradient
var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

// Append stops to gradient and gradient to definition
gradient.appendChild(stop1);
gradient.appendChild(stop2);
defs.appendChild(gradient);

function createArrow(rotation) {
    // Create 50px by 50px svg element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("style", "border: 0px solid black");
    svg.setAttribute("width", "50");
    svg.setAttribute("height", "50");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    // Create arrow shaped path
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("id", "path0");
    path.setAttribute("d", "M 23,43 23,32 45,32 45,18 23,18 23,7 5,25 Z");
    path.setAttribute("opacity", 1);
    
    // Change rotation and color of the path depending on the given rotation variable
    path.setAttribute("fill", computeColor(rotation));
    path.setAttribute("d", rotate(path.getAttribute("d"), rotation));
    
    // Create path for the shine effect for the arrow
    var shine = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shine.setAttribute("id", "path1");
    shine.setAttribute("d", "M 0,0 50,0 50,31 0,19 Z");
    shine.setAttribute("opacity", 1);
    
    // Append gradient to svg element and set gradient as fill of the shine
    svg.appendChild(gradient);
    shine.setAttribute("fill", "url(#grad)");
    
    // Append arrow and shine to the svg element
    svg.appendChild(path);
    svg.appendChild(shine);
    
    return svg;
}

// Create test set of arrows to the table in HTML document
var table = document.getElementById("table");

var row = table.insertRow(0);

for(var i = 0 ; i < 33 ; i++) {
    var cell = row.insertCell(0);
    cell.id = "cell" + i;
    $("#cell" + i).append(createArrow(Math.PI * i / 16));
}

// Compute color depending difference in rotation.
// Color starts as full green at 0 and turns to red trought yellow while rotating to PI.
function computeColor(rotationDifference) {
    var totalRed = "";
    var totalGreen = "";
    
    // Make sure that rotation difference is positive number in between of 0 and 2 * PI
    if (rotationDifference < 0) rotationDifference *= -1;
    while (rotationDifference > Math.PI * 2) rotationDifference -= Math.PI * 2;
    
    // Shift rotation difference to between of PI and -PI
    var normRotDif = Math.abs(rotationDifference - Math.PI);
    
    // Compute amount of red
    totalRed = Math.round(255 - Math.max(normRotDif - Math.PI / 2, 0) / (Math.PI / 2) * 255);
    
    // This allows us to use same formula for green as we used for red
    normRotDif = Math.PI - normRotDif;
    
    // Compute amount of green
    totalGreen = Math.round(255 - Math.max(normRotDif - Math.PI / 2, 0) / (Math.PI / 2) * 255);
    
    // Transform from decimal to hexadecimal
    totalGreen = totalGreen.toString(16);
    totalRed = totalRed.toString(16);
    
    // Make sure that all color values has 2 digits
    while (totalGreen.length < 2) totalGreen = "0" + totalGreen;
    while (totalRed.length < 2) totalRed = "0" + totalRed;
    
    // Return color as hexadecimal
    return "#" + totalRed + totalGreen + "00";
}

// Rotate svg path for amount of given rotation variable around middle(25px, 25px)
// svg path is written like: "M x1,y1 x2,y2 x3,y3 ... xn,yn Z"
function rotate(path, rotation) {
    var points = [];
    
    // Create path and open in up with M
    var rotatedPath = "M"
    
    // Split old path up
    var newPath = path.split(" ");
    
    // Remove M and Z (first and last)
    newPath.shift();
    newPath.pop();
    
    // Parse coordinates out from the points newPath array
    for (var i = 0 ; i < newPath.length ; i++) {
        points.push(newPath[i].split(","));
    }
    
    // Rotate points around the middle point and add them to rotatedPath array
    for (var i = 0 ; i < points.length ; i++) {
        var new_x = Math.cos(rotation) * (points[i][0] - 25) - Math.sin(rotation) * (points[i][1] - 25) + 25;
        var new_y = Math.sin(rotation) * (points[i][0] - 25) + Math.cos(rotation) * (points[i][1] - 25) + 25;
        
        rotatedPath += " " + new_x + "," + new_y;
    }
    
    // Close up the array
    rotatedPath += " Z";
    
    return rotatedPath;
}