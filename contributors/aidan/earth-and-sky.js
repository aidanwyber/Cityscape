let horizonHeight;

export function earthAndSky() {
	horizonHeight = round(height * (2 / 3));
	push();
	noStroke();
	const [skyTop, skyBot] = skyColors(dayProgress());
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

	print(width, height);

	fill('#1E2627');
	rect(0, horizonHeight, width, height - horizonHeight);
	pop();
}

function skyColors(t) {
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

	let i = t > stops.at(-1).t ? stops.length - 1 : 0;
	while (i < stops.length && t > stops[i].t) i++;

	const a = stops.at(i - 1);
	const b = stops[i];

	if (a.t > b.t) a.t -= 1;

	const q = map(t, a.t, b.t, 0, 1);

	return [lerpColor(a.cTop, b.cTop, q), lerpColor(a.cBot, b.cBot, q)];
}

function dayProgress() {
	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);
	const msSinceStart = Math.round(
		(new Date().getTime() - startOfDay.getTime()) / 1000
	);
	const msInDay = 24 * 60 * 60 * 1000;
	return msSinceStart / msInDay;
}

// function fillGradient(colA, colB, x1, y1, x2, y2) {
// 	let gradient = drawingContext.createLinearGradient(x1, y1, x2, y2);
// 	gradient.addColorStop(0, colA);
// 	gradient.addColorStop(1, colB);
// 	drawingContext.fillStyle = gradient;
// }
