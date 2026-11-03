import {
	computeWeakOrStrongEtag,
	createFeedErrorResponse,
	matchesIfNoneMatch
} from '#lib/server/posts/cache';
import { listPublicCategoriesWithCounts } from '#lib/server/services/categories';
import { listSitemapBlogEntries } from '#lib/server/services/posts';
import { listPublicTagsWithCounts } from '#lib/server/services/tags';
import {
	absoluteUrl,
	DEFAULT_FEED_ORIGIN,
	escapeXml,
	resolvePostModifiedDate
} from '#lib/shared/seo/rss';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
	const baseUrl = DEFAULT_FEED_ORIGIN;

	try {
		const pageModules = import.meta.glob('/src/routes/**/+page.svelte');

		const allRoutes = Object.keys(pageModules).map((filePath) => {
			return (
				filePath
					.replace('/src/routes', '')
					.replace('/+page.svelte', '')
					.replace(/\/\([^)]+\)/g, '') || '/'
			);
		});

		const discoveredRoutes = allRoutes
			.filter((route) => {
				return (
					!route.includes('[') &&
					route !== '/blogs' &&
					!route.startsWith('/demo') &&
					!route.startsWith('/lp') &&
					!route.startsWith('/login') &&
					!route.startsWith('/register') &&
					!route.startsWith('/dashboard') &&
					!route.startsWith('/admin') &&
					!route.startsWith('/checkout')
				);
			})
			.sort((a, b) => {
				if (a === '/') return -1;
				if (b === '/') return 1;
				return a.localeCompare(b);
			});

		const dynamicRoutes: {
			path: string;
			lastmod?: string;
			imageUrl?: string | null;
		}[] = [];

		const [publicPosts, publicCategories, publicTags] = await Promise.all([
			listSitemapBlogEntries(),
			listPublicCategoriesWithCounts(),
			listPublicTagsWithCounts()
		]);

		let newestBlogModifiedIso: string | undefined;
		for (const post of publicPosts) {
			const modDate = resolvePostModifiedDate(post);
			const modIso = modDate ? modDate.toISOString() : undefined;
			if (modIso && (!newestBlogModifiedIso || modIso > newestBlogModifiedIso)) {
				newestBlogModifiedIso = modIso;
			}
			dynamicRoutes.push({
				path: `/blog/${post.slug}`,
				lastmod: modIso,
				imageUrl: post.coverImage ? absoluteUrl(post.coverImage, baseUrl) : null
			});
		}

		for (const cat of publicCategories) {
			if (cat.isIndexable) {
				dynamicRoutes.push({
					path: `/blog/category/${cat.slug}`
				});
			}
		}

		for (const tag of publicTags) {
			if (tag.isIndexable) {
				dynamicRoutes.push({
					path: `/blog/tag/${tag.slug}`
				});
			}
		}

		const entries: {
			path: string;
			lastmod?: string;
			imageUrl?: string | null;
		}[] = [
			...discoveredRoutes.map((path) => ({
				path,
				lastmod: path === '/blog' ? newestBlogModifiedIso : undefined
			})),
			...dynamicRoutes
		];

		const urlNodes = entries
			.map(({ path, lastmod, imageUrl }) => {
				const fullUrl = absoluteUrl(path, baseUrl);
				const imageLines = imageUrl
					? [
							'    <image:image>',
							`      <image:loc>${escapeXml(imageUrl)}</image:loc>`,
							'    </image:image>'
						]
					: [];

				return [
					'  <url>',
					`    <loc>${escapeXml(fullUrl)}</loc>`,
					...(lastmod ? [`    <lastmod>${escapeXml(lastmod)}</lastmod>`] : []),
					...imageLines,
					'  </url>'
				].join('\n');
			})
			.join('\n');

		const xml = [
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
			urlNodes,
			'</urlset>'
		].join('\n');

		const etag = computeWeakOrStrongEtag(xml);
		const cacheControl =
			'public, max-age=0, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400';

		if (matchesIfNoneMatch(request.headers.get('if-none-match'), etag)) {
			return new Response(null, {
				status: 304,
				headers: {
					ETag: etag,
					'Cache-Control': cacheControl,
					'X-Robots-Tag': 'noindex'
				}
			});
		}

		return new Response(xml, {
			status: 200,
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				ETag: etag,
				'Cache-Control': cacheControl,
				'X-Robots-Tag': 'noindex'
			}
		});
	} catch (err) {
		console.error('[/sitemap.xml] Failed to build sitemap:', err);
		return createFeedErrorResponse();
	}
};
