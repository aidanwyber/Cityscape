export function UFOs() {
	const horizon = round(height * (2 / 3));
	push();
	const ufoCount = 7;
	const baseWidth = 250;
	const baseHeight = 100;
	const minScale = 0.8;
	const maxScale = 1.3;
	const placedUFOs = [];
	let attempts = 0;
	let placedCount = 0;

	while (placedCount < ufoCount && attempts < 100) {
		const scale = random(minScale, maxScale);
		const w = baseWidth * scale;
		const h = baseHeight * scale;
		const cx = random(w / 2, width - w / 2);
		const cy = random(horizon * 0.15, horizon * 0.6);
		let overlaps = false;
		for (const ufo of placedUFOs) {
			const dx = cx - ufo.x;
			const dy = cy - ufo.y;

			const minDist = (w + ufo.width) * 0.9; 
			if (dx * dx + dy * dy < minDist * minDist) {
				overlaps = true;
				break;
			}
		}

		if (!overlaps) {
			drawUFO(cx, cy, w, h);
			placedUFOs.push({ x: cx, y: cy, width: w, height: h });
			placedCount++;
		}
		attempts++;
	}
	pop();
}
function drawUFO(x, y, w, h) {
	push();
	translate(x, y);
	noStroke();
	// body
	fill(192, 192, 200, 240);
	ellipse(0, 0, w, h * 0.5);
	// cockpit
	fill(150, 200, 255, 180);
	ellipse(0, -h * 0.15, w * 0.4, h * 0.4);
	// lights
	const lightCount = 5;
	const lightSpacing = (w * 0.7) / lightCount;
	const startX = -w * 0.35 + lightSpacing / 2;
	colorMode(HSB);
	for (let i = 0; i < lightCount; i++) {
		const lightX = startX + i * lightSpacing;
		fill(random(0, 360), 80, 100, 0.7);
		ellipse(lightX, h * 0.1, w * 0.08, h * 0.15);
	}
	colorMode(RGB);
	pop();
}
