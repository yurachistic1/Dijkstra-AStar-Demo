import { init, switchEraser, A_Star, reset, setSlowDown, isErasing } from "./sketch.js";

document.getElementById("clear-button").onclick = clearButton;
document.getElementById("erase-button").onclick = eraseButton;
document.getElementById("start-button").onclick = startButton;
document.getElementById('speed-slider').oninput = speedSlider;

function eraseButton(){
    let button = document.getElementById("erase-button");
    if(!isErasing){
        button.style.color = "White";
        button.style.backgroundColor = "#ee582a";
    } else {
        button.style.color = "Black";
        button.style.backgroundColor = "Ivory";
    }

    switchEraser();
}

async function startButton(){
    let button = document.getElementById("start-button");
    if(button.textContent === "Start"){
        button.textContent = "Reset";
        A_Star();
    } else {
        button.textContent = "Start";
        reset();
    }
    
}

function clearButton(){
    reset(); 
    init();
    document.getElementById("start-button").textContent = "Start";
}

function speedSlider(){
    let val = document.getElementById('speed-slider').value;
    setSlowDown(val);
}