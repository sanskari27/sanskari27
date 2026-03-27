import { C, EDGES } from '../constants';

export function getColor(cat: string): string {
	return (C as Record<string, string>)[cat] ?? C.text;
}

export function getConnected(nodeId: string): Set<string> {
	const s = new Set<string>();
	EDGES.forEach(([a, b]) => {
		if (a === nodeId) s.add(b);
		if (b === nodeId) s.add(a);
	});
	return s;
}
