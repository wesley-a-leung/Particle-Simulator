/**
 * DrawableArrow class that takes a starting point and ending point.
 * The resulting arrow is drawn on the canvas with an arrowhead at the ending point.
 */
class DrawableArrow extends Drawable {
    /*
     * Initializes the arrow with a starting x, y coordinate by calling the drawable constructor,
     * and end ending x, y coordinate
     */
    constructor(x, y, x2, y2) {
        super(x, y);
        this.x2 = x2;
        this.y2 = y2;
    } // constructor

    // Define abstract function to be implemented in child objects
    draw() {} // draw function

    /*
     * Draws the arrow on the canvas.
     */
    drawArrow() {
        this.context.save();
        let dist = Math.sqrt((this.x2 - this.x) * (this.x2 - this.x) + (this.y2 - this.y) * (this.y2 - this.y));

        // arrow stem
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#404040";
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x2, this.y2);
        this.context.stroke();

        let angle = Math.acos((this.y2 - this.y) / dist);

        if (this.x2 < this.x) angle = 2 * Math.PI - angle;

        let size = 15; // size of arrowhead

        // arrowhead
        this.context.beginPath();
        this.context.translate(this.x2, this.y2);
        this.context.rotate(-angle);
        this.context.fillStyle = "#404040";
        this.context.lineWidth = 2;
        this.context.moveTo(0, -size);
        this.context.lineTo(-size, -size);
        this.context.lineTo(0, 0);
        this.context.lineTo(size, -size);
        this.context.lineTo(0, -size);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
        this.context.restore();
    } // draw function    
} // DrawableArrow class