// -- Genetic Algorithm Test 01 - cdh - 20240904

// Constants
const CANV_SIZE = { x: 1200, y: 750 };  //Canvas Size
const MOB_TOTAL = 100;  //Total number of mobs in each generation
const POOL_MAX = 100;  //Maximum number of mobs in the mating pool
const CYCLES_PER_FRAME = 1;  //Physics cycles per frame of animation

// Properties
var doRun = false;  // VV Loop toggles
var doRender = false;
var doProcess = false;

var generation = 0;  // Generation counter

// Controls
var cnvMain;  // Canvas
var divControl;  // Control container
var divStatus;  // Status container
var lblGen;  // Generation label
var lblAge;  // Age label

// Scene Objects
var terrain;
var mobs = [];

// == Scene Setup ==
function setup() {
	Controls_Init() //Setup Controls

	//Graphics Setup
	angleMode(DEGREES);

	//Property Initialization
	terrain = new Terrain(width, height, P2D);

	for (var i = 0; i < MOB_TOTAL; i++) {
		mobs.push(new Mob(terrain, createVector(50, 50)));
	}
}

// == Main Loop ==
function draw() {
	if (!doRun) return;

	//Status
	lblGen.html("Generation: " + generation);
	lblAge.html("Age: " + this.mobs[0].age);

	// Rendering
	if (doRender) {
		//Background
		background(0, 64);

		//Terrain
		terrain.show();

		// Mobs
		for (var i = 0; i < mobs.length; i++) {
			mobs[i].show();
		}
	}

	if (doProcess) {
		var isDone = true;

		//Mobs
		for (var i = 0; i < mobs.length; i++) {
			var mob = mobs[i];
			for (var g = 0; g < CYCLES_PER_FRAME; g++) {
				mob.applyFriction(0.01);
				mob.update();
			}
			isDone &= mob.isComplete;
		}

		//Data processing
		if (isDone) {
			evaluate();
			generation++;
		}
	}
}

// MOVE == Data Processing ==
function evaluate() {
	//Breed, Mutate, Replace

	//Sort the mobs best to worst
	mobs.sort(function (a, b) {
		return a.score < b.score;
	})
	var scoreMax = mobs[0].score + 0.0001;
	var scoreMin = mobs[mobs.length - 1].score;

	//Create mating pool with mob index weigthed by score
	var selectables = []
	for (var i = 0; i < mobs.length; i++) {
		var mob = mobs[i];
		var score = mob.score / scoreMax;
		var weight = score * score * POOL_MAX;

		for (var j = 0; j < weight; j++) {
			selectables.push({ val: i, sc: score, w: weight });
		}
	}

	//Breed the mobs using the mating pool
	var newMobs = [];
	for (var i = 0; i < MOB_TOTAL; i++) {
		var fatherMob = mobs[random(selectables).val];
		var motherMob = mobs[random(selectables).val];
		var childMob = fatherMob.breed(motherMob);
		childMob.DNA.mutate();

		newMobs.push(childMob);
	}
	mobs = newMobs;  //Swap in the new mob list
}

function Controls_Init() {
	//Control Setup
	divControl = select("#divControl");
	divStatus = select("#divStatus");

	// Canvas
	cnvMain = createCanvas(CANV_SIZE.x, CANV_SIZE.y, P2D);
	cnvMain.parent("divCanvas");
	cnvMain.mouseReleased(cnvMain_mouseReleased);

	// Master Checkbox (Master/Toggle Button)
	var chk = select("#chkMaster");
	chk.changed(chkMaster_changed);
	chk.elt.checked = true;
	chkMaster_changed();

	// Render Checkbox (Toggle Button)
	chk = select("#chkRender");
	chk.changed(chkRender_changed);
	chk.elt.checked = true;
	chkRender_changed();

	// Process Checkbox (Toggle Button)
	chk = select("#chkProcess");
	chk.changed(chkProcess_changed);
	chk.elt.checked = true;
	chkProcess_changed();

	// Generation Lable
	lblGen = createP();
	lblGen.parent("divControl");
	lblGen.html("");

	// Age Label
	lblAge = createP()
	lblAge.parent("divControl");
	lblAge.html("");
}

function cnvMain_mouseReleased(event) { doRun = !doRun; };

function chkMaster_changed(event) {
	doRun = select("#chkMaster").checked();
	select("#chkRender").elt.checked = doRun;
	chkRender_changed();
	select("#chkProcess").elt.checked = doRun;
	chkProcess_changed();
};
function chkRender_changed(event) { doRender = select("#chkRender").checked(); };
function chkProcess_changed(event) { doProcess = select("#chkProcess").checked(); };
