import type { HomeBlogPostItem } from '#lib/types/blog';
import { listPublicPosts } from '#lib/server/services/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const pageResult = await listPublicPosts({ page: 1, perPage: 3 });
		const latestPosts: HomeBlogPostItem[] = pageResult.items.map((post) => {
			const rawDate = post.publishedAt ?? post.updatedAt ?? null;
			return {
				id: post.id,
				title: post.title,
				slug: post.slug,
				excerpt:
					post.excerpt ||
					'Read this devotional and faith-restoration reflection from Courtney Ribeiro and Grow Your Faith Ministries.',
				coverImage: post.coverImage || '/images/gyfm-mustard-seed-ministry.webp',
				coverImageAlt: post.coverImageAlt || post.title,
				publishedAt: rawDate instanceof Date ? rawDate.toISOString() : rawDate,
				readingTime: post.readingTime || 5,
				categoryName: post.categoryName || 'Faith & Vision Restoration',
				categorySlug: post.categorySlug ?? null,
				authorName: post.authorName || 'Courtney Ribeiro'
			};
		});

		return { latestPosts };
	} catch (err) {
		console.warn('[/] Could not load the latest blog posts:', err);
		return { latestPosts: [] };
	}
};
