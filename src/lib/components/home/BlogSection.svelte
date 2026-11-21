<script lang="ts">
	import { resolve } from '$app/paths';
	import { IconArrowUpRight } from '@tabler/icons-svelte';
	import { cinematicPhotoReveal, gsapReveal } from '#lib/attachments/gsap.js';
	import { coverSrcsetFromUrl } from '#lib/shared/cover-srcset.js';
	import type { HomeBlogPostItem } from '#lib/types/blog';

	let { posts }: { posts: readonly HomeBlogPostItem[] } = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'America/New_York'
	});
</script>

<section class="section journal-section" id="blog" aria-labelledby="journal-title">
	<div class="container">
		<div class="journal-heading" {@attach gsapReveal({ y: 14 })}>
			<div>
				<p class="eyebrow">Scripture for everyday life</p>
				<h2 id="journal-title">The Mustard Seed Journal</h2>
			</div>
			<a href={resolve('/blog')} class="journal-link">
				Read the journal <IconArrowUpRight size={18} aria-hidden="true" />
			</a>
		</div>

		{#if posts.length}
			<div class="journal-grid">
				{#each posts as post (post.id)}
					<article class="journal-post">
						{#if post.coverImage}
							<div class="journal-cover" {@attach cinematicPhotoReveal}>
								<img
									src={post.coverImage}
									srcset={coverSrcsetFromUrl(post.coverImage)}
									sizes="(max-width: 750px) calc(100vw - 2.3rem), (max-width: 1240px) 29vw, 370px"
									alt={post.coverImageAlt ?? ''}
									width="800"
									height="500"
									loading="lazy"
									decoding="async"
								/>
							</div>
						{/if}
						<p class="journal-category">{post.categoryName}</p>
						<h3>
							<a href={resolve('/blog/[slug]', { slug: post.slug })}>{post.title}</a>
						</h3>
						<p class="journal-excerpt">{post.excerpt}</p>
						<div class="journal-meta">
							{#if post.publishedAt}
								<time datetime={post.publishedAt}>
									{dateFormatter.format(new Date(post.publishedAt))}
								</time>
							{/if}
							<span>{post.readingTime} min read</span>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="journal-empty">
				Explore <a href={resolve('/resources')}>faith and purpose resources</a> for prayer, Scripture
				reflection, and guidance in a difficult season.
			</p>
		{/if}
	</div>
</section>

<style>
	.journal-section {
		background: var(--color-screen);
		border-top: 1px solid var(--color-rule);
	}

	.journal-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 0.8rem 2rem;
		flex-wrap: wrap;
		margin-bottom: clamp(1.6rem, 4vw, 3.25rem);
	}

	.eyebrow,
	.journal-category {
		margin-bottom: 0.8rem;
		color: var(--color-accent);
		font-size: 0.75rem;
		font-weight: 750;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.journal-heading h2 {
		margin: 0;
		font-size: clamp(2.5rem, 5.3vw, 5rem);
		font-weight: 550;
		line-height: 1;
		letter-spacing: -0.055em;
	}

	.journal-link {
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-navy);
		font-weight: 750;
		text-decoration: underline;
		text-decoration-color: var(--color-rust);
		text-underline-offset: 0.28em;
	}

	.journal-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(1rem, 2.8vw, 2.6rem);
	}

	.journal-post {
		position: relative;
		display: flex;
		flex-direction: column;
		padding-bottom: 0.9rem;
		border-bottom: 1px solid var(--color-rule);
	}

	.journal-cover {
		margin-bottom: 1rem;
		aspect-ratio: var(--photo-aspect);
		overflow: hidden;
		background: var(--color-parchment-alt);
	}

	.journal-cover img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: saturate(0.93) contrast(1.04);
		transition: transform 0.5s var(--ease-out);
	}

	.journal-post:hover img,
	.journal-post:focus-within img {
		transform: scale(1.04);
	}

	.journal-category {
		margin-bottom: 0.38rem;
		letter-spacing: 0.07em;
	}

	.journal-post h3 {
		margin-bottom: 0.5rem;
		font-size: clamp(1.32rem, 2.15vw, 1.75rem);
		line-height: 1.18;
	}

	.journal-post h3 a {
		color: inherit;
	}

	.journal-post h3 a::after {
		position: absolute;
		inset: 0;
		content: '';
	}

	.journal-post h3 a:focus-visible {
		outline: none;
	}

	.journal-post h3 a:focus-visible::after {
		outline: 2px solid var(--color-rust);
		outline-offset: 5px;
	}

	.journal-post:hover h3 a,
	.journal-post:focus-within h3 a,
	.journal-link:hover {
		color: var(--color-accent);
	}

	.journal-excerpt {
		flex: 1;
		margin-bottom: 0.9rem;
		color: var(--color-text-muted);
		font-size: 0.98rem;
		line-height: 1.45;
	}

	.journal-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 1rem;
		color: var(--color-text-muted);
		font-size: 0.83rem;
	}

	.journal-empty {
		max-width: 56ch;
		margin: 0;
	}

	.journal-empty a {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	@media (max-width: 750px) {
		.journal-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}
</style>
