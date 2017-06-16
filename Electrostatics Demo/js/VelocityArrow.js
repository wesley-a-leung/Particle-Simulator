/**
 * VelocityArrow class represents the velocity arrow drawn on the canvas when
 * launching a particle. It allows for the end point of the arrow to change
 * as the mouse moves.
 */
class VelocityArrow extends DrawableArrow {
    /*
     * Initializes a velocity arrow starting at the x, y coordinates.
     */
    constructor(x, y) {
        super(x, y, x, y);
    } // constructor

    /*
     * Clears the entire canvas (okay since its the only thing on the canvas, then draws the arrow
     */
    draw() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        if(!shiftDown) this.drawArrow(); // if the shift key is down, then don't draw the arrow
                                         // since the velocity will be 0
    } // draw function

    /*
     * Updates the end coordinate of the arrow.
     */
    updateEnd(x2, y2) {
        this.x2 = x2;
        this.y2 = y2;
    } // updateEnd function

    /*
     * See draw().
     */
    animate() {
        this.draw();
    } // animate function

    /*
     * Returns the vector representation of the arrow.
     */
    toVector() {
        var factor = 20; // factor to adjust the velocity
        // returns the velocity vector equal to the distance between
        // the start and end locations of the arrow divided by the factor
        return new Vector((this.x2 - this.x) / factor, (this.y2 - this.y) / factor)
    } // toVector function

    /*
     * Clears the arrow canvas.
     */
    reset() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    } // reset function
} // VelocityArrow class