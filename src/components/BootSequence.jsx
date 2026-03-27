import { useState, useEffect, useMemo } from 'react';
import { C, NODES, EDGES } from '../constants';

export default function BootSequence({ onComplete }) {
	const [lines, setLines] = useState([]);
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
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 9999,
				background: C.bg,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				opacity: phase === 1 ? 0 : 1,
				transition: 'opacity 0.6s',
				fontFamily: "'JetBrains Mono',monospace",
			}}
		>
			<div style={{ maxWidth: 600, width: '90%', padding: 32 }}>
				<div
					style={{
						fontFamily: "'Orbitron'",
						fontSize: 11,
						color: C.core,
						letterSpacing: 6,
						marginBottom: 24,
						opacity: 0.5,
					}}
				>
					SYS://PORTFOLIO_MESH
				</div>
				{lines.map((line, i) => (
					<div
						key={i}
						style={{
							fontSize: 12,
							color:
								line.includes('100%') || line.includes('LAUNCHING')
									? C.core
									: line.startsWith('>')
										? `rgba(200,214,229,0.8)`
										: `rgba(200,214,229,0.45)`,
							fontWeight: line.includes('LAUNCHING') ? 600 : 400,
							marginBottom: 6,
							lineHeight: 1.6,
							animation: 'fadeIn 0.3s ease',
						}}
					>
						{line || '\u00A0'}
					</div>
				))}
				<div
					style={{
						marginTop: 20,
						height: 2,
						background: `linear-gradient(to right,${C.core},transparent)`,
						opacity: 0.4,
					}}
				/>
			</div>
		</div>
	);
}
