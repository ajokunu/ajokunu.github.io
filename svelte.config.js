import adapter from '@sveltejs/adapter-static';

// PREVIEW=1 builds a copy that runs from any path (hash routing), used for hosted previews
const preview = process.env.PREVIEW === '1';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: preview ? 'build-preview' : 'build',
			assets: preview ? 'build-preview' : 'build',
			fallback: '404.html'
		}),
		router: { type: preview ? 'hash' : 'pathname' },
		appDir: preview ? 'app' : '_app'
	}
};

export default config;
