
class Mob {
	//Constants
	FORCE_MAX = 1.0;

	//Properties
	Location_Start = null;

	// -- Positioning
	acc = createVector();
	vel = createVector();
	loc = createVector();
	terrain = null;

	// -- Genetics
	DNA = null;
	genes = [];
	age = 0;

	// -- Analysis
	stucks = 0;
	inGoal = false;
	isComplete = false;
	score = 0;

	// == NEW Mob
	constructor(xTerrain, xLocation, xDNA) {
		//Reference to the map
		this.terrain = xTerrain;

		//Setup the initial location
		this.loc = createVector(random(width), random(height));
		if (xLocation) this.loc = xLocation.copy();
		this.Location_Start = this.loc.copy();

		//Setup the DNA
		this.DNA = new DNA(xDNA);
	}

	// Physics Actions
	applyForce(xForce) { // FORCE
		this.acc.add(xForce);
	}

	applyFriction(xFriction) { // FRICTION
		this.vel.mult(1 - xFriction / 1);
	}

	// Main Loop
	update() {
		// Check to see if this mob is done
		if (this.isComplete) return;

		//Check if reached age limit
		var geneForce = this.DNA.GetGeneForce(this.age);
		if (geneForce !== undefined) {
			this.applyForce(geneForce.setMag(this.FORCE_MAX));
		} else {
			this.calcFitness();
			return;
		}

		this.vel.add(this.acc); //Update the velocity using acceleration

		//Add the velocity if the mob isn't obstructed
		var target = createVector(this.loc.x + this.vel.x, this.loc.y + this.vel.y);
		if (this.terrain.canMove(target)) {
			this.loc.add(this.vel)
		} else {
			this.stucks++;
		}

		//Check if it reached target
		if (this.terrain.goal.inTarget(this.loc)) {
			this.inGoal = true;
			this.calcFitness();
		}

		// Reset and Advance props
		this.acc = createVector();
		this.age++;
	}

	// Calculate Fitness score of mob
	calcFitness() {
		// Calculate initial score on distance to target
		var disttogoal = dist(this.loc.x, this.loc.y, this.terrain.goal.x, this.terrain.goal.y)
		var s = map(disttogoal, 0, this.terrain.goal.distmax, this.terrain.goal.distmax, 0);

		// Adjust score when reached the target
		if (this.inGoal) s *= 10;

		// Adjust score for age
		var ts = 1 / this.age;
		s *= ts * ts;

		// Adjust score for times stuck
		var ss = map(this.stucks, 0, this.DNA.AGE_MAX, 1, 0);
		s *= ss * ss;

		// Set values and return Score
		this.score = s;
		this.isComplete = true;
		return this.score;
	}

	// Breed this mob with a partner
	breed(xPartner) {
		var newGenes = [];
		for (var i = 0; i < this.DNA.genes.length; i++) {
			// Randomly mix the genes
			var midp = random(this.DNA.genes.length);
			if (i < midp) {
				newGenes.push(this.DNA.genes[i].copy());
			} else {
				newGenes.push(xPartner.DNA.genes[i].copy());
			}
		}
		return new Mob(this.terrain, this.Location_Start.copy(), newGenes);;
	}

	// Render mob
	show() {
		//Body
		push();
		translate(this.loc.x, this.loc.y)
		if (this.isComplete)
			stroke(0, 255, 0);
		else {
			colorMode(HSB)
			var ss = map(this.stucks, 0, this.DNA.AGE_MAX, 1, 0);
			var h = map(ss, 0.5, 1, 0, 128)
			stroke(color(h, 255, 255));
		}
		strokeWeight(10);
		point(0, 0);
		pop();

		//Head
		push();
		translate(this.loc.x, this.loc.y)
		rotate(this.vel.heading());
		stroke(255, 255, 255, 128);
		strokeWeight(2);
		var l = map(this.vel.mag() / (this.FORCE_MAX), 0, 30, 2, 10);
		line(5, 0, 5 + l, 0);
		pop();

		//Info
		if (this.isComplete && false) { // DEBUG ADDED
			push();
			translate(this.loc.x, this.loc.y)
			stroke(192, 192, 192)
			textSize(16);
			text(this.score, 0, 0);
			pop();
		}
	}
}