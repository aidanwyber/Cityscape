// import your functions here
import { earthAndSky } from './contributors/aidan/earth-and-sky.js';
import { UFOs } from './contributors/bedir/ufos.js';
import { getHouses } from './contributors/stanko/houses.js';

const drawingFunctions = [
	// add your functions to this array
	// they will be called one by one each frame
	earthAndSky,
	UFOs,
	getHouses,
];
let functionIndex = 0;

// protected
window.setup = () => {
	pixelDensity(1);
	const canvas = createCanvas(3840, 2160, WEBGL); // 4K
	canvas.elt.style = '';
	curveDetail(100);
	bezierDetail(100);
};

// protected
window.draw = () => {
	// make sure to preserve transformations and drawing styles
	// with push() and pop()
	resetMatrix();
	// put the origin of the canvas at the top left
	translate(-width / 2, -height / 2);
	push();
	// draw each function on every next iteration to build the city
	drawingFunctions[functionIndex++]();
	pop();

	if (functionIndex === drawingFunctions.length) {
		noLoop();
		print('Cityscape completed successfully.');
	}
};

// protected
window.keyPressed = () => {
	// press 's' to download the image
	if (key.toLowerCase() === 's') save('cityscape.png');
};
