import type { HomeBlogPostItem } from '#lib/types/blog';
import { listPublicPosts } from '#lib/server/services/posts';
import type { PageServerLoad } from './$types';

const FALLBACK_POSTS: HomeBlogPostItem[] = [
	{
		id: 1,
		title: 'Faith the Size of a Mustard Seed: Moving Mountains When Your Dreams Feel Buried',
		slug: 'faith-the-size-of-a-mustard-seed-matthew-17-20',
		excerpt:
			'Discover what Matthew 17:20 teaches about mustard seed faith and how Grow Your Faith Ministries helps individuals in Connecticut restore buried dreams.',
		coverImage: '/images/hero-courtney-outreach.webp',
		coverImageAlt:
			'Courtney Ribeiro encouraging a community member during Friday ministry outreach in Connecticut',
		publishedAt: '2026-10-25T12:00:00.000Z',
		readingTime: 6,
		categoryName: 'Faith & Vision Restoration',
		categorySlug: 'faith-and-vision-restoration',
		authorName: 'Courtney Ribeiro'
	},
	{
		id: 2,
		title: 'How to Rebuild Your Vision After a Shattered Season: A Practical Christian Guide',
		slug: 'how-to-rebuild-your-vision-after-a-shattered-season',
		excerpt:
			'A practical Christian mentorship guide from Courtney Ribeiro on rebuilding shattered goals, rediscovering God-given talents, and walking in purpose.',
		coverImage: '/images/friday-mentorship-session.webp',
		coverImageAlt:
			'One-on-one Christian mentorship and vision restoration session on a Friday afternoon',
		publishedAt: '2026-10-28T12:00:00.000Z',
		readingTime: 6,
		categoryName: 'Friday Ministry & Mentorship',
		categorySlug: 'friday-ministry-and-mentorship',
		authorName: 'Courtney Ribeiro'
	},
	{
		id: 3,
		title: 'Stewarding Your God-Given Talents in Business and Life',
		slug: 'stewarding-your-god-given-talents-in-business-and-life',
		excerpt:
			'Learn how Christian business stewardship and client partnerships fuel weekly Friday ministry and Connecticut winter coat and holiday meal drives.',
		coverImage: '/images/holiday-coat-meal-drive.webp',
		coverImageAlt:
			'Volunteers preparing brand-new children winter coats, hats, mittens, blankets, and hot holiday meals in Connecticut',
		publishedAt: '2026-11-01T12:00:00.000Z',
		readingTime: 6,
		categoryName: 'Holiday Outreach & Community Care',
		categorySlug: 'holiday-outreach-and-community-care',
		authorName: 'Courtney Ribeiro'
	}
];

export const load: PageServerLoad = async () => {
	try {
		const pageResult = await listPublicPosts({ page: 1, perPage: 3 });
		if (pageResult.items.length === 0) {
			return { latestPosts: FALLBACK_POSTS };
		}

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
		console.warn('[/] Falling back to static latest blog posts:', err);
		return { latestPosts: FALLBACK_POSTS };
	}
};
