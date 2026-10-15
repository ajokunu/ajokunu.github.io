export const profile = {
	name: 'Aaron Lindahl',
	koreanName: '애런 린달',
	title: 'Lead Information Security Consultant',
	company: 'Capital One',
	location: 'New York, NY',
	school: 'NYU Tandon School of Engineering',
	bio: 'Security Engineer @ Capital One | Cloud + AI Security | AI Builder | AWS Community Builder | NYU Tandon',
	tagline: 'I make clouds secure and dungeons dangerous.',
	avatar: 'https://avatars.githubusercontent.com/u/65878280?v=4',
	github: 'https://github.com/ajokunu',
	linkedin: 'https://www.linkedin.com/in/aaron-lindahl-58574a108',
	medium: 'https://medium.com/@AaronLJ',
	awsCommunity: 'https://community.aws/u/ajokunu',
	email: null,
	githubHandle: 'ajokunu',
	followers: '6,000',
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
		date: '2026 - Present',
		title: 'Capital One',
		subtitle: 'Lead Information Security Consultant - New York, NY',
		detail: 'Security architecture and engineering for financial services infrastructure. Built a Claude skill that does the first pass of API security review against internal policy, and designs network connectivity and IAM for large partner networks.',
		tags: []
	},
	{
		type: 'job',
		date: '2024 - 2026',
		title: 'Mastercard',
		subtitle: 'Senior Information Security Engineer - Boston, MA',
		detail: 'Cloud security engineering. Shipped mTLS and VPC PrivateLink across 12 AWS accounts, ran 25 security architecture reviews, scanned 42 MCP servers and built data sanitization guardrails for AI systems, and cut third-party system reviews from a week to 30 minutes with LLM automation.',
		tags: []
	},
	{
		type: 'project',
		date: '2025 - Present',
		title: 'TableTalesAI',
		subtitle: 'Production AI Game Master on Claude',
		detail: 'AI-powered virtual tabletop (tabletalesai.com), grown from Donnie the Robot DM. Write-ahead audit and undo for every agent tool call, a deterministic engine the model can only narrate, model routing across Claude tiers on the Anthropic API or Amazon Bedrock, and a prompt-injection guardrail on uploaded documents.',
		tags: ['TypeScript', 'Claude API', 'Bedrock', 'pgvector', 'Agent Security'],
		isNew: true,
		url: 'https://tabletalesai.com'
	},
	{
		type: 'project',
		date: '2026',
		title: 'PhantomPacket',
		subtitle: 'ML Classifier for Slopsquatting',
		detail: 'Detects hallucinated package names from the name alone: about 65 lexical, naming, semantic and statistical features and 12 classifier families, with notebooks, tests, CI and a paper.',
		tags: ['Python', 'scikit-learn', 'XGBoost', 'AI Supply Chain'],
		url: 'https://github.com/ajokunu/phantompacket'
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
		date: '2023',
		title: "Tenser's Floating Distro",
		subtitle: 'Deep Learning Stat Block Generator',
		detail: 'Early, unfinished deep learning experiment for generating D&D stat blocks.',
		tags: ['Deep Learning', 'D&D'],
		stars: 1,
		url: 'https://github.com/ajokunu/Tensers-floating-Distro'
	},
	{
		type: 'job',
		date: '2024',
		title: 'Mass General Brigham',
		subtitle: 'Senior Information Security Engineer - Boston, MA',
		detail: 'Greenfield Azure security architecture enforcing NIST 800-53, FedRAMP Moderate and HITRUST through Azure Policy, CrowdStrike CNAPP across 80,000+ cloud assets in AWS, Azure and GCP, and a secure container image CI/CD pipeline aligned with CIS Benchmarks.',
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
		date: '2022 - 2024',
		title: 'Tenable',
		subtitle: 'IT Engineer II - Columbia, MD (Remote)',
		detail: 'Enterprise technical support for Tenable.vm, Tenable.sc and Nessus deployments, SAML, LDAP and Entra ID integrations via Okta, and Python and Bash automation for vulnerability management workflows.',
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
		date: '2022',
		title: 'Wayfair',
		subtitle: 'IT Support Engineer - Boston, MA',
		detail: 'Managed 100+ endpoints and 3 network stacks at 99.9% uptime, and implemented IAM roles with Intune and Entra ID.',
		tags: []
	},
	{
		type: 'job',
		date: '2019 - 2022',
		title: 'Community Health Options',
		subtitle: 'IT Support Specialist - Lewiston, ME',
		detail: 'Help desk support and Active Directory IAM administration. Where it started.',
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
