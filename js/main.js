import { init, switchEraser, A_Star, reset, setSlowDown, changeDemo, isDijkstra, isErasing } from "./sketch.js";

document.getElementById("clear-button").onclick = clearButton;
document.getElementById("erase-button").onclick = eraseButton;
document.getElementById("start-button").onclick = startButton;
document.getElementById('speed-slider').oninput = speedSlider;
document.getElementById('dijkstra').onclick = switchToDij;
document.getElementById('a-star').onclick = switchToAStar;

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
        button.disabled = true;
        setTimeout(() => button.disabled = false, 300)
        reset();
    }
    
}

function clearButton(){
    reset(); 
    init();
    document.getElementById("start-button").textContent = "Start";
    document.getElementById('speed-slider').value = 100;

}

function speedSlider(){
    let val = document.getElementById('speed-slider').value;
    setSlowDown(200 - val);
}

function switchToDij(){
    let dij = document.getElementById('dijkstra');
    let a_star = document.getElementById('a-star');
    if(isDijkstra){
        return;
    } else {
        dij.classList.add('active');
        a_star.classList.remove('active');
        changeDemo();
    }
}

function switchToAStar(){
    let dij = document.getElementById('dijkstra');
    let a_star = document.getElementById('a-star');
    if(!isDijkstra){
        return;
    } else {
        a_star.classList.add('active');
        dij.classList.remove('active');
        changeDemo();
    }
}