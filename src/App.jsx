import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { C, NODES, EDGES, CATEGORIES } from './constants';
import { getColor, getConnected } from './utils';
import BootSequence from './components/BootSequence';
import DetailPanel from './components/DetailPanel';
import NodeLabels from './components/NodeLabels';
import TopBar from './components/TopBar';
import SideNav from './components/SideNav';
import AboutOverlay from './components/AboutOverlay';
import BottomHUD from './components/BottomHUD';

export default function App() {
	const mountRef = useRef(null);
	const sceneData = useRef({});
	const mouseRef = useRef({ isDragging: false, prevX: 0, prevY: 0 });
	const rotRef = useRef({ theta: 0.3, phi: 0.5, radius: 90, targetTheta: 0.3, targetPhi: 0.5, targetRadius: 58 });

	const [booting, setBooting] = useState(true);
	const [selected, setSelected] = useState(null);
	const [hovered, setHovered] = useState(null);
	const [labelPositions, setLabelPositions] = useState([]);
	const [activeFilters, setActiveFilters] = useState(new Set(['core', 'competency', 'tech', 'project', 'experience']));
	const [navOpen, setNavOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showAbout, setShowAbout] = useState(false);
	const [ready, setReady] = useState(false);

	const selectedRef = useRef(null);
	const hoveredRef = useRef(null);
	const filtersRef = useRef(activeFilters);
	const frameRef = useRef(0);
	const sizeRef = useRef({ w: 0, h: 0 });

	useEffect(() => { selectedRef.current = selected; }, [selected]);
	useEffect(() => { hoveredRef.current = hovered; }, [hovered]);
	useEffect(() => { filtersRef.current = activeFilters; }, [activeFilters]);

	useEffect(() => {
		if (selected) {
			const node = NODES.find((n) => n.id === selected);
			if (node) {
				const [x, y, z] = node.pos;
				const theta = Math.atan2(x, z);
				const r = Math.sqrt(x * x + y * y + z * z) || 1;
				const phi = Math.acos(y / r);
				rotRef.current.targetTheta = theta + Math.PI;
				rotRef.current.targetPhi = Math.max(0.3, Math.min(Math.PI - 0.3, phi));
				rotRef.current.targetRadius = 28;
			}
		} else {
			rotRef.current.targetRadius = 58;
		}
	}, [selected]);

	useEffect(() => {
		const container = mountRef.current;
		if (!container) return;
		const w = container.clientWidth, h = container.clientHeight;
		sizeRef.current = { w, h };

		const scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x04060e, 0.009);
		const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 500);
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
		renderer.setSize(w, h);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x04060e);
		container.appendChild(renderer.domElement);

		// Particles
		const pCount = 3000;
		const pGeo = new THREE.BufferGeometry();
		const pPos = new Float32Array(pCount * 3);
		for (let i = 0; i < pCount; i++) {
			pPos[i * 3] = (Math.random() - 0.5) * 250;
			pPos[i * 3 + 1] = (Math.random() - 0.5) * 250;
			pPos[i * 3 + 2] = (Math.random() - 0.5) * 250;
		}
		pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
		const pMat = new THREE.PointsMaterial({ color: 0x2255aa, size: 0.35, transparent: true, opacity: 0.5, sizeAttenuation: true, blending: THREE.AdditiveBlending });
		const particles = new THREE.Points(pGeo, pMat);
		scene.add(particles);

		// Nebula
		for (let i = 0; i < 4; i++) {
			const ng = new THREE.PlaneGeometry(80 + i * 40, 80 + i * 40);
			const nm = new THREE.MeshBasicMaterial({ color: new THREE.Color(i % 2 === 0 ? 0x0a1a3a : 0x1a0a2a), transparent: true, opacity: 0.03, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
			const n = new THREE.Mesh(ng, nm);
			n.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
			n.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
			scene.add(n);
		}

		// Grid
		const gridGeo = new THREE.PlaneGeometry(150, 150, 50, 50);
		const gridMat = new THREE.MeshBasicMaterial({ color: 0x0a1628, wireframe: true, transparent: true, opacity: 0.1 });
		const grid = new THREE.Mesh(gridGeo, gridMat);
		grid.rotation.x = -Math.PI / 2;
		grid.position.y = -14;
		scene.add(grid);

		// Nodes
		const nodeMeshes = {};
		NODES.forEach((n) => {
			const color = new THREE.Color(getColor(n.cat));
			const group = new THREE.Group();
			group.position.set(...n.pos);
			const geo = new THREE.SphereGeometry(n.size * 0.45, 32, 32);
			const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
			const mesh = new THREE.Mesh(geo, mat);
			group.add(mesh);
			const glowGeo = new THREE.SphereGeometry(n.size * 0.75, 32, 32);
			const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
			const glow = new THREE.Mesh(glowGeo, glowMat);
			group.add(glow);
			const ringGeo = new THREE.RingGeometry(n.size * 0.7, n.size * 0.85, 48);
			const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.06, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
			const ring = new THREE.Mesh(ringGeo, ringMat);
			group.add(ring);
			if (n.cat === 'core' || n.cat === 'project') {
				const hg = new THREE.RingGeometry(n.size * 1.1, n.size * 1.2, 6);
				const hm = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.08, side: THREE.DoubleSide, blending: THREE.AdditiveBlending });
				group.add(new THREE.Mesh(hg, hm));
			}
			scene.add(group);
			nodeMeshes[n.id] = { group, mesh, glow, ring, node: n };
		});

		// Edges
		const edgeMeshes = [];
		EDGES.forEach(([fId, tId]) => {
			const f = NODES.find((n) => n.id === fId), t = NODES.find((n) => n.id === tId);
			if (!f || !t) return;
			const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...f.pos), new THREE.Vector3(...t.pos)]);
			const mat = new THREE.LineBasicMaterial({ color: new THREE.Color(C.edge), transparent: true, opacity: 0.18 });
			const line = new THREE.Line(geo, mat);
			scene.add(line);
			edgeMeshes.push({ line, from: f, to: t, mat });
		});

		// Flow particles
		const flowParticles = [];
		EDGES.forEach(([fId, tId], i) => {
			if (i % 3 !== 0) return;
			const f = NODES.find((n) => n.id === fId), t = NODES.find((n) => n.id === tId);
			if (!f || !t) return;
			const geo = new THREE.SphereGeometry(0.12, 8, 8);
			const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.core), transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
			const p = new THREE.Mesh(geo, mat);
			scene.add(p);
			flowParticles.push({ mesh: p, from: new THREE.Vector3(...f.pos), to: new THREE.Vector3(...t.pos), t: Math.random(), speed: 0.0015 + Math.random() * 0.003, fromId: fId, toId: tId });
		});

		sceneData.current = { scene, camera, renderer, nodeMeshes, edgeMeshes, flowParticles, particles, grid };

		let animId;
		const clock = new THREE.Clock();
		const animate = () => {
			animId = requestAnimationFrame(animate);
			const t = clock.getElapsedTime();
			frameRef.current++;
			const rot = rotRef.current;
			if (!mouseRef.current.isDragging && !selectedRef.current) rot.targetTheta += 0.0006;
			rot.theta += (rot.targetTheta - rot.theta) * 0.035;
			rot.phi += (rot.targetPhi - rot.phi) * 0.035;
			rot.radius += (rot.targetRadius - rot.radius) * 0.025;
			const cp = Math.max(0.15, Math.min(Math.PI - 0.15, rot.phi));
			camera.position.x = rot.radius * Math.sin(cp) * Math.sin(rot.theta);
			camera.position.y = rot.radius * Math.cos(cp);
			camera.position.z = rot.radius * Math.sin(cp) * Math.cos(rot.theta);
			camera.lookAt(0, 0, 0);

			const filters = filtersRef.current;
			const sel = selectedRef.current;
			const hov = hoveredRef.current;
			const connSel = sel ? getConnected(sel) : new Set();
			const connHov = hov ? getConnected(hov) : new Set();

			Object.values(nodeMeshes).forEach(({ group, glow, ring, node: nd }) => {
				const vis = filters.has(nd.cat);
				const isSel = sel === nd.id;
				const isConn = sel && connSel.has(nd.id);
				const isHov = hov === nd.id;
				const isHovConn = hov && connHov.has(nd.id);
				const dimmed = sel && !isSel && !isConn;
				const hovDim = hov && !isHov && !isHovConn && !sel;
				const targetOp = !vis ? 0 : dimmed ? 0.15 : hovDim ? 0.35 : 1;
				group.children.forEach((child, ci) => {
					if (ci === 0) {
						const cur = child.material.opacity;
						child.material.opacity = cur + (targetOp - cur) * 0.08;
					} else if (child === glow) {
						const pulse = Math.sin(t * 2 + nd.pos[0]) * 0.05 + 0.1;
						child.material.opacity = (isSel ? 0.25 : isHov ? 0.2 : pulse) * targetOp;
					} else if (child === ring) {
						const s = 1 + Math.sin(t * 1.5 + nd.pos[1]) * 0.12;
						child.scale.set(s, s, s);
						child.lookAt(camera.position);
						child.material.opacity = 0.06 * targetOp;
					} else {
						child.lookAt(camera.position);
						child.rotation.z = t * 0.2;
						child.material.opacity = 0.08 * targetOp;
					}
				});
				if (isSel) {
					const s = 1 + Math.sin(t * 3) * 0.08;
					group.scale.set(s, s, s);
				} else if (isHov) group.scale.set(1.12, 1.12, 1.12);
				else {
					const cs = group.scale.x;
					const ns = cs + (1 - cs) * 0.08;
					group.scale.set(ns, ns, ns);
				}
			});

			edgeMeshes.forEach(({ mat: m, from: f, to: tt }) => {
				const fv = filters.has(f.cat), tv = filters.has(tt.cat), bv = fv && tv;
				const isAct = sel && (f.id === sel || tt.id === sel) && bv;
				const isHovAct = hov && (f.id === hov || tt.id === hov) && bv;
				const dim = sel && !isAct;
				m.opacity = !bv ? 0 : isAct ? 0.6 : isHovAct && !sel ? 0.4 : dim ? 0.05 : 0.15;
				m.color.set(isAct ? C.edgeActive : isHovAct && !sel ? C.core : C.edge);
			});

			flowParticles.forEach((fp) => {
				fp.t += fp.speed;
				if (fp.t > 1) fp.t = 0;
				fp.mesh.position.lerpVectors(fp.from, fp.to, fp.t);
				const fv = filters.has(NODES.find((n) => n.id === fp.fromId)?.cat);
				const tv = filters.has(NODES.find((n) => n.id === fp.toId)?.cat);
				fp.mesh.material.opacity = fv && tv ? Math.sin(fp.t * Math.PI) * 0.6 : 0;
			});

			particles.rotation.y = t * 0.008;
			particles.rotation.x = t * 0.003;
			const gp = grid.geometry.attributes.position;
			for (let i = 0; i < gp.count; i++) {
				const x = gp.getX(i), z = gp.getY(i);
				gp.setZ(i, Math.sin(x * 0.08 + t * 0.4) * Math.cos(z * 0.08 + t * 0.25) * 0.6);
			}
			gp.needsUpdate = true;
			renderer.render(scene, camera);

			if (frameRef.current % 2 === 0) {
				const { w: sw, h: sh } = sizeRef.current;
				const nl = NODES.map((n) => {
					const v = new THREE.Vector3(...n.pos);
					v.project(camera);
					const x = (v.x * 0.5 + 0.5) * sw, y = (-v.y * 0.5 + 0.5) * sh;
					const dist = camera.position.distanceTo(new THREE.Vector3(...n.pos));
					const op = Math.max(0.15, Math.min(1, 1 - (dist - 15) / 65));
					const sc = Math.max(0.45, Math.min(1.3, 28 / dist));
					return { id: n.id, label: n.label, cat: n.cat, x, y, opacity: op, scale: sc, behind: v.z > 1 };
				});
				setLabelPositions(nl);
			}
		};
		animate();
		setTimeout(() => setReady(true), 500);

		const onResize = () => {
			const nw = container.clientWidth, nh = container.clientHeight;
			sizeRef.current = { w: nw, h: nh };
			camera.aspect = nw / nh;
			camera.updateProjectionMatrix();
			renderer.setSize(nw, nh);
		};
		window.addEventListener('resize', onResize);
		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', onResize);
			if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
			renderer.dispose();
		};
	}, []);

	const handlePointerDown = useCallback((e) => {
		mouseRef.current.isDragging = true;
		const cx = e.clientX || e.touches?.[0]?.clientX || 0;
		const cy = e.clientY || e.touches?.[0]?.clientY || 0;
		mouseRef.current.prevX = cx;
		mouseRef.current.prevY = cy;
	}, []);

	const handlePointerMove = useCallback((e) => {
		const m = mouseRef.current;
		const cx = e.clientX || e.touches?.[0]?.clientX || 0;
		const cy = e.clientY || e.touches?.[0]?.clientY || 0;
		if (m.isDragging) {
			const dx = cx - m.prevX, dy = cy - m.prevY;
			rotRef.current.targetTheta -= dx * 0.005;
			rotRef.current.targetPhi += dy * 0.005;
			rotRef.current.targetPhi = Math.max(0.25, Math.min(Math.PI - 0.25, rotRef.current.targetPhi));
			m.prevX = cx;
			m.prevY = cy;
		}
	}, []);

	const handlePointerUp = useCallback(() => { mouseRef.current.isDragging = false; }, []);

	const handleWheel = useCallback((e) => {
		rotRef.current.targetRadius += e.deltaY * 0.035;
		rotRef.current.targetRadius = Math.max(18, Math.min(110, rotRef.current.targetRadius));
	}, []);

	const handleNodeClick = useCallback((id) => {
		setSelected((p) => (p === id ? null : id));
		setShowAbout(false);
	}, []);

	const toggleFilter = useCallback((cat) => {
		setActiveFilters((prev) => {
			const n = new Set(prev);
			if (n.has(cat)) { if (n.size > 1) n.delete(cat); } else n.add(cat);
			return n;
		});
	}, []);

	const filteredSearch = useMemo(() => {
		if (!searchQuery.trim()) return [];
		const q = searchQuery.toLowerCase();
		return NODES.filter((n) => n.label.toLowerCase().includes(q) || n.cat.toLowerCase().includes(q));
	}, [searchQuery]);

	const connectedToSelected = useMemo(() => (selected ? getConnected(selected) : new Set()), [selected]);

	const handleBootComplete = useCallback(() => setBooting(false), []);

	return (
		<div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: C.bg, position: 'relative' }}>
			<link
				href='https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500&family=Exo+2:wght@300;400;500;600;700&display=swap'
				rel='stylesheet'
			/>
			<style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideInLeft{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes scanline{0%{top:-2px}100%{top:100%}}
        @keyframes breathe{0%,100%{box-shadow:0 0 8px rgba(0,229,255,0.15)}50%{box-shadow:0 0 20px rgba(0,229,255,0.3)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .node-label{cursor:pointer;transition:transform 0.15s ease,filter 0.15s ease;user-select:none}
        .node-label:hover{filter:brightness(1.5) drop-shadow(0 0 8px currentColor)}
        .hud{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(0,229,255,0.35);letter-spacing:2px;text-transform:uppercase}
        .nav-btn{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);color:rgba(200,214,229,0.5);padding:8px 14px;border-radius:4px;cursor:pointer;font-family:'Exo 2',sans-serif;font-size:11px;transition:all 0.2s;letter-spacing:1px;display:flex;align-items:center;gap:8px;width:100%;text-align:left}
        .nav-btn:hover{background:rgba(0,229,255,0.06);border-color:rgba(0,229,255,0.2);color:rgba(200,214,229,0.8)}
        .nav-btn.active{background:rgba(0,229,255,0.08);border-color:rgba(0,229,255,0.3);color:#00e5ff}
        .filter-chip{padding:5px 12px;border-radius:3px;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:1.5px;transition:all 0.2s;border:1px solid;user-select:none}
        .search-input{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#c8d6e5;padding:8px 12px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11px;width:100%;outline:none;letter-spacing:1px;transition:border-color 0.2s}
        .search-input:focus{border-color:rgba(0,229,255,0.3)}
        .search-input::placeholder{color:rgba(200,214,229,0.2)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,229,255,0.15);border-radius:2px}
        *{box-sizing:border-box;margin:0;padding:0}
      `}</style>

			{booting && <BootSequence onComplete={handleBootComplete} />}

			<div
				ref={mountRef}
				style={{ position: 'absolute', inset: 0, cursor: 'grab' }}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerUp}
				onTouchStart={handlePointerDown}
				onTouchMove={handlePointerMove}
				onTouchEnd={handlePointerUp}
				onWheel={handleWheel}
			/>

			{ready && (
				<NodeLabels
					labelPositions={labelPositions}
					activeFilters={activeFilters}
					selected={selected}
					connectedToSelected={connectedToSelected}
					onNodeClick={handleNodeClick}
					onHover={setHovered}
				/>
			)}

			<TopBar
				booting={booting}
				navOpen={navOpen}
				onMenuToggle={() => { setNavOpen(!navOpen); setShowAbout(false); }}
				onAbout={() => { setShowAbout(!showAbout); setSelected(null); setNavOpen(false); }}
				onProjects={() => {
					setActiveFilters(new Set(['core', 'project']));
					setSelected(null);
					setShowAbout(false);
					setNavOpen(false);
					rotRef.current.targetRadius = 58;
				}}
				onContact={() => { handleNodeClick('sanskar'); setShowAbout(false); setNavOpen(false); }}
			/>

			{navOpen && (
				<SideNav
					selected={selected}
					activeFilters={activeFilters}
					searchQuery={searchQuery}
					filteredSearch={filteredSearch}
					onSearchChange={setSearchQuery}
					onNodeClick={(id) => { handleNodeClick(id); setSearchQuery(''); setNavOpen(false); }}
					onFilterToggle={toggleFilter}
					onShowAll={() => setActiveFilters(new Set(CATEGORIES.map((c) => c.id)))}
				/>
			)}

			{showAbout && (
				<AboutOverlay selected={selected} onClose={() => setShowAbout(false)} />
			)}

			{selected && !booting && (
				<DetailPanel nodeId={selected} onClose={() => setSelected(null)} onNavigate={handleNodeClick} />
			)}

			<BottomHUD booting={booting} activeFilters={activeFilters} onFilterToggle={toggleFilter} />
		</div>
	);
}
