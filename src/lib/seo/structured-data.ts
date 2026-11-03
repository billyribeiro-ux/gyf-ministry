import { siteConfig } from '#lib/config/site';

export const BRAND_NAME = siteConfig.name;
export const BRAND_SLOGAN = siteConfig.slogan;
export const BRAND_LOGO_PATH = '/images/hero-courtney-outreach.webp';
export const BRAND_LOGO_WIDTH = 1200;
export const BRAND_LOGO_HEIGHT = 675;
export const BRAND_SOCIAL_IMAGE_PATH = '/images/hero-courtney-outreach.webp';
export const BRAND_SOCIAL_IMAGE_WIDTH = 1200;
export const BRAND_SOCIAL_IMAGE_HEIGHT = 675;

const NOINDEX_ROUTE_PREFIXES = ['/login', '/register', '/dashboard', '/admin'] as const;

export const SITE_ORIGIN = siteConfig.url;

export function getCanonicalUrl(url: Pick<URL, 'pathname'>): string {
	const cleanPath = url.pathname === '/' ? '' : url.pathname.replace(/\/+$/, '');
	return `${SITE_ORIGIN}${cleanPath}`;
}

export function isNoIndexRoute(pathname: string): boolean {
	return NOINDEX_ROUTE_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
	);
}

/**
 * Safely serializes a JSON-LD object for embedding inside `<script type="application/ld+json">`,
 * escaping `<`, `>`, `&`, `U+2028`, and `U+2029` per SD-02.
 */
export function serializeJsonLd(schema: unknown): string {
	return JSON.stringify(schema)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
}

/**
 * Escapes `<`, `>`, `&`, `U+2028`, and `U+2029` inside any rendered
 * `<script type="application/ld+json">...</script>` block in HTML.
 */
export function escapeJsonLdBlocksInHtml(html: string): string {
	return html.replace(
		/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?\})\s*(<\/script>)/gi,
		(_match, openTag: string, body: string, closeTag: string) => {
			const escaped = body
				.replace(/</g, '\\u003c')
				.replace(/>/g, '\\u003e')
				.replace(/&/g, '\\u0026')
				.replace(/\u2028/g, '\\u2028')
				.replace(/\u2029/g, '\\u2029');
			return `${openTag}${escaped}${closeTag}`;
		}
	);
}

export function buildOrganizationEntity(origin: string = SITE_ORIGIN) {
	const logoUrl = `${origin}${BRAND_LOGO_PATH}`;
	return {
		'@type': ['NGO', 'Organization'],
		'@id': `${origin}/#organization`,
		name: BRAND_NAME,
		alternateName: siteConfig.shortName,
		url: origin,
		sameAs: [siteConfig.founder.legacyMinistryUrl, siteConfig.founder.parentOrgUrl],
		slogan: BRAND_SLOGAN,
		foundingDate: String(siteConfig.foundingYear),
		description: siteConfig.description,
		logo: {
			'@type': 'ImageObject',
			'@id': `${origin}/#logo`,
			url: logoUrl,
			contentUrl: logoUrl,
			width: BRAND_LOGO_WIDTH,
			height: BRAND_LOGO_HEIGHT,
			caption: `${BRAND_NAME} — ${BRAND_SLOGAN}`
		},
		image: {
			'@id': `${origin}/#logo`
		},
		founder: {
			'@type': 'Person',
			'@id': `${origin}/#founder`,
			name: siteConfig.founder.name,
			jobTitle: siteConfig.founder.role,
			url: `${origin}/about`
		},
		areaServed: siteConfig.location.counties.map((area) => ({
			'@type': 'AdministrativeArea',
			name: area
		})),
		knowsAbout: [
			'Christian Life Restoration Mentorship',
			'Mustard Seed Faith (Matthew 17:20)',
			'Weekly Friday Community Ministry',
			'Thanksgiving and Christmas Hot Meal Outreach',
			"Children's Winter Coat, Hat, Mitten, and Blanket Drive"
		],
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'ministry support and prayer requests',
			url: `${origin}/prayer-and-support`,
			availableLanguage: ['en-US']
		}
	};
}
