export let horizonHeight;

export function earthAndSky(t = undefined) {
	horizonHeight = round(height * (2 / 3));
	push();
	noStroke();
	const [skyTop, skyBot] = skyColors(t ?? dayProgress());
	// fillGradient(skyTop, skyBot, 0, 0, 0, horizonHeight);
	// rect(0, 0, width, horizonHeight);
	beginShape();
	fill(skyTop);
	vertex(0, 0);
	fill(skyTop);
	vertex(width, 0);
	fill(skyBot);
	vertex(width, horizonHeight);
	fill(skyBot);
	vertex(0, horizonHeight);
	endShape(CLOSE);

	fill('#1E2627');
	rect(0, horizonHeight, width, height - horizonHeight);
	pop();
}

export function skyColors(t /* in range [0, 1> */) {
	const stops = [
		{ t: 6 / 24, cTop: color('#8B5FBF'), cBot: color('#F28DA8') }, // dawn -> ~7:00
		{ t: 7 / 24, cTop: color('#ff7636'), cBot: color('#ffd36c') }, // sunrise
		{ t: 8 / 24, cTop: color('#91c9fd'), cBot: color('#BDE0FE') }, // morning
		{ t: 13 / 24, cTop: color('#49affd'), cBot: color('#8dccff') }, // midday
		{ t: 17 / 24, cTop: color('#74C0FC'), cBot: color('#4DABF7') }, // afternoon
		{ t: 20.5 / 24, cTop: color('#F9A857'), cBot: color('#C85B8F') }, // sunset
		{ t: 21.5 / 24, cTop: color('#463386'), cBot: color('#F49D65') }, // dusk
		{ t: 23 / 24, cTop: color('#0B1D51'), cBot: color('#102C75') }, // night -> ~23:00
	];

	let endStopInd = 0;
	while (stops[endStopInd % stops.length].t < t && endStopInd < stops.length)
		endStopInd++;

	const prev = stops[(endStopInd - 1 + stops.length) % stops.length];
	const next = stops[endStopInd % stops.length];

	if (prev.t > next.t && t > 0.5) next.t += 1;
	else if (prev.t > next.t && t < 0.5) prev.t -= 1;

	const q = map(t, prev.t, next.t, 0, 1);

	return [
		lerpColor(prev.cTop, next.cTop, q),
		lerpColor(prev.cBot, next.cBot, q),
	];
}

export function dayProgress() {
	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);
	const msSinceStart = Math.round(
		new Date().getTime() - startOfDay.getTime()
	);
	return msSinceStart / (24 * 60 * 60 * 1000);
}

// debug/test:

// window.dayProgress = dayProgress;
// window.skyColors = skyColors;
// window.earthAndSky = earthAndSky;

// test sky colors:
// let i = 0; const n = 100; function q(){if (i < n){earthAndSky(i/n);i++;setTimeout(q, 100);}} q();

// p2d mode:
// function fillGradient(colA, colB, x1, y1, x2, y2) {
// 	let gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
// 	gradient.addColorStop(0, colA);
// 	gradient.addColorStop(1, colB);
// 	drawingContext.fillStyle = gradient;
// }
