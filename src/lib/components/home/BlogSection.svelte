<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		IconBible,
		IconArrowUpRight,
		IconArrowRight,
		IconClock,
		IconSparkles
	} from '@tabler/icons-svelte';
	import type { HomeBlogPostItem } from '#lib/types/blog';

	interface Props {
		posts: readonly HomeBlogPostItem[];
	}

	let { posts }: Props = $props();

	function formatDate(iso: string | null): string {
		if (!iso) return 'Nov 2026';
		const d = new Date(iso);
		if (Number.isNaN(d.getTime())) return 'Nov 2026';
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<!-- BLOG SECTION (Modeled after new-revolution-web BlogSection with Grow Your Faith Ministries palette & design) -->
<section class="section-alt blog-section" id="blog" aria-labelledby="blog-title">
	<div class="container">
		<div class="blog-header">
			<div class="blog-heading-group">
				<span class="badge-teal">
					<IconBible size={15} />
					<span>MUSTARD SEED DEVOTIONALS &amp; OUTREACH JOURNAL</span>
				</span>
				<h2 id="blog-title">
					The Latest From <span class="blog-title-accent">Our Ministry Blog</span>
				</h2>
				<p class="blog-subcopy">
					Biblical encouragement for hard times, practical faith-restoration coaching, Friday
					mentorship reflections, and Connecticut holiday outreach recaps by Courtney Ribeiro.
				</p>
			</div>

			<a href={resolve('/blog')} class="btn btn-gold see-all-blogs-btn">
				<span>See All Blogs</span>
				<span class="arrow" aria-hidden="true">
					<IconArrowUpRight size={18} stroke={2.3} />
				</span>
			</a>
		</div>

		<div class="blog-grid">
			{#each posts as post, idx (post.id)}
				<article
					class={['card', 'blog-card', { 'blog-card-featured': idx === 0 }]}
					data-post-id={post.id}
				>
					<a
						href={resolve('/blog/[slug]', { slug: post.slug })}
						class={['blog-cover', `cover-variant-${(idx % 3) + 1}`]}
						aria-label={`Read "${post.title}"`}
					>
						{#if post.coverImage}
							<img
								src={post.coverImage}
								alt={post.coverImageAlt || post.title}
								width="800"
								height="450"
								loading="lazy"
								decoding="async"
								class="blog-cover-img"
							/>
						{/if}
						<div class="blog-cover-gradient" aria-hidden="true"></div>
						<div class="blog-cover-top">
							<span class="cover-category-badge">
								<IconSparkles size={13} />
								<span>{post.categoryName}</span>
							</span>
							<span class="cover-read-pill">
								<IconClock size={13} />
								<span>{post.readingTime} min read</span>
							</span>
						</div>
					</a>

					<div class="blog-body">
						<div class="blog-meta">
							<span class="blog-author">By {post.authorName}</span>
							<span class="meta-dot" aria-hidden="true">•</span>
							<time datetime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
						</div>

						<h3>
							<a href={resolve('/blog/[slug]', { slug: post.slug })}>
								{post.title}
							</a>
						</h3>

						<p>{post.excerpt}</p>

						<div class="blog-footer">
							<a href={resolve('/blog/[slug]', { slug: post.slug })} class="blog-read-link">
								<span>Read Full Article</span>
								<IconArrowRight size={17} stroke={2.2} />
							</a>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.blog-section {
		position: relative;
	}

	.blog-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 2rem;
		margin-bottom: 2.75rem;
		flex-wrap: wrap;
	}

	.blog-heading-group {
		max-width: 680px;
	}

	.blog-heading-group h2 {
		margin-top: 0.75rem;
		margin-bottom: 0.65rem;
		color: var(--color-navy);
	}

	.blog-title-accent {
		color: var(--color-teal);
		font-style: italic;
	}

	.blog-subcopy {
		margin: 0;
		color: var(--color-text-muted);
		font-size: 1.03rem;
		line-height: 1.65;
	}

	.see-all-blogs-btn {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.see-all-blogs-btn .arrow {
		display: inline-flex;
		align-items: center;
		transition: transform 0.18s ease;
	}

	.see-all-blogs-btn:hover .arrow {
		transform: translate(2px, -2px);
	}

	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.75rem;
	}

	.blog-card {
		padding: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-card);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.blog-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-elevated);
		border-color: var(--color-gold);
	}

	.blog-card-featured {
		border-top: 3px solid var(--color-gold);
	}

	.blog-cover {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		background: var(--color-navy);
		overflow: hidden;
		text-decoration: none;
	}

	.blog-cover.cover-variant-2 {
		background: #142b52;
	}

	.blog-cover.cover-variant-3 {
		background: #0b3948;
	}

	.blog-cover-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.35s ease;
	}

	.blog-card:hover .blog-cover-img {
		transform: scale(1.04);
	}

	.blog-cover-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			180deg,
			rgba(15, 32, 60, 0.58) 0%,
			rgba(15, 32, 60, 0.12) 55%,
			rgba(15, 32, 60, 0.72) 100%
		);
		pointer-events: none;
	}

	.blog-cover-top {
		position: absolute;
		top: 0.85rem;
		left: 0.85rem;
		right: 0.85rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		z-index: 2;
	}

	.cover-category-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		background: rgba(15, 32, 60, 0.88);
		color: var(--color-gold);
		border: 1px solid rgba(212, 168, 67, 0.45);
		backdrop-filter: blur(6px);
	}

	.cover-read-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.28rem 0.65rem;
		border-radius: 999px;
		font-size: 0.74rem;
		font-weight: 600;
		background: rgba(255, 255, 255, 0.92);
		color: var(--color-navy);
	}

	.blog-body {
		padding: 1.5rem 1.6rem 1.65rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.blog-meta {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--color-teal);
		margin-bottom: 0.65rem;
	}

	.meta-dot {
		color: var(--color-border);
	}

	.blog-body h3 {
		font-family: var(--font-heading);
		font-size: 1.28rem;
		line-height: 1.32;
		margin: 0 0 0.75rem;
		color: var(--color-navy);
	}

	.blog-body h3 a {
		color: inherit;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	.blog-body h3 a:hover {
		color: var(--color-teal);
	}

	.blog-body p {
		color: var(--color-text-muted);
		font-size: 0.95rem;
		line-height: 1.62;
		margin: 0 0 1.35rem;
		flex: 1;
	}

	.blog-footer {
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
		margin-top: auto;
	}

	.blog-read-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.92rem;
		font-weight: 700;
		color: var(--color-navy);
		text-decoration: none;
		transition:
			color 0.15s ease,
			gap 0.15s ease;
	}

	.blog-read-link:hover {
		color: var(--color-teal);
		gap: 0.6rem;
	}

	@media (max-width: 960px) {
		.blog-grid {
			grid-template-columns: 1fr;
		}

		.blog-header {
			align-items: flex-start;
		}
	}
</style>
