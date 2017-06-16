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
     * right before the particle is drawn to prevent the x and y coordiantes from changing. Takes N + N^2 / 2 time
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
     * Checks if any particles overlap or are in contact with each other. If so, then both
     * should be removed from the screen. Takes N^2 / 2 time to complete. Since clicking on a particle
     * creates another particle directly on top of it, clicking on a particle will delete it.
     */
    checkOverlap() {
        let marked = new Set(); // array holding particles marked for deletion
        // Side note: This could be done much faster with HashSets and overloading the hashcode and equals methods
        for (let i = 0; i < this.size; i++) {
            let A = this._pool[i]; // for non modification actions
            if (!A.alive) break; // all particles afterward are 'dead'
            for (let j = i + 1; j < this.size; j++) { // no need to check for particle i or before
                let B = this._pool[j];
                if (!B.alive) break; // all particles afterward are 'dead'
                if (A.distSqTo(B) < (A.radius + B.radius) * (A.radius + B.radius)) { // overlap
                    marked.add(i);
                    marked.add(j);
                } // if
            } // for j
        } // for i
        let arr = Array.from(marked); // converts to array to sort
        arr.sort();
        let adj = 0; // adjustment is required since elements are removed from array
        for (let i of arr) {
            this._pool[i - adj].reset(); // resets values
            this._pool.push((this._pool.splice(i - adj, 1))[0]); // moves to end of array
            adj++; // array indicies have changed
        } // for marked
    } // checkOverlap function

    /*
     * Draws any in use Particles. If a paricle goes off the screen, it is reset and pushed to the end of the array.
     */
    animate() {
        this.checkOverlap(); // first checks for particles overlapping and removes them if necessary
        this.update(); // updates force vectors first
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