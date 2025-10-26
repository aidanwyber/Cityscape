// Some of the hackiest code I ever written, sorry and good luck reading it :D

function cut(start, end, ratio) {
	const r1 = {
		x: start.x * (1 - ratio) + end.x * ratio,
		y: start.y * (1 - ratio) + end.y * ratio,
	};
	const r2 = {
		x: start.x * ratio + end.x * (1 - ratio),
		y: start.y * ratio + end.y * (1 - ratio),
	};
	return [r1, r2];
}

function chaikin(curve, iterations = 1, closed = false, ratio = 0.25) {
	if (ratio > 0.5) {
		ratio = 1 - ratio;
	}

	for (let i = 0; i < iterations; i++) {
		let refined = [];
		refined.push(curve[0]);

		for (let j = 1; j < curve.length; j++) {
			let points = cut(curve[j - 1], curve[j], ratio);
			refined = refined.concat(points);
		}

		if (closed) {
			refined.shift();
			refined = refined.concat(
				cut(curve[curve.length - 1], curve[0], ratio),
			);
		} else {
			refined.push(curve[curve.length - 1]);
		}

		curve = refined;
	}
	return curve;
}

export default function random(
	min = 0,
	max = 1,
	rng = null,
	decimalPlaces = 16,
) {
	const rgnFn = rng || Math.random;

	const value = rgnFn() * (max - min) + min;

	if (decimalPlaces) {
		return parseFloat(value.toFixed(decimalPlaces));
	}

	return Math.floor(value);
}

function translate(polygon, v) {
	return polygon.map(p => {
		return {
			x: p.x + v.x,
			y: p.y + v.y,
		};
	});
}

function translateBezier(polygon, v) {
	return polygon.map(item => {
		if (Array.isArray(item)) {
			return translate(item, v);
		} else {
			return {
				x: item.x + v.x,
				y: item.y + v.y,
			};
		}
	});
}

function getWindow(w, h, t, isLeft = true, isDoor = false) {
	const frame = [
		{ x: 0, y: 0 },
		{ x: 0, y: h },
		{ x: w, y: h },
		{ x: w, y: 0 },
	];

	if (!isDoor) {
		frame.push({ x: 0, y: 0 });
	}

	return [
		frame,
		[
			{ x: isLeft ? w - t : t, y: 0 },
			{ x: isLeft ? w - t : t, y: h },
		],
	];
}

function getDoor(w, h, t, isLeft = true) {
	const rad = w * 0.5;
	h = h * random(0.7, 1);

	// Boards
	const step = random(0.12, 0.16);
	const count = random(0, 4, null, 0);

	const boards = new Array(count).fill('').map((_, index) => {
		const x = w * step * (index + 1);
		const yy = Math.sqrt(count - index);

		return [
			{
				x,
				y: 0, // h * random(0.0, 0.1),
			},
			{
				x,
				y: yy * h * random(0.2, 0.4), // h * random(0.9, 0.8),
			},
		];
	});

	if (Math.random() > 0.5) {
		return [...getWindow(w, h, t, isLeft, true), ...boards];
	}

	const frame = [
		{ x: 0, y: 0 },
		...chaikin(
			[
				{ x: 0, y: h - rad },
				{ x: 0, y: h },
				{ x: rad, y: h },
			],
			4,
		),
		...chaikin(
			[
				{ x: rad, y: h },
				{ x: w, y: h },
				{ x: w, y: h - rad },
			],
			4,
		),
		{ x: w, y: 0 },
	];

	return [
		frame,
		translate(
			[
				...chaikin(
					[
						{ x: rad, y: h },
						{ x: w, y: h },
						{ x: w, y: h - rad },
					],
					4,
				),
				{ x: w, y: 0 },
			],
			{ x: -t, y: 0 },
		),
		...boards,
	];
}

function getArc(center, r, startAngle, endAngle, step = Math.PI / 90) {
	const n = Math.round((endAngle - startAngle) / step);
	const points = [];

	for (let i = 0; i < n; i++) {
		const a = startAngle + i * step;
		points.push({
			x: center.x + Math.cos(a) * r,
			y: center.y + Math.sin(a) * r,
		});
	}

	return points;
}

function distance(v1, v2) {
	const x = v1.x - v2.x;
	const y = v1.y - v2.y;
	return Math.sqrt(x * x + y * y);
}

function add(v1, v2) {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y,
	};
}

function getBush(n = 4, size = 30) {
	const factor = 1 + 3 / n;

	const bush = [
		// { x: -size, y: 0 },
		{
			x: size * -0.5,
			y: 0,
		},
	];

	for (let i = 0; i < n; i++) {
		const step = Math.PI / n;

		const angleOffset = i === n - 1 ? 0 : random(-0.05, 0.05);

		const a1 = Math.PI - step * i + random(-0.05, 0.05);
		const a2 = Math.PI - step * (i + 1) + angleOffset;

		bush.push([
			{
				x: Math.cos(a1) * size * random(0.9, 1.1),
				y: Math.sin(a1) * size * random(0.9, 1.1),
			},
			{
				x: Math.cos(a2) * size * random(0.9, 1.1),
				y: Math.sin(a2) * size * random(0.9, 1.1),
			},
			{
				x: ((Math.cos(a2) * size) / factor) * random(0.9, 1.1),
				y: ((Math.sin(a2) * size) / factor) * random(0.9, 1.1),
			},
		]);
	}

	// bush.push(
	//   {
	//     x: size,
	//     y: 0,
	//   }
	// );

	return translateBezier(bush, { x: 0, y: -1.5 });
}

function getBoards(w, b, t, u) {
	const maxWidth = w * 0.2;
	const minY = -b + 10;

	const boards = [];

	const step = -15;
	let y = random(step) - 10;

	while (y > minY) {
		boards.push([
			{ x: -u, y },
			{ x: -u + random(maxWidth), y },
		]);
		y += random(step) - 10;
	}

	y = random(step) - 10;

	while (y > minY) {
		boards.push([
			{ x: w - u - t, y },
			{ x: w - u - t - random(maxWidth), y },
		]);
		y += random(step) - 10;
	}

	return boards;
}

function getChimney(h, d, w2) {
	const width = d * random(0.1, 0.2);
	const height = h * random(0.2, 0.3);
	const left = w2 + d * random(-0.3, -0.7);
	const bottom = h * random(0.8, 0.9);

	return [
		[
			{ x: left, y: bottom },
			{ x: left + width, y: bottom },
			{ x: left + width, y: bottom + height },
			{ x: left + width, y: bottom + height },
			{ x: left, y: bottom + height },
			{ x: left, y: bottom },
		],
		[
			{ x: left + width * 0.7, y: bottom },
			{ x: left + width * 0.7, y: bottom + height },
		],
	];
}

function getRoofLines(h, d, a, rStep, rCount, rOffset = 0, xOffset = 0) {
	const roofLines = [];

	for (let i = 0; i < rCount; i++) {
		const x = -d + (i + 1) * rStep * random(1, 1.1) + xOffset;
		const r1 = random(0, 0.15) + rOffset;
		const r2 = random(0.18, 0.3) + rOffset;

		roofLines.push([
			{
				x: x + Math.cos(a) * h * r1,
				y: Math.sin(a) * h * r1,
			},
			{
				x: x + Math.cos(a) * h * r2,
				y: Math.sin(a) * h * r2,
			},
		]);
	}

	return roofLines;
}

function getAtticWindow(w, h, t) {
	if (Math.random() > 0.7) {
		return [];
	}

	const center = {
		x: w / 2,
		y: h * 0.33,
	};

	const r = Math.min(Math.min(w, h) * random(0.08, 0.16), 18);

	if (Math.random() > 0.5) {
		return getWindow(r * 2, r * 2, t).map(p =>
			translate(p, {
				x: center.x - r,
				y: center.y - r,
			}),
		);
	}

	const segmentsCount = 32;
	const window = getCircle(center, r, 32);
	const line = [];

	const angle = (Math.PI * 2) / segmentsCount;

	for (let i = 0; i <= 12; i++) {
		const j = i - 6;
		line.push({
			x: center.x + Math.cos(angle * j) * r * 1.05,
			y: center.y + Math.sin(angle * j) * r * 1.05,
		});
	}

	return [window, translate(line, { x: r * -0.4, y: 0 })];
}

function getCircle(center, r, segmentsCount = 32) {
	const angle = (Math.PI * 2) / segmentsCount;

	const circle = [];

	for (let i = 0; i <= segmentsCount; i++) {
		circle.push({
			x: center.x + Math.cos(angle * i) * r,
			y: center.y + Math.sin(angle * i) * r,
		});
	}

	return circle;
}

function scale(p, scale) {
	return {
		x: p.x * scale,
		y: p.y * scale,
	};
}

function getHouse(x, y, size = 1) {
	const w = random(80, 120) * size;
	const h = random(60, 120) * size;
	const d = random(80, 120) * size;
	const t = random(5, 7) * size;
	// const u = random(5, 20) * size;
	const u = random(15, 25) * size;
	const b = random(30, 120) * size;

	const w2 = w / 2;
	const a = Math.atan2(h, w2);

	const cosine = w2 - t;
	const r = cosine / Math.cos(a);
	const sine = Math.sin(a) * r;

	const position = {
		x: x + d,
		y: y + b,
	};

	const frame = [
		{ x: 0, y: 0 },
		{ x: w2, y: h },
		{ x: w, y: 0 },
		{ x: w - t, y: 0 },
		{ x: w2, y: sine },
		{ x: t, y: 0 },
		// close
		{ x: 0, y: 0 },
	];

	const cosine1 = (w - u - t * 2) / 2;
	const r1 = cosine1 / Math.cos(a);

	const innerFrame = [
		{ x: w - t, y: 0 },
		{ x: w - t - u, y: 0 },
		{ x: w - t - u - Math.cos(a) * r1, y: Math.sin(a) * r1 },
		{ x: w2, y: sine },
	];

	const side = translate(
		[
			{ x: d + w2, y: h },
			{ x: w2, y: h },
			{ x: 0, y: 0 },
			{ x: d, y: 0 },
		],
		{ x: -d, y: 0 },
	);

	const chimney = getChimney(h, d, w2);

	const base1 = [
		{ x: w - t - u, y: 0 },
		{ x: w - t - u, y: -b },
		{ x: -u, y: -b },
		{ x: -u, y: 0 },
		{ x: t, y: 0 },
		{ x: w - t - u - Math.cos(a) * r1, y: Math.sin(a) * r1 },
	];

	const base2 = [
		{ x: -u, y: 0 },
		{ x: -u, y: -b },
		{ x: -d + u + t, y: -b },
		{ x: -d + u + t, y: 0 },
	];

	const separator = [
		{ x: -u, y: 0 },
		{ x: -u, y: -b },
	];

	const boards = getBoards(w, b, t, u);

	let door = getDoor(w * 0.3, b * 0.8, t * 0.5, true).map(polygon => {
		return translate(polygon, {
			x: w * 0.25,
			y: -b,
		});
	});

	const dd = d - (t + u * 2);

	const wh1 = b * random(0.4, 0.6);
	const wy1 = -wh1 - b * random(0.1, 0.3);
	let window1 = getWindow(dd * 0.25, wh1, u * 0.3, false).map(polygon => {
		return translate(polygon, {
			x: -d + t + u + dd * 0.16,
			y: wy1,
		});
	});

	const wh2 = b * random(0.4, 0.6);
	const wy2 = -wh2 - b * random(0.1, 0.3);
	let window2 = getWindow(dd * 0.25, wh2, u * 0.3, false).map(polygon => {
		return translate(polygon, {
			x: -d + t + u + dd * 0.57,
			y: wy2,
		});
	});

	const bushes = [
		translateBezier(getBush(random(4, 7, null, 0), random(25, 45)), {
			x: (w + d) * random(0, 0.4),
			y: 0,
		}),
	];

	if (random() > 0.5) {
		bushes.push(
			translateBezier(getBush(random(4, 7, null, 0), random(15, 30)), {
				x: (w + d) * random(0.6, 1),
				y: 0,
			}),
		);
	}

	// Roof lines
	const rStep1 = random(0.08, 0.11) * d;
	const rStep2 = random(0.08, 0.12) * d;
	const rStep3 = random(0.08, 0.12) * d;
	const rCount1 = random(0, 8, null, 0);
	const rCount2 = random(0, 6, null, 0);
	const rCount3 = random(0, 6, null, 0);

	const roof = [
		...getRoofLines(h, d, a, rStep1, rCount1),
		...(Math.random() > 0.5 ?
			getRoofLines(h, d, a, rStep2, rCount2, 0.33, d * random(0.05, 0.1))
		:	getRoofLines(h, d, a, rStep3, rCount3, 0.7, d * random(0.45, 0.35))),
	];

	const hours = new Date().getHours();
	const stops = [
		{ t: 6, offset: 20, lightInWindow: 0.1 },
		{ t: 9, offset: 10, lightInWindow: 0.5 },
		{ t: 12, offset: -5, lightInWindow: 0.2 },
		{ t: 15, offset: 0, lightInWindow: 0 },
		{ t: 18, offset: 10, lightInWindow: 0.1 },
		{ t: 20, offset: 20, lightInWindow: 0.5 },
		{ t: 24, offset: 20, lightInWindow: 0.9 },
	];
	const { offset, lightInWindow } = stops.find(stop => stop.t >= hours);

	const roofColor = [random(0, 10), random(60, 80), random(50, 70) - offset];
	const innerFrameColor = [
		roofColor[0],
		roofColor[1] - 10,
		roofColor[2] - 30,
	];
	const frameColor = [roofColor[0], roofColor[1] + 10, roofColor[2] - 15];

	const wallColor = [random(0, 360), random(0, 10), random(60, 90) - offset];
	const wallColorDark = [wallColor[0], wallColor[1], wallColor[2] - 5];
	const getDarkWindowColor = () => {
		return random() < lightInWindow ? windowColor : (
				[wallColorDark[0], wallColorDark[1], wallColorDark[2] - 10]
			);
	};

	const windowColor = [random(45, 55), random(80, 100), random(70, 100)];

	const doorColor = [
		random(340, 380),
		random(30, 50),
		random(50, 60) - offset,
	];

	let atticWindow = getAtticWindow(w - t - u, h, t);
	if (atticWindow.length) {
		atticWindow = [
			{
				path: atticWindow[0],
				color: getDarkWindowColor(),
			},
			atticWindow[1],
		];
	}

	door = [
		{
			color: doorColor,
			path: door[0],
		},
		...door.slice(1),
	];

	window1 = [
		{
			color: getDarkWindowColor(),
			path: window1[0],
		},
		...window1.slice(1),
	];

	window2 = [
		{
			color: getDarkWindowColor(),
			path: window2[0],
		},
		...window2.slice(1),
	];

	return {
		offset,
		dimensions: {
			w,
			h,
			d,
		},
		beziers: [...bushes].map(p =>
			translateBezier(p, {
				x: position.x - d,
				y: position.y - b,
			}),
		),
		filledPaths: [...chimney].map(p => translate(p, position)),
		body: [
			{ color: wallColorDark, path: base1 },
			{ color: wallColor, path: base2 },

			separator,
			...atticWindow,
			...roof,
			...boards,

			...door,
			...window1,
			...window2,
		]
			.filter(p => !!p)
			.map(p => {
				if (Array.isArray(p)) {
					return translate(p, position);
				}
				return {
					color: p.color,
					path: translate(p.path, position),
				};
			}),
		roof: [
			{
				color: roofColor,
				path: side,
			},

			{ color: innerFrameColor, path: innerFrame },
			{ color: frameColor, path: frame },
		]
			.filter(p => !!p)
			.map(p => {
				if (Array.isArray(p)) {
					return translate(p, position);
				}
				return {
					color: p.color,
					path: translate(p.path, position),
				};
			}),
	};
}

const w = 3840;
const h = 2160;

const strokePolygon = (points, isClosed) => {
	for (let i = 0; i < points.length - (isClosed ? 0 : 1); i++) {
		const point = points[i];
		const next = points[(i + 1) % points.length];
		line(point.x, h - point.y, next.x, h - next.y);
	}
};

const fillPolygon = (points, isClosed) => {
	beginShape();

	for (let i = 0; i < points.length - (isClosed ? 0 : 1); i++) {
		const point = points[i];
		vertex(point.x, h - point.y);
	}
	endShape(CLOSE);
};

function bezierPath(polygon, isClosed = true) {
	beginShape();
	for (let i = 0; i < polygon.length; i++) {
		const item = polygon[i];
		if (Array.isArray(item)) {
			// item = [cp1, cp2, p]
			bezierVertex(
				item[0].x,
				h - item[0].y,
				item[1].x,
				h - item[1].y,
				item[2].x,
				h - item[2].y,
			);
		} else {
			if (i === 0) vertex(item.x, h - item.y);
			else vertex(item.x, h - item.y);
		}
	}
	if (isClosed) {
		endShape(CLOSE);
	} else {
		endShape();
	}
}

export function getHouses() {
	// 3840 2160
	strokeWeight(2);
	colorMode(HSB);
	for (let y = 0; y < 6; y++) {
		let left = random(0, 300);
		for (let x = 0; x < 6; x++) {
			if (random() > 0.75) {
				continue;
			}
			const house = getHouse(2800 + left, 580 - 120 * y + random(0, 80));
			left += house.dimensions.w + house.dimensions.d + random(0, 10);
			const { offset } = house;

			fill('rgba(80, 80, 80, 1)');

			// WALLS and WINDOWS
			noStroke();
			house.body.forEach((path, i) => {
				if (path.color && path.path) {
					fill(path.color);
					fillPolygon(path.path, true);
				}
			});

			stroke('black');
			house.body.forEach((path, i) => {
				if (path.color && path.path) {
					strokePolygon(path.path, false);
				} else {
					strokePolygon(path, false);
				}
			});

			// ROOF
			noStroke();
			house.roof.forEach((path, i) => {
				if (path.color && path.path) {
					fill(path.color);
					fillPolygon(path.path, true);
				}
			});

			stroke('black');
			house.roof.forEach((path, i) => {
				if (path.color && path.path) {
					strokePolygon(path.path, false);
				} else {
					strokePolygon(path, false);
				}
			});

			fill(house.roof[0].color);
			house.filledPaths.map(path => {
				fillPolygon(path, false);
				strokePolygon(path, true);
			});

			house.beziers.map(path => {
				const bushColor = [
					random(100, 150),
					random(40, 60),
					random(40, 60) - offset,
				];

				fill(bushColor);
				bezierPath(path, true);
			});
		}
	}
}
