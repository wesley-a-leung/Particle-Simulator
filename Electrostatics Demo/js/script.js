var demo = new Demo();
var shiftKeyCode = 16; // keycode of shift key
var shiftDown = false; // boolean to store whether shift is currently being pressed
var sliderVal = 0; // value of slider
var helpMessages = ["Click anywhere to spawn a particle.",
"Click and hold to increase the mass of a particle.", 
"To set a velocity, click and drag the mouse.",
"Hold shift to spawn a fixed particle (indicated by a black outline).", 
"Adjust the charge with the slider.",
"Positve particles are blue, negative particles are red.", 
"The darker the color, the greater the charge.",
"Click on a particle to delete it.",
" Particles will also be deleted when they touch."];

/**
 * Initializes the demo.
 */
function init() {
    if (demo.init()) { // if the canvas was successfully initialized
        demo.start();
    } // if
    $("#slider").slider({ // to control charge
        value: 0, // defauly charge
        min: -500, // minimum allowed charge
        max: 500, // maximum allowed charge
        step: 1,
        slide: function(event, ui) {
            $("#charge").html("Charge: " + ui.value + "µC");
            sliderVal = ui.value;
        } // anon function (slide)
    }); // slider
    dialog(0); // starts the help dialog chain
    $('#help').click(function() { // adds the recursive function to the help button
        dialog(0);
    }); // click help
} // init function

/**
 * Recursively calls the function to display help messages one after another.
 */
function dialog(i){
    $("<div></div>").html(helpMessages[i]).dialog({
        title: "Help",
        show: {effect: "slide", direction: "right", duration: 1000},
        hide: {effect: "slide", direction: "left", duration: 1000},
        resizable: false,
        modal: true,
        buttons: {
            "Next": function() {
                $(this).dialog("close");
                if (i < helpMessages.length - 1) dialog(i + 1);
            } // anon function (Next button)
        } // buttons
    }); // dialog
} // dialog function

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the loop and draws all objects. This function
 * must be a global function and cannot be within an object.
 */
function animate() {
    requestAnimFrame(animate);
    if (demo.particlePool) demo.particlePool.animate(); // animates all the particles if the pool exists
    if (demo.dummyParticle) demo.dummyParticle.animate(); // animates the dummy particle if it exists
} // animate function

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
            }; // anon function (callback)
})(); // anon function (animation)

/**
 * Detects if shift is pressed and sets the shiftDown variable to true.
 */
document.onkeydown = function(event) {
    // Firefox and opera use charCode instead of keyCode to
    // return which key was pressed.
    let keyCode = (event.keyCode) ? event.keyCode : event.charCode;
    if (shiftKeyCode == keyCode) { // if shift is pressed
        event.preventDefault(); // prevents default shift mapping
        shiftDown = true;
    } // if
} // anon function (onkeydown)

/**
 * Detects if shift is released and sets the shiftDown variable to false.
 */
document.onkeyup = function(event) {
    // Firefox and opera use charCode instead of keyCode to
    // return which key was pressed.
    let keyCode = (event.keyCode) ? event.keyCode : event.charCode;
    if (shiftKeyCode == keyCode) { // if shift is released
        event.preventDefault(); // prevents default shift mapping
        shiftDown = false;
    } // if
} // anon function (onkeyup)