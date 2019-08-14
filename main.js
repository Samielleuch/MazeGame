//Canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//initial dimention
var initialCordonne;
var cols, rows;
var widthofCell = 100 ;
let space= widthofCell/5;
var grid;
var gradindice = 560;
var startPosition = [0, 0];
var endPosition = [7, 7];
var player;
var indice1 = 0.3;
var indice2 = 0.6;
var indice3 = 1;
//maze walls width
var line = 3.15;
var goal;
let goalSize = widthofCell*0.7;
var started = false;
var newUrl = "www.google.com";
const Difficulty = (diffuclty) => {
    switch (diffuclty) {
        case 100: {
            startPosition = [0, 0];
            endPosition = [7, 7];
            break;
        }
        case 80 : {
            startPosition = [0, 0];
            endPosition = [9, 9];
            break;
        }
        case 50 : {
            startPosition = [0, 0];
            endPosition = [15, 15];
            break;
        }
        case 40 : {
            startPosition = [0, 0];
            endPosition = [19, 19];
            break;
        }

    }

};

function init() {

    initialCordonne = 800;
    space = widthofCell/5;
    goalSize = widthofCell*0.7;
    cols = Math.floor(initialCordonne / widthofCell);
    rows = Math.floor(initialCordonne / widthofCell);
    grid = new Grid(rows, cols);
    grid.makeMap();
//where we start the maze
    grid.currentcell = grid.Map[0][0];
    grid.genMap();
    player = new Player(startPosition[0], startPosition[1]);
    goal = new Goal(endPosition[0],endPosition[0]);

}

function Cell(x, y) {
    this.x = x;
    this.y = y;

    this.right = true;
    this.left = true;
    this.top = true;
    this.bottom = true;

    this.visited = false;

    this.drawCell = function () {
        //Draw Top line
        if (this.top)
            drawNewLine(this.x, this.y, this.x + widthofCell , this.y);
        //draw Right Line
        if (this.right)
            drawNewLine(this.x + widthofCell , this.y, this.x + widthofCell , this.y + widthofCell );
        //draw Left Line
        if (this.left)
            drawNewLine(this.x, this.y, this.x, this.y + widthofCell);
        //draw BottomLine
        if (this.bottom)
            drawNewLine(this.x, this.y + widthofCell, this.x + widthofCell, this.y + widthofCell);


    };

}

function Grid() {
    this.Map = Array.from(Array(cols), () => new Array(rows));
    this.makeMap = function () {
        //create the Cells
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.Map[i][j] = new Cell(j * widthofCell, i * widthofCell,);
            }
        }
    };
    this.stack = [];
    this.numberVisited = 1;
    this.currentcell = this.Map[0][0];

    this.drawMap = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.Map[i][j].drawCell();
            }
        }
    };
    this.genMap = function () {
        while (this.numberVisited < (cols * rows)) {

            this.currentcell.visited = true;

            let nextCell = this.checkNeighborCells(this.currentcell.x, this.currentcell.y);
            if (nextCell !== undefined) {
                nextCell.visited = true;
                this.numberVisited++;
                //the backtracking aspect it knows the places where it already went
                grid.stack.push(this.currentcell);

                this.currentcell = nextCell;
            } else {
                if (this.stack.length > 0) {
                    this.currentcell = this.stack.pop();
                }
            }



        }
        console.log("Maze Generated!");
    };

    this.checkNeighborCells = (x, y) => {
        let neighbors = [];

        if ((y / widthofCell - 1 >= 0) && (!this.Map[y / widthofCell - 1][x / widthofCell].visited)) {
            neighbors.push([this.Map[y / widthofCell - 1][x / widthofCell], "top"]);
        }

        if ((y / widthofCell + 1 < cols) && (!this.Map[y / widthofCell + 1][x / widthofCell].visited)) {
            neighbors.push([this.Map[y / widthofCell + 1][x / widthofCell], "bottom"]);
        }
        if ((x / widthofCell - 1 >= 0) && (!this.Map[y / widthofCell][x / widthofCell - 1].visited)) {
            neighbors.push([this.Map[y / widthofCell][x / widthofCell - 1], "left"]);
        }
        if ((x / widthofCell + 1 < rows) && (!this.Map[y / widthofCell][x / widthofCell + 1].visited)) {
            neighbors.push([this.Map[y / widthofCell][x / widthofCell + 1], "right"]);
        }

        //console.log(neighbors);

        if (neighbors.length > 0) {
            let randomneighbor = Math.floor(Math.random() * neighbors.length);
            let currentDirection = neighbors[randomneighbor][1];

            switch (currentDirection) {
                case "top" : {
                    this.currentcell.top = false;
                    neighbors[randomneighbor][0].bottom = false;

                    break;
                }
                case "right" : {
                    this.currentcell.right = false;
                    neighbors[randomneighbor][0].left = false;
                    break;
                }
                case "left" : {
                    this.currentcell.left = false;
                    neighbors[randomneighbor][0].right = false;
                    break;
                }
                case "bottom" : {
                    this.currentcell.bottom = false;
                    neighbors[randomneighbor][0].top = false;
                    break;
                }

            }

            return (neighbors[randomneighbor][0]);
        } else {
            return (undefined);
        }
    };
}


function Player(x, y) {
    this.x = x * widthofCell + space;
    this.y = y * widthofCell + space;
    this.i = 0;
    this.j = 0;
    //the speed
    this.dx = 7;
    this.dy = 7;
    this.animating = false;
    this.destination = [this.x, this.y];
    this.trail = [];

    this.moveUp = function () {
        if (!grid.Map[this.j][this.i].top  && !this.animating){
            this.destination = [grid.Map[this.j - 1][this.i].x + space, grid.Map[this.j - 1][this.i].y + space];

        }
    };
    this.moveLeft = function () {
        if (!grid.Map[this.j][this.i].left  && !this.animating) {
            this.destination = [grid.Map[this.j][this.i - 1].x + space, grid.Map[this.j][this.i - 1].y + space];
        }

    };
    this.moveDown = function () {
        if (!grid.Map[this.j][this.i].bottom && !this.animating) {
            this.destination = [grid.Map[this.j + 1][this.i].x + space, grid.Map[this.j + 1][this.i].y + space];
        }

    };
    this.moveRight = function () {
        {
            if (!grid.Map[this.j][this.i].right  && !this.animating) {
                this.destination = [grid.Map[this.j][this.i + 1].x + space, grid.Map[this.j][this.i + 1].y + space];
            }
        }

    };
    this.move = function () {


        // if (this.trail.length < 10) {
        //     this.trail.push(new Particle(this.x, this.y));
        // } else {
        //     this.trail.shift();
        // }


        if (Key.isDown(Key.UP)) this.moveUp();
        if (Key.isDown(Key.LEFT)) this.moveLeft();
        if (Key.isDown(Key.DOWN)) this.moveDown();
        if (Key.isDown(Key.RIGHT)) this.moveRight();

    };
    this.draw = function () {
    //gradient animations
        indice1 += 0.01;
        indice2 += 0.01;
        indice3 += 0.01;

        const gradient = ctx.createLinearGradient(convertCordonne(this.x), convertCordonne(this.y)
            , convertCordonne(this.x + widthofCell), convertCordonne(this.y + widthofCell));

        indice1 %=  1;
        indice2 %=  1;
        indice3 %=  1;

        gradient.addColorStop(indice1, "#0D1440");
        gradient.addColorStop(indice2, "#1438A6");
        gradient.addColorStop(indice2, "#BF1736");

// Fill with gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(convertCordonne(this.x), convertCordonne(this.y), convertCordonne(widthofCell * 0.5), convertCordonne(widthofCell * 0.5));
       ctx.rect(convertCordonne(this.x), convertCordonne(this.y), convertCordonne(widthofCell * 0.5), convertCordonne(widthofCell * 0.5));
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();

    };
    this.animate = function () {

        //wigle fix :
        let testx = (this.destination[0] - this.x);
        let testy = (this.destination[1] - this.y);
        let wiggleRoom = {
            x: 0,
            y: 0
        };

        if (testx < this.dx) {
            wiggleRoom.x = testx
        }
        if (testy < this.dy) {
            wiggleRoom.y = testy
        }


        if (this.x < (this.destination[0] - wiggleRoom.x)) {
            this.x += this.dx;
            this.animating = true ;
        } else if (this.x > this.destination[0]) {
            this.x -= this.dx;
            this.animating = true ;

        } else if (this.x === (this.destination[0] - wiggleRoom.x)) {
            this.x = this.destination[0];
        }
        if (this.y < (this.destination[1] - wiggleRoom.y)) {
            this.y += this.dy;
            this.animating = true ;

        }
        else if (this.y > this.destination[1]) {
            this.y -= this.dy;
            this.animating = true ;

        } else if (this.y === (this.destination[1] - wiggleRoom.y)) {
            this.y = this.destination[1];
        }

        this.i = Math.floor(this.x / widthofCell);
        this.j = Math.floor(this.y / widthofCell);

        if(this.x === this.destination[0] && this.y === this.destination[1]){
            this.animating = false ;
        }




    };
}

// function Particle(x, y) {
//     this.x = x - 10;
//     this.y = y - 10;
//     this.dx = 3 * Math.random();
//     this.dy = 4 * Math.random();
//     this.initialx = x;
//     this.initialy = y;
//
//     this.draw = () => {
//         ctx.rect(convertCordonne(this.x), convertCordonne(this.y), convertCordonne(widthofCell * 0.3), convertCordonne(widthofCell * 0.3));
//         ctx.strokeStyle = "#770025";
//         ctx.stroke();
//         console.log("hi");
//
//     };
//
//     this.update = () => {
//
//         // this.dx = Math.random();
//         // this.dy = Math.random();
//         this.x += this.dx;
//         this.y += this.dy;
//
//         if (this.x <= this.initialx - 200 || this.x >= this.initialx + widthofCell + 200) {
//             this.dx = -this.dx;
//         }
//         if (this.y <= this.initialy - 200 || this.y >= this.initialy + widthofCell + 200) {
//             this.dy = -this.dy;
//         }
//         console.log("yo?");
//
//     };
//
// }

function Goal (x,y) {
    this.x = x * widthofCell + space;
    this.y = y * widthofCell + space;
    this.img = new Image();
    this.img.src = './img/goal.png';
    this.draw = () => {
        ctx.drawImage(this.img,convertCordonne(this.x),convertCordonne(this.y),convertCordonne(goalSize),convertCordonne(goalSize));

    };

}
//our game logic
function update() {
    player.move();
    player.animate();

    if(player.i === endPosition[0] && player.j === endPosition[1] ) {
       // console.log("you win :D ") ;
        $("canvas").hide();
        $(".Win").show();

        //change page here
        document.location = newUrl;


    }
}

//we Draw Here
function draw() {
    //draw here
    grid.drawMap();
    player.draw();
    goal.draw();

}


function animate() {
    //reset the canvas
    ctx.fillStyle = 'rgba(12, 20, 63, 0.25)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    update();
    draw();
    requestAnimationFrame(animate);
}

//helper Functions
function convertCordonne(x) {
    return ((ctx.canvas.width / initialCordonne) * x);


}

function drawNewLine(xfrom, yfrom, xto, yto) {
    ctx.beginPath();

    const gradient = ctx.createLinearGradient(0, 0, gradindice, gradindice);
    gradient.addColorStop(indice1, "#BF1736");
    gradient.addColorStop(indice2, "#1455D9");
    gradient.addColorStop(indice3, "#1438A6");

// Fill with gradient
    ctx.strokeStyle = gradient;
    ctx.lineWidth = line;
    ctx.moveTo(convertCordonne(xfrom), convertCordonne(yfrom));
    ctx.lineTo(convertCordonne(xto ), convertCordonne(yto));
    ctx.closePath();

    ctx.stroke();

 }

//resize for the first time on load
if (innerHeight < innerWidth) {
    //canvas.style.width  = outerWidth - 100 +"px" ;
    ctx.canvas.width = innerHeight - innerHeight / 100;
    ctx.canvas.height = innerHeight - innerHeight / 80;
    canvas.style.height = ctx.canvas.height + "px";
    canvas.style.width = ctx.canvas.width + "px";
}
else {
    ctx.canvas.width = innerWidth - innerWidth / 100;
    ctx.canvas.height = innerWidth - innerWidth / 80;
    canvas.style.height = ctx.canvas.height + "px";
    canvas.style.width = ctx.canvas.width + "px";
}

// resize on resize
addEventListener('resize', () => {

    if (innerHeight < innerWidth) {
        //canvas.style.width  = outerWidth - 100 +"px" ;
        ctx.canvas.width = innerHeight - innerHeight / 100;
        ctx.canvas.height = innerHeight - innerHeight / 100;
        canvas.style.height = ctx.canvas.height + "px";
        canvas.style.width = ctx.canvas.width + "px";

    } else {
        ctx.canvas.width = innerWidth - innerWidth / 100;
        ctx.canvas.height = innerWidth - innerWidth / 100;
        canvas.style.height = ctx.canvas.height + "px";
        canvas.style.width = ctx.canvas.width + "px";

    }
});


//our Keyboard Input

//helper Object for syc
const Key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function (event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
    }
};
//hookup the object

window.addEventListener('keyup', function (event) {
    Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function (event) {
    Key.onKeydown(event);
}, false);

//call it to start animation loop
$("canvas").hide();
$(".Win").hide();

$(".welcome").show();

$(".start").on("click" ,function () {
    widthofCell = parseInt($("#inputGroupSelect02").val());
    Difficulty(widthofCell);
    $.when(init()).then(animate());
    $(".welcome").hide();
    $("canvas").show();
    console.log("hi");
    started = true;
});

//Swipe functionality
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
 if( started) {
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
            player.moveLeft();
        } else {
            /* right swipe */
            player.moveRight();
        }
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
            player.moveUp();
        } else {
            /* down swipe */
            player.moveDown();
        }
    }
 }
    /* reset values */
    xDown = null;
    yDown = null;
}