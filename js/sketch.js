import { MinHeap, Node } from "./minHeap.js";

const APPROX_LINE_SPACING = 20; //target distance between gridlines (pixels)

// Some handy names for map keys
const WALLS = 1;
const START = 2;
const END = 3;
const EDGE = 4;
const EXPLORED = 5;
const PATH = 6;

let lineSpacing;    // actual distance between gridlines (pixels)
let numRows;        // number of rows on the grid
let numCols;        // number of columns on the grid
let gridComponents; // map for grid items such as walls and start/end
let isErasing;      // eraser boolean toggle
let isRunning;      // boolean to indicate if visualisation is in progress
let movingStart;    // boolean to indicate start is being moved
let movingEnd       // boolean to indicate end is being moved
let slowDown;       // number of milliseconds A* is slowed downed by in each cycle

// setters

function switchEraser(){
  isErasing = !isErasing;
}

function setSlowDown(x){
  slowDown = x;
}

// p5js functions

window.setup = function () {
  frameRate(30);
    init();
}

window.draw = function() {
  background(255);
  drawGrid();
}

window.mousePressed = function(){
  if(isRunning){return;}
  let col = floor(mouseX / lineSpacing);
  let row = floor(mouseY / lineSpacing);

  const [startX, startY] = gridComponents.get(START);
  const [endX, endY] = gridComponents.get(END);
  
  if (col == startX && row == startY){movingStart = true;}
  if (col == endX && row == endY){movingEnd = true;}
}

window.mouseReleased = function(){
  movingStart = false;
  movingEnd = false;
}

window.mouseDragged = function(){
  if(isRunning){return;}
  if(movingStart){
    moveStart();
  } else if (movingEnd){
    moveEnd();
  } else {
    mouseDraw();
  }
}

window.mouseClicked = function (){
  if(isRunning){return;}
  mouseDraw();
}

// setup and draw functions

function init(){
  let gridWidth = windowWidth * 0.8;
  let gridHeight = windowHeight * 0.7;

  lineSpacing = 
    APPROX_LINE_SPACING 
    + ((gridWidth % APPROX_LINE_SPACING) / (floor(gridWidth / APPROX_LINE_SPACING)));

  let canvas = createCanvas(gridWidth, gridHeight);
  canvas.parent('grid-holder')

  numRows = floor(gridHeight / lineSpacing);
  numCols = round(gridWidth / lineSpacing);
  gridComponents = new Map();
  gridComponents.set(START, [floor(numCols / 10), floor(numRows / 2)]);
  gridComponents.set(END, [floor(numCols * 0.9), floor(numRows / 2)]);
  gridComponents.set(WALLS, new Set());
  gridComponents.set(EDGE, new Set());
  gridComponents.set(EXPLORED, new Set());
  gridComponents.set(PATH, new Set())

  isErasing = false;
  isRunning = false;

  slowDown = 100;
}

function drawGrid(){

  stroke(100);


  // gridlines
  for(let i = 0; i < numCols + 1; i++){
    line(i * lineSpacing, 0, i*lineSpacing, numRows * lineSpacing);
  }

  for(let i = 0; i < numRows + 1; i++){
    line(0, i * lineSpacing, numCols * lineSpacing, i * lineSpacing);
  }

  // all the different types of cells
  const edgeCells = gridComponents.get(EDGE);
  drawCells(edgeCells, "#f98404");

  const exploredCells = gridComponents.get(EXPLORED);
  drawCells(exploredCells, "#b6c9f0");
  

  const pathCells = gridComponents.get(PATH);
  drawCells(pathCells, "#867ae9");

  const wallCells = gridComponents.get(WALLS);
  drawCells(wallCells, "#364547");

  const [startX, startY] = gridComponents.get(START);
  fill('#9fe6a0');
  square(startX * lineSpacing, startY * lineSpacing, lineSpacing);

  const [endX, endY] = gridComponents.get(END);
  fill('#f55c47');
  square(endX * lineSpacing, endY * lineSpacing, lineSpacing);
  
}

function drawCells(cells, colour){
  fill(colour);
  for(let cell of cells){
    const [cellX, cellY] = cell.split(",");
    square(cellX * lineSpacing, cellY * lineSpacing, lineSpacing);
  }

}

async function reset(){

  isRunning = false;
  await sleep(300);

  gridComponents.set(EDGE, new Set());
  gridComponents.set(EXPLORED, new Set());
  gridComponents.set(PATH, new Set())
}

function mouseDraw(){

  let col = floor(mouseX / lineSpacing);
  let row = floor(mouseY / lineSpacing);

  const [startX, startY] = gridComponents.get(START);
  const [endX, endY] = gridComponents.get(END);
  
  if (col == startX && row == startY){return;}
  if (col == endX && row == endY){return;}

  if (col < numCols && col >= 0 && row < numRows && row >= 0){
    let walls = gridComponents.get(WALLS);
    if(isErasing){
      walls.delete(`${col},${row}`);
    } else {
      walls.add(`${col},${row}`)
    }

    gridComponents.set(WALLS, walls)
  }
}

function moveStart(){
  let col = floor(mouseX / lineSpacing);
  let row = floor(mouseY / lineSpacing);

  gridComponents.set(START, [col, row])
}

function moveEnd(){
  let col = floor(mouseX / lineSpacing);
  let row = floor(mouseY / lineSpacing);

  gridComponents.set(END, [col, row])
}

// --- A* ----

// Code adopted from wikipedia A* pseudocode

async function reconstructPath(cameFrom, current){

  while (cameFrom.has(current)){
      if(!isRunning) {return;}
      current = cameFrom.get(current);
      gridComponents.get(PATH).add(current);
      await sleep(slowDown);
  }
  isRunning = false;
}

// A* finds a path from start to goal.
async function A_Star(){

  isRunning = true;

  const [startX, startY] = gridComponents.get(START);
  const [endX, endY] = gridComponents.get(END);
  const distanceStartToGoal = manhattanDistance(startX, startY, endX, endY);

  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  let openSet = new MinHeap();
  openSet.insert(new Node(distanceStartToGoal, `${startX},${startY}`));

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest EDGE from start
  // to n currently known.
  let cameFrom = new Map();

  // For node n, gScore[n] is the cost of the cheapest EDGE from start to n currently known.
  let gScore = new Map();
  gScore.set(`${startX},${startY}`, 0);

  // For node n, fScore[n] := gScore[n] + heuristic(n). fScore[n] represents our current best guess as to
  // how short a path from start to finish can be if it goes through n.
  let fScore = new Map();
  fScore.set(`${startX},${startY}`, distanceStartToGoal);

  while (!openSet.isEmpty()) {

    //abort if running was interrupted via reset or clear buttons.
    if (!isRunning){return;}

    await sleep(slowDown);

    let current = openSet.extractMin().value; 
    gridComponents.get(EDGE).delete(current);
    gridComponents.get(EXPLORED).add(current);
    const [currX, currY] = current.split(",");
    
    // goal reached
    if (current === `${endX},${endY}`){
        return reconstructPath(cameFrom, current);
    }

    let neighbours = getNeighbours(currX, currY);
    for (let neighbour of neighbours){
      const [neighbourX, neighbourY] = neighbour.split(",");
      // tentative_gScore is the distance from start to the neighbor through current
      let edgeWeight = 1;
      let tentative_gScore = getWithDefault(gScore, current, Infinity) + edgeWeight;
      if (tentative_gScore < getWithDefault(gScore, neighbour, Infinity)){
        // This path to neighbor is better than any previous one. Record it!
        cameFrom.set(neighbour, current);
        gScore.set(neighbour, tentative_gScore);

        let heuristic = manhattanDistance(neighbourX, neighbourY, endX, endY);

        fScore.set(neighbour, getWithDefault(gScore, neighbour, Infinity) + heuristic)
        let node = new Node(fScore.get(neighbour), neighbour);
        if (!openSet.has(node)){
            openSet.insert(node);
            gridComponents.get(EDGE).add(neighbour);
        }
      }
    }
  }
  // Open set is empty but goal was never reached
  isRunning = false;
  return [];
}

// A* helper functions 

function manhattanDistance(x1, y1, x2, y2){
  return abs(x1 - x2) + abs(y1 - y2);
}

function getNeighbours(x, y){
  let neighbours = [
    [+x + 1, y],
    [+x - 1, y],
    [x, +y + 1],
    [x, +y - 1]
  ]
  .filter(([x1,]) => x1 >= 0 && x1 < numCols)
  .filter(([,y1]) => y1 >= 0 && y1 < numRows)
  .map(([x1, y1]) => {return `${x1},${y1}`;});

  return difference(new Set(neighbours), gridComponents.get(WALLS));
}

// utility functions

function difference(setA, setB) {
  let _difference = new Set(setA)
  for (let elem of setA) {
    if(setB.has(elem)){
      _difference.delete(elem)
    }
      
  }
  return _difference
}

function getWithDefault(map, key, def){
  if(!map.has(key)){
    return def
  } else {
    return map.get(key)
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {init, switchEraser, A_Star, reset, setSlowDown, isErasing}