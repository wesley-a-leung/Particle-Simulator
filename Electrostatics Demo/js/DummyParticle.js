/**
 * DummyParticle class to represent a particle that is about to be launched. The dummy particle
 * does not interact with any of the live particles.
 */
class DummyParticle extends DrawableCircle {
    /*
     * Constructor calls the DrawableCircle contructor (x, y, radius).
     * Also accepts a velocity arrow.
     */
    constructor(x, y, radius, velocityArrow) {
        super(x, y, radius);
        this.velocityArrow = velocityArrow;
    } // constructor

    /*
     * Draws the dummy particle
     */
    draw() {
        this.clearCircle();
        this.outlineCircle(5, "#404040");
    } // draw function

    /*
     * Increases the radius of the dummy particle and draws it.
     * Also draws the velocity arrow.
     */
    animate() {
        this.radius += 0.167; // rate of 10 pixels per second
        this.velocityArrow.draw();
        this.draw();
    } // animate function

    /*
     * Clears the arrow and dummy particle canvases.
     */
    reset() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.velocityArrow.reset();
    } // reset function
} // DummyParticle Class