

/** Codes below are to test how Grid Spatial Data Structure works */
const NUM_CELLS_X = 20;
const NUM_CELLS_Y = 10
const CELL_SIZE = 40;

/**
 *
 * Canvas Dimension
 * XX -> 20 * 40 = 800
 * YY -> 10 * 30 = 400
 */


class Grid {

	constructor(){

		this.cells = [];
		for(let y = 0;y < NUM_CELLS_Y; y++){
			this.cells[y] = [];
			for(let x = 0; x < NUM_CELLS_X;x++){
				this.cells[y][x] = null;
			}
		}
	}


	add(obstacle){
		const gridPosX = Math.floor(obstacle.x / CELL_SIZE); 
		const gridPosY = Math.floor(obstacle.y / CELL_SIZE);
		this.cells[gridPosX][gridPosY] = obstacle;	
	}

}
































/**
 * End of experimental code
 */

const canvas = document.getElementById("_canvas");
const ctx = canvas.getContext("2d");


// canvas dimensions
const cnvs_width = canvas.width;
const cnvs_height = canvas.height;



let btnPressed = false;
const ARROW_DWN_KY = 40;
const ARROW_UP_KY = 38;
const ARROW_LFT_KY = 37;
const ARROW_RT_KY = 39;

let cur_btn_ky = -1;



window.addEventListener("keydown", (e) => {
		e.preventDefault();
		cur_btn_ky = e.keyCode;
	/*	if(btnPressed){
		cur_btn_key = e.keyCode;
		console.log(e.keyCode);

	} else{
		btnPressed = true;

	}*/

});


addEventListener("keyup", (e) => {
	cur_btn_ky = -1;

})



/** Obstacle class
 */

const grid = new Grid()

class Obstacle{
	constructor(cnvs_ctx, x, y){
		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;
		
		this.img = new Image();

		this.grid = grid;


		this.prevObstacle = null;
		this.nextObstacle = null;
		this.grid.add(this);


		// testing purpose
		this.box = new Box(cnvs_ctx, x, y, 0, 0,"",false,"red");
		
	}


	setImg(src){
		this.img.src = src;

	}

	getHeight(){
		return this.img.height;

	}

	getWidth(){
		return this.img.width;
	}

	draw(){
		this.cnvs_ctx.drawImage(this.img, this.x, this.y);
		

		// testing purpose
		this.box.setPosition(this.x, this.y);
		this.box.setStrokeSize(3);
		this.box.setDimension(this.img.width, this.img.height);
		this.box.draw();
		

	}

}



class Tree extends Obstacle{
	constructor(cnvs_ctx, x, y){
		super(cnvs_ctx, x, y);
		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;

		this.src = "./res/tree/tree.png";
		super.setImg(this.src);

	}


}

class Villager extends Obstacle{
	constructor(cnvs_ctx, x, y) {
		super(cnvs_ctx, x, y);

		this.src = "./res/villager/dw2.png";
		super.setImg(this.src);
		this.count = 1;
		this.currPos = "dw"
		this.changeRate = 1;


		

		this.dx = 0;
		this.dy = 1;
		


		this.walkingSpeed = 5;

	}

	buildSpritePath(direction, n){
		return `./res/villager/${direction}${n}.png`
	
	}



	update(){
		if(this.count + this.changeRate > 3
			|| this.count + this.changeRate < 1){
			this.changeRate *= -1;

		}

		this.count += this.changeRate;


		this.src = this.buildSpritePath(this.currPos, this.count);
		super.setImg(this.src);

	}


	moveDown(){
		this.dy = 1 * this.walkingSpeed;
		this.y += this.dy;

		// boundary down
		if(this.y + super.getHeight() > cnvs_height){
			this.y = cnvs_height - super.getHeight();

		}
		this.currPos = "dw";
		this.update();


	}

	moveUp(){
		this.dy = -1 * this.walkingSpeed;
		this.y += this.dy;

		// boundary up
		if(this.y < 0){
			this.y = 0;
		}

		this.currPos = "uw";
		this.update();
	}

	moveLeft(){
		this.dx = -1 * this.walkingSpeed;
		this.x += this.dx;

		// boundary left
		if(this.x < 0) {
			this.x = 0;
		}
		this.currPos = "lw";
		this.update();

	}

	moveRight(collision){
		this.dx = 1 * this.walkingSpeed;
		this.x += this.dx;

		if(collision){
			this.x -= thix.dx;
		}
		
		// boundery right
		if(this.x + super.getWidth() > cnvs_width){
		
			this.x = cnvs_width - super.getWidth();
		}

		this.currPos = "rw";
		this.update();

	}






	// obstacle tree
	/*
	isObstacle(tree){

		let collision = this.y <= tree.y + tree.height
				&& this.y + this.height >= tree.y
				&& this.x + this.width >= tree.x
				&& this.x <= tree.x + tree.width;

		return collision;
	}
*/









}



class Box{
	constructor(cnvs_ctx, x, y, w, h, color="green", fill=true, stroke="green"){
		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.c = color;
		this.f = fill;
		this.s = stroke;
		this.lw = 1;

		// change rate
		this.dx = 1;
		this.dy = 0;//0.1;

	}
	
	setDimension(w, h){
		this.w = w;
		this.h = h;
	}


	setPosition(x, y){
		this.x = x;
		this.y = y;

	}

	setStrokeSize(lw){
		this.lw = lw;
	}

	draw(){
		if(this.f){
			this.cnvs_ctx.fillStyle = this.c;
			this.cnvs_ctx.fillRect(this.x, this.y, this.w, this.h);
		}else{
			this.cnvs_ctx.strokeStyle = this.s;
			this.cnvs_ctx.lineWidth = this.lw;
			this.cnvs_ctx.strokeRect(this.x, this.y, this.w, this.h);
		}
	}

	update() {
		this.x = this.x + this.dx;
		
		if (this.x + this.w > cnvs_width || 
			this.x < 0){
			this.dx *= -1;
		
		}


		this.y = this.y + this.dy;

		this.draw();

	}



}




function init() {
	console.log(grid);
	window.requestAnimationFrame(draw);

}
let box = new Box(ctx, 0, 100, 100, 100, "red");
let villager = new Villager(ctx, 10, 10);

let ground = new Box(ctx, 0, 0, cnvs_width, cnvs_height, "lightgreen");

// generate tree randomly -- TODO LATER
let trees = [
	new Tree(ctx, 100, 0)
	,new Tree(ctx, 100,5)
	,new Tree(ctx, 56, 24)

	,new Tree(ctx, 156,224)
	,new Tree(ctx, 356, 224)
	,new Tree(ctx, 256, 24)
	,new Tree(ctx, 256, 124)
	,new Tree(ctx, 156, 124)


]


/*
const NUM_CELLS_X = 20;
const NUM_CELLS_Y = 10
const CELL_SIZE = 40;
*/



const gridBorders = new Array(NUM_CELLS_X*NUM_CELLS_Y);
let counter = 0;

for(let y = 0; y < NUM_CELLS_Y;y++){
for(let x =0; x<NUM_CELLS_X;x++){
	gridBorders[counter] = new Box(ctx, x*CELL_SIZE,y*CELL_SIZE,CELL_SIZE, CELL_SIZE,"",false,"black");
	counter++;
}
}


let obstacles = [...trees, villager];

console.log(grid);


// TODO	-- Collision detection
// TODO	-- redraw villager when villager is behind an obstacle

let lastUpdate = 0;

function draw(time){
	// clear screen
	ctx.clearRect(0, 0, cnvs_width,cnvs_height);

	// draw
	// drawRect(0, 0, 100, 10, "blue");

//	box.draw();
	ground.draw();

	

	obstacles.forEach(o => o.draw());


	gridBorders.forEach(gb => gb.draw());

	//box.update();
	
	if(time - lastUpdate > 20) {
		//villager.update();
		

		let collision = false;
/*
		for(let t of trees
		{
			if(villager.isObstacle(t)){

			}
		}
*/
		if(cur_btn_ky == ARROW_DWN_KY){
			villager.moveDown();

		} else if (cur_btn_ky == ARROW_UP_KY){
			villager.moveUp();
		} else if(cur_btn_ky == ARROW_LFT_KY){

			villager.moveLeft();
		} else if(cur_btn_ky == ARROW_RT_KY){
			
			
			villager.moveRight();
		}
		lastUpdate = time;

	}



	window.requestAnimationFrame(draw);
}




init();




