// -- Vehicle Steering 01 - cdh - 20240918

// Constants
const CANV_SIZE = { x: 1200, y: 750 };  //Canvas Size

// Properties
var doRun = false;  // VV Loop toggles
var doRender = false;
var doProcess = false;

// Controls
var cnvMain;  // Canvas
var divControl;  // Control container
var divStatus;  // Status container

// Scene Objects

// == Scene Setup ==
function setup() {
	//Setup Controls
	Controls_Init()

	//Graphics Setup
	angleMode(DEGREES);

	//Property Initialization
	// DEBUG
}

// == Main Loop ==
function draw() {
	if (!doRun) return;

	if (doProcess) {
		Update();
	}

	if (doRender) {
		Render();
	}

	ReportStatus();
}

// Process Data
function Update() {
}

// Render Scene
function Render() {
	background(0, 64);
}

// Report Data
function ReportStatus() {
	lblFPS.html("FPS: " + 0); // DEBUG
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

	// FPS Label
	lblFPS = createP()
	lblFPS.parent("divControl");
	lblFPS.html("");
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
