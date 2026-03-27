import { C, NODES, CATEGORIES } from '../constants';
import { getColor } from '../utils';

export default function SideNav({ selected, activeFilters, searchQuery, filteredSearch, onSearchChange, onNodeClick, onFilterToggle, onShowAll }) {
	return (
		<div
			style={{
				position: 'absolute',
				top: 56,
				left: 0,
				width: 300,
				bottom: 0,
				background: C.panelBg,
				borderRight: `1px solid ${C.panelBorder}`,
				backdropFilter: 'blur(20px)',
				zIndex: 45,
				animation: 'slideInLeft 0.3s ease',
				overflowY: 'auto',
				boxShadow: '20px 0 60px rgba(0,0,0,0.5)',
			}}
		>
			<div style={{ padding: 20 }}>
				<input
					className='search-input'
					placeholder='Search nodes...'
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
				{filteredSearch.length > 0 && (
					<div style={{ marginTop: 8 }}>
						{filteredSearch.slice(0, 6).map((n) => (
							<button
								key={n.id}
								className='nav-btn'
								style={{ marginBottom: 4 }}
								onClick={() => onNodeClick(n.id)}
							>
								<div
									style={{ width: 6, height: 6, borderRadius: '50%', background: getColor(n.cat), flexShrink: 0 }}
								/>
								<span>{n.label}</span>
							</button>
						))}
					</div>
				)}
				<div style={{ marginTop: 20, marginBottom: 16 }}>
					<div className='hud' style={{ marginBottom: 10 }}>
						FILTER LAYERS
					</div>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
						{CATEGORIES.map((cat) => {
							const active = activeFilters.has(cat.id);
							return (
								<div
									key={cat.id}
									className='filter-chip'
									onClick={() => onFilterToggle(cat.id)}
									style={{
										borderColor: active ? `${cat.color}60` : 'rgba(255,255,255,0.08)',
										background: active ? `${cat.color}15` : 'transparent',
										color: active ? cat.color : 'rgba(200,214,229,0.3)',
									}}
								>
									{cat.label}
								</div>
							);
						})}
						<div
							className='filter-chip'
							onClick={onShowAll}
							style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(200,214,229,0.4)' }}
						>
							Show All
						</div>
					</div>
				</div>
				<div className='hud' style={{ marginBottom: 10 }}>
					NODE DIRECTORY
				</div>
				{CATEGORIES.map((cat) => (
					<div key={cat.id} style={{ marginBottom: 12 }}>
						<div
							style={{
								fontFamily: "'Exo 2'",
								fontSize: 10,
								fontWeight: 600,
								color: cat.color,
								letterSpacing: 2,
								marginBottom: 6,
								textTransform: 'uppercase',
								opacity: 0.6,
							}}
						>
							{cat.label}
						</div>
						{NODES.filter((n) => n.cat === cat.id).map((n) => (
							<button
								key={n.id}
								className={`nav-btn ${selected === n.id ? 'active' : ''}`}
								style={{ marginBottom: 3, padding: '6px 12px' }}
								onClick={() => onNodeClick(n.id)}
							>
								<div style={{ width: 5, height: 5, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
								<span style={{ fontSize: 11 }}>{n.label}</span>
							</button>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
