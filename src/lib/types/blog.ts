export interface HomeBlogPostItem {
	id: number;
	title: string;
	slug: string;
	excerpt: string;
	coverImage: string | null;
	coverImageAlt: string | null;
	publishedAt: string | null;
	readingTime: number;
	categoryName: string;
	categorySlug: string | null;
	authorName: string;
}
