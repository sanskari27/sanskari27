import { C, type NodeCategory } from '../constants';
import { getColor } from '../utils';

export interface LabelPosition {
	id: string;
	label: string;
	cat: NodeCategory;
	x: number;
	y: number;
	opacity: number;
	scale: number;
	behind: boolean;
}

interface NodeLabelsProps {
	labelPositions: LabelPosition[];
	activeFilters: Set<NodeCategory>;
	selected: string | null;
	connectedToSelected: Set<string>;
	onNodeClick: (id: string) => void;
	onHover: (id: string | null) => void;
}

const DOT_SIZE: Record<NodeCategory, number> = {
	core: 12,
	project: 8,
	competency: 7,
	experience: 6,
	tech: 5,
};

const LABEL_SIZE: Record<NodeCategory, number> = {
	core: 14,
	competency: 11,
	project: 11,
	experience: 10,
	tech: 9,
};

export default function NodeLabels({
	labelPositions,
	activeFilters,
	selected,
	connectedToSelected,
	onNodeClick,
	onHover,
}: NodeLabelsProps) {
	return (
		<div className='absolute inset-0 pointer-events-none overflow-hidden'>
			{labelPositions.map((lp) => {
				if (lp.behind || !activeFilters.has(lp.cat)) return null;
				const isSel = selected === lp.id;
				const isConn = selected !== null && connectedToSelected.has(lp.id);
				const dimmed = selected !== null && !isSel && !isConn;
				const color = getColor(lp.cat);
				const dotSize = DOT_SIZE[lp.cat];
				const labelSize = LABEL_SIZE[lp.cat];

				return (
					<div
						key={lp.id}
						className='node-label absolute text-center pointer-events-auto'
						style={{
							left: lp.x,
							top: lp.y,
							transform: `translate(-50%,-50%) scale(${lp.scale * (isSel ? 1.15 : 1)})`,
							opacity: dimmed ? 0.12 : lp.opacity,
							color,
							zIndex: isSel ? 10 : 1,
						}}
						onClick={() => onNodeClick(lp.id)}
						onMouseEnter={() => onHover(lp.id)}
						onMouseLeave={() => onHover(null)}
					>
						<div
							className='rounded-full mx-auto mb-1.5 transition-shadow duration-300'
							style={{
								width: dotSize,
								height: dotSize,
								background: color,
								boxShadow: `0 0 ${isSel ? 24 : 10}px ${color}`,
							}}
						/>
						<div
							className='whitespace-nowrap transition-colors duration-300'
							style={{
								fontFamily: lp.cat === 'core' ? "'Orbitron'" : "'Exo 2'",
								fontSize: labelSize,
								fontWeight: lp.cat === 'core' ? 800 : lp.cat === 'competency' || lp.cat === 'project' ? 600 : 400,
								color: isSel ? '#fff' : dimmed ? 'rgba(200,214,229,0.2)' : C.text,
								textShadow: isSel ? `0 0 12px ${color}` : `0 0 6px ${color}33`,
								letterSpacing: lp.cat === 'core' ? 5 : 1,
								textTransform: lp.cat === 'core' ? 'uppercase' : 'none',
							}}
						>
							{lp.label}
						</div>
					</div>
				);
			})}
		</div>
	);
}
