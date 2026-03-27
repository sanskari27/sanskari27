import { useState, useEffect, useMemo } from 'react';
import { C, NODES, EDGES } from '../constants';

interface BootSequenceProps {
	onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
	const [lines, setLines] = useState<string[]>([]);
	const [phase, setPhase] = useState(0);

	const bootLines = useMemo(
		() => [
			{ text: 'INITIALIZING PORTFOLIO MESH v1.0...', delay: 0 },
			{ text: '█████░░░░░░░░░░ 22%  Loading node graph...', delay: 500 },
			{ text: '████████░░░░░░░ 48%  Mapping connections...', delay: 900 },
			{ text: '███████████░░░░ 70%  Calibrating 3D renderer...', delay: 1500 },
			{ text: '██████████████░ 92%  Syncing experience data...', delay: 2200 },
			{ text: '███████████████ 100% MESH ONLINE', delay: 3000 },
			{ text: '', delay: 3300 },
			{ text: '> SANSKAR.PORTFOLIO — SYSTEMS ARCHITECT', delay: 3800 },
			{ text: `> ${NODES.length} NODES · ${EDGES.length} CONNECTIONS · ALL SYSTEMS NOMINAL`, delay: 4500 },
			{ text: '', delay: 5500 },
			{ text: 'LAUNCHING INTERFACE...', delay: 6000 },
		],
		[],
	);

	useEffect(() => {
		const timers = bootLines.map((_, i) =>
			setTimeout(() => setLines((p) => [...p, bootLines[i].text]), bootLines[i].delay),
		);
		const e1 = setTimeout(() => setPhase(1), 6600);
		const e2 = setTimeout(onComplete, 7200);
		return () => {
			timers.forEach(clearTimeout);
			clearTimeout(e1);
			clearTimeout(e2);
		};
	}, [onComplete, bootLines]);

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-[600ms]"
			style={{
				background: C.bg,
				fontFamily: "'JetBrains Mono', monospace",
				opacity: phase === 1 ? 0 : 1,
			}}
		>
			<div className="max-w-[600px] w-[90%] p-8">
				<div
					className="mb-6 opacity-50"
					style={{ fontFamily: "'Orbitron'", fontSize: 11, color: C.core, letterSpacing: 6 }}
				>
					SYS://PORTFOLIO_MESH
				</div>
				{lines.map((line, i) => (
					<div
						key={i}
						className="mb-1.5 leading-relaxed"
						style={{
							fontSize: 12,
							color: line.includes('100%') || line.includes('LAUNCHING')
								? C.core
								: line.startsWith('>')
									? 'rgba(200,214,229,0.8)'
									: 'rgba(200,214,229,0.45)',
							fontWeight: line.includes('LAUNCHING') ? 600 : 400,
							animation: 'fadeIn 0.3s ease',
						}}
					>
						{line || '\u00A0'}
					</div>
				))}
				<div
					className="mt-5 h-0.5 opacity-40"
					style={{ background: `linear-gradient(to right,${C.core},transparent)` }}
				/>
			</div>
		</div>
	);
}
