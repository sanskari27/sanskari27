import { C, NODES, EDGES, CATEGORIES } from '../constants';

export default function BottomHUD({ booting, activeFilters, onFilterToggle }) {
	return (
		<div
			style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: 48,
				background: 'linear-gradient(to top,rgba(4,6,14,0.9),transparent)',
				display: 'flex',
				alignItems: 'flex-end',
				justifyContent: 'space-between',
				padding: '0 20px 12px',
				zIndex: 20,
				animation: booting ? 'none' : 'fadeIn 0.8s ease 0.5s both',
			}}
		>
			<div className='hud' style={{ animation: 'pulse 4s infinite' }}>
				{NODES.length} NODES · {EDGES.length} CONNECTIONS · {activeFilters.size} LAYERS
			</div>
			<div className='hud'>DRAG ORBIT · SCROLL ZOOM · CLICK INSPECT</div>
			<div style={{ display: 'flex', gap: 10 }}>
				{CATEGORIES.map((cat) => (
					<div
						key={cat.id}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 5,
							opacity: activeFilters.has(cat.id) ? 1 : 0.3,
							cursor: 'pointer',
						}}
						onClick={() => onFilterToggle(cat.id)}
					>
						<div
							style={{
								width: 5,
								height: 5,
								borderRadius: '50%',
								background: cat.color,
								boxShadow: `0 0 4px ${cat.color}`,
							}}
						/>
						<span className='hud' style={{ fontSize: 9 }}>
							{cat.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
