"use strict";

// Variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorInput = document.getElementById("color-input");
const sizeInput = document.getElementById("size-input");
let color = "black";
let size = 20;
let drawing = false;
const changesArray = [];
let changesPosition = -1;
const changesArrayLimit = 15;

// Event Listeners
// Mobile
canvas.addEventListener("touchstart", drawStart);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", drawEnd);
// Desktop
canvas.addEventListener("mousedown", drawStart);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", drawEnd);
canvas.addEventListener("mouseout", drawEnd);

// Functions
function drawStart(e) {
  drawing = true;
  color = colorInput.value;
  ctx.strokeStyle = color;
  size = sizeInput.value;
  ctx.lineWidth = size;
  ctx.beginPath();
  ctx.moveTo(e.x - canvas.offsetLeft, e.y - canvas.offsetTop);
  draw(e);
}

function draw(e) {
  if (drawing) {
    ctx.lineTo(e.x - canvas.offsetLeft, e.y - canvas.offsetTop);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }
}

function drawEnd(e) {
  drawing = false;
  ctx.closePath();
  if (e.type != "mouseout") {
    if (changesPosition != changesArray.length - 1) {
      changesArray.splice(changesPosition + 1);
    }
    changesArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (changesArray.length >= changesArrayLimit) {
      changesArray.splice(0, 1);
    } else changesPosition++;
  }
}

function undo() {
  changesPosition--;
  if (changesPosition < 0) {
    clearCanvas();
    changesPosition = -1;
  } else ctx.putImageData(changesArray[changesPosition], 0, 0);
}

function redo() {
  changesPosition++;
  if (changesPosition < changesArray.length) ctx.putImageData(changesArray[changesPosition], 0, 0);
  else changesPosition = changesArray.length - 1;
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Resize Fix
function resizeFix() {
  const canvasRect = canvas.getBoundingClientRect();
  canvas.width = canvasRect.width;
  canvas.height = canvasRect.height;
}
window.addEventListener("resize", resizeFix);
resizeFix();