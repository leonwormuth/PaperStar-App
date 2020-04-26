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
    console.log('Created new Line Star.');
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
    console.log('Created new Curve Star.');
}

function awareStar() {
    init();

    var lineLength;

    for (var i = 2 + getRandomInt(2); i < edgePoints.length; i++) { //commented out for testing
        ctx.strokeStyle = '#' + Math.random().toString(16).slice(2, 8); //each line is a random colour

        var currentX = edgePoints[i][1]/GRID_INTERVAL;
        var currentY = edgePoints[i][0]/GRID_INTERVAL;
        var nextX;
        var nextY;

        //pathfinding loop
        var lineQueue = []; //queue to add chosen path points to, for drawing later
        var options = [];
        var chosen;

        lineQueue.unshift([currentX,currentY]);
        lineLength = 0;

        while (lineLength < 20) {
            if ((currentX + 1) < gridSize) {
                switch (grid[currentX + 1][currentY][2]) {
                    case 0:
                        options.unshift([currentX + 1,currentY]);
                        break;
                }
            }
            if ((currentX - 1) < gridSize && (currentX - 1) >= 0) {
                switch (grid[currentX - 1][currentY][2]) {
                    case 0:
                        options.unshift([currentX - 1,currentY]);
                        break;
                }
            }
            if ((currentY + 1) < gridSize) {
                switch (grid[currentX][currentY + 1][2]) {
                    case 0:
                        options.unshift([currentX,currentY + 1]);
                        break;
                }
            }

            if ((currentY - 1) < gridSize && (currentY - 1) >= 0) {
                switch (grid[currentX][currentY - 1][2]) {
                    case 0:
                        options.unshift([currentX,currentY - 1]);
                        break;
                }
            }
            if (options.length == 0) break;

            chosen = options[Math.floor(Math.random() * options.length)];
            grid[chosen[0]][chosen[1]][2] = 1;
            lineQueue.unshift(chosen);

            currentX = chosen[0];
            currentY = chosen[1];

            options = []; //clear the options array for the next iteration
            lineLength++;
        }

        var currentPoint;
        var nextPoint;
        var tempQueue;

        if (lineQueue.length == 1) {
            /*nextPoint = lineQueue.pop();

            ctx.beginPath();
            ctx.moveTo(400 + nextPoint[1] * GRID_INTERVAL, 400 - nextPoint[0] * GRID_INTERVAL);
            ctx.lineTo(400 + nextPoint[1] * GRID_INTERVAL, 400 - nextPoint[0] * GRID_INTERVAL);
            ctx.stroke();*/
        }
        else {
            //draw the line (and its mirrored counterpart) using the lineQueue data structure
            tempQueue = lineQueue;
            currentPoint = tempQueue.pop();
            nextPoint = tempQueue.pop();

            while(tempQueue.length != 0) {
                for (var j = 0; j < 4; j++) {
                    ctx.beginPath();
                    ctx.moveTo(400 + currentPoint[1] * GRID_INTERVAL, 400 - currentPoint[0] * GRID_INTERVAL);
                    ctx.lineTo(400 + nextPoint[1] * GRID_INTERVAL, 400 - nextPoint[0] * GRID_INTERVAL);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(400 - currentPoint[1] * GRID_INTERVAL, 400 - currentPoint[0] * GRID_INTERVAL);
                    ctx.lineTo(400 - nextPoint[1] * GRID_INTERVAL, 400 - nextPoint[0] * GRID_INTERVAL);
                    ctx.stroke();

                    ctx.translate(c.width/2,c.height/2);
                    ctx.rotate(ROTATION * Math.PI / 180);
                    ctx.translate(-c.width/2,-c.height/2);
                }
                currentPoint = nextPoint;
                nextPoint = tempQueue.pop();
            }
        }
    }
    console.log('Created new Aware Star.');
}

function post(pageID, accessToken, imageURL) {
    //save image locally
    var out = fs.createWriteStream(__dirname + '/public' + '/star.png');
    var stream = c.pngStream();

    stream.on('data', function(chunk) {out.write(chunk);});
    stream.on('end', function() {console.log('Saved new star successfully.');});

    //post request to upload image
    axios.post('https://graph.facebook.com/' + pageID + '/photos', {
        url: imageURL,
        access_token: accessToken
    })
    .then(function (response) {
        console.log('Post created: ' + response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports = {
    awareStar: awareStar,
    curveStar: curveStar,
    lineStar: lineStar,
    post: post
};
