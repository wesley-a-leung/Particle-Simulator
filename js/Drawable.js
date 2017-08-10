/**
 * Drawble class, which serves as a base class for all drawable objects
 */
class Drawable {
    /*
     * Initializes a drawabe object at an x, y position.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    } // constructor

    // Define abstract function to be implemented in child objects
    draw() {} // draw function
} // Drawble class