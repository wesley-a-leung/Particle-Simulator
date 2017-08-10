/**
 * DrawableCircle class, which will be the base class for all circular drawable objects.
 * Sets up default variables that all child objects will inherit, as well as abstract functions.
 */
class DrawableCircle extends Drawable {
    /*
     * Initializes the DrawableCircle object with an x position, y position, and radius.
     * Calls the Drawable constructor to set x and y coordinates.
     */
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    } // constructor

    // Define abstract function to be implemented in child objects
    draw() {} // draw function

    /*
     * Fills a circle centered at the position of the object with the specified color.
     * Optional parameters include stroke, strokeWidth, and strokeColor
     */
    fillCircle(color, stroke, strokeWidth, strokeColor) {
        // stroke, strokeWidth, and strokeColor are optional parameters
        stroke = stroke || false;
        // stroke will be 30% as wide as the radius if not specified
        if (stroke)    strokeWidth = strokeWidth || this.radius * 0.3;
        else strokeWidth = 1; // if stroke is false, the width of the stroke is 1;
        // the strokeWidth cannot be greater than the radius
        strokeWidth = Math.min(this.radius, strokeWidth); 
        // stroke will be 50% darker than the color if not specified
        strokeColor = strokeColor || Color.colorLuminance(color, -0.5); 
        this.context.beginPath();
        this.context.fillStyle = color;
        // Since stroke is centered around the circumference, the half of the strokeWidth
        // is subtracted from the radius to create an inner stroke effect.
        this.context.arc(this.x, this.y, this.radius - Math.ceil(strokeWidth / 2), 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.lineWidth = strokeWidth;
        this.context.strokeStyle = strokeColor;
        this.context.stroke();
        this.context.closePath();
    } // fillCircle function

    /*
     * Outlines a circle centered at the position of the object.
     * Optional parameters include strokeColor
     */
    outlineCircle(strokeWidth, strokeColor) {
        // the strokeWidth cannot be greater than the radius
        strokeWidth = Math.min(this.radius, strokeWidth); 
        // stroke will be black if not specified
        strokeColor = strokeColor || "#000000"; 
        this.context.beginPath();
        // Since stroke is centered around the circumference, the half of the strokeWidth
        // is subtracted from the radius to create an inner stroke effect.
        this.context.arc(this.x, this.y, this.radius - Math.ceil(strokeWidth / 2), 0, 2 * Math.PI, false);
        this.context.lineWidth = strokeWidth;
        this.context.strokeStyle = strokeColor;
        this.context.stroke();
        this.context.closePath();
    } // outlineCircle function

    /*
     * Clears the circle centered at the position of the object (including its stroke).
     */
    clearCircle() {
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius + 1, 0, 2 * Math.PI, false);
        this.context.clip();
        this.context.clearRect(this.x - this.radius - 1, this.y - this.radius - 1,
            (this.radius + 1) * 2, (this.radius + 1) * 2);
        this.context.restore();
        this.context.closePath();
    } // clearCircle function
} // DrawableCircle class