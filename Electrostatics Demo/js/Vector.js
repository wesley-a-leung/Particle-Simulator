/**
 * Vector class, represented by x and y components.
 */
class Vector {
    /*
     * Creates a vector with the respective x and y components.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    } // constructor

    /*
     * Adds vector v to this vector.
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
    } // add function

    /*
     * Returns the magnitude of the vector.
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    } // magnitude function

    /*
     * Returns the angle (between -pi and pi) that the vector is pointing.
     */
    angle() {
        return Math.atan2(this.y, this.x);
    } // angle function

    /*
     * Static function that returns a new vector that is the sum of vectors a and b,
     * leaving the original vectors unchanged.
     */
    static sum(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    } // sum function
} // Vector class