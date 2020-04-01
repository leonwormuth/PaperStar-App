const {createCanvas, loadImage} = require('canvas')
const axios = require('axios');

var fs = require('fs');

const c = createCanvas(800, 800)
const ctx = c.getContext("2d");

//rotate everything by 45 degrees - star looks better this way
ctx.translate(c.width/2,c.height/2);
ctx.rotate(45 * Math.PI / 180);
ctx.translate(-c.width/2,-c.height/2);

var ROTATION = 90; //for copying and rotating the initial quarter of the star
var DRAW_BOUNDS = false;
var DRAW_GRID_POINTS = false;
var DRAW_OUTLINE = false;
var GRID_INTERVAL = 15;
var VERTICAL_EDGE_MINIMUM = 150;
var DIAGONAL_EDGE_MINIMUM = 150;
var VERTICAL_EDGE_MAXIMUM = 250;
var DIAGONAL_EDGE_MAXIMUM = 250;

//initialise drawing style
ctx.strokeStyle = "#1597e8";
ctx.lineWidth = 6;
ctx.lineCap='round';

//outer bounds of the star's edge
var diagonalEdgePoint;
var verticalEdgePoint;

//point grid variables, populated in init()
var gridRange; //the actual width/length of the grid in pixels
var gridSize; //the number of points along one side of the grid (gridRange divided by grid point interval)
var grid;
var edgePoints;


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.ceil(max));
}

function createArray(length) { //ref https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}

function fillGrid(gridArray, yIntercept, endPoint, edgeArray) {
    var m = (endPoint - yIntercept) / endPoint;

    for (var i = 0; i < gridArray.length; i++) {
        for (var j = 0; j < gridArray.length; j++) {
            //discard point if out of bounds
            if (i < j || ((i * GRID_INTERVAL) >= (m * j * GRID_INTERVAL + yIntercept))) {
                gridArray[i][j][2] = -1; //indicating for later that no lines should be drawn to this point
                continue;
            }
            //discard point if on boundary lines
            if (j == 0 || i == j) {
                gridArray[i][j][2] = -1; //indicating for later that no lines should be drawn to this point
                edgeArray.push([j * GRID_INTERVAL, i * GRID_INTERVAL]);
                //ctx.fillStyle = "#ff0000";
                //ctx.fillRect(400 + j * GRID_INTERVAL,400 - i * GRID_INTERVAL,2,2);
                continue;
            }

            //console.log(j * GRID_INTERVAL + ", " + i * GRID_INTERVAL);

            gridArray[i][j][0] = j * GRID_INTERVAL;
            gridArray[i][j][1] = i * GRID_INTERVAL;
            gridArray[i][j][2] = 0; //indicating for later that a line may be drawn to this point

            if (DRAW_GRID_POINTS) {
                ctx.fillStyle = "#000000";
                ctx.fillRect(400 + gridArray[i][j][0],400 - gridArray[i][j][1],2,2);
            }
        }
    }
}

function init() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#18191a";
    ctx.fillRect(-400, -400, c.width * 2, c.height * 2);

    diagonalEdgePoint = getRandomInt(DIAGONAL_EDGE_MAXIMUM - DIAGONAL_EDGE_MINIMUM);
    verticalEdgePoint = getRandomInt(VERTICAL_EDGE_MAXIMUM - VERTICAL_EDGE_MINIMUM);

    if ((diagonalEdgePoint + DIAGONAL_EDGE_MINIMUM) > (verticalEdgePoint + VERTICAL_EDGE_MINIMUM)) {
        gridRange = diagonalEdgePoint + DIAGONAL_EDGE_MINIMUM;
    } else {
        gridRange = verticalEdgePoint + VERTICAL_EDGE_MINIMUM;
    }

    gridSize = Math.ceil(gridRange / GRID_INTERVAL);

    grid = createArray(gridSize,gridSize,3);
    edgePoints = createArray();

    fillGrid(grid, verticalEdgePoint + VERTICAL_EDGE_MINIMUM, diagonalEdgePoint + DIAGONAL_EDGE_MINIMUM, edgePoints);
}

function lineStar() {
    init();

    for (var i = 0; i < edgePoints.length; i++) {
        ctx.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16); //each line is a random colour

        var xval = getRandomInt(gridSize);
        var yval = getRandomInt(gridSize);

        while (grid[xval][yval][2] != 0) {
            xval = getRandomInt(gridSize);
            yval = getRandomInt(gridSize);
        }

        for (var j = 0; j < 4; j++) {
            ctx.beginPath();
            ctx.moveTo(400 + edgePoints[i][0], 400 - edgePoints[i][1]);
            ctx.lineTo(400 + yval * GRID_INTERVAL, 400 - xval * GRID_INTERVAL);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(400 - edgePoints[i][0], 400 - edgePoints[i][1]);
            ctx.lineTo(400 - yval * GRID_INTERVAL, 400 - xval * GRID_INTERVAL);
            ctx.stroke();

            ctx.translate(400,400);
            ctx.rotate(ROTATION * Math.PI / 180);
            ctx.translate(-400,-400);
        }
        grid[xval][yval][2] = 1;
    }
}

function curveStar() {
    init();

    for (var i = 0; i < edgePoints.length; i++) {
        ctx.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16); //each line is a random colour

        var xval = getRandomInt(gridSize);
        var yval = getRandomInt(gridSize);
        var ctrlX = getRandomInt(gridSize);
        var ctrlY = getRandomInt(gridSize);

        while (grid[xval][yval][2] != 0) {
            xval = getRandomInt(gridSize);
            yval = getRandomInt(gridSize);
        }

        while (grid[ctrlX][ctrlY][2] < 0) {
            var ctrlX = getRandomInt(gridSize);
            var ctrlY = getRandomInt(gridSize);
        }

        for (var j = 0; j < 4; j++) {
            ctx.beginPath();
            ctx.moveTo(400 + edgePoints[i][0], 400 - edgePoints[i][1]);
            ctx.quadraticCurveTo(400 + ctrlY * GRID_INTERVAL, 400 - ctrlX * GRID_INTERVAL, 400 + yval * GRID_INTERVAL, 400 - xval * GRID_INTERVAL);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(400 - edgePoints[i][0], 400 - edgePoints[i][1]);
            ctx.quadraticCurveTo(400 - ctrlY * GRID_INTERVAL, 400 - ctrlX * GRID_INTERVAL, 400 - yval * GRID_INTERVAL, 400 - xval * GRID_INTERVAL);
            ctx.stroke();

            ctx.translate(c.width/2,c.height/2);
            ctx.rotate(ROTATION * Math.PI / 180);
            ctx.translate(-c.width/2,-c.height/2);
        }
        grid[xval][yval][2] = 1;
    }
}

function post() {
    //save image locally
    var out = fs.createWriteStream(__dirname + '/star.png');
    var stream = c.pngStream();

    stream.on('data', function(chunk) {out.write(chunk);});
    stream.on('end', function() {console.log('saved png');});
    console.log('Created temporary file star.png');

    var image = '/star.png';

    //post request to upload image
    axios.post('https://graph.facebook.com/229893064559530/photos', {
        url: image,
        access_token: 'EAACVS6jUj0QBAI6FWZAjWHgL40SCzjmOeZB8saz3mfNaE959rdTX4jbLGj2AAvwlHQbjvi6ZC2lF2tUMUTo9HAZCRmrlSDyg0SperyUo0sd2yBqKPs3VLzPm9medTeCZBx3nwtp7ZBZBUWW62dt8MitPoYZCnZAPLit4T3PRvjGpT8AZDZD'
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

    //delete image from local storage
}

module.exports = {
    curveStar: curveStar,
    lineStar: lineStar,
    post: post,
};
