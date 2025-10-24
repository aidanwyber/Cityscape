let horizonHeight;

function earthAndSky() {
	horizonHeight = round(height * (2 / 3));
	push();
	fillGradient('#257CEF', '#7BBFE1', 0, 0, 0, horizonHeight);
	rect(0, 0, width, horizonHeight);
	fill('#1E2627');
	rect(0, horizonHeight, width, height - horizonHeight);
	pop();
}

function fillGradient(colA, colB, x1, y1, x2, y2) {
	let gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
	gradient.addColorStop(0, colA);
	gradient.addColorStop(1, colB);
	drawingContext.fillStyle = gradient;
}
