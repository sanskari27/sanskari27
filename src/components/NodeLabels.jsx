import { C } from '../constants';
import { getColor } from '../utils';

export default function NodeLabels({ labelPositions, activeFilters, selected, connectedToSelected, onNodeClick, onHover }) {
	return (
		<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
			{labelPositions.map((lp) => {
				if (lp.behind || !activeFilters.has(lp.cat)) return null;
				const isSel = selected === lp.id;
				const isConn = selected && connectedToSelected.has(lp.id);
				const dimmed = selected && !isSel && !isConn;
				const color = getColor(lp.cat);
				return (
					<div
						key={lp.id}
						className='node-label'
						style={{
							position: 'absolute',
							left: lp.x,
							top: lp.y,
							transform: `translate(-50%,-50%) scale(${lp.scale * (isSel ? 1.15 : 1)})`,
							opacity: dimmed ? 0.12 : lp.opacity,
							pointerEvents: 'auto',
							textAlign: 'center',
							color,
							zIndex: isSel ? 10 : 1,
						}}
						onClick={() => onNodeClick(lp.id)}
						onMouseEnter={() => onHover(lp.id)}
						onMouseLeave={() => onHover(null)}
					>
						<div
							style={{
								width:
									lp.cat === 'core'
										? 12
										: lp.cat === 'project'
											? 8
											: lp.cat === 'competency'
												? 7
												: lp.cat === 'experience'
													? 6
													: 5,
								height:
									lp.cat === 'core'
										? 12
										: lp.cat === 'project'
											? 8
											: lp.cat === 'competency'
												? 7
												: lp.cat === 'experience'
													? 6
													: 5,
								borderRadius: '50%',
								background: color,
								boxShadow: `0 0 ${isSel ? 24 : 10}px ${color}`,
								margin: '0 auto 5px',
								transition: 'box-shadow 0.3s',
							}}
						/>
						<div
							style={{
								fontFamily: lp.cat === 'core' ? "'Orbitron'" : "'Exo 2'",
								fontSize:
									lp.cat === 'core'
										? 14
										: lp.cat === 'competency'
											? 11
											: lp.cat === 'project'
												? 11
												: lp.cat === 'experience'
													? 10
													: 9,
								fontWeight: lp.cat === 'core' ? 800 : lp.cat === 'competency' || lp.cat === 'project' ? 600 : 400,
								color: isSel ? '#fff' : dimmed ? 'rgba(200,214,229,0.2)' : C.text,
								textShadow: isSel ? `0 0 12px ${color}` : `0 0 6px ${color}33`,
								letterSpacing: lp.cat === 'core' ? 5 : 1,
								whiteSpace: 'nowrap',
								textTransform: lp.cat === 'core' ? 'uppercase' : 'none',
								transition: 'color 0.3s',
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
