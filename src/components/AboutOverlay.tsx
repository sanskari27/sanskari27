import { C } from '../constants';

interface AboutOverlayProps {
	selected: string | null;
	onClose: () => void;
}

export default function AboutOverlay({ selected, onClose }: AboutOverlayProps) {
	return (
		<div
			className="absolute top-16 left-0 bottom-0 flex items-center justify-center z-30 backdrop-blur-[6px]"
			style={{
				right: selected ? 380 : 0,
				background: 'rgba(4,6,14,0.7)',
				animation: 'fadeIn 0.5s ease',
			}}
		>
			<div
				className="max-w-[660px] w-[90%] p-14 rounded-md"
				style={{
					background: C.panelBg,
					border: `1px solid ${C.panelBorder}`,
					animation: 'slideUp 0.5s ease',
					boxShadow: '0 0 80px rgba(0,229,255,0.05)',
				}}
			>
			<div
				className="mb-3"
				style={{ fontFamily: "'Orbitron'", fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: 4 }}
				>
					SANSKAR
				</div>
			<div
				className="mb-7"
				style={{ fontFamily: "'Exo 2'", fontSize: 16, color: C.core, letterSpacing: 2 }}
				>
					FULL-STACK SYSTEMS ENGINEER
				</div>
				<div
					className="w-[60px] h-0.5 mb-6"
					style={{ background: `linear-gradient(to right,${C.core},transparent)` }}
				/>
			<p
				className="mb-6"
				style={{ fontFamily: "'Exo 2'", fontSize: 16, color: 'rgba(200,214,229,0.7)', lineHeight: 1.9 }}
				>
					5+ years building scalable systems, developer tools, and real-world applications — including 2 years in
					production-grade corporate environments. I specialize in high-performance backend architectures, real-time
					systems, and developer-first tooling.
				</p>
			<p
				className="mb-8"
				style={{ fontFamily: "'Exo 2'", fontSize: 16, color: 'rgba(200,214,229,0.55)', lineHeight: 1.9 }}
				>
					I think in systems, not just features. I prioritize clean architecture and long-term scalability. I build
					tools that reduce developer friction. I automate anything that feels repetitive.
				</p>
				<div className="flex gap-3 flex-wrap mb-8">
					{['Systems Thinker', 'Clean Architecture', 'Production-Ready', '5+ Years Experience'].map((tag) => (
						<span
							key={tag}
							className="px-3.5 py-1.5 rounded-sm"
							style={{
								border: `1px solid ${C.core}25`,
						fontFamily: "'JetBrains Mono'",
						fontSize: 12,
						color: `${C.core}aa`,
								letterSpacing: 1,
								background: `${C.core}08`,
							}}
						>
							{tag}
						</span>
					))}
				</div>
				<div className="flex gap-4 mb-8">
					{[
						{ label: 'GitHub', url: 'github.com/sanskari27' },
						{ label: 'LinkedIn', url: 'linkedin.com/' },
						{ label: 'Portfolio', url: 'sanskari27.github.io/' },
					].map((l) => (
						<span
							key={l.label}
							className="cursor-pointer opacity-70"
							style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: C.core, letterSpacing: 1 }}
						>
							↗ {l.label}
						</span>
					))}
				</div>
				<button
					onClick={onClose}
					className="px-5 py-2 rounded-sm cursor-pointer transition-all duration-200"
					style={{
						background: 'none',
						border: '1px solid rgba(255,255,255,0.1)',
						color: 'rgba(200,214,229,0.4)',
					fontFamily: "'Exo 2'",
					fontSize: 13,
					letterSpacing: 1,
					}}
					onMouseEnter={(e) => {
						(e.target as HTMLButtonElement).style.borderColor = `${C.core}40`;
						(e.target as HTMLButtonElement).style.color = C.core;
					}}
					onMouseLeave={(e) => {
						(e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
						(e.target as HTMLButtonElement).style.color = 'rgba(200,214,229,0.4)';
					}}
				>
					Close — Return to Mesh
				</button>
			</div>
		</div>
	);
}
