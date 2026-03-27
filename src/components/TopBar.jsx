import { C } from '../constants';

export default function TopBar({ booting, navOpen, onMenuToggle, onAbout, onProjects, onContact }) {
	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: 56,
				background: 'linear-gradient(to bottom,rgba(4,6,14,0.9),transparent)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '0 20px',
				zIndex: 40,
				animation: booting ? 'none' : 'fadeIn 0.8s ease 0.3s both',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<button
					onClick={onMenuToggle}
					style={{
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						padding: 6,
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
					}}
				>
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							style={{
								width: 20,
								height: 2,
								background: navOpen ? C.core : 'rgba(200,214,229,0.4)',
								transition: 'all 0.3s',
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
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<div
						style={{
							width: 8,
							height: 8,
							borderRadius: '50%',
							background: C.core,
							boxShadow: `0 0 10px ${C.core}`,
							animation: 'breathe 3s ease infinite',
						}}
					/>
					<span style={{ fontFamily: "'Orbitron'", fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 3 }}>
						SANSKAR
					</span>
					<span
						style={{
							fontFamily: "'JetBrains Mono'",
							fontSize: 9,
							color: 'rgba(0,229,255,0.4)',
							letterSpacing: 2,
							marginLeft: 4,
						}}
					>
						MESH v1.0
					</span>
				</div>
			</div>
			<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
				{[
					{ label: 'About', action: onAbout },
					{ label: 'Projects', action: onProjects },
					{ label: 'Contact', action: onContact },
				].map(({ label, action }) => (
					<button
						key={label}
						onClick={action}
						style={{
							background: 'none',
							border: '1px solid rgba(255,255,255,0.06)',
							color: 'rgba(200,214,229,0.5)',
							padding: '6px 16px',
							borderRadius: 3,
							cursor: 'pointer',
							fontFamily: "'Exo 2'",
							fontSize: 11,
							letterSpacing: 1,
							transition: 'all 0.2s',
						}}
						onMouseEnter={(e) => {
							e.target.style.borderColor = `${C.core}40`;
							e.target.style.color = C.core;
						}}
						onMouseLeave={(e) => {
							e.target.style.borderColor = 'rgba(255,255,255,0.06)';
							e.target.style.color = 'rgba(200,214,229,0.5)';
						}}
					>
						{label}
					</button>
				))}
			</div>
		</div>
	);
}
