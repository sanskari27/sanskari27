import { C, NODES, CATEGORIES, type Node, type NodeCategory } from '../constants';
import { getColor } from '../utils';

interface SideNavProps {
	selected: string | null;
	activeFilters: Set<NodeCategory>;
	searchQuery: string;
	filteredSearch: Node[];
	onSearchChange: (q: string) => void;
	onNodeClick: (id: string) => void;
	onFilterToggle: (cat: NodeCategory) => void;
	onShowAll: () => void;
}

export default function SideNav({
	selected,
	activeFilters,
	searchQuery,
	filteredSearch,
	onSearchChange,
	onNodeClick,
	onFilterToggle,
	onShowAll,
}: SideNavProps) {
	return (
		<div
			className="absolute top-16 left-0 w-[300px] bottom-0 overflow-y-auto z-[45] backdrop-blur-[20px]"
			style={{
				background: C.panelBg,
				borderRight: `1px solid ${C.panelBorder}`,
				animation: 'slideInLeft 0.3s ease',
				boxShadow: '20px 0 60px rgba(0,0,0,0.5)',
			}}
		>
			<div className="p-6">
				<input
					className="search-input"
					placeholder="Search nodes..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
				/>

				{filteredSearch.length > 0 && (
					<div className="mt-2">
						{filteredSearch.slice(0, 6).map((n) => (
							<button
								key={n.id}
								className="nav-btn mb-1"
								onClick={() => onNodeClick(n.id)}
							>
								<div
									className="w-1.5 h-1.5 rounded-full shrink-0"
									style={{ background: getColor(n.cat) }}
								/>
								<span>{n.label}</span>
							</button>
						))}
					</div>
				)}

				<div className="mt-6 mb-5">
					<div className="hud mb-2.5">FILTER LAYERS</div>
					<div className="flex flex-wrap gap-1.5">
						{CATEGORIES.map((cat) => {
							const active = activeFilters.has(cat.id);
							return (
								<div
									key={cat.id}
									className="filter-chip"
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
							className="filter-chip"
							onClick={onShowAll}
							style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(200,214,229,0.4)' }}
						>
							Show All
						</div>
					</div>
				</div>

			<div className="hud mb-3">NODE DIRECTORY</div>
			{CATEGORIES.map((cat) => (
				<div key={cat.id} className="mb-4">
						<div
							className="mb-1.5 uppercase opacity-60"
							style={{ fontFamily: "'Exo 2'", fontSize: 12, fontWeight: 600, color: cat.color, letterSpacing: 2 }}
						>
							{cat.label}
						</div>
						{NODES.filter((n) => n.cat === cat.id).map((n) => (
							<button
								key={n.id}
								className={`nav-btn mb-1 !py-2 !px-3.5 ${selected === n.id ? 'active' : ''}`}
								onClick={() => onNodeClick(n.id)}
							>
								<div className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: cat.color }} />
								<span style={{ fontSize: 13 }}>{n.label}</span>
							</button>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
