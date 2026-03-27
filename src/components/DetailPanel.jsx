import { useMemo } from 'react';
import { C, NODES, DETAILS } from '../constants';
import { getColor, getConnected } from '../utils';

export default function DetailPanel({ nodeId, onClose, onNavigate }) {
	const detail = DETAILS[nodeId];
	const node = NODES.find((n) => n.id === nodeId);
	const connected = useMemo(() => getConnected(nodeId), [nodeId]);
	const connNodes = useMemo(() => NODES.filter((n) => connected.has(n.id)), [connected]);

	if (!detail || !node) return null;
	const accent = getColor(node.cat);

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				right: 0,
				width: 380,
				height: '100%',
				background: C.panelBg,
				borderLeft: `1px solid ${C.panelBorder}`,
				backdropFilter: 'blur(20px)',
				animation: 'slideInRight 0.4s ease',
				display: 'flex',
				flexDirection: 'column',
				zIndex: 50,
				boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
			}}
		>
			<div
				style={{
					position: 'absolute',
					width: '100%',
					height: 2,
					background: `linear-gradient(to right,transparent,${accent}11,transparent)`,
					animation: 'scanline 5s linear infinite',
					pointerEvents: 'none',
				}}
			/>
			<div style={{ padding: '28px 24px 0', flexShrink: 0 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
					<div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
							<div
								style={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									background: accent,
									boxShadow: `0 0 12px ${accent}`,
								}}
							/>
							<span
								style={{
									fontFamily: "'Exo 2'",
									fontSize: 10,
									color: accent,
									letterSpacing: 3,
									textTransform: 'uppercase',
									opacity: 0.7,
								}}
							>
								{node.cat}
							</span>
						</div>
						<div style={{ fontFamily: "'Orbitron'", fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: 2 }}>
							{detail.title}
						</div>
						<div
							style={{
								fontFamily: "'Exo 2'",
								fontSize: 12,
								color: 'rgba(255,255,255,0.4)',
								marginTop: 4,
								letterSpacing: 1,
							}}
						>
							{detail.subtitle}
						</div>
					</div>
					<button
						onClick={onClose}
						style={{
							background: 'rgba(255,255,255,0.05)',
							border: '1px solid rgba(255,255,255,0.1)',
							color: 'rgba(255,255,255,0.4)',
							width: 32,
							height: 32,
							borderRadius: 4,
							cursor: 'pointer',
							fontSize: 16,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transition: 'all 0.2s',
						}}
						onMouseEnter={(e) => {
							e.target.style.borderColor = accent;
							e.target.style.color = accent;
						}}
						onMouseLeave={(e) => {
							e.target.style.borderColor = 'rgba(255,255,255,0.1)';
							e.target.style.color = 'rgba(255,255,255,0.4)';
						}}
					>
						×
					</button>
				</div>
				<div
					style={{
						width: 50,
						height: 2,
						background: `linear-gradient(to right,${accent},transparent)`,
						margin: '16px 0',
					}}
				/>
			</div>
			<div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
				<p
					style={{
						fontFamily: "'Exo 2'",
						fontSize: 13,
						color: 'rgba(200,214,229,0.7)',
						lineHeight: 1.8,
						margin: '0 0 20px',
					}}
				>
					{detail.desc}
				</p>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
					{detail.tags.map((tag) => (
						<span
							key={tag}
							style={{
								padding: '4px 12px',
								border: `1px solid ${accent}30`,
								borderRadius: 3,
								fontFamily: "'JetBrains Mono'",
								fontSize: 10,
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
						style={{
							padding: '12px 16px',
							background: 'rgba(255,255,255,0.03)',
							border: `1px solid ${accent}20`,
							borderRadius: 4,
							marginBottom: 24,
						}}
					>
						<div
							style={{
								fontFamily: "'JetBrains Mono'",
								fontSize: 10,
								color: 'rgba(255,255,255,0.35)',
								letterSpacing: 2,
								marginBottom: 6,
							}}
						>
							SOURCE CODE
						</div>
						<div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12, color: accent }}>↗ {detail.link}</div>
					</div>
				)}
				{detail.links && (
					<div style={{ marginBottom: 24 }}>
						<div
							style={{
								fontFamily: "'JetBrains Mono'",
								fontSize: 10,
								color: 'rgba(255,255,255,0.35)',
								letterSpacing: 2,
								marginBottom: 10,
							}}
						>
							LINKS
						</div>
						{detail.links.map((l) => (
							<div
								key={l.label}
								style={{
									padding: '8px 14px',
									background: 'rgba(255,255,255,0.03)',
									border: `1px solid ${accent}15`,
									borderRadius: 4,
									marginBottom: 6,
									fontFamily: "'JetBrains Mono'",
									fontSize: 11,
									color: accent,
									cursor: 'pointer',
								}}
							>
								↗ {l.label} — {l.url}
							</div>
						))}
					</div>
				)}
				{connNodes.length > 0 && (
					<div>
						<div
							style={{
								fontFamily: "'JetBrains Mono'",
								fontSize: 10,
								color: 'rgba(255,255,255,0.35)',
								letterSpacing: 2,
								marginBottom: 10,
							}}
						>
							CONNECTED NODES ({connNodes.length})
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
							{connNodes.map((cn) => (
								<button
									key={cn.id}
									onClick={() => onNavigate(cn.id)}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 10,
										padding: '8px 12px',
										background: 'rgba(255,255,255,0.02)',
										border: '1px solid rgba(255,255,255,0.06)',
										borderRadius: 4,
										cursor: 'pointer',
										textAlign: 'left',
										transition: 'all 0.2s',
										width: '100%',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = `${getColor(cn.cat)}10`;
										e.currentTarget.style.borderColor = `${getColor(cn.cat)}30`;
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
									}}
								>
									<div
										style={{
											width: 6,
											height: 6,
											borderRadius: '50%',
											background: getColor(cn.cat),
											boxShadow: `0 0 6px ${getColor(cn.cat)}`,
											flexShrink: 0,
										}}
									/>
									<span style={{ fontFamily: "'Exo 2'", fontSize: 12, color: 'rgba(200,214,229,0.7)' }}>
										{cn.label}
									</span>
									<span
										style={{
											fontFamily: "'JetBrains Mono'",
											fontSize: 9,
											color: 'rgba(255,255,255,0.25)',
											marginLeft: 'auto',
											textTransform: 'uppercase',
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
