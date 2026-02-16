


const isDevMode = true;


const loadGame = (assets, cb) => {
	let loaded = 0;
	
	assets.forEach(img => {
		img.onload = () => {
			loaded = loaded + 1;

			if(loaded == assets.length) cb();

		}

	})

}

const assets = {
	tree: new Image()
	,villager: {


		uw1: new Image()
		,uw2: new Image()
		,uw3: new Image()

		,dw1: new Image()
		,dw2: new Image()
		,dw3: new Image()

		,lw1: new Image()
		,lw2: new Image()
		,lw3: new Image()
			
		,rw1: new Image()
		,rw2: new Image()
		,rw3: new Image()
	}
	,cow: {
		cowstand1: new Image()
		,cowstand2: new Image()
		,cowstand3: new Image()
		,cowstand4: new Image()
		,cowstand5: new Image()

	}
	,resource: {
		gold1: new Image()
		,stone1: new Image()
	}

}

assets.tree.src = "./res/tree/tree.png";

assets.villager.uw1.src = "./res/villager/uw1.png";
assets.villager.uw2.src = "./res/villager/uw2.png";
assets.villager.uw3.src = "./res/villager/uw3.png";

assets.villager.dw1.src = "./res/villager/dw1.png";
assets.villager.dw2.src = "./res/villager/dw2.png";
assets.villager.dw3.src = "./res/villager/dw3.png";


assets.villager.lw1.src = "./res/villager/lw1.png";
assets.villager.lw2.src = "./res/villager/lw2.png";
assets.villager.lw3.src = "./res/villager/lw3.png";

assets.villager.rw1.src = "./res/villager/rw1.png";
assets.villager.rw2.src = "./res/villager/rw2.png";
assets.villager.rw3.src = "./res/villager/rw3.png";


assets.cow.cowstand1.src = "./res/cow/cowstand1.png";
assets.cow.cowstand2.src = "./res/cow/cowstand2.png";
assets.cow.cowstand3.src = "./res/cow/cowstand3.png";
assets.cow.cowstand4.src = "./res/cow/cowstand4.png";
assets.cow.cowstand5.src = "./res/cow/cowstand5.png";



assets.resource.gold1.src = "./res/gold/gold1.png";
assets.resource.stone1.src = "./res/stone/stone1.png";

// constant variables to identify the axis
const HORIZONTAL_R = 0;
const HORIZONTAL_L = 1;
const VERTICAL_U = 2
const VERTICAL_D = 3;
const NO_DIRECTION = -1;



const canvas = document.getElementById("_canvas");
const ctx = canvas.getContext("2d");


// canvas dimensions
const cnvs_width = canvas.width;
const cnvs_height = canvas.height;



/** Codes below are to test how Grid Spatial Data Structure works */


const CELL_SIZE = 40;

const NUM_CELLS_X = cnvs_width / CELL_SIZE; //20;
const NUM_CELLS_Y = cnvs_height / CELL_SIZE;// 10





/**
 *
 * Canvas Dimension
 * XX -> 20 * 40 = 800
 * YY -> 10 * 30 = 400
 */

let  obs = [];
class Grid {

	constructor(){

		this.cells = new Array(NUM_CELLS_Y);
		for(let y = 0;y < NUM_CELLS_Y; y++){
			this.cells[y] = new Array(NUM_CELLS_X);
			for(let x = 0; x < NUM_CELLS_X;x++){
				this.cells[y][x] = [];
			}
		}
	}


	// given canvas cooridnates
	convertToGridCOORD(xPos,yPos){

		
		
		let gridPosX = Math.floor(xPos / CELL_SIZE); 
		let gridPosY = Math.floor(yPos / CELL_SIZE);

		if(gridPosX >= NUM_CELLS_X) gridPosX = NUM_CELLS_X - 1;
		if(gridPosY >= NUM_CELLS_Y) gridPosY = NUM_CELLS_Y - 1;


	
		return [gridPosX, gridPosY];
	}

	remove(obstacle){
		
			let prevOccupiedCells = obstacle.occupiedCells;
			for(let i = 0; i < prevOccupiedCells.length; i++){
				let [_prevGridPosX, _prevGridPosY] = prevOccupiedCells[i];

				let currObst = this.cells[_prevGridPosY][_prevGridPosX];

				let idx = this.cells[_prevGridPosY][_prevGridPosX].indexOf(obstacle);
				this.cells[_prevGridPosY][_prevGridPosX].splice(idx, 1);
			}

	}


	add(obstacle){
		

		const xPos = obstacle.x;
		const yPos = obstacle.y + obstacle.getHeight();
		

		for(let i in obstacle.occupiedCells){
			let [gridPosX, gridPosY] = obstacle.occupiedCells[i];
			
			this.cells[gridPosY][gridPosX].push(obstacle);

		}
		

	}





}




/**
 * End of experimental code
 */


let btnPressed = false;
const ARROW_DWN_KY = 40;
const ARROW_UP_KY = 38;
const ARROW_LFT_KY = 37;
const ARROW_RT_KY = 39;

const C_KY = 67;


let cur_btn_ky = -1;



window.addEventListener("keydown", (e) => {
		e.preventDefault();
		cur_btn_ky = e.keyCode;


});


addEventListener("keyup", (e) => {
	cur_btn_ky = -1;

})



/** Obstacle class
 */

const grid = new Grid()

class Obstacle{
	constructor(cnvs_ctx, x, y, img){
		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;
		
		this.img = img;


		this.grid = grid;
	

		this.prevObstacle = null;
		this.nextObstacle = null;
		

		
		if(this.img.complete){


			// occupied cells in grid
			this.occupiedCells = []
			this.calculateOccupiedCells();
			this.grid.add(this);
		}else{
			this.img.onload = () => {
				
				// occupied cells in grid
				this.occupiedCells = []
				this.calculateOccupiedCells();

				this.grid.add(this);
			}

		}

		//this.grid.add(this);
		// testing purpose
		if(isDevMode){


			this.box = new Box(cnvs_ctx, x, y, 0, 0,"",false,"red");

		}


	}


	setImg(img){
	//	this.img.src = src;

		this.img = img;
	}

	getHeight(){
		return this.img.naturalHeight;

	}

	getWidth(){
		return this.img.naturalWidth;
	}

	draw(){
		/*
		this.cnvs_ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
		this.cnvs_ctx.shadowBlur = 10;
		this.cnvs_ctx.shadowOffsetX = 5;
		this.cnvs_ctx.shadowOffsetY = 5;
		*/
		this.cnvs_ctx.drawImage(this.img, this.x, this.y);
		

		// testing purpose
		if(isDevMode){
			// show border box
			this.box.setPosition(this.x, this.y);
			this.box.setStrokeSize(3);
			this.box.setDimension(this.img.naturalWidth, this.img.naturalHeight);
			this.box.draw();

			// show coordinates
			this.cnvs_ctx.fillStyle = "blue";
			this.cnvs_ctx.font = "16px serif"
			this.cnvs_ctx.fillText(`(${this.x},${this.y})`, this.x-40,this.y);
			
			this.cnvs_ctx.fillText(`(${this.x+this.getWidth()},${this.y})`, this.x+this.getWidth(),this.y);
			
			this.cnvs_ctx.fillText(`(${this.x},${this.y+this.getHeight()})`, this.x-40,this.y+this.getHeight()+20);
			
			this.cnvs_ctx.fillText(`(${this.x+this.getWidth()},${this.y+this.getHeight()})`, this.x+this.getWidth(),this.y+this.getHeight()+20);
			

		}		

	}


	// calculate the occupied cells by this obstacle
	// occupied cells mean # of cells the obstacle occupies
	// from range x to x + width
	// and from range y to y + height
	calculateOccupiedCells(){
		let leftX = Math.floor(this.x / CELL_SIZE);
		let rightX = Math.floor((this.x + this.getWidth()) / CELL_SIZE);
		let topY = Math.floor(this.y / CELL_SIZE);
		let bottomY = Math.floor((this.y + this.getHeight()) / CELL_SIZE);
		
		
		if(rightX >= NUM_CELLS_X) rightX = NUM_CELLS_X - 1;
		if(bottomY >= NUM_CELLS_Y) bottomY = NUM_CELLS_Y - 1;



		this.occupiedCells = [];
		for(let y = topY; y <= bottomY; y++){
			for(let x = leftX; x <= rightX; x++){
				this.occupiedCells.push([x,y]);
			}
		}


	}


	calculateOccupiedCellsGiven(x, y){
		let leftX = Math.floor(x / CELL_SIZE);
		let rightX = Math.floor((x + this.getWidth()) / CELL_SIZE);
		let topY = Math.floor(y / CELL_SIZE);
		let bottomY = Math.floor((y + this.getHeight()) / CELL_SIZE);
		
		if(rightX >= NUM_CELLS_X) rightX = NUM_CELLS_X - 1;
		if(bottomY >= NUM_CELLS_Y) bottomY = NUM_CELLS_Y - 1;
		
		let occupiedCells = [];
		for(let y = topY; y <= bottomY; y++){
			for(let x = leftX; x <= rightX; x++){
				occupiedCells.push([x,y]);
			}
		}

		return occupiedCells;
	}

	findNearByObstacles(){
		
		let obstacles = [];
	

		for(let i = 0; i < this.occupiedCells.length; i++){
			let [x,y] = this.occupiedCells[i];

			let obs = this.grid.cells[y][x].filter(o => o !== this);
			obstacles = [...obstacles, ...obs];


		}


		return new Set(obstacles);

	}

}



class Movable extends Obstacle {

	constructor(cnvs_ctx, x, y, sprite){
		super(cnvs_ctx, x, y, sprite);

	
		this.count = 1;
		this.currPos = "dw"
		this.changeRate = 1;


		

		this.dx = 0;
		this.dy = 1;
		


		this.walkingSpeed = 5;

		this.direction = NO_DIRECTION;


	}






	update(){
		if(this.count + this.changeRate > 3
			|| this.count + this.changeRate < 1){
			this.changeRate *= -1;

		}

		this.count += this.changeRate;



		super.setImg(assets.villager[`${this.currPos}${this.count}`]);
	


		// SORT obstacles
		//
		obs.sort((a,b) => {
			
			const [aGridPosX, aGridPosY] = this.grid.convertToGridCOORD(a.x, a.y + a.getHeight());
			const [bGridPosX, bGridPosY] = this.grid.convertToGridCOORD(b.x, b.y + b.getHeight());
			
			return (a.getHeight() + a.y) - (b.getHeight()+b.y);

			
		})
	}

	


	moveDown(){

		this.direction = VERTICAL_D;

		//if(this.isCollided()) this.y = this.y - this.dy;

		if(this.isCollided()){

			this.grid.remove(this);
			super.calculateOccupiedCells();
			this.grid.add(this);
			this.currPos = "dw";
			this.update();
			return;
		}

		this.grid.remove(this);
		this.dx = 0;
		this.dy = 1 * this.walkingSpeed;
		this.y += this.dy;

		// boundary down
		if(this.y + super.getHeight() > cnvs_height){
			this.y = cnvs_height - super.getHeight();

		}

		super.calculateOccupiedCells();
		this.grid.add(this);

		this.currPos = "dw";
		this.update();


	}

	moveUp(){

		this.direction = VERTICAL_U;

		//if(this.isCollided()) this.y = this.y - this.dy;


		if(this.isCollided()){
			this.grid.remove(this);
			super.calculateOccupiedCells();
			this.grid.add(this);
			this.currPos = "uw";
			this.update();
			return;
		}

		this.grid.remove(this);

		this.dx = 0;
		this.dy = -1 * this.walkingSpeed;
		this.y += this.dy;

		// boundary up
		if(this.y < 0){
			this.y = 0;
		}

		super.calculateOccupiedCells();

		this.grid.add(this);

		this.currPos = "uw";
		this.update();
	}

	moveLeft(){


		this.direction = HORIZONTAL_L;

		//if(this.isCollided()) this.x = this.x - this.dx;
		

		if(this.isCollided()){

			this.grid.remove(this);
			super.calculateOccupiedCells();
			this.grid.add(this);
			this.currPos = "lw";
			this.update();
			return;
		}



		this.grid.remove(this);



		this.dy = 0;
		this.dx = -1 * this.walkingSpeed;
		this.x += this.dx;

		// boundary left
		if(this.x < 0) {
			this.x = 0;
		}

		super.calculateOccupiedCells();
		this.grid.add(this);


		this.currPos = "lw";
		this.update();



	}

	moveRight(){

		this.direction = HORIZONTAL_R;


		//if(this.isCollided()) this.x = this.x-this.dx;

		if(this.isCollided()){

			this.grid.remove(this);
			super.calculateOccupiedCells();
			this.grid.add(this);
			this.currPos = "rw";
			this.update();
			return;
		}	
		this.grid.remove(this);

		this.dy = 0;
		this.dx = 1 * this.walkingSpeed;
		this.x += this.dx;
		/*
		if(collision){
			this.x -= thix.dx;
		}*/
		
		// boundery right
		if(this.x + super.getWidth() > cnvs_width){
		
			this.x = cnvs_width - super.getWidth();
		}

		super.calculateOccupiedCells();
		this.grid.add(this);

		this.currPos = "rw";
		this.update();

	}


	// collision
	isCollided(){

		let collided = false;


		let nearByObst = this.findNearByObstacles();

		console.log(nearByObst);

		let toleranceY = 5;
		let toleranceX = 0;
		const TOLERANCE_AMP = 5;

		
		for(let obst of nearByObst){

			toleranceY = 5;

			if (this.getWidth() > obst.getWidth()){
				toleranceX = TOLERANCE_AMP* Math.abs(Math.ceil((this.getWidth() - obst.getWidth()) / 2))
				

			}
			
			

			// when object get in to the collided object's inner box
			if(
				(this.x + this.getWidth() >= obst.x-toleranceX && this.x + this.getWidth() <= obst.x + obst.getWidth()+toleranceX)
				&& (this.y+this.getHeight() >= obst.y + obst.getHeight()-toleranceY && this.y+this.getHeight() <= obst.y + obst.getHeight()+toleranceY)
				&& this.direction == HORIZONTAL_L
			){
				collided = false;
				break;
			}
			else if(
				(this.x >= obst.x-toleranceX && this.x <= obst.x + obst.getWidth()+toleranceX)
				&& (this.y+this.getHeight() >= obst.y+obst.getHeight()-toleranceY && this.y+this.getHeight() <= obst.y+obst.getHeight()+toleranceY)
				&& this.direction == HORIZONTAL_R
			){
				collided = false;
				break;
			}

			// when object is not in collided object's inner box yet


			if(

				this.direction == HORIZONTAL_R &&
				(this.x + this.getWidth() >= obst.x) &&
				(this.x <= obst.x + obst.getWidth()) &&
				(this.y + this.getHeight() >= obst.y+obst.getHeight()-toleranceY) &&
				(this.y + this.getHeight() <= obst.y+obst.getHeight()+toleranceY)
			) {
				collided = true;
				break;
			} 
			else if(
				this.direction == HORIZONTAL_L &&
				(this.x + this.getWidth() >= obst.x) &&
				(this.x <= obst.x + obst.getWidth()) &&
				(this.y + this.getHeight() >= obst.y + obst.getHeight() - toleranceY) &&
				(this.y + this.getHeight() <= obst.y+obst.getHeight() + toleranceY)
			)
			{
				collided = true;
				break;
			}
			else if(
				this.direction == VERTICAL_U &&
				(this.x >= obst.x-toleranceX && this.x <= obst.x +  obst.getWidth()+toleranceX) &&
				
				(this.x + this.getWidth() >= obst.x-toleranceX && this.x + this.getWidth() <= obst.x+obst.getWidth()+toleranceX) &&
				(this.y + this.getHeight() <= obst.y + obst.getHeight() + toleranceY) &&
				(this.y + this.getHeight() >= obst.y + obst.getHeight() - toleranceY) 

			){

				let idxThis = obs.indexOf(this);
				let idxObs = obs.indexOf(obst);

				if(idxObs > idxThis) {
					collided = false;
					break;
				}

				collided = true;
				break;
			}

			else if(
				this.direction == VERTICAL_D &&
				(this.x > obst.x-toleranceX && this.x <= obst.x +  obst.getWidth()+toleranceX) &&
				(this.x + this.getWidth() >= obst.x-toleranceX && this.x + this.getWidth() <= obst.x+obst.getWidth()+toleranceX) &&
				(this.y + this.getHeight() >= obst.y + obst.getHeight() - toleranceY) &&
				(this.y + this.getHeight() <= obst.y + obst.getHeight())

			){
				collided = true;
				break;
			}


			toleranceX = 0;
			toleranceY = 0;

		}


		return collided;
	}








}



class Gold extends Obstacle{
	constructor(cnvs_ctx, x, y){
		super(cnvs_ctx, x, y, assets.resource.gold1);
		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;
	}


}

class Stone extends Obstacle{
	constructor(cnvs_ctx, x, y){
		super(cnvs_ctx, x, y, assets.resource.stone1)

		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;
	}


}




class Tree extends Obstacle{
	constructor(cnvs_ctx, x, y){
		super(cnvs_ctx, x, y, assets.tree);

		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;
		//this.src = "./res/tree/tree.png";
		//super.setImg(this.src);

	}


}

class Villager extends Movable{
	constructor(cnvs_ctx, x, y) {
		super(cnvs_ctx, x, y, assets.villager.dw2);

		//this.src = "./res/villager/dw2.png";
		//super.setImg(this.src);

	}

	buildSpritePath(direction, n){
		return `./res/villager/${direction}${n}.png`
	
	}






}


class Animal extends Movable{

	constructor(cnvs_ctx, x, y, sprite){
		super(cnvs_ctx, x, y, sprite);
		

	}

}


class Cow extends Animal{
	constructor(cnvs_ctx, x, y) {
		super(cnvs_ctx, x, y, assets.cow.cowstand2);
		this.currPos = "cowstand";

		this.lastUpdate = 0;
		this.updateInterval = 300 + Math.random() * 500;
	}



	update(){
		if(this.count + this.changeRate > 5
			|| this.count + this.changeRate < 1){
			this.changeRate *= -1;

		}

		this.count += this.changeRate;



		super.setImg(assets.cow[`${this.currPos}${this.count}`]);
	
	}

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








const images = [assets.tree, ...Object.values(assets.villager), ...Object.values(assets.cow), ...Object.values(assets.resource)]


loadGame(images, () => {
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

let animals = [
	new Cow(ctx, 300, 300)
	,new Cow(ctx, 500, 250)
	,new Cow(ctx, 500, 300)
	,new Cow(ctx, 600, 300)
	,new Cow(ctx, 700, 300)
]


let resources = [
	new Gold(ctx, 400, 100)
	,new Gold(ctx, 700, 240)
	,new Stone(ctx, 700, 100)

]

	let villager = new Villager(ctx, 10, 10);
//	let trees = [new Tree(ctx, 140,10)];
	obs = [...trees, villager, ...animals, ...resources];



function init() {
	window.requestAnimationFrame(draw);

}


// TODO	-- Collision detection
// TODO	-- redraw villager when villager is behind an obstacle






let box = new Box(ctx, 0, 100, 100, 100, "red");

let ground = new Box(ctx, 0, 0, cnvs_width, cnvs_height, "lightgreen");


const gridBorders = new Array(NUM_CELLS_X*NUM_CELLS_Y);
let counter = 0;

for(let y = 0; y < NUM_CELLS_Y;y++){
	for(let x =0; x<NUM_CELLS_X;x++){
		gridBorders[counter] = new Box(ctx, x*CELL_SIZE,y*CELL_SIZE,CELL_SIZE, CELL_SIZE,"",false,"black");
		counter++;
	}
}







let lastUpdate = 0;
//let isInit = true;


let lastUpdateAnimals = 0

function draw(time){
	// clear screen
	ctx.clearRect(0, 0, cnvs_width,cnvs_height);

	// draw
	// drawRect(0, 0, 100, 10, "blue");

//	box.draw();
	ground.draw();


		obs.forEach(o => o.draw());
	if(isDevMode){
		gridBorders.forEach(gb => gb.draw());
	}
	//box.update();
	
	if(time - lastUpdate > 20) {
		if(cur_btn_ky == ARROW_DWN_KY){
			villager.moveDown();

		} else if (cur_btn_ky == ARROW_UP_KY){
			villager.moveUp();
		} else if(cur_btn_ky == ARROW_LFT_KY){

			villager.moveLeft();
		} else if(cur_btn_ky == ARROW_RT_KY){
			
			
			villager.moveRight();
		} else if(cur_btn_ky == C_KY && isDevMode){

			console.log(grid);

		}
		lastUpdate = time;

	}

	animals.forEach(a => {
		if(time - a.lastUpdate > a.updateInterval){
			a.update();
			a.lastUpdate = time;
		}

	})


	window.requestAnimationFrame(draw);
}





	init();
})







