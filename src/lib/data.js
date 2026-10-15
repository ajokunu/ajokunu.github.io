// Every fact here was checked against Aaron's 2026 resume, his GitHub repos,
// and his Medium profile. Keep it that way: no em dashes, no unverifiable numbers.

export const profile = {
	name: 'Aaron Lindahl',
	koreanName: '애런 린달',
	role: 'AI and Cloud Security Engineer',
	company: 'Capital One',
	location: 'New York, NY',
	oneLiner:
		'I secure AI agents and cloud platforms in financial services, and I built TableTales, an AI Game Master that runs tabletop RPGs for you and your friends.',
	avatar: 'photo.jpg',
	github: 'https://github.com/ajokunu',
	githubHandle: 'ajokunu',
	linkedin: 'https://www.linkedin.com/in/aaron-lindahl-58574a108',
	medium: 'https://medium.com/@AaronLJ',
	// Assembled at runtime so scrapers don't get it for free
	emailParts: ['justuslindahl', 'gmail.com']
};

export const about = [
	'Since 2019 I have worked my way from the help desk to cloud security architecture, and I still like the same thing about the work: taking something complicated and making it safe enough that nobody has to think about it.',
	'Today I am a Lead Information Security Consultant at Capital One in New York, where I built a Claude skill that does the first pass of API security review. Before that I was a Senior Information Security Engineer at Mastercard, where I shipped a zero-trust mTLS and PrivateLink design across 12 AWS accounts, and at Mass General Brigham, where I rolled CrowdStrike CNAPP out across 80,000+ cloud assets.',
	'Outside of work I build TableTales, which started as a Discord bot called Donnie that ran my own D&D table and grew into a full AI-powered virtual tabletop. I am also finishing an M.Eng in Cybersecurity at NYU Tandon and studying Korean.'
];

export const experience = [
	{
		company: 'Capital One',
		title: 'Lead Information Security Consultant',
		team: 'Global Payment Network',
		dates: 'Apr 2026 to now',
		current: true,
		points: [
			'Built a Claude skill that analyzes APIs for security gaps against internal policy, automating the first pass of API security review.',
			'Designed and consulted on network connectivity and IAM architecture for large partner networks during the Discover integration.',
			'Run security design reviews and threat models, aligning controls to NIST, PCI DSS, and federal frameworks.'
		],
		tags: ['AI Security', 'IAM', 'Threat Modeling', 'Payments', 'Security Architecture']
	},
	{
		company: 'Mastercard',
		title: 'Senior Information Security Engineer',
		dates: 'Dec 2024 to 2026',
		points: [
			'Architected and shipped an mTLS + VPC PrivateLink zero-trust design across 12 AWS accounts in 6 months, removing network-only security dependencies.',
			'Led AI security work: scanned 42 MCP servers, wrote secure coding guidance, and built guardrails and data sanitization for AI applications.',
			'Ran 25 security architecture reviews (one a week) for enterprise SaaS integrations and third-party tools.',
			'Defined AWS WAF and Shield Advanced rules protecting 36+ APIs; mapped Entra ID to IAM Identity Center roles.',
			'Built a BlackDuck findings aggregator covering 50 to 100 repos, ran the 16-engineer Security Champions program, and mentored 2 junior engineers.'
		],
		tags: ['mTLS', 'PrivateLink', 'WAF', 'IAM Identity Center', 'AI Security', 'Prisma Cloud']
	},
	{
		company: 'Mass General Brigham',
		title: 'Senior Information Security Engineer',
		dates: 'Mar 2024 to Dec 2024',
		points: [
			'Deployed CrowdStrike CNAPP across 80,000+ cloud assets in AWS, Azure, and GCP.',
			'Architected security for a greenfield Azure environment, using Azure Policy to enforce NIST 800-53, FedRAMP Moderate, and HITRUST.',
			'Built a secure container image CI/CD pipeline aligned with CIS Benchmarks.'
		],
		tags: ['CNAPP', 'Azure Policy', 'NIST 800-53', 'HITRUST']
	},
	{
		company: 'Tenable',
		title: 'IT Engineer II',
		dates: 'Sep 2022 to Feb 2024',
		points: [
			'Supported enterprise customers rolling out Tenable.vm, Tenable.sc, and Nessus.',
			'Configured SAML 2.0, LDAP, and Entra ID integrations through Okta.'
		],
		tags: ['Nessus', 'Tenable.sc', 'SAML', 'Okta']
	},
	{
		company: 'Wayfair',
		title: 'IT Support Engineer',
		dates: 'Apr 2022 to Sep 2022',
		points: ['Managed 100+ endpoints and 3 network stacks at 99.9% uptime; implemented IAM roles with Intune and Entra ID.'],
		tags: ['Intune', 'Entra ID']
	},
	{
		company: 'Community Health Options',
		title: 'IT Support Specialist',
		dates: 'Dec 2019 to Apr 2022',
		points: ['Where it started: help desk and Active Directory identity management.'],
		tags: ['Active Directory']
	}
];

// Selected work: the projects worth a recruiter's first 30 seconds
// The flagship. Facts from app.tabletalesai.com and the April 2026 Medium post.
export const tableTales = {
	name: 'TableTales',
	url: 'https://app.tabletalesai.com/',
	tagline: 'No prep. No scheduling. Just adventure.',
	pitch:
		'An AI-powered virtual tabletop where the Game Master is an AI, built since May 2025 (3,600+ commits). Start a campaign solo, or invite friends and play together in the browser. The AI narrates the world, plays every character you meet, and runs the rules, so nobody has to spend Sunday night prepping.',
	systems: ['D&D 5e', 'Pathfinder 2e', 'FATE', 'and more'],
	modes: ['Solo play', 'Multiplayer with friends', 'Runs in the browser'],
	pillars: [
		{ k: 'The AI runs the table', v: 'A multiplayer Game Master that narrates, adjudicates, and keeps the story moving for the whole party.' },
		{ k: 'Built by a security engineer', v: 'Agent actions are reversible. I wrote about giving the Game Master an undo button so a bad call never corrupts a campaign.' },
		{ k: 'Where it started', v: 'It began as Donnie, a Claude-powered Discord DM for my own group, and grew into a full product.' }
	],
	post: 'https://medium.com/@AaronLJ/giving-my-ai-agent-an-undo-button-for-security-purposes-8c0b12369ad6'
};

export const featured = [
	{
		name: 'MatchBox',
		kicker: 'Home SOC',
		blurb:
			'A full security operations center on a 16GB Mac Mini: Wazuh SIEM/XDR, OpenCTI threat intel, TheHive + Cortex for incident response, and Grafana, all on k3s. Hardened with 34 default-deny NetworkPolicies and SOPS secrets, plus three custom MCP servers so Claude Code can triage alerts and open cases.',
		stats: ['v1.7.0', '~3 GB minimal footprint', '3 MCP servers'],
		tags: ['k3s', 'Wazuh', 'OpenCTI', 'TheHive', 'MCP', 'TypeScript'],
		url: 'https://github.com/ajokunu/MatchBox',
		post: 'https://medium.com/@AaronLJ/i-built-a-tiny-soc-so-i-can-watch-my-own-little-island-meet-matchbox-e52bdc9875b6',
		art: 'soc'
	},
	{
		name: 'PhantomPacket',
		kicker: 'ML security research',
		blurb:
			'LLMs invent package names, and attackers register them ("slopsquatting"). PhantomPacket asks whether a name is real or hallucinated from the string alone, with no registry lookup: 65 engineered features, 12 classifiers, about 936K labeled names from PyPI, npm, and published hallucination data. Paper draft in progress.',
		stats: ['~936K names', '65 features', '12 models'],
		tags: ['Python', 'scikit-learn', 'XGBoost', 'Supply Chain'],
		url: 'https://github.com/ajokunu/phantompacket',
		art: 'ml'
	},
	{
		name: 'Cloud Cost Security Detection',
		kicker: 'Research',
		blurb:
			'Attacks consume resources and resources show up on the bill, which is harder to tamper with than logs. This flags cost anomalies with z-score, modified z-score, and Grubbs’ test, then maps them to 13 MITRE ATT&CK techniques like cryptojacking and exfiltration.',
		stats: ['0.97 AUC-ROC', '0.5% false positives', '10K simulated scenarios'],
		tags: ['Python', 'AWS Billing', 'MITRE ATT&CK', 'Statistics'],
		url: 'https://github.com/ajokunu/cloud-cost-security-detection',
		art: 'cost'
	},
	{
		name: 'Goldfinch',
		kicker: 'Serverless finance app',
		blurb:
			'A self-hosted personal finance app that runs in your own AWS account for about $3 to $4 a month. CDK, Lambda, single-table DynamoDB, Cognito passkeys, read-only bank sync, and Bedrock categorization. A CDK Aspect fails the build if anything always-on sneaks in.',
		stats: ['40+ API routes', '85%+ mutation score', '$3/mo'],
		tags: ['TypeScript', 'AWS CDK', 'DynamoDB', 'Bedrock', 'Expo'],
		url: 'https://github.com/ajokunu/goldfinch-public',
		art: 'finance'
	}
];

export const projects = [
	{
		name: 'ThreatCode',
		blurb: 'STRIDE and MITRE threat models generated from Terraform, CloudFormation, Dockerfiles, and Kubernetes, plus secrets, vulnerability, and SBOM scanning.',
		tags: ['Python', 'Threat Modeling'],
		url: 'https://github.com/ajokunu/ThreatCode'
	},
	{
		name: 'ApartmentOps',
		blurb: 'Claude Code skills that scan listings, flag scams by photo hash, grade neighborhoods from cited data, and review leases. 445 tests.',
		tags: ['Python', 'Claude Code', 'Playwright'],
		url: 'https://github.com/ajokunu/ApartmentOps'
	},
	{
		name: 'snapvault',
		blurb: 'Private photo and video storage on AWS: 200GB for about $3 a month with S3 Intelligent-Tiering, CloudFront, and short-lived presigned URLs.',
		tags: ['TypeScript', 'S3', 'Lambda'],
		url: 'https://github.com/ajokunu/snapvault'
	},
	{
		name: 'Dash (ClaudeDashboard)',
		blurb: 'A native macOS app that reads Claude Code logs and shows session limits, context use, and burn rate.',
		tags: ['SwiftUI', 'macOS'],
		url: 'https://github.com/ajokunu/ClaudeDashboard'
	},
	{
		name: 'capacities-mcp',
		blurb: 'An MCP server that lets AI assistants search, create, and file notes in Capacities.io.',
		tags: ['TypeScript', 'MCP'],
		url: 'https://github.com/ajokunu/capacities-mcp'
	},
	{
		name: 'Servy',
		blurb: 'A Discord bot that starts and stops an AWS Minecraft server and shuts it down when nobody is playing. Two Lambdas, DynamoDB, secrets in SSM.',
		tags: ['JavaScript', 'Lambda', 'Discord'],
		url: 'https://github.com/ajokunu/Servy',
		post: 'https://medium.com/@AaronLJ/servy-building-a-secure-discord-based-minecraft-server-controller-safely-on-aws-85a10fc0707b'
	},
	{
		name: 'FlightTracker',
		blurb: 'Polls Google Flights every 30 minutes, charts price history, and pings Discord when a fare drops.',
		tags: ['JavaScript', 'SQLite'],
		url: 'https://github.com/ajokunu/FlightTracker'
	},
	{
		name: 'Tenable-Pypi-builds',
		blurb: 'PyTenable scripts for permission audits, job cleanup, diagnostics, and agent provisioning.',
		tags: ['Python', 'Tenable'],
		url: 'https://github.com/ajokunu/Tenable-Pypi-builds'
	}
];

// The fun stuff
export const sideQuests = [
	{
		name: 'HomeBrewify',
		blurb: 'Turns campaign notes into print-ready Homebrewery books: stat blocks, magic items, read-aloud boxes.',
		url: 'https://github.com/ajokunu/HomeBrewify',
		glyph: 'book'
	},
	{
		name: 'Middle-earth mod',
		blurb: 'A Tolkien total-conversion mod for Minecraft on NeoForge. Personal, non-commercial, very much a labor of love.',
		url: 'https://github.com/ajokunu/mearth',
		glyph: 'ring'
	},
	{
		name: 'Holocron',
		blurb: 'A local-first text-to-speech reader for macOS. Early days.',
		url: 'https://github.com/ajokunu/holocron',
		glyph: 'cube'
	},
	{
		name: 'Tenser’s Floating Distro',
		blurb: 'An early attempt at generating D&D stat blocks with deep learning.',
		url: 'https://github.com/ajokunu/Tensers-floating-Distro',
		glyph: 'disc'
	},
	{
		name: 'Adventures in Elturel',
		blurb: 'A choose-your-own-adventure game for one of my campaigns.',
		url: 'https://github.com/ajokunu/Adventures-in-Elturel',
		glyph: 'map'
	}
];

export const writing = [
	{ title: 'Giving my AI agent an undo button, for security', date: 'Apr 2026', url: 'https://medium.com/@AaronLJ/giving-my-ai-agent-an-undo-button-for-security-purposes-8c0b12369ad6', topic: 'AI Security' },
	{ title: 'I built a tiny SOC so I can watch my own little island. Meet MatchBox', date: 'Feb 2026', url: 'https://medium.com/@AaronLJ/i-built-a-tiny-soc-so-i-can-watch-my-own-little-island-meet-matchbox-e52bdc9875b6', topic: 'SOC' },
	{ title: 'Terraform & AWS: Data privacy for AWS Bedrock Agents', url: 'https://medium.com/@AaronLJ/terraform-aws-data-privacy-implementation-for-aws-bedrock-agents-9a3688b38836', topic: 'AI Security' },
	{ title: 'Servy: A secure Discord-based Minecraft server controller on AWS', date: 'Apr 2025', url: 'https://medium.com/@AaronLJ/servy-building-a-secure-discord-based-minecraft-server-controller-safely-on-aws-85a10fc0707b', topic: 'Serverless' },
	{ title: 'AWS WAF: A technical clinic on web application security', url: 'https://medium.com/@AaronLJ/aws-waf-advanced-usage-a-technical-clinic-on-web-application-security-in-aws-29682d610928', topic: 'AWS' },
	{ title: 'AWS and east-west firewall decisions', url: 'https://medium.com/@AaronLJ/aws-east-west-firewall-decisions-e025138b2e1e', topic: 'Network' },
	{ title: 'Navigating the complexity of multi-cloud IAM', url: 'https://medium.com/@AaronLJ/navigating-the-complexity-of-multi-cloud-iam-6193740e5c8b', topic: 'IAM' },
	{ title: 'AWS data security in S3: When data integrity becomes invisible', url: 'https://medium.com/@AaronLJ/aws-data-security-in-s3-when-data-integrity-becomes-invisible-c27b2b794489', topic: 'AWS' },
	{ title: 'OPA: Policy-as-code agents, an introduction', url: 'https://medium.com/@AaronLJ/opa-policy-as-code-agents-introduction-2ea1ddd11ea5', topic: 'Policy' },
	{ title: 'Terraform & AWS: Amazon Inspector as your security scanner', url: 'https://medium.com/@AaronLJ/terraform-aws-the-security-scanner-amazon-inspector-76422a25515d', topic: 'AWS' },
	{ title: 'Terraform for GCP security: the security-posture resource', url: 'https://medium.com/@AaronLJ/terraform-for-gcp-security-security-posture-resource-4a25860d4d11', topic: 'GCP' },
	{ title: 'Amazon Macie: Why should we use it?', url: 'https://medium.com/@AaronLJ/amazon-macie-why-should-we-use-it-d1931467d21b', topic: 'AWS' },
	{ title: 'AWS Lambda: Breaking down the serverless advantage', url: 'https://medium.com/@AaronLJ/aws-lambda-serverless-breaking-down-the-cloud-advantage-27a969c75740', topic: 'Serverless' }
];

export const nessusSeries = {
	title: 'The Nessus series',
	blurb: 'Ten beginner-friendly deep dives from my Tenable days: plugins, port scanning, compliance output, web app scanning, cloud deployments, Datadog integration, and more.',
	url: 'https://medium.com/@AaronLJ',
	count: 10
};

export const certs = [
	{ name: 'CISSP', org: 'ISC2', tier: 'gold' },
	{ name: 'AWS Security Specialty', org: 'AWS', tier: 'gold' },
	{ name: 'AWS Solutions Architect', org: 'AWS' },
	{ name: 'AWS AI Practitioner', org: 'AWS' },
	{ name: 'Azure Cybersecurity Architect', org: 'Microsoft', tier: 'gold' },
	{ name: 'Azure Security Engineer', org: 'Microsoft' },
	{ name: 'CCNA', org: 'Cisco' },
	{ name: 'CySA+', org: 'CompTIA' },
	{ name: 'PenTest+', org: 'CompTIA' },
	{ name: 'Security+', org: 'CompTIA' },
	{ name: 'CEH', org: 'EC-Council' }
];

export const education = [
	{ degree: 'M.Eng, Cybersecurity', school: 'NYU Tandon School of Engineering', year: 'Expected 2027' },
	{ degree: 'M.S., Cyber Forensics and Information Security', school: 'Western Governors University', year: '2023' },
	{ degree: 'B.S., Cybersecurity and Information Assurance', school: 'Western Governors University', year: '2021' }
];

export const affiliations = ['AWS Community Builder, Security', 'Cyber Peace Institute'];

export const toolbox = [
	{ label: 'Cloud', items: ['AWS', 'Azure', 'GCP', 'IAM Identity Center', 'PrivateLink', 'WAF & Shield', 'KMS', 'Entra ID'] },
	{ label: 'Security', items: ['Zero trust', 'mTLS', 'Threat modeling', 'AI security', 'Vuln management', 'Incident response'] },
	{ label: 'Compliance', items: ['PCI DSS', 'SOC 2', 'NIST 800-53', 'FedRAMP', 'HITRUST', 'CIS'] },
	{ label: 'Build', items: ['Python', 'TypeScript', 'Go', 'Terraform', 'AWS CDK', 'Kubernetes', 'MCP'] }
];
