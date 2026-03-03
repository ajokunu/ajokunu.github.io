export const profile = {
	name: 'Aaron Lindahl',
	koreanName: '애런 린달',
	title: 'Security Engineer',
	company: 'Mastercard',
	location: 'Greater Boston',
	school: 'NYU Tandon School of Engineering',
	bio: 'Security Engineer @ Mastercard | Cloud Security + AI Builder | AWS Community Builder | NYU Engineering',
	tagline: 'I make clouds secure and dungeons dangerous.',
	avatar: 'https://avatars.githubusercontent.com/u/65878280?v=4',
	github: 'https://github.com/ajokunu',
	linkedin: 'https://www.linkedin.com/in/aaron-lindahl-58574a108',
	medium: 'https://medium.com/@ajokunu',
	awsCommunity: 'https://community.aws/u/ajokunu',
	email: 'aaron.lindahl@mastercard.com',
	githubHandle: 'ajokunu',
	followers: '4,502',
	connections: '500+'
};

export const branchConfig = {
	job:     { label: 'Career',            color: 'green',  direction: 'left'   },
	project: { label: 'Security Projects', color: 'blue',   direction: 'center' },
	dnd:     { label: 'D&D / Creative',    color: 'purple', direction: 'right'  }
};

export const branchOrder = ['job', 'project', 'dnd'];

export function getBranches(items) {
	const branches = { job: [], project: [], dnd: [] };
	for (const item of items) {
		branches[item.type].push(item);
	}
	return branches;
}

export const timeline = [
	{
		type: 'job',
		current: true,
		date: 'Current',
		title: 'Mastercard',
		subtitle: 'Security Engineer — Greater Boston',
		detail: 'Cloud Security + AI Builder. Designing threat models, guiding secure cloud adoption, and shaping security strategy for critical financial infrastructure. AWS Community Builder.',
		tags: []
	},
	{
		type: 'project',
		date: '2026',
		title: 'ThreatCode',
		subtitle: 'STRIDE Threat Model Generator from IaC',
		detail: 'Automated threat model generator that analyzes Infrastructure-as-Code files. Feed it Terraform or CloudFormation and get comprehensive STRIDE analysis covering all six threat categories.',
		tags: ['Python', 'STRIDE', 'Terraform', 'CloudFormation'],
		stars: 0,
		isNew: true,
		url: 'https://github.com/ajokunu/ThreatCode'
	},
	{
		type: 'project',
		date: '2026',
		title: 'MatchBox',
		subtitle: 'Home SOC on Kubernetes',
		detail: 'Complete security operations center running on k3s. Integrates Wazuh for SIEM/XDR, OpenCTI for threat intelligence, TheHive/Cortex for incident response, and Grafana for monitoring. Includes MCP server integration.',
		tags: ['Svelte', 'k3s', 'Wazuh', 'OpenCTI', 'TheHive', 'MCP'],
		stars: 3,
		url: 'https://github.com/ajokunu/MatchBox'
	},
	{
		type: 'dnd',
		date: '2025',
		title: 'Donnie the Robot DM',
		subtitle: 'AI Dungeon Master via Claude API',
		detail: 'AI-powered Dungeon Master that manages campaigns, generates encounters, tracks character state, and delivers narrative with Clean Architecture principles.',
		tags: ['Python', 'Claude API', 'D&D'],
		url: 'https://github.com/ajokunu/DonnieTheRobotDMAlpha'
	},
	{
		type: 'project',
		date: '2026',
		title: 'Cloud Cost Security Detection',
		subtitle: 'Detect Attacks via Billing Anomalies',
		detail: 'Transforms AWS billing data into security signals. Detects cryptominers, data exfiltration, and resource abuse through cost anomaly patterns using Monte Carlo validation.',
		tags: ['Python', 'AWS', 'Security', 'Telemetry'],
		url: 'https://github.com/ajokunu/cloud-cost-security-detection'
	},
	{
		type: 'dnd',
		date: '2026',
		title: 'HomeBrewify',
		subtitle: 'D&D Markdown to Homebrewery',
		detail: 'Converts D&D campaign markdown to Homebrewery format for print-ready character sheets and campaign documents. Auto-detects content types, validates formatting, supports batch processing.',
		tags: ['TypeScript', 'Markdown', 'Homebrewery'],
		url: 'https://github.com/ajokunu/HomeBrewify'
	},
	{
		type: 'project',
		date: '2026',
		title: 'Capacities MCP',
		subtitle: 'MCP Server for Capacities.io',
		detail: 'Full CRUD Model Context Protocol server enabling AI agents to read, create, update, and delete content in your Capacities knowledge base.',
		tags: ['TypeScript', 'MCP', 'Capacities.io'],
		url: 'https://github.com/ajokunu/capacities-mcp'
	},
	{
		type: 'project',
		date: '2025',
		title: 'Servy',
		subtitle: 'Discord Bot for AWS Minecraft Server',
		detail: 'Discord bot to start, stop, and monitor an AWS-hosted Minecraft server. Lambda + DynamoDB backend.',
		tags: ['Discord', 'AWS Lambda', 'DynamoDB'],
		url: 'https://github.com/ajokunu/Servy'
	},
	{
		type: 'dnd',
		date: '2025',
		title: "Tenser's Floating Distro",
		subtitle: 'Deep Learning Stat Block Generator',
		detail: 'Neural network that generates balanced D&D stat blocks based on creature type, CR, and narrative context.',
		tags: ['Deep Learning', 'D&D'],
		stars: 1,
		url: 'https://github.com/ajokunu/Tensers-floating-Distro'
	},
	{
		type: 'job',
		date: 'Previous',
		title: 'Mass General Brigham',
		subtitle: 'Security Engineering — Boston, MA',
		detail: 'Built and maintained security infrastructure for one of the largest healthcare networks. Implemented detection pipelines and vulnerability management programs protecting sensitive patient data.',
		tags: []
	},
	{
		type: 'project',
		date: '2024',
		title: 'Tenable-Pypi-builds',
		subtitle: 'Tenable Product Integrations',
		detail: 'Collection of builds and integrations using Tenable products with PyTenable. Automated vulnerability scanning workflows and asset management tooling.',
		tags: ['Python', 'Tenable', 'Vuln Mgmt'],
		stars: 1,
		url: 'https://github.com/ajokunu/Tenable-Pypi-builds'
	},
	{
		type: 'job',
		date: 'Previous',
		title: 'Tenable',
		subtitle: 'Security Engineering — Columbia, MD',
		detail: 'Worked on vulnerability management tooling at one of the industry\'s leading cybersecurity companies. Deep expertise in vulnerability assessment and exposure management.',
		tags: []
	},
	{
		type: 'project',
		date: '2024',
		title: 'Text-Encryption-Tool',
		subtitle: 'Cryptography in Rust',
		detail: 'Text encryption utility implementing common cryptographic algorithms for secure message encoding and decoding.',
		tags: ['Rust', 'Cryptography'],
		url: 'https://github.com/ajokunu/Text-Encryption-Tool'
	},
	{
		type: 'job',
		date: 'Previous',
		title: 'Wayfair',
		subtitle: 'Security Engineering — Boston, MA',
		detail: 'Built security engineering capabilities at scale for one of the largest e-commerce platforms. Focused on cloud security and application security programs.',
		tags: []
	}
];

export const skills = [
	{ category: 'Languages', items: 'Python, TypeScript, Rust, Go, JavaScript' },
	{ category: 'Security', items: 'SIEM/XDR, Threat Modeling, IAM, Pentesting, IR' },
	{ category: 'Cloud & Infra', items: 'AWS, Azure, GCP, Kubernetes, Terraform' },
	{ category: 'Platforms', items: 'Wazuh, OpenCTI, TheHive, Grafana, Tenable' },
	{ category: 'Frontend', items: 'Svelte, Modern CSS, HTML5' },
	{ category: 'AI & Tools', items: 'Claude API, MCP, LLM Integration' }
];
