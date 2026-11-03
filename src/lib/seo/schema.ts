// Helper inside src/lib/seo/schema.ts
import { siteConfig, getCanonicalUrl, getSchemaGraph } from '#lib/config/site.js';

export function generateRootOrganizationSchema() {
	const baseGraph = getSchemaGraph();
	return {
		...baseGraph,
		'@graph': [
			{
				...baseGraph['@graph'][0],
				url: getCanonicalUrl('/'),
				logo: getCanonicalUrl('/images/gyfm-logo.webp'),
				image: getCanonicalUrl('/images/gyfm-holiday-outreach-hero.webp'),
				sponsor: {
					'@type': 'Organization',
					name: siteConfig.founder.parentOrgName,
					url: siteConfig.founder.parentOrgUrl
				},
				// Links historical authority from the old MWC URL to the new domain
				sameAs: [siteConfig.founder.legacyMinistryUrl]
			},
			baseGraph['@graph'][1]
		]
	};
}
