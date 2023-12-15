const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const MAX_ASSETS = 5;
let loadedAssets = 0;
let assets = {}
let started = false;
let allowedToStart = false;

let gameObjects = [];

let state = "gameplay";

function loadAsset(assetName, assetType)
{
    if (assetType == "sprite")
    {
        var image = new Image();

        //Now, set .onload with function(s) that require a loaded image, before setting .src
        image.onload = function() {
            assets[assetName] = this;
            loadedAssets++;
        }

        //Finally, start the loading process
        image.src = 'images/game/'.concat(assetName, ".png");
        return;
    }

    if (assetType == "audio")
    {
        var audio = new Audio('images/game/'.concat(assetName, ".wav"));

        assets[assetName] = audio;
        loadedAssets++;
        return;
    }
}

window.onload = function() {
    loadAsset("logo", "sprite");
    loadAsset("bg", "sprite");
    loadAsset("bgPage", "sprite");

    loadAsset("rain", "audio");
    loadAsset("note", "audio");
}

let mouseX = 0;
let mouseY = 0;

let mX = 256;
let mY = 256;

function getMousePos(canvas) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: mouseX - rect.left,
    y: mouseY - rect.top
  };
}

function init()
{
    assets.rain.loop = true;
    assets.rain.play();

    const newRect = new Logo(256, 256, 336, 102, "Logo", assets["logo"], assets["note"]);
    gameObjects.push(newRect);

    document.body.backgroundImage = assets.bgPage;
}

function update()
{
    if (!allowedToStart)
    {
        return;
    }

    gameObjects.forEach(obj => {
        obj.update();
    });
}

function draw()
{
    ctx.drawImage(assets.bg, 0, 0);

    gameObjects.forEach(element => {
        element.draw(ctx);
    });
}

function mouseMoved(e)
{
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function startGame()
{
    allowedToStart = true;
}

function gameLoop()
{
    if (loadedAssets < MAX_ASSETS)
    {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        return;
    }

    if (!allowedToStart)
    {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Tap to start!", 256, 256);
        return;
    }

    if (!started)
    {
        started = true;
        init();
    }

    update();

    ctx.clearRect(0, 0, 512, 512);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 512, 512);
    draw();
}

var interval = setInterval(gameLoop, 20);