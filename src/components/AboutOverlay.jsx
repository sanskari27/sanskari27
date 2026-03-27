import { C } from '../constants';

export default function AboutOverlay({ selected, onClose }) {
	return (
		<div
			style={{
				position: 'absolute',
				top: 56,
				left: 0,
				right: selected ? 380 : 0,
				bottom: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'rgba(4,6,14,0.7)',
				backdropFilter: 'blur(6px)',
				zIndex: 30,
				animation: 'fadeIn 0.5s ease',
			}}
		>
			<div
				style={{
					maxWidth: 640,
					width: '90%',
					padding: 48,
					background: C.panelBg,
					border: `1px solid ${C.panelBorder}`,
					borderRadius: 6,
					animation: 'slideUp 0.5s ease',
					boxShadow: '0 0 80px rgba(0,229,255,0.05)',
				}}
			>
				<div
					style={{
						fontFamily: "'Orbitron'",
						fontSize: 28,
						fontWeight: 800,
						color: '#fff',
						letterSpacing: 4,
						marginBottom: 8,
					}}
				>
					SANSKAR
				</div>
				<div style={{ fontFamily: "'Exo 2'", fontSize: 14, color: C.core, letterSpacing: 2, marginBottom: 24 }}>
					FULL-STACK SYSTEMS ENGINEER
				</div>
				<div
					style={{
						width: 60,
						height: 2,
						background: `linear-gradient(to right,${C.core},transparent)`,
						marginBottom: 24,
					}}
				/>
				<p
					style={{
						fontFamily: "'Exo 2'",
						fontSize: 14,
						color: 'rgba(200,214,229,0.7)',
						lineHeight: 1.9,
						marginBottom: 20,
					}}
				>
					5+ years building scalable systems, developer tools, and real-world applications — including 2 years in
					production-grade corporate environments. I specialize in high-performance backend architectures, real-time
					systems, and developer-first tooling.
				</p>
				<p
					style={{
						fontFamily: "'Exo 2'",
						fontSize: 14,
						color: 'rgba(200,214,229,0.55)',
						lineHeight: 1.9,
						marginBottom: 28,
					}}
				>
					I think in systems, not just features. I prioritize clean architecture and long-term scalability. I build
					tools that reduce developer friction. I automate anything that feels repetitive.
				</p>
				<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
					{['Systems Thinker', 'Clean Architecture', 'Production-Ready', '5+ Years Experience'].map((tag) => (
						<span
							key={tag}
							style={{
								padding: '5px 14px',
								border: `1px solid ${C.core}25`,
								borderRadius: 3,
								fontFamily: "'JetBrains Mono'",
								fontSize: 10,
								color: `${C.core}aa`,
								letterSpacing: 1,
								background: `${C.core}08`,
							}}
						>
							{tag}
						</span>
					))}
				</div>
				<div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
					{[
						{ label: 'GitHub', url: 'github.com/sanskari27' },
						{ label: 'LinkedIn', url: 'linkedin.com/' },
						{ label: 'Portfolio', url: 'sanskari27.github.io/' },
					].map((l) => (
						<span
							key={l.label}
							style={{
								fontFamily: "'JetBrains Mono'",
								fontSize: 10,
								color: C.core,
								letterSpacing: 1,
								opacity: 0.7,
								cursor: 'pointer',
							}}
						>
							↗ {l.label}
						</span>
					))}
				</div>
				<button
					onClick={onClose}
					style={{
						marginTop: 28,
						background: 'none',
						border: '1px solid rgba(255,255,255,0.1)',
						color: 'rgba(200,214,229,0.4)',
						padding: '8px 20px',
						borderRadius: 3,
						cursor: 'pointer',
						fontFamily: "'Exo 2'",
						fontSize: 11,
						letterSpacing: 1,
					}}
					onMouseEnter={(e) => {
						e.target.style.borderColor = `${C.core}40`;
						e.target.style.color = C.core;
					}}
					onMouseLeave={(e) => {
						e.target.style.borderColor = 'rgba(255,255,255,0.1)';
						e.target.style.color = 'rgba(200,214,229,0.4)';
					}}
				>
					Close — Return to Mesh
				</button>
			</div>
		</div>
	);
}
