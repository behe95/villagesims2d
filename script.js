const isDevMode = true;



const canvas = document.getElementById("_canvas");
const ctx = canvas.getContext("2d");


// canvas dimensions
const cnvs_width = canvas.width;
const cnvs_height = canvas.height;



/** Codes below are to test how Grid Spatial Data Structure works */


const CELL_SIZE = 20;

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

		const xPos = obstacle.x;
		const yPos = obstacle.y + obstacle.getHeight()

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
				this.cells[gridPosY][gridPosX] = obstacle;
			}
			// obstacle y position is before the existing grid obstacle
			else {

				// existing obstacle don't have next obstacle
				if(currObstacle.nextObstacle == null){
					currObstacle.nextObstacle = obstacle;
					obstacle.prevObstacle = currObstacle;

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
					console.log(this.cells)

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

			
			
			const [aGridPosX, aGridPosY] = this.convertToGridCOORD(a.x, a.y);
			const [bGridPosX, bGridPosY] = this.convertToGridCOORD(b.x, b.y);

			console.log(`a(${aGridPosX},${aGridPosY})`);

			console.log(`b(${bGridPosX},${bGridPosY})`);


			
			console.log((a.getHeight() + a.y) - (b.getHeight()+b.y));
			
			return (a.getHeight() + a.y) - (b.getHeight()+b.y);

			
		})

		console.log(obs)
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
	constructor(cnvs_ctx, x, y, imgSrc){
		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;
		
		this.img = new Image();
		this.img.src = imgSrc;

		this.grid = grid;


		this.prevObstacle = null;
		this.nextObstacle = null;
		this.grid.add(this);


		// testing purpose
		if(isDevMode){
			this.box = new Box(cnvs_ctx, x, y, 0, 0,"",false,"red");
		}
		
	}


	setImg(src){
		this.img.src = src;

	//	this.grid.add(this);

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
		if(isDevMode){
			this.box.setPosition(this.x, this.y);
			this.box.setStrokeSize(3);
			this.box.setDimension(this.img.width, this.img.height);
			this.box.draw();
		}		

	}

}



class Tree extends Obstacle{
	constructor(cnvs_ctx, x, y){
		super(cnvs_ctx, x, y, "./res/tree/tree.png");
		this.cnvs_ctx = cnvs_ctx;
		this.x = x;
		this.y = y;

		//this.src = "./res/tree/tree.png";
		//super.setImg(this.src);

	}


}

class Villager extends Obstacle{
	constructor(cnvs_ctx, x, y) {
		super(cnvs_ctx, x, y, "./res/villager/dw2.png");

		//this.src = "./res/villager/dw2.png";
		//super.setImg(this.src);
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



		let prevGridPosX = Math.floor((this.x - this.dx) / CELL_SIZE);
		let prevGridPosY = Math.floor(((this.y - this.dy)+super.getHeight()) / CELL_SIZE);

		let currGridPosX = Math.floor(this.x / CELL_SIZE);
		let currGridPosY = Math.floor((this.y + super.getHeight()) / CELL_SIZE);
		
		if(currGridPosX >= NUM_CELLS_X) currGridPosX = NUM_CELLS_X - 1;	

		if(currGridPosY >= NUM_CELLS_Y) currGridPosY = NUM_CELLS_Y - 1;


		if(prevGridPosX >= NUM_CELLS_X) prevGridPosX = NUM_CELLS_X-1;
		if(prevGridPosY >= NUM_CELLS_Y) prevGridPosY = NUM_CELLS_Y-1;
		//console.log(`prev(${prevGridPosX}, ${prevGridPosY})`)

		//console.log(`curr(${currGridPosX}, ${currGridPosY})`)

		// position change
		// Remove from the previous grid cell
		if(prevGridPosX != currGridPosX || currGridPosY != prevGridPosY){

			// previous grid cell has only one obstacle
			if(this.prevObstacle == null && this.nextObstacle == null)
			{
				this.grid.cells[prevGridPosY][prevGridPosX] = null;
			}
			// previous grid cell has more than one obstacle
			// obstacle to be removed has next obstacle(s)
			else if(this.prevObstacle == null && this.nextObstacle){
				this.nextObstacle.prevObstacle = null;
				this.grid.cells[prevGridPosY][prevGridPosX] = this.nextObstacle;
					

				this.nextObstacle = null;

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

			} 
			// obstacle to be removed has previous obstacle(s) but no next obstacle(s)
			else {
				let tmpCurr = this.grid.cells[prevGridPosY][prevGridPosX];
				let tmpPrev = null;
				while(tmpCurr){
					tmpPrev = tmpCurr;
					if(this === tmpCurr){
						break;
					}
					tmpCurr = tmpCurr.nextObsacle;

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






			this.grid.add(this);
		}

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
	window.requestAnimationFrame(draw);

}
let box = new Box(ctx, 0, 100, 100, 100, "red");
let villager = new Villager(ctx, 10, 10);

let ground = new Box(ctx, 0, 0, cnvs_width, cnvs_height, "lightgreen");
/*
// generate tree randomly -- TODO LATER
let trees = [
	new Tree(ctx, 100, 0)
	,new Tree(ctx, 100,5)
	//,new Tree(ctx, 56, 24)

	,new Tree(ctx, 156,224)
	,new Tree(ctx, 356, 224)
	,new Tree(ctx, 256, 24)
	,new Tree(ctx, 256, 124)
	,new Tree(ctx, 156, 124)


]
*/
let trees = [new Tree(ctx, 140,10)];


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


//let obstacles = [...trees, villager];

obs = [...trees, villager];
console.log(grid);


// TODO	-- Collision detection
// TODO	-- redraw villager when villager is behind an obstacle

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




