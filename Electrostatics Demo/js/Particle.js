/**
 * Particle class representing a charged particle with mass, a charge (can be positive or negative),
 * an (x, y) position, velocity vector, acceleration vector, and a fixed or moveable state.
 * The particle is a DrawableCircle.
 */
class Particle extends DrawableCircle {
    /*
     * Instantiates a 'dead' particle with no values except the DrawableCircle defaults.
     */
    constructor() {
        super(0, 0, 0);
        this.alive = false; // Is true if the particle is currently in use
    } // constructor

    /*
     * Spawns the particle with the corresponding values.
     */
    spawn(mass, charge, x, y, velocity, acceleration, fixed) {
        this.mass = mass;
        this.charge = charge;
        // changes color based on charge (max charge is 500)
        // luminance adjustment will scale proportional to the sqare root of the charge to a value between 0 and 255 (max RGB value)
        if (charge < 0) { // negative particles are red
            this.color = Color.colorLuminance("#ff0101", ((Math.sqrt(500) - Math.sqrt(-charge * 1e6))) / Math.sqrt(500) * 255);
        } else { // positive particles are blue
            this.color = Color.colorLuminance("#0101ff", ((Math.sqrt(500) - Math.sqrt(charge * 1e6))) / Math.sqrt(500) * 255);
        } // if else 
        this.x = x;
        this.y = y;
        this.radius = mass * 1000; // radius will be proportional to the mass in grams
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.fixed = fixed;
        if (fixed) { // a fixed particle can be mimiced by a very large mass for collisions
            mass = 1e20;
        } // if
        this.alive = true;
        this.clicked = false;
        this.inCollision = false; // to help with collision detection
    } // spawn function

    /*
     * Returns the distance squared between this particle and Particle B.
     */
    distSqTo(B) {
        return (this.x - B.x) * (this.x - B.x) + (this.y - B.y) * (this.y - B.y);
    } // calcDistSq function

    /*
     * Returns the angle from this particle to Particle B.
     */
    angleTo(B) {
        return Math.atan2((B.y - this.y), (B.x - this.x));
    } // angleTo function

    /*
     * Returns the vector of the electric force of this particle exerts on Particle B
     * using Coulomb's law (F = k * |q1| * |q2| / r^2). Taking into consideration the sign of the charges
     * by multiplying them together helps determine the direction of the force vector. The x, y positions
     * are also be considered when determining the direction of the force vector.
     */
    electricForceOn(B) {
        let k = 9e9; // Coulomb's constant
        let rSq = this.distSqTo(B); // distance squared between particles
        let electricForce = k * this.charge * B.charge / rSq; // magnitude of electric force taking into
                                                           // consideration the sign of charges
        let angle = this.angleTo(B); // angle (in radians) to the x axis
                                     // atan2 handles signs of positions
        let electricForceX = electricForce * Math.cos(angle); // x component
        let electricForceY = electricForce * Math.sin(angle); // y component
        return new Vector(electricForceX, electricForceY);
    } // calcElectricForce funciton

    /*
     * Draws the particle on the canvas. Returns false if the particle is more than one canvas size
     * outside the canvas so it can be removed. 
     */
    draw() {
        this.clearCircle(); // clears the old particle at the old location
        if (!this.fixed) { // only update particles that are not fixed
            this.velocity.add(this.acceleration); // updates velocity
            this.x += this.velocity.x; // updates x position
            this.y += this.velocity.y; // update y position
        } // if
        // draws particle at new position with the specified color
        if (this.fixed) this.fillCircle(this.color, true, null, "#000000"); // black outline if fixed
        else this.fillCircle(this.color);
        // checks if particle is more than one canvas size outside the canvas
        if (this.x < -this.canvasWidth || this.x > 2 * this.canvasWidth
            || this.y < -this.canvasHeight || this.y > 2 * this.canvasHeight) return false;
        else return true;
    } // draw function

    /*
     * Resets the particle values, including erasing it from the canvas.
     */
    reset() {
        this.clearCircle();
        this.mass = 0;
        this.charge = 0;
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.fixed = true;
        this.alive = false;
        this.clicked = false;
        this.inCollision = false;
    } // reset function
} // Particle class