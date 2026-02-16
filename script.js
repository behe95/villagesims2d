


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



// constant variables to identify the axis
const HORIZONTAL_R = 0;
const HORIZONTAL_L = 1;
const VERTICAL_U = 2
const VERTICAL_D = 3;


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
				this.cells[y][x] = null;
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


	add(obstacle){
		

		obstacle.nextObstacle = null;
		obstacle.prevObstacle = null;


		const xPos = obstacle.x;
		const yPos = obstacle.y + obstacle.getHeight();
		
		

	/*	let gridPosX = Math.floor(xPos / CELL_SIZE); 
		let gridPosY = Math.floor(yPos / CELL_SIZE);

		if(gridPosX >= NUM_CELLS_X) gridPosX = NUM_CELLS_X - 1;
		if(gridPosY >= NUM_CELLS_Y) gridPosY = NUM_CELLS_Y - 1;

*/

		const [gridPosX, gridPosY] = this.convertToGridCOORD(xPos, yPos);

		let currObstacle = this.cells[gridPosY][gridPosX];
		// no obstacle in current grid cell
		if(!currObstacle){

			this.cells[gridPosY][gridPosX] = obstacle;



		}
		// current grid has obstacle already
		else {
			// obstacle y position is after the existing grid obstacle
			if(obstacle.getHeight() + obstacle.y > currObstacle.getHeight() + currObstacle.y){

				obstacle.nextObstacle = currObstacle;
				currObstacle.prevObstacle = obstacle;
				obstacle.prevObstacle = null;
				this.cells[gridPosY][gridPosX] = obstacle;
			}
			// obstacle y position is before the existing grid obstacle
			else {

				// existing obstacle don't have next obstacle
				if(currObstacle.nextObstacle == null){
					currObstacle.nextObstacle = obstacle;
					obstacle.prevObstacle = currObstacle;
					obstacle.nextObstacle = null;

				}
				// existing obstacle has next obstacle(s)
				else{


				
			

					let tmpCurr = currObstacle;
					let tmpPrev = null;
	
					while(tmpCurr && 
						(
							(tmpCurr.getHeight() + tmpCurr.y > obstacle.getHeight() + obstacle.y)	// obstacle base is inside existing obstacle's base
						)){
						tmpPrev = tmpCurr;

						tmpCurr = tmpCurr.nextObstacle;

					}

					if (tmpPrev) tmpPrev.nextObstacle = obstacle;
					obstacle.prevObstacle = tmpPrev;
					obstacle.nextObstacle = tmpCurr;
					if (tmpCurr) tmpCurr.prevObstacle = obstacle;

				}

			}

		}


		// SORT obstacles
		//
		obs.sort((a,b) => {
			/*

			let aGridPosX = Math.floor(a.x / NUM_CELLS_X);
			let aGridPosY = Math.floor((a.y + a.getHeight()) / NUM_CELLS_Y);



			let bGridPosX = Math.floor(b.x / NUM_CELLS_X);
			let bGridPosY = Math.floor((b.y + b.getHeight()) / NUM_CELLS_Y);

			*/

			
			
			const [aGridPosX, aGridPosY] = this.convertToGridCOORD(a.x, a.y + a.getHeight());
			const [bGridPosX, bGridPosY] = this.convertToGridCOORD(b.x, b.y + b.getHeight());




			
			
			return (a.getHeight() + a.y) - (b.getHeight()+b.y);

			
		})

		//calculate occupied region
		obstacle.calculateOccupiedCells();
		
		console.log(gridPosX, gridPosY);
		console.log(obstacle);
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
	/*	if(btnPressed){
		cur_btn_key = e.keyCode;
		tonsole.log(e.keyCode);

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
	constructor(cnvs_ctx, x, y, img){
		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;
		
		this.img = img;


		this.grid = grid;
	

		this.prevObstacle = null;
		this.nextObstacle = null;


		
		if(this.img.complete){
			this.grid.add(this);
		}else{
			this.img.onload = () => {
				this.grid.add(this);
			}

		}

		//this.grid.add(this);
		// testing purpose
		if(isDevMode){


			this.box = new Box(cnvs_ctx, x, y, 0, 0,"",false,"red");

		}


		// occupied cells in grid
		this.occupiedCells = []
		this.calculateOccupiedCells();
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
		const leftX = Math.floor(this.x / CELL_SIZE);
		const rightX = Math.floor((this.x + this.getWidth()) / CELL_SIZE);
		const topY = Math.floor(this.y / CELL_SIZE);
		const bottomY = Math.floor((this.y + this.getHeight()) / CELL_SIZE);
		
		this.occupiedCells = [];
		for(let y = topY; y <= bottomY; y++){
			for(let x = leftX; x <= rightX; x++){
				this.occupiedCells.push([x,y]);
			}
		}


		console.log("AAAAAAAAAA ", this);
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

class Villager extends Obstacle{
	constructor(cnvs_ctx, x, y) {
		super(cnvs_ctx, x, y, assets.villager.dw2);

		//this.src = "./res/villager/dw2.png";
		//super.setImg(this.src);
		this.count = 1;
		this.currPos = "dw"
		this.changeRate = 1;


		

		this.dx = 0;
		this.dy = 1;
		


		this.walkingSpeed = 5;

		this.collisionDirection = null;

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

		//this.src = this.buildSpritePath(this.currPos, this.count);
		//super.setImg(this.src);


		super.setImg(assets.villager[`${this.currPos}${this.count}`]);
		
		let [prevGridPosX, prevGridPosY] = this.grid.convertToGridCOORD(this.x - this.dx, (this.y-this.dy)+super.getHeight());

		let [currGridPosX, currGridPosY] = this.grid.convertToGridCOORD(this.x, this.y + super.getHeight());


		console.log(this.x - this.dx, (this.y-this.dy)+super.getHeight());
		console.log(prevGridPosX, prevGridPosY);
		console.log(this.x, this.y+super.getHeight());
		console.log(currGridPosX, currGridPosY);
		/*
		let prevGridPosX = Math.floor((this.x - this.dx) / CELL_SIZE);
		let prevGridPosY = Math.floor(((this.y - this.dy)+super.getHeight()) / CELL_SIZE);

		let currGridPosX = Math.floor(this.x / CELL_SIZE);
		let currGridPosY = Math.floor((this.y + super.getHeight()) / CELL_SIZE);
		
		if(currGridPosX >= NUM_CELLS_X) currGridPosX = NUM_CELLS_X - 1;	

		if(currGridPosY >= NUM_CELLS_Y) currGridPosY = NUM_CELLS_Y - 1;


		if(prevGridPosX >= NUM_CELLS_X) prevGridPosX = NUM_CELLS_X-1;
		if(prevGridPosY >= NUM_CELLS_Y) prevGridPosY = NUM_CELLS_Y-1;
		*/
		// position change
		// Remove from the previous grid cell
		if(prevGridPosX != currGridPosX || currGridPosY != prevGridPosY){
			//console.log(this.prevObstacle, this.nextObstacle);
			// previous grid cell has only one obstacle
			if(this.prevObstacle == null && this.nextObstacle == null)
			{

				console.log("1");
				this.grid.cells[prevGridPosY][prevGridPosX] = null;
			}
			// previous grid cell has more than one obstacle
			// obstacle to be removed has next obstacle(s)
			else if(this.prevObstacle == null && this.nextObstacle){
				this.nextObstacle.prevObstacle = null;
				this.grid.cells[prevGridPosY][prevGridPosX] = this.nextObstacle;
					

				this.nextObstacle = null;
				console.log("2");

			}
			// obstacle to be removed has previous obstacle(s) and next obstacle(s)
			else if(this.prevObstacle != null && this.nextObstacle != null){
				let tmpCurr = this.grid.cells[prevGridPosY][prevGridPosX];
				let tmpPrev = null;
				while(tmpCurr){
					tmpPrev = tmpCurr;

					if(this === tmpCurr) {
						break;
					}
					tmpCurr = tmpCurr.nextObstacle;
				}

				let prev = this.prevObstacle;
				let next = this.nextObstacle;

				prev.nextObstacle = next;
				next.prevObstacle = prev;
				this.prevObstacle = null;
				this.nextObstacle = null;
				console.log("3");

			} 
			// obstacle to be removed has previous obstacle(s) but no next obstacle(s)
			else {
				console.log("4");
				let tmpCurr = this.grid.cells[prevGridPosY][prevGridPosX];
				let tmpPrev = null;
				while(tmpCurr){
					tmpPrev = tmpCurr;
					if(this === tmpCurr){
						break;
					}
					tmpCurr = tmpCurr.nextObstacle;

				}
				let prev = this.prevObstacle;
				prev.nextObstacle = null;
				this.prevObstacle = null;

			}
			/*
			if(this.prevObstcle != null){
				this.prevObstacle.nextObstacle = this.nextObstacle;
			}else{
				this.grid.cells[prevGridPosY][prevGridPosX] = this.nextObstacle;

			}


			if(this.nextObstacle != null){
				
				this.nextObstacle.prevObstacle = this.prevObstacle;

			}
			*/




			//this.img.onload = () => {
				this.prevObstacle = null;
				this.nextObstacle = null;
				this.grid.add(this);
			//}

		}

		// calculate occupied region
		//super.calculateOccupiedCells();


	}


	moveDown(){
		if(this.isCollided()) return;

		this.dx = 0;
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

		if(this.isCollided()) return;

		this.dx = 0;
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

		if(this.isCollided()) return;
		this.dy = 0;
		this.dx = -1 * this.walkingSpeed;
		this.x += this.dx;

		// boundary left
		if(this.x < 0) {
			this.x = 0;
		}
		this.currPos = "lw";
		this.update();

	}

	moveRight(){


		if(this.isCollided() && this.collisionDirection && this.collisionDirection == HORIZONTAL_R) return;

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

		this.currPos = "rw";
		this.update();

	}


	// collision
	isCollided(){

		let collided = false;


		const [x,y] = this.grid.convertToGridCOORD(this.x, this.y+this.getHeight());
		let tmp = this.grid.cells[y][x]

		const tolerance = 5;

		while(tmp){

			if(tmp === this) {
				tmp = tmp.nextObstacle;
				continue;
			
			}
			

			console.log("A===>", this.x + this.getWidth());
			console.log("B====>", this.y + this.getHeight());
			console.log("C====>", tmp.y+tmp.getHeight());
			console.log("D====>", this.y+this.getHeight());

			// horizontal collision
			if(
				this.x + this.getWidth() > tmp.x
				&& (this.y + this.getHeight() < tmp.y+tmp.getHeight() && this.y + this.getHeight() > tmp.y)
			){
				this.collisionDirection = HORIZONTAL_R;
				collided = true;
				break;
			}
			else{
				this.collisionDirection = null;
				collided = false;
				
			}




			/*
			// right collision - y within certain range
			if(
				this.x + this.getWidth() > tmp.x
				&& (this.y + this.getHeight() < tmp.y+tmp.getHeight() + 5 && this.y + this.getHeight() > tmp.y + tmp.getHeight() - 5)

			){

				collided = true;
				break;
			}
			//upward collision - x within certain range
			else if(
				(this.y + this.getHeight() + 5 < tmp.y + tmp.getHeight())
				&&
				(this.x < tmp.x + tmp.getWidth() && this.x > tmp.x + tmp.getWidth())
			)
			{
				console.log("HELLO");
				collided = true;
				break;
			}
			//downward collision - x within certain range
			else if(
				(this.y + this.getHeight() - 5 > tmp.y + tmp.getHeight())
				&&
				(this.x < tmp.x + tmp.getWidth() && this.x > tmp.x + tmp.getWidth())
			)
			{
				collided = false;
				break;
			}


			*/



			tmp = tmp.nextObstacle;
			
		}


		console.log(tmp);
		return collided;
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








const images = [assets.tree, ...Object.values(assets.villager)]


loadGame(images, () => {
/*let trees = [
	new Tree(ctx, 100, 0)
	,new Tree(ctx, 100,5)
	,new Tree(ctx, 56, 24)

	,new Tree(ctx, 156,224)
	,new Tree(ctx, 356, 224)
	,new Tree(ctx, 256, 24)
	,new Tree(ctx, 256, 124)
	,new Tree(ctx, 156, 124)


]	*/

	let villager = new Villager(ctx, 10, 10);
	let trees = [new Tree(ctx, 140,10)];
	obs = [...trees, villager];



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
		} else if(cur_btn_ky == C_KY && isDevMode){

			console.log(grid);

		}
		lastUpdate = time;

	}



	window.requestAnimationFrame(draw);
}





	init();
})







