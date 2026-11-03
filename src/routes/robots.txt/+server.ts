import { siteConfig, getCanonicalUrl } from '#lib/config/site.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const body = [
		'# Allow crawling everything by default (Traditional Search + 2026 AI Search / GEO)',
		'User-agent: *',
		'Allow: /',
		'Disallow: /demo/',
		'',
		`Sitemap: ${getCanonicalUrl('/sitemap.xml')}`,
		`Host: ${siteConfig.domain}`
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
