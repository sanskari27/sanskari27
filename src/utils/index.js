import { C, EDGES } from '../constants';

export function getColor(cat) {
	return C[cat] || C.text;
}

export function getConnected(nodeId) {
	const s = new Set();
	EDGES.forEach(([a, b]) => {
		if (a === nodeId) s.add(b);
		if (b === nodeId) s.add(a);
	});
	return s;
}
