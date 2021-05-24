import { MinHeap, Node } from "./minHeap.js";

const APPROX_LINE_SPACING = 20; //target distance between gridlines (pixels)
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

document.getElementById("clear-button").onclick = init;
document.getElementById("erase-button").onclick = () => {isErasing = !isErasing;}
document.getElementById("start-button").onclick = () => {A_Star();}

window.setup = function () {
  frameRate(30);
    init();
}

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
}

window.draw = function() {
  background(255);
  drawGrid();
}

function drawGrid(){

  for(let i = 0; i < numCols + 1; i++){
    line(i * lineSpacing, 0, i*lineSpacing, numRows * lineSpacing);
  }

  for(let i = 0; i < numRows + 1; i++){
    line(0, i * lineSpacing, numCols * lineSpacing, i * lineSpacing);
  }

  const wallCells = gridComponents.get(WALLS);
  fill(40)
  for(let cell of wallCells){
    const [cellX, cellY] = cell.split(",");
    square(cellX * lineSpacing, cellY * lineSpacing, lineSpacing);
  }

  const edgeCells = gridComponents.get(EDGE);
  fill("#f98404")
  for(let cell of edgeCells){
    const [cellX, cellY] = cell.split(",");
    square(cellX * lineSpacing, cellY * lineSpacing, lineSpacing);
  }

  const exploredCells = gridComponents.get(EXPLORED);
  fill("#b6c9f0")
  for(let cell of exploredCells){
    const [cellX, cellY] = cell.split(",");
    square(cellX * lineSpacing, cellY * lineSpacing, lineSpacing);
  }

  const pathCells = gridComponents.get(PATH);
  fill("#867ae9")
  for(let cell of pathCells){
    const [cellX, cellY] = cell.split(",");
    square(cellX * lineSpacing, cellY * lineSpacing, lineSpacing);
  }

  const [startX, startY] = gridComponents.get(START);
  fill('#9fe6a0');
  square(startX * lineSpacing, startY * lineSpacing, lineSpacing);

  const [endX, endY] = gridComponents.get(END);
  fill('#f55c47');
  square(endX * lineSpacing, endY * lineSpacing, lineSpacing);
  
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

window.mouseDragged = function(){
  mouseDraw();
}

window.mouseClicked = function (){
  mouseDraw();
}

// -----------
// --- A* ----
// -----------


async function reconstructPath(cameFrom, current){
  let total_path = [current];

  while (cameFrom.has(current)){
      current = cameFrom.get(current);
      total_path.push(current);
      gridComponents.get(PATH).add(current);
      await sleep(100)
  }
  return total_path.reverse();
}

// A* finds a EDGE from start to goal.
async function A_Star(){

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
  // how short a EDGE from start to finish can be if it goes through n.
  let fScore = new Map();
  fScore.set(`${startX},${startY}`, distanceStartToGoal);

  while (!openSet.isEmpty()) {

    await sleep(100);

    let current = openSet.extractMin().value; 
    gridComponents.get(EDGE).delete(current);
    gridComponents.get(EXPLORED).add(current);
    const [currX, currY] = current.split(",");
    
    if (current === `${endX},${endY}`){
        return reconstructPath(cameFrom, current);
    }

    let neighbours = getNeighbours(currX, currY);
    for (let neighbour of neighbours){
      const [neighbourX, neighbourY] = neighbour.split(",");
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      let edgeWeight = 1;
      let tentative_gScore = getWithDefault(gScore, current, Infinity) + edgeWeight;
      if (tentative_gScore < getWithDefault(gScore, neighbour, Infinity)){
        // This EDGE to neighbor is better than any previous one. Record it!
        cameFrom.set(neighbour, current);
        gScore.set(neighbour, tentative_gScore);

        let h = manhattanDistance(neighbourX, neighbourY, endX, endY);

        fScore.set(neighbour, getWithDefault(gScore, neighbour, Infinity) + h)
        let node = new Node(fScore.get(neighbour), neighbour);
        if (!openSet.has(node)){
            openSet.insert(node);
            gridComponents.get(EDGE).add(neighbour);
        }
      }
    }
  }
  // Open set is empty but goal was never reached
  return [];
}

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