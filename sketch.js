let functionIndex = 0;
const functions = [
	// add your functions here
	// this list is in chronological order
	earthAndSky,
];

// protected
function setup() {
	pixelDensity(1);
	const canvas = createCanvas(3840, 2160); // 4K
	canvas.elt.style = '';
}

// protected
function draw() {
	// make sure to preserve transformations and drawing styles
	// with push() and pop()
	push();
	// draw each function on every next iteration to build the city
	functions[functionIndex++]();
	pop();

	if (functionIndex === functions.length) {
		noLoop();
		print('Cityscape completed successfully.');
		return;
	}
}

// protected
function keyPressed() {
	// press 's' to download the image
	if (key.toLowerCase() === 's') save('cityscape.png');
}
