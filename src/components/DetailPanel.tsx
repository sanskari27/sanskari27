import { useMemo } from 'react';
import { C, NODES, DETAILS, type NodeCategory } from '../constants';
import { getColor, getConnected } from '../utils';

interface DetailPanelProps {
	nodeId: string;
	onClose: () => void;
	onNavigate: (id: string) => void;
}

export default function DetailPanel({ nodeId, onClose, onNavigate }: DetailPanelProps) {
	const detail = DETAILS[nodeId];
	const node = NODES.find((n) => n.id === nodeId);
	const connected = useMemo(() => getConnected(nodeId), [nodeId]);
	const connNodes = useMemo(() => NODES.filter((n) => connected.has(n.id)), [connected]);

	if (!detail || !node) return null;
	const accent = getColor(node.cat);

	return (
		<div
			className='absolute top-0 right-0 w-[400px] h-full flex flex-col z-50 backdrop-blur-[20px]'
			style={{
				background: C.panelBg,
				borderLeft: `1px solid ${C.panelBorder}`,
				animation: 'slideInRight 0.4s ease',
				boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
			}}
		>
			{/* Scanline effect */}
			<div
				className='absolute w-full h-0.5 pointer-events-none'
				style={{
					background: `linear-gradient(to right,transparent,${accent}11,transparent)`,
					animation: 'scanline 5s linear infinite',
				}}
			/>

			{/* Header */}
			<div className='pt-8 px-7 pb-0 shrink-0'>
				<div className='flex justify-between items-start'>
					<div>
						<div className='flex items-center gap-2.5 mb-1.5'>
							<div className='w-2 h-2 rounded-full' style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
							<span
								className='uppercase opacity-70'
								style={{ fontFamily: "'Exo 2'", fontSize: 12, color: accent, letterSpacing: 3 }}
							>
								{node.cat}
							</span>
						</div>
						<div style={{ fontFamily: "'Orbitron'", fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: 2 }}>
							{detail.title}
						</div>
						<div
							className='mt-1'
							style={{ fontFamily: "'Exo 2'", fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}
						>
							{detail.subtitle}
						</div>
					</div>
					<button
						onClick={onClose}
						className='w-8 h-8 rounded flex items-center justify-center text-base cursor-pointer transition-all duration-200 shrink-0'
						style={{
							background: 'rgba(255,255,255,0.05)',
							border: '1px solid rgba(255,255,255,0.1)',
							color: 'rgba(255,255,255,0.4)',
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLButtonElement).style.borderColor = accent;
							(e.currentTarget as HTMLButtonElement).style.color = accent;
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
							(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)';
						}}
					>
						×
					</button>
				</div>
				<div
					className='w-[50px] h-0.5 my-4'
					style={{ background: `linear-gradient(to right,${accent},transparent)` }}
				/>
			</div>

			{/* Scrollable content */}
			<div className='flex-1 overflow-y-auto px-7 pb-8'>
				<p
					className='mb-6'
					style={{ fontFamily: "'Exo 2'", fontSize: 15, color: 'rgba(200,214,229,0.7)', lineHeight: 1.8 }}
				>
					{detail.desc}
				</p>

				<div className='flex flex-wrap gap-2 mb-7'>
					{detail.tags.map((tag) => (
						<span
							key={tag}
							className='px-3 py-1 rounded-sm'
							style={{
								border: `1px solid ${accent}30`,
								fontFamily: "'JetBrains Mono'",
								fontSize: 12,
								color: `${accent}cc`,
								letterSpacing: 1,
								background: `${accent}08`,
							}}
						>
							{tag}
						</span>
					))}
				</div>

				{detail.link && (
					<div
						className='px-4 py-3 rounded mb-6'
						style={{
							background: 'rgba(255,255,255,0.03)',
							border: `1px solid ${accent}20`,
						}}
					>
						<div
							className='mb-1.5'
							style={{
								fontFamily: "'JetBrains Mono'",
								fontSize: 12,
								color: 'rgba(255,255,255,0.35)',
								letterSpacing: 2,
							}}
						>
							SOURCE CODE
						</div>
						<div style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, color: accent }}>↗ {detail.link}</div>
					</div>
				)}

				{detail.links && (
					<div className='mb-6'>
						<div
							className='mb-2.5'
							style={{
								fontFamily: "'JetBrains Mono'",
								fontSize: 12,
								color: 'rgba(255,255,255,0.35)',
								letterSpacing: 2,
							}}
						>
							LINKS
						</div>
						{detail.links.map((l) => (
							<a
								key={l.label}
								className='px-3.5 py-2 rounded mb-1.5 cursor-pointer block'
								style={{
									background: 'rgba(255,255,255,0.03)',
									border: `1px solid ${accent}15`,
									fontFamily: "'JetBrains Mono'",
									fontSize: 13,
									color: accent,
								}}
								href={l.url}
								target='_blank'
								rel='noopener noreferrer'
							>
								↗ {l.label} — {l.url}
							</a>
						))}
					</div>
				)}

				{connNodes.length > 0 && (
					<div>
						<div
							className='mb-2.5'
							style={{
								fontFamily: "'JetBrains Mono'",
								fontSize: 12,
								color: 'rgba(255,255,255,0.35)',
								letterSpacing: 2,
							}}
						>
							CONNECTED NODES ({connNodes.length})
						</div>
						<div className='flex flex-col gap-1'>
							{connNodes.map((cn) => (
								<button
									key={cn.id}
									onClick={() => onNavigate(cn.id)}
									className='flex items-center gap-2.5 px-3 py-2 rounded cursor-pointer text-left transition-all duration-200 w-full'
									style={{
										background: 'rgba(255,255,255,0.02)',
										border: '1px solid rgba(255,255,255,0.06)',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = `${getColor(cn.cat as NodeCategory)}10`;
										e.currentTarget.style.borderColor = `${getColor(cn.cat as NodeCategory)}30`;
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
									}}
								>
									<div
										className='w-1.5 h-1.5 rounded-full shrink-0'
										style={{
											background: getColor(cn.cat),
											boxShadow: `0 0 6px ${getColor(cn.cat)}`,
										}}
									/>
									<span style={{ fontFamily: "'Exo 2'", fontSize: 14, color: 'rgba(200,214,229,0.7)' }}>
										{cn.label}
									</span>
									<span
										className='ml-auto uppercase'
										style={{
											fontFamily: "'JetBrains Mono'",
											fontSize: 11,
											color: 'rgba(255,255,255,0.25)',
											letterSpacing: 1,
										}}
									>
										{cn.cat}
									</span>
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
