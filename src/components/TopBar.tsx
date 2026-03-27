import { C } from '../constants';

interface TopBarProps {
	booting: boolean;
	navOpen: boolean;
	onMenuToggle: () => void;
	onAbout: () => void;
	onProjects: () => void;
	onContact: () => void;
}

export default function TopBar({ booting, navOpen, onMenuToggle, onAbout, onProjects, onContact }: TopBarProps) {
	return (
		<div
			className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-7 z-40"
			style={{
				background: 'linear-gradient(to bottom,rgba(4,6,14,0.9),transparent)',
				animation: booting ? 'none' : 'fadeIn 0.8s ease 0.3s both',
			}}
		>
			<div className="flex items-center gap-4">
				{/* Hamburger / Close button */}
				<button
					onClick={onMenuToggle}
					className="bg-transparent border-none cursor-pointer p-1.5 flex flex-col gap-1"
				>
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="w-5 h-0.5 transition-all duration-300"
							style={{
								background: navOpen ? C.core : 'rgba(200,214,229,0.4)',
								transform: navOpen
									? i === 0
										? 'rotate(45deg) translate(4px,4px)'
										: i === 2
											? 'rotate(-45deg) translate(4px,-4px)'
											: 'scaleX(0)'
									: 'none',
							}}
						/>
					))}
				</button>

				{/* Logo */}
				<div className="flex items-center gap-2">
					<div
						className="w-2 h-2 rounded-full"
						style={{ background: C.core, boxShadow: `0 0 10px ${C.core}`, animation: 'breathe 3s ease infinite' }}
					/>
					<span style={{ fontFamily: "'Orbitron'", fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 3 }}>
						SANSKAR
					</span>
					<span
						className="ml-1"
						style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'rgba(0,229,255,0.4)', letterSpacing: 2 }}
					>
						MESH v1.0
					</span>
				</div>
			</div>

			{/* Nav buttons */}
			<div className="flex items-center gap-2">
				{[
					{ label: 'About', action: onAbout },
					{ label: 'Projects', action: onProjects },
					{ label: 'Contact', action: onContact },
				].map(({ label, action }) => (
					<button
						key={label}
						onClick={action}
						className="px-4 py-1.5 rounded-sm cursor-pointer transition-all duration-200"
						style={{
							background: 'none',
							border: '1px solid rgba(255,255,255,0.06)',
							color: 'rgba(200,214,229,0.5)',
						fontFamily: "'Exo 2'",
						fontSize: 13,
						letterSpacing: 1,
						}}
						onMouseEnter={(e) => {
							(e.target as HTMLButtonElement).style.borderColor = `${C.core}40`;
							(e.target as HTMLButtonElement).style.color = C.core;
						}}
						onMouseLeave={(e) => {
							(e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)';
							(e.target as HTMLButtonElement).style.color = 'rgba(200,214,229,0.5)';
						}}
					>
						{label}
					</button>
				))}
			</div>
		</div>
	);
}
