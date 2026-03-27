import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { C, NODES, EDGES, CATEGORIES, type Node, type NodeCategory } from './constants';
import { getColor, getConnected } from './utils';
import BootSequence from './components/BootSequence';
import DetailPanel from './components/DetailPanel';
import NodeLabels, { type LabelPosition } from './components/NodeLabels';
import TopBar from './components/TopBar';
import SideNav from './components/SideNav';
import AboutOverlay from './components/AboutOverlay';
import BottomHUD from './components/BottomHUD';

type BasicMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;

interface NodeMeshData {
	group: THREE.Group;
	mesh: BasicMesh;
	glow: BasicMesh;
	ring: BasicMesh;
	node: Node;
}

interface EdgeMeshData {
	line: THREE.Line;
	from: Node;
	to: Node;
	mat: THREE.LineBasicMaterial;
}

interface FlowParticle {
	mesh: BasicMesh;
	from: THREE.Vector3;
	to: THREE.Vector3;
	t: number;
	speed: number;
	fromId: string;
	toId: string;
}

interface SceneData {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
	nodeMeshes: Record<string, NodeMeshData>;
	edgeMeshes: EdgeMeshData[];
	flowParticles: FlowParticle[];
	particles: THREE.Points;
	grid: THREE.Mesh;
}

interface RotState {
	theta: number;
	phi: number;
	radius: number;
	targetTheta: number;
	targetPhi: number;
	targetRadius: number;
}

interface MouseState {
	isDragging: boolean;
	prevX: number;
	prevY: number;
}

export default function App() {
	const mountRef = useRef<HTMLDivElement>(null);
	const sceneData = useRef<Partial<SceneData>>({});
	const mouseRef = useRef<MouseState>({ isDragging: false, prevX: 0, prevY: 0 });
	const rotRef = useRef<RotState>({ theta: 0.3, phi: 0.5, radius: 90, targetTheta: 0.3, targetPhi: 0.5, targetRadius: 58 });

	const [booting, setBooting] = useState(true);
	const [selected, setSelected] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [labelPositions, setLabelPositions] = useState<LabelPosition[]>([]);
	const [activeFilters, setActiveFilters] = useState<Set<NodeCategory>>(new Set(['core', 'competency', 'tech', 'project', 'experience']));
	const [navOpen, setNavOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showAbout, setShowAbout] = useState(false);
	const [ready, setReady] = useState(false);

	const selectedRef = useRef<string | null>(null);
	const hoveredRef = useRef<string | null>(null);
	const filtersRef = useRef<Set<NodeCategory>>(activeFilters);
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

		// Background particles
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

		// Nebula planes
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
		const nodeMeshes: Record<string, NodeMeshData> = {};
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
		const edgeMeshes: EdgeMeshData[] = [];
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
		const flowParticles: FlowParticle[] = [];
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

		let animId: number;
		const clock = new THREE.Clock();

		const animate = () => {
			animId = requestAnimationFrame(animate);
			const elapsed = clock.getElapsedTime();
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
			const connSel = sel ? getConnected(sel) : new Set<string>();
			const connHov = hov ? getConnected(hov) : new Set<string>();

			Object.values(nodeMeshes).forEach(({ group, mesh, glow, ring, node: nd }) => {
				const vis = filters.has(nd.cat);
				const isSel = sel === nd.id;
				const isConn = sel !== null && connSel.has(nd.id);
				const isHov = hov === nd.id;
				const isHovConn = hov !== null && connHov.has(nd.id);
				const dimmed = sel !== null && !isSel && !isConn;
				const hovDim = hov !== null && !isHov && !isHovConn && sel === null;
				const targetOp = !vis ? 0 : dimmed ? 0.15 : hovDim ? 0.35 : 1;

				const curOp = mesh.material.opacity;
				mesh.material.opacity = curOp + (targetOp - curOp) * 0.08;

				const pulse = Math.sin(elapsed * 2 + nd.pos[0]) * 0.05 + 0.1;
				glow.material.opacity = (isSel ? 0.25 : isHov ? 0.2 : pulse) * targetOp;

				const s = 1 + Math.sin(elapsed * 1.5 + nd.pos[1]) * 0.12;
				ring.scale.set(s, s, s);
				ring.lookAt(camera.position);
				ring.material.opacity = 0.06 * targetOp;

				// Hex ring (index 3) for core/project nodes
				if (nd.cat === 'core' || nd.cat === 'project') {
					const hexRing = group.children[3] as BasicMesh | undefined;
					if (hexRing) {
						hexRing.lookAt(camera.position);
						hexRing.rotation.z = elapsed * 0.2;
						hexRing.material.opacity = 0.08 * targetOp;
					}
				}

				if (isSel) {
					const sc = 1 + Math.sin(elapsed * 3) * 0.08;
					group.scale.set(sc, sc, sc);
				} else if (isHov) {
					group.scale.set(1.12, 1.12, 1.12);
				} else {
					const cs = group.scale.x;
					const ns = cs + (1 - cs) * 0.08;
					group.scale.set(ns, ns, ns);
				}
			});

			edgeMeshes.forEach(({ mat: m, from: f, to: tt }) => {
				const fv = filters.has(f.cat), tv = filters.has(tt.cat), bv = fv && tv;
				const isAct = sel !== null && (f.id === sel || tt.id === sel) && bv;
				const isHovAct = hov !== null && (f.id === hov || tt.id === hov) && bv;
				const dim = sel !== null && !isAct;
				m.opacity = !bv ? 0 : isAct ? 0.6 : (isHovAct && sel === null) ? 0.4 : dim ? 0.05 : 0.15;
				m.color.set(isAct ? C.edgeActive : (isHovAct && sel === null) ? C.core : C.edge);
			});

			flowParticles.forEach((fp) => {
				fp.t += fp.speed;
				if (fp.t > 1) fp.t = 0;
				fp.mesh.position.lerpVectors(fp.from, fp.to, fp.t);
				const fv = filters.has(NODES.find((n) => n.id === fp.fromId)?.cat ?? 'tech');
				const tv = filters.has(NODES.find((n) => n.id === fp.toId)?.cat ?? 'tech');
				fp.mesh.material.opacity = fv && tv ? Math.sin(fp.t * Math.PI) * 0.6 : 0;
			});

			particles.rotation.y = elapsed * 0.008;
			particles.rotation.x = elapsed * 0.003;
			const gp = grid.geometry.attributes['position'] as THREE.BufferAttribute;
			for (let i = 0; i < gp.count; i++) {
				const x = gp.getX(i), z = gp.getY(i);
				gp.setZ(i, Math.sin(x * 0.08 + elapsed * 0.4) * Math.cos(z * 0.08 + elapsed * 0.25) * 0.6);
			}
			gp.needsUpdate = true;
			renderer.render(scene, camera);

			if (frameRef.current % 2 === 0) {
				const { w: sw, h: sh } = sizeRef.current;
				const nl: LabelPosition[] = NODES.map((n) => {
					const v = new THREE.Vector3(...n.pos);
					v.project(camera);
					const lx = (v.x * 0.5 + 0.5) * sw, ly = (-v.y * 0.5 + 0.5) * sh;
					const dist = camera.position.distanceTo(new THREE.Vector3(...n.pos));
					const op = Math.max(0.15, Math.min(1, 1 - (dist - 15) / 65));
					const sc = Math.max(0.45, Math.min(1.3, 28 / dist));
					return { id: n.id, label: n.label, cat: n.cat, x: lx, y: ly, opacity: op, scale: sc, behind: v.z > 1 };
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

	const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		mouseRef.current.isDragging = true;
		mouseRef.current.prevX = e.clientX;
		mouseRef.current.prevY = e.clientY;
	}, []);

	const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
		const m = mouseRef.current;
		if (m.isDragging) {
			const dx = e.clientX - m.prevX, dy = e.clientY - m.prevY;
			rotRef.current.targetTheta -= dx * 0.005;
			rotRef.current.targetPhi += dy * 0.005;
			rotRef.current.targetPhi = Math.max(0.25, Math.min(Math.PI - 0.25, rotRef.current.targetPhi));
			m.prevX = e.clientX;
			m.prevY = e.clientY;
		}
	}, []);

	const handlePointerUp = useCallback(() => { mouseRef.current.isDragging = false; }, []);

	const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
		mouseRef.current.isDragging = true;
		const touch = e.touches[0];
		if (touch) { mouseRef.current.prevX = touch.clientX; mouseRef.current.prevY = touch.clientY; }
	}, []);

	const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
		const m = mouseRef.current;
		const touch = e.touches[0];
		if (m.isDragging && touch) {
			const dx = touch.clientX - m.prevX, dy = touch.clientY - m.prevY;
			rotRef.current.targetTheta -= dx * 0.005;
			rotRef.current.targetPhi += dy * 0.005;
			rotRef.current.targetPhi = Math.max(0.25, Math.min(Math.PI - 0.25, rotRef.current.targetPhi));
			m.prevX = touch.clientX;
			m.prevY = touch.clientY;
		}
	}, []);

	const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
		rotRef.current.targetRadius += e.deltaY * 0.035;
		rotRef.current.targetRadius = Math.max(18, Math.min(110, rotRef.current.targetRadius));
	}, []);

	const handleNodeClick = useCallback((id: string) => {
		setSelected((p) => (p === id ? null : id));
		setShowAbout(false);
	}, []);

	const toggleFilter = useCallback((cat: NodeCategory) => {
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

	const connectedToSelected = useMemo(() => (selected ? getConnected(selected) : new Set<string>()), [selected]);

	const handleBootComplete = useCallback(() => setBooting(false), []);

	return (
		<div className="w-screen h-screen overflow-hidden relative cursor-grab" style={{ background: C.bg }}>
			{booting && <BootSequence onComplete={handleBootComplete} />}

			<div
				ref={mountRef}
				className="absolute inset-0"
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerUp}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
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
					setActiveFilters(new Set<NodeCategory>(['core', 'project']));
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
					onShowAll={() => setActiveFilters(new Set<NodeCategory>(CATEGORIES.map((c) => c.id)))}
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
