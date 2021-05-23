import { MinHeap, Node } from "./minHeap.js";

const APPROX_LINE_SPACING = 30; //target distance between gridlines (pixels)
const WALLS = 1
const START = 2
const END = 3

let lineSpacing;    // actual distance between gridlines (pixels)
let numRows;        // number of rows on the grid
let numCols;        // number of columns on the grid
let gridComponents; // map for grid items such as walls and start/end
let isErasing;      // eraser boolean toggle

document.getElementById("clear-button").onclick = init;
document.getElementById("erase-button").onclick = () => {isErasing = !isErasing;}

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
  gridComponents.set(START, [floor(numCols / 10), floor(numRows / 2)])
  gridComponents.set(END, [floor(numCols * 0.9), floor(numRows / 2)])
  gridComponents.set(WALLS, new Set())

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