// Vehicle.js - cdh - 20240918

class Vehicle {
	bodySize = createVector();
	track = 0;

	constructor(xBodySize, xTrack) {
		this.bodySize = xBodySize
		this.track = xTrack;

		this.direction = createVector(1, 0);
		this.position = createVector();
		this.velocity = createVector();
		this.acceleration = createVector();

		this.WheelAccLeft = 0;
		this.WheelAccRight = 0;
	}

	applyForce(xForce) {
		this.acceleration.add(xForce);
	}

	applyWheelForce(xWheelLeft, xWheelRight) {
		this.WheelAccLeft = xWheelLeft;
		this.WheelAccRight = xWheelRight;
	}

	Process() {
		let dA = (this.WheelAccRight - this.WheelAccLeft) / this.track;
		let vB = (this.WheelAccRight + this.WheelAccLeft) / 2;
		this.direction.rotate(-dA);

		let h = this.direction.heading();
		this.acceleration.x = (0.5 * vB * cos(h)) + (0.5 * vB * cos(h));
		this.acceleration.y = (0.5 * this.WheelAccLeft * sin(h)) + (0.5 * this.WheelAccRight * sin(h));

		console.log(Round(h, 2), Round(cos(h), 2))
		//console.log(Round(this.acceleration.x, 2), Round(this.acceleration.y, 2));


		//this.velocity.add(this.acceleration);
		this.velocity = this.acceleration;
		this.position.add(this.velocity);

		// Reset all the values
		this.velocity.mult(0); // TODO: Wheel Friction
		this.acceleration.mult(0);
		this.WheelAccLeft = 0;
		this.WheelAccRight = 0;
	}

	Draw() {
		push();
		rectMode(CENTER);
		translate(this.position);
		rotate(this.direction.heading() + 90);

		// Body
		strokeWeight(2);
		stroke(0, 255, 0);
		fill(0, 64, 0);
		rect(0, 0, this.bodySize.x, this.bodySize.y)

		// Wheels
		strokeWeight(2);
		stroke(255, 255, 0);
		fill(64, 64, 0);
		rect(this.track / 2, 0, 4, this.bodySize.y / 2)
		rect(-this.track / 2, 0, 4, this.bodySize.y / 2)

		pop();
	}
}