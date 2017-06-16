/**
 * Demo class, which create an object to hold all other objects and data for
 * the demo.
 */
class Demo {
    /*
     * Gets canvas information and context and sets up all objects.
     * Returns true if the canvas is supported and false if it
     * is not. This is to stop the animation script from constantly
     * running on older browsers.
     */
    init() {
        // Get the canvas element
        this.canvas = document.getElementById('demo');
        this.arrowCanvas = document.getElementById('arrows');
        this.dummyCanvas = document.getElementById('dummy');
        // Test to see if canvas is supported
        if (!this.canvas.getContext || !this.arrowCanvas.getContext || !this.dummyCanvas.getContext) return false;
        // default canvas for arrows is the main canvas
        Drawable.prototype.context = this.canvas.getContext('2d');
        Drawable.prototype.canvasWidth = this.canvas.width;
        Drawable.prototype.canvasHeight = this.canvas.height;
        // all velocity arrows go on the arrow canvas
        VelocityArrow.prototype.context = this.arrowCanvas.getContext('2d');
        VelocityArrow.prototype.canvasWidth = this.arrowCanvas.width;
        VelocityArrow.prototype.canvasHeight = this.arrowCanvas.height;
        // all dummy particles go on the dummy particle canvas
        DummyParticle.prototype.context = this.dummyCanvas.getContext('2d');
        DummyParticle.prototype.canvasWidth = this.dummyCanvas.width;
        DummyParticle.prototype.canvasHeight = this.dummyCanvas.height;
        this.particlePool = new ParticlePool(1000); // maximum of 1000 particles can be displayed on screen (to prevent lag)
        this.particlePool.init();
        // Figure 8
        this.particlePool.get(20e-3, 200e-6, 250, 300, new Vector(0, 0), new Vector(0, 0), true);
        this.particlePool.get(20e-3, 200e-6, 650, 300, new Vector(0, 0), new Vector(0, 0), true);
        this.particlePool.get(20e-3, -200e-6, 650, 150, new Vector(-11.78, 0), new Vector(0, 0), false);
        this.arrowCanvas.addEventListener('mousedown', function(event) {
            let xStart = event.pageX - this.offsetLeft; // saves starting x coordinate
            let yStart = event.pageY - this.offsetTop; // saves starting y coordinate
            let velocityArrow = new VelocityArrow(xStart, yStart);
            demo.dummyParticle = new DummyParticle(xStart, yStart, 1, velocityArrow); // dummy particle starts with mass 1e-3 (radius = 1)
        }); // anon function (mousedown)
        this.arrowCanvas.addEventListener('mousemove', function(event) {
            if (demo.dummyParticle) { // only update arrow if there is a dummy particle (spawned at mousedown)
                let xCur = event.pageX - this.offsetLeft; // saves current x coordinate
                let yCur = event.pageY - this.offsetTop; // saves current y coordinate
                // the velocity arrow's end location is updated (negative of current location relative to start to
                // act as a slingshot)
                demo.dummyParticle.velocityArrow.updateEnd(
                    demo.dummyParticle.velocityArrow.x + (demo.dummyParticle.velocityArrow.x - xCur),
                    demo.dummyParticle.velocityArrow.y + (demo.dummyParticle.velocityArrow.y - yCur)); 
            } // if
        }); // anon function (mousemove)
        this.arrowCanvas.addEventListener('click', function(event) {
            let x = event.pageX - this.offsetLeft;
            let y = event.pageY - this.offsetTop;
            demo.particlePool.markClicked(x, y);
        }); // anon function (click)
        document.addEventListener('mouseup', function(event) { // the mouseup listener is placed in the the document
                                                               // in case the user moves the mouse outside the canvas
            if (demo.dummyParticle) { // if a dummy particle exists
                // spawn particle with a mass of the radius / 1000 (since radius represents mass in g), charge of
                // sliverVal * 1e-6 (since the slider represents charge in µC), x and y coordinates at the start location
                // of the velocity arrow (also location of mousedown), velocity of the velocity arrow, no acceleration,
                // and fixed state if shiftDown is pressed
                demo.particlePool.get(demo.dummyParticle.radius / 1000, sliderVal * 1e-6,
                demo.dummyParticle.velocityArrow.x, demo.dummyParticle.velocityArrow.y,
                demo.dummyParticle.velocityArrow.toVector(), new Vector(0, 0), shiftDown);
                demo.dummyParticle.reset(); // dummy particle and velocity arrow are cleared off the canvas
                demo.dummyParticle = null;
            } // if
        }); // anon function (mouseup)
        return true;
    } // init function

    /*
     * Starts the animation loop
     */
    start() {
        animate();
    } // start function
} // Demo class