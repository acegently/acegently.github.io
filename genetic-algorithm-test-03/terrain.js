// -- Terrain Class - cdh - 20240904

class Terrain {
	// Properties
	goal = null;
	Walls = [];

	// == NEW Terrain ==
	constructor(xWidth, xHeight) {
		//Set map size
		this.width = xWidth;
		this.height = xHeight;

		//Create a target Goal
		var g = new Goal(60, width - 60, height - 60);
		this.goal = g;

		// Bounding Walls
		var w = [
			[0, 0, width, 10],
			[0, height - 10, width, 10],
			[0, 0, 10, height],
			[width - 10, 0, 10, height]
		];
		this.LoadObjects(w);

		var w = [
			[0, 300, 700, 20],
			[450, 500, 750, 20]
		];
		this.LoadObjects(w);

	}

	// == Render Terrain ==
	show() {
		// Goal
		this.goal.show();

		// Terrain boundaries
		push();
		stroke(0, 255, 0);
		strokeWeight(1);
		line(0, 0, this.width, 0);
		line(0, 0, 0, this.height);
		line(this.width, 0, this.width, this.height);
		line(0, this.height, this.width, this.height);
		pop();

		//Render Walls
		for (var i = 0; i < this.Walls.length; i++) {
			var w = this.Walls[i];
			push();
			noStroke();
			fill(w.c);
			rect(w.x, w.y, w.w, w.h);
			pop();
		}
	};

	// == Check if obstructed == (TODO: return direction?)
	canMove(xLoc) {
		//Check bounds of map
		if (xLoc.x < 0 || xLoc.x > this.width || xLoc.y < 0 || xLoc.y > this.height)
			return false;

		//Check Walls
		for (var i = 0; i < this.Walls.length; i++) {
			if (this.Walls[i].isInside(xLoc)) return false;
		}

		return true; // No Obstructions found
	};

	LoadObjects(xObjects) {
		//Load objects array
		for (var i = 0; i < xObjects.length; i++) {
			var w = xObjects[i];
			this.Walls.push(new Wall(w[0], w[1], w[2], w[3], w[4]));
		}
	}

	SaveObjects() {
		var rObjects;
		//TODO: Save objects list

		return rObjects;
	}
}

// **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** ****
// **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** ****

// __ Wall Class __
function Wall(x, y, w, h, c) {
	this.x = x;
	this.y = y;
	this.w = w;

	this.h = w;
	if (h) this.h = h;

	this.c = color(48, 128, 192);
	if (c) this.c = c;

	this.isInside = function (xLoc) {
		return ((xLoc.x > this.x) && (xLoc.x < (this.x + this.w))
			&& (xLoc.y > this.y) && (xLoc.y < (this.y + this.h)))
	}
}

// **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** ****
// **** **** **** **** **** **** **** **** **** **** **** **** **** **** **** ****

// __ Goal Class __
function Goal(size, x, y) {
	this.size = 10;
	if (size !== undefined) this.size = size

	this.x = random(size / 2, width - (size / 2))
	if (x !== undefined) this.x = x

	this.y = random(size / 2, height - (size / 2))
	if (y !== undefined) this.y = y

	//Calculate the maximum distance from the goal to the map bounds
	this.distmax = 0;
	this.distmax = dist(this.x, this.y, 0, 0);
	this.distmax = max(dist(this.x, this.y, width, 0), this.distmax);
	this.distmax = max(dist(this.x, this.y, 0, height), this.distmax);
	this.distmax = max(dist(this.x, this.y, width, height), this.distmax);

	//Render function
	this.show = function () {
		noFill();
		stroke(0, 0, 255);
		strokeWeight(1);
		ellipse(this.x, this.y, this.size, this.size);

		//text(this.distmax, this.x, this.y);
	}

	// Check if location in target
	this.inTarget = function (xLoc) {
		var l = dist(xLoc.x, xLoc.y, this.x, this.y);
		return (l <= (this.size / 2));
	}
}
