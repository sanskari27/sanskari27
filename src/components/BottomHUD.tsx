import { NODES, EDGES, CATEGORIES, type NodeCategory } from '../constants';

interface BottomHUDProps {
	booting: boolean;
	activeFilters: Set<NodeCategory>;
	onFilterToggle: (cat: NodeCategory) => void;
}

export default function BottomHUD({ booting, activeFilters, onFilterToggle }: BottomHUDProps) {
	return (
		<div
			className="absolute bottom-0 left-0 right-0 h-14 flex items-end justify-between px-7 pb-4 z-20"
			style={{
				background: 'linear-gradient(to top,rgba(4,6,14,0.9),transparent)',
				animation: booting ? 'none' : 'fadeIn 0.8s ease 0.5s both',
			}}
		>
			<div className="hud" style={{ animation: 'hudPulse 4s infinite' }}>
				{NODES.length} NODES · {EDGES.length} CONNECTIONS · {activeFilters.size} LAYERS
			</div>
			<div className="hud">DRAG ORBIT · SCROLL ZOOM · CLICK INSPECT</div>
			<div className="flex gap-2.5">
				{CATEGORIES.map((cat) => (
					<div
						key={cat.id}
						className="flex items-center gap-1.5 cursor-pointer"
						style={{ opacity: activeFilters.has(cat.id) ? 1 : 0.3 }}
						onClick={() => onFilterToggle(cat.id)}
					>
						<div
							className="w-[5px] h-[5px] rounded-full"
							style={{ background: cat.color, boxShadow: `0 0 4px ${cat.color}` }}
						/>
						<span className="hud" style={{ fontSize: 11 }}>{cat.label}</span>
					</div>
				))}
			</div>
		</div>
	);
}
