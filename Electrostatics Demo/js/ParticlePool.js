/**
 * ParticlePool class, which will create a pool that holds Particle objects to be managed to prevent
 * garbage collection. This prevents constant creation and deletion of particles.
 */
class ParticlePool {
	/*
	 * Instantiates a pool with a maximum size.
	 */
	constructor(maxSize) {
		this._pool = []; // Private variable (just a guideline using underscore notation)
		this.size = maxSize; // Max Particles allowed in the pool
	} // constructor
	
	/*
	 * Populates the pool array with Particle objects
	 */
	init() {
		for (let i = 0; i < this.size; i++) {
			// Initalize the particle object
			let particle = new Particle();
			this._pool[i] = particle;
		} // for i
	} // init function

	/*
	 * Grabs the last item in the list and initializes it and
	 * pushes it to the front of the array.
	 */
	get(mass, charge, x, y, velocity, acceleration, fixed) {
		if(!this._pool[this.size - 1].alive) {
			this._pool[this.size - 1].spawn(mass, charge, x, y, velocity, acceleration, fixed);
			this._pool.unshift(this._pool.pop());
		} // if
	} // get function

	/*
	 * Calculates the force vectors, then acceleration of each particle. Velocity and position are updated
	 * right before the particle is drawn to prevent the x and y coordiantes from changing. Takes N^2 time
	 * to complete where N is the number of alive particles. Newton's 2nd law is used so that the electric force
	 * does not have to be calculated twice.
	 */
	update() {
		for (let i = 0; i < this.size; i++) {
			if (!this._pool[i].alive) break; // all particles afterward are 'dead'
			this._pool[i].acceleration = new Vector(0, 0); // resets acceleration (to allow for easier vector addition)
		} // for i
		for (let i = 0; i < this.size; i++) {
			let A = this._pool[i]; // for non modification actions
			if (!A.alive) break; // all particles afterward are 'dead'
			for (let j = i + 1; j < this.size; j++) {
				let B = this._pool[j];
				if (!B.alive) break; // all particles afterward are 'dead'
				// calculated electric force of B on A
				let electricForce = B.electricForceOn(A);
				this._pool[i].acceleration.add(new Vector(electricForce.x / A.mass, electricForce.y / A.mass));
				// acceleration of particle B is changed by the same magnitude, but in the opposite direction of particle A
				// according to Newton's 2nd Law
				this._pool[j].acceleration.add(new Vector(-electricForce.x / B.mass, -electricForce.y / B.mass));
			} // for j
		} // for i
	} // update function

	/*
	 * Checks if any particles are in contact with each other. If so, then the the resulting velocities from the
	 * elastic collision should be set. Takes N^2 time to complete where N is the number of alive particles.
	 */
	checkCollision() {
		let collisions = []; // boolean array of collisions to ensure velocity is not updated twice
		for (let i = 0; i < this.size; i++) {
			let A = this._pool[i]; // for non modification actions
			if (!A.alive) break; // all particles afterward are 'dead'
			for (let j = i + 1; j < this.size; j++) { // no need to check for particle i or before
				let B = this._pool[j];
				if (!B.alive) break; // all particles afterward are 'dead'
				if (A.distSqTo(B) <= (A.radius + B.radius) * (A.radius + B.radius)) { // overlap
					// TODO fix fixed particle collisions
					// no acceleration during a collision 
					this._pool[i].acceleration = new Vector(0, 0);
					this._pool[j].acceleration = new Vector(0, 0);
					collisions[i] = true; // mark particles in a collision
					collisions[j] = true;
					if (A.inCollision && B.inCollision) continue; // don't update velocities if they are still overlapping
					// collision is calculated by rotating the the axis to become parallel to the x axis, solving
					// in one dimension for both x and y, then rotating back to the original axis
					// INITIAL VALUES
					let theta1 = A.velocity.angle(); // direction of particle A
					let theta2 = B.velocity.angle(); // direction of particle B
					let phi = A.angleTo(B); // angle of collision
					let v1 = A.velocity.magnitude(); // magnitude of the velocity of particle A
					let v2 = B.velocity.magnitude(); // magnitude of the velocity of particle B
					let m1 = A.mass;
					let m2 = B.mass;
					// INITIAL VELOCITY COMPONENTS ON ROTATED AXIS
					let v1xr = v1 * Math.cos(theta1 - phi); // x velocity of particle A on rotated axis
					let v1yr = v1 * Math.sin(theta1 - phi); // y velocity of particle A on rotated axis
					let v2xr = v2 * Math.cos(theta2 - phi); // x velocity of particle B on rotated axis
					let v2yr = v2 * Math.sin(theta2 - phi); // y velocity of particle B on rotated axis
					// FINAL VELOCITY COMPONENTS ON ROTATED AXIS (only 1 dimension is needed to solve)
					let v1fxr = (v1xr * (m1 - m2) + 2 * m2 * v2xr) / (m1 + m2); // 1D collision formula
					let v2fxr = (v2xr * (m2 - m1) + 2 * m1 * v1xr) / (m1 + m2);
					// FINAL VELOCITY COMPONENTS ROTATE BACK TO ORIGINAL AXIS
					let v1fx = v1fxr * Math.cos(phi) + v1yr * Math.cos(phi + Math.PI / 2);
					let v1fy = v1fxr * Math.sin(phi) + v1yr * Math.sin(phi + Math.PI / 2);
					let v2fx = v2fxr * Math.cos(phi) + v2yr * Math.cos(phi + Math.PI / 2);
					let v2fy = v2fxr * Math.sin(phi) + v2yr * Math.sin(phi + Math.PI / 2);
					if (!this._pool[i].fixed) this._pool[i].velocity = new Vector(v1fx, v1fy);
					if (!this._pool[j].fixed) this._pool[j].velocity = new Vector(v2fx, v2fy);
				} // if
			} // for j
		} // for i	
		for (let i = 0; i < this.size; i++) {
			if (!this._pool[i].alive) break; // all particles afterward are 'dead'
			if (!collisions[i] && this._pool[i].inCollision) { // if a particle is no longer in a collision that previously was
				this._pool[i].inCollision = false;
			} // if
			if (collisions[i]) { // a particle is now in a collision
				this._pool[i].inCollision = true;
			} // if
		} // for i
	} // checkCollision function

	/*
	 * Checks if a particle has been clicked. If so, then if should be removed from the canvas. Takes N
	 * time to complete where N is the number of alive particles.
	 */
	checkClick() {
		let marked = new Set(); // array holding particles marked for deletion
		for (let i = 0; i < this.size; i++) {
			let A = this._pool[i]; // for non modification actions
			if (!A.alive) break; // all particles afterward are 'dead'
			if (A.clicked) { // particle has been clicked and should be removed
				marked.add(i);
			} // if
		} // for i
		let arr = Array.from(marked); // converts to array for sorting
		arr.sort();
		let adj = 0; // adjustment is required since elements are removed from array
		for (let i of arr) {
			this._pool[i - adj].reset(); // resets values
			this._pool.push((this._pool.splice(i - adj, 1))[0]); // moves to end of array
			adj++; // array indicies have changed
		} // for marked
	} // checkClick function

	/*
	 * Marks particles for deletion given a click location. Take N time to complete where N is the number
	 * of alive particles.
	 */
	markClicked(x, y) {
		for (let i = 1; i < this.size; i++) { // since the first particle is the one being created, it should not be deleted
		                                      // unless there is another particle being deleted
			let A = this._pool[i]; // for non modification actions
			if (!A.alive) break; // all particles afterward are 'dead'
			// if the click location is within the radius, then the particle has been clicked
			if ((A.x - x) * (A.x - x) + (A.y - y) * (A.y - y) <= A.radius * A.radius) {
				this._pool[i].clicked = true; // mark the particle for deletion
				this._pool[0].clicked = true; // also mark the particle being spawned for deletion
				break; // to prevent multiple deletions
			} // if
		} // for i
	} // markClicked function

	/*
	 * Draws any in use Particles. If a paricle goes off the screen, it is reset and pushed to the end of the array.
	 */
	animate() {
		this.checkClick(); // first checks for particles that have been clicked removes them if necessary
		this.update(); // updates force vectors
		this.checkCollision() // checks for particles that have collided
		for (let i = 0; i < this.size; i++) {
			let A = this._pool[i]; // for non modification actions
			// Only draw until we find a particle that is not alive
			// since they are all at the front of the array
			if (!A.alive) break;
			if (!A.draw()) {
				A.reset();
				this._pool.push((this._pool.splice(i, 1))[0]); // moves to end of array
				i--; // since array indicies have changed
			} // if
		} // for i
	} // animate function
} // ParticlePool class