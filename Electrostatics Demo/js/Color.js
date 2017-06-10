/**
 * Color class containing static methods to assist with determining hex color values.
 */
class Color {
	/*
	 * Static function that returns the hex color value that differs by the original
	 * by the luminosity factor. Eg. -0.1 is 10% darker, 0.2 is 20% lighter.
	 */
	static colorLuminance(hex, lum) {
		// validate hex string
		// replaces everything that's not a valid hexadecimal(include '#') with ''
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		// expands 3-digit hex codes to 6-digit representation
		if (hex.length == 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		} // if
		if (!lum) return ("#" + hex); // if lum is not defined or is 0, return the hex string
		// convert to decimal and change luminosity
		let rgb = "#";
		for (let i = 0; i < 3; i++) {
			let c = parseInt(hex.substr(i * 2, 2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00" + c).substr(c.length);
		} // for i
		return rgb;
	} // colorLuminance function
} // Color class