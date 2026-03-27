export const C = {
	bg: '#04060e',
	core: '#00e5ff',
	competency: '#a855f7',
	tech: '#22d3ee',
	project: '#f43f5e',
	experience: '#f59e0b',
	edge: '#0f2847',
	edgeActive: '#00e5ff',
	text: '#c8d6e5',
	panelBg: 'rgba(6,10,24,0.92)',
	panelBorder: 'rgba(0,229,255,0.12)',
} as const;

export type NodeCategory = 'core' | 'competency' | 'tech' | 'project' | 'experience';

export interface Node {
	id: string;
	label: string;
	cat: NodeCategory;
	pos: [number, number, number];
	size: number;
}

export type Edge = [string, string];

export interface DetailLink {
	label: string;
	url: string;
}

export interface Detail {
	title: string;
	subtitle: string;
	desc: string;
	tags: string[];
	link?: string;
	links?: DetailLink[];
}

export interface Category {
	id: NodeCategory;
	label: string;
	color: string;
}

export const NODES: Node[] = [
	{ id: 'sanskar', label: 'SANSKAR', cat: 'core', pos: [0, 0, 0], size: 2.2 },
	{ id: 'backend', label: 'Backend Architecture', cat: 'competency', pos: [10, 4, 6], size: 1.2 },
	{ id: 'realtime', label: 'Real-time Systems', cat: 'competency', pos: [-9, -3, 9], size: 1.2 },
	{ id: 'devtools', label: 'Developer Tooling', cat: 'competency', pos: [-11, 5, -7], size: 1.2 },
	{ id: 'frontend', label: 'Frontend Engineering', cat: 'competency', pos: [8, -4, -10], size: 1.2 },
	{ id: 'mobile', label: 'Mobile Development', cat: 'competency', pos: [-5, -6, -11], size: 1.2 },
	{ id: 'automation', label: 'Automation Systems', cat: 'competency', pos: [3, 7, -8], size: 1.2 },
	{ id: 'ts', label: 'TypeScript', cat: 'tech', pos: [-17, 7, -5], size: 0.7 },
	{ id: 'js', label: 'JavaScript', cat: 'tech', pos: [-15, 3, -13], size: 0.7 },
	{ id: 'python', label: 'Python', cat: 'tech', pos: [-19, 4, -11], size: 0.7 },
	{ id: 'java', label: 'Java', cat: 'tech', pos: [-21, 8, -3], size: 0.7 },
	{ id: 'react', label: 'React', cat: 'tech', pos: [13, -5, -17], size: 0.7 },
	{ id: 'nextjs', label: 'Next.js', cat: 'tech', pos: [17, -2, -13], size: 0.7 },
	{ id: 'tailwind', label: 'Tailwind CSS', cat: 'tech', pos: [10, -6, -19], size: 0.7 },
	{ id: 'nodejs', label: 'Node.js', cat: 'tech', pos: [16, 5, 11], size: 0.7 },
	{ id: 'express', label: 'Express', cat: 'tech', pos: [19, 3, 15], size: 0.7 },
	{ id: 'fastapi', label: 'FastAPI', cat: 'tech', pos: [21, 7, 7], size: 0.7 },
	{ id: 'mongodb', label: 'MongoDB', cat: 'tech', pos: [15, 6, 17], size: 0.7 },
	{ id: 'dynamodb', label: 'DynamoDB', cat: 'tech', pos: [23, 4, 5], size: 0.7 },
	{ id: 'ws', label: 'WebSockets', cat: 'tech', pos: [-15, -4, 16], size: 0.7 },
	{ id: 'socketio', label: 'Socket.io', cat: 'tech', pos: [-17, 1, 19], size: 0.7 },
	{ id: 'rn', label: 'React Native', cat: 'tech', pos: [-9, -8, -19], size: 0.7 },
	{ id: 'microservices', label: 'Microservices', cat: 'tech', pos: [13, 8, 5], size: 0.7 },
	{ id: 'vite', label: 'Vite', cat: 'tech', pos: [-13, 9, -9], size: 0.7 },
	{ id: 'git', label: 'Git', cat: 'tech', pos: [5, 10, -14], size: 0.7 },
	{ id: 'devxcode', label: 'devxcode', cat: 'project', pos: [-23, 6, -15], size: 0.95 },
	{ id: 'apimocker', label: 'api-mocker', cat: 'project', pos: [19, -4, -23], size: 0.95 },
	{ id: 'wautopilot', label: 'wautopilot', cat: 'project', pos: [-21, -3, 23], size: 0.95 },
	{ id: 'whatsleads', label: 'whatsleads.in', cat: 'project', pos: [25, 6, 19], size: 0.95 },
	{ id: 'exp_corp', label: 'Corporate (2 yrs)', cat: 'experience', pos: [6, -9, 5], size: 0.85 },
	{ id: 'exp_indie', label: 'Independent (3+ yrs)', cat: 'experience', pos: [-6, -10, -4], size: 0.85 },
];

export const EDGES: Edge[] = [
	['sanskar', 'backend'],
	['sanskar', 'realtime'],
	['sanskar', 'devtools'],
	['sanskar', 'frontend'],
	['sanskar', 'mobile'],
	['sanskar', 'automation'],
	['sanskar', 'exp_corp'],
	['sanskar', 'exp_indie'],
	['backend', 'nodejs'],
	['backend', 'express'],
	['backend', 'fastapi'],
	['backend', 'mongodb'],
	['backend', 'dynamodb'],
	['backend', 'microservices'],
	['realtime', 'ws'],
	['realtime', 'socketio'],
	['devtools', 'ts'],
	['devtools', 'python'],
	['devtools', 'java'],
	['devtools', 'js'],
	['devtools', 'vite'],
	['devtools', 'git'],
	['frontend', 'react'],
	['frontend', 'nextjs'],
	['frontend', 'tailwind'],
	['mobile', 'rn'],
	['automation', 'python'],
	['automation', 'nodejs'],
	['devxcode', 'ts'],
	['devxcode', 'react'],
	['devxcode', 'tailwind'],
	['devxcode', 'vite'],
	['apimocker', 'js'],
	['apimocker', 'react'],
	['wautopilot', 'nodejs'],
	['wautopilot', 'ws'],
	['wautopilot', 'mongodb'],
	['wautopilot', 'socketio'],
	['wautopilot', 'microservices'],
	['whatsleads', 'nodejs'],
	['whatsleads', 'mongodb'],
	['whatsleads', 'react'],
	['whatsleads', 'express'],
	['exp_corp', 'backend'],
	['exp_corp', 'realtime'],
	['exp_corp', 'microservices'],
	['exp_indie', 'devtools'],
	['exp_indie', 'frontend'],
	['exp_indie', 'mobile'],
];

export const DETAILS: Record<string, Detail> = {
	sanskar: {
		title: 'Sanskar',
		subtitle: 'Full-Stack Systems Engineer',
		desc: '5+ years building scalable systems, developer tools, and real-world applications. 2 years in production-grade corporate environments. I think in systems, not just features — prioritizing clean architecture, long-term scalability, and tools that reduce developer friction.',
		tags: ['Systems Thinker', 'Clean Architecture', 'Production-Ready', '5+ Years'],
		links: [
			{ label: 'GitHub', url: 'https://github.com/sanskari27' },
			{ label: 'LinkedIn', url: 'https://linkedin.com/' },
			{ label: 'Portfolio', url: 'https://sanskari27.github.io/' },
		],
	},
	backend: {
		title: 'Backend Architecture',
		subtitle: 'Core Competency',
		desc: 'Designing scalable backend systems and microservices with emphasis on performance, reliability, and clean architecture. Building APIs that handle high throughput with grace.',
		tags: ['Scalable', 'Microservices', 'High-Performance', 'API Design'],
	},
	realtime: {
		title: 'Real-time Systems',
		subtitle: 'Core Competency',
		desc: 'Building real-time communication layers using WebSockets and Socket.io — from chat systems to live dashboards and event-driven architectures.',
		tags: ['WebSockets', 'Event-Driven', 'Low Latency', 'Live Data'],
	},
	devtools: {
		title: 'Developer Tooling',
		subtitle: 'Core Competency',
		desc: 'Creating tools, extensions, and automation platforms that reduce developer friction. VS Code extensions, Chrome extensions, CLI tools — if it makes developers faster, I build it.',
		tags: ['DX-First', 'Automation', 'Extensions', 'CLI'],
	},
	frontend: {
		title: 'Frontend Engineering',
		subtitle: 'Core Competency',
		desc: 'Shipping polished, responsive frontend experiences with the React ecosystem. Complex SPAs, server-rendered apps, and pixel-perfect interfaces.',
		tags: ['React', 'Next.js', 'Responsive', 'SPA'],
	},
	mobile: {
		title: 'Mobile Development',
		subtitle: 'Core Competency',
		desc: 'Cross-platform mobile apps using React Native. Native-quality experiences from a single codebase, optimized for both iOS and Android.',
		tags: ['React Native', 'Cross-Platform', 'Mobile-First'],
	},
	automation: {
		title: 'Automation Systems',
		subtitle: 'Core Competency',
		desc: 'If it feels repetitive, I automate it. Building systems that eliminate manual workflows, streamline operations, and scale effortlessly.',
		tags: ['Workflow', 'Scripting', 'CI/CD', 'Zero Friction'],
	},
	devxcode: {
		title: 'devxcode',
		subtitle: 'VS Code Extension · Open Source',
		desc: 'Consolidates team workflows into a single productivity hub. Todos, repo tools, git helpers & release workflows with persistent state via VS Code Memento API.',
		tags: ['React', 'Vite', 'Tailwind', 'VS Code API'],
		link: 'https://github.com/sanskari27/devxcode',
	},
	apimocker: {
		title: 'api-mocker',
		subtitle: 'Chrome Extension · Open Source',
		desc: 'Mock APIs per tab with real-time behavior. Rule-based mocking with headers, status, body control. No refresh needed, per-tab isolation.',
		tags: ['Chrome API', 'JavaScript', 'Real-time'],
		link: 'https://github.com/sanskari27/api-mocker',
	},
	wautopilot: {
		title: 'wautopilot',
		subtitle: 'WhatsApp Automation · Private',
		desc: 'Full-scale WhatsApp automation for campaigns, chatbots, and team inbox. Real-time messaging with bot orchestration on scalable microservices.',
		tags: ['Node.js', 'WebSockets', 'MongoDB', 'Microservices'],
	},
	whatsleads: {
		title: 'whatsleads.in',
		subtitle: 'Lead Management · Private',
		desc: 'Full-stack lead management & communication platform. Multi-app architecture with admin + client + backend, analytics, and real-time comms.',
		tags: ['React', 'Node.js', 'MongoDB', 'Express'],
	},
	ts: { title: 'TypeScript', subtitle: 'Primary Language', desc: 'Type-safe development across the entire stack.', tags: ['Type Safety', 'Full-Stack'] },
	js: { title: 'JavaScript', subtitle: 'Language', desc: 'Deep expertise including browser APIs, Node.js, and extension development.', tags: ['ES6+', 'Browser APIs'] },
	python: { title: 'Python', subtitle: 'Language', desc: 'Backend services, automation, and FastAPI development.', tags: ['FastAPI', 'Automation'] },
	java: { title: 'Java', subtitle: 'Language', desc: 'Enterprise-grade application development.', tags: ['Enterprise', 'OOP'] },
	react: { title: 'React', subtitle: 'Frontend Framework', desc: 'Component-based UI with hooks, context, and the modern ecosystem.', tags: ['Hooks', 'Components'] },
	nextjs: { title: 'Next.js', subtitle: 'React Framework', desc: 'SSR, static generation, and full-stack React apps.', tags: ['SSR', 'SSG'] },
	tailwind: { title: 'Tailwind CSS', subtitle: 'Styling', desc: 'Utility-first CSS for rapid, consistent UI.', tags: ['Utility-First', 'Responsive'] },
	nodejs: { title: 'Node.js', subtitle: 'Runtime', desc: 'Server-side JS for APIs, real-time systems, and microservices.', tags: ['APIs', 'Scalable'] },
	express: { title: 'Express', subtitle: 'Backend Framework', desc: 'Minimal, flexible web framework for APIs.', tags: ['REST', 'Middleware'] },
	fastapi: { title: 'FastAPI', subtitle: 'Python Framework', desc: 'High-performance Python APIs with auto docs.', tags: ['Async', 'OpenAPI'] },
	mongodb: { title: 'MongoDB', subtitle: 'Database', desc: 'NoSQL document database for flexible storage.', tags: ['NoSQL', 'Aggregation'] },
	dynamodb: { title: 'DynamoDB', subtitle: 'Database', desc: 'AWS managed NoSQL for high throughput.', tags: ['AWS', 'Serverless'] },
	ws: { title: 'WebSockets', subtitle: 'Protocol', desc: 'Full-duplex real-time communication.', tags: ['Bidirectional', 'Low Latency'] },
	socketio: { title: 'Socket.io', subtitle: 'Library', desc: 'Real-time event-based communication.', tags: ['Events', 'Rooms'] },
	rn: { title: 'React Native', subtitle: 'Mobile Framework', desc: 'Cross-platform mobile with native performance.', tags: ['iOS', 'Android'] },
	microservices: { title: 'Microservices', subtitle: 'Architecture', desc: 'Distributed system design with service orchestration.', tags: ['Distributed', 'Resilient'] },
	vite: { title: 'Vite', subtitle: 'Build Tool', desc: 'Lightning-fast frontend tooling.', tags: ['HMR', 'ESBuild'] },
	git: { title: 'Git', subtitle: 'Version Control', desc: 'Advanced workflows, branching, and team collaboration.', tags: ['Branching', 'CI/CD'] },
	exp_corp: {
		title: 'Corporate Experience',
		subtitle: '2 Years · Production-Grade',
		desc: 'Production-grade corporate work on scalable backends, real-time architectures, and microservices serving real users at scale.',
		tags: ['Production', 'Scale', 'Enterprise'],
	},
	exp_indie: {
		title: 'Independent Work',
		subtitle: '3+ Years · Full-Stack',
		desc: 'Building developer tools, full-stack platforms, open-source projects, and mobile apps from concept to deployment.',
		tags: ['Open Source', 'End-to-End', 'Self-Driven'],
	},
};

export const CATEGORIES: Category[] = [
	{ id: 'core', label: 'Core', color: C.core },
	{ id: 'competency', label: 'Competencies', color: C.competency },
	{ id: 'tech', label: 'Technologies', color: C.tech },
	{ id: 'project', label: 'Projects', color: C.project },
	{ id: 'experience', label: 'Experience', color: C.experience },
];
