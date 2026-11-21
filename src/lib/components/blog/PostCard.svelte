<script module lang="ts">
	export interface PostCardItem {
		id: number;
		title: string;
		slug: string;
		excerpt?: string | null;
		coverImage?: string | null;
		coverImageAlt?: string | null;
		publishedAt?: Date | string | null;
		updatedAt?: Date | string | null;
		contentUpdatedAt?: Date | string | null;
		readingTime?: number | null;
		isPillar?: boolean;
		category?: {
			name: string;
			slug: string;
		} | null;
		author?: {
			name: string;
			slug: string;
		} | null;
	}
</script>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { IconArrowUpRight } from '@tabler/icons-svelte';
	import { cinematicPhotoReveal } from '#lib/attachments/gsap.js';
	import { coverSrcsetFromUrl } from '#lib/shared/cover-srcset';

	interface Props {
		post: PostCardItem;
		eager?: boolean;
		lead?: boolean;
		headingLevel?: 'h2' | 'h3';
	}

	let { post, eager = false, lead = false, headingLevel = 'h3' }: Props = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC'
	});

	let href = $derived(resolve('/blog/[slug]', { slug: post.slug }));
	let srcset = $derived(coverSrcsetFromUrl(post.coverImage));
	let estimatedImageSize = $derived(
		lead
			? '(max-width: 760px) 92vw, (max-width: 1240px) 46vw, 575px'
			: '(max-width: 760px) 92vw, (max-width: 1100px) 66vw, 850px'
	);
	let displayDate = $derived(post.publishedAt ?? post.contentUpdatedAt ?? post.updatedAt);
	let date = $derived(displayDate ? new Date(displayDate) : null);
</script>

<article
	class={['blog-post-card', { 'is-lead': lead, 'has-cover': post.coverImage }]}
	data-post-id={post.id}
>
	{#if post.coverImage}
		<div class="card-media journal-photo" {@attach lead ? cinematicPhotoReveal : undefined}>
			<img
				class="card-cover-img"
				src={post.coverImage}
				{srcset}
				sizes={srcset ? (eager ? estimatedImageSize : `auto, ${estimatedImageSize}`) : undefined}
				alt={post.coverImageAlt ?? ''}
				width="800"
				height="450"
				loading={eager ? 'eager' : 'lazy'}
				fetchpriority={eager ? 'high' : 'auto'}
				decoding="async"
				data-cinematic-image
			/>
		</div>
	{/if}

	<div class="card-body">
		{#if post.category || post.isPillar || post.readingTime}
			<div class="card-meta">
				{#if post.category}
					<a href={resolve('/blog/category/[slug]', { slug: post.category.slug })}>
						{post.category.name}
					</a>
				{/if}
				{#if post.isPillar}
					<span>Cornerstone guide</span>
				{/if}
				{#if post.readingTime}
					<span>{post.readingTime} min read</span>
				{/if}
			</div>
		{/if}

		<svelte:element this={headingLevel} class="card-title">
			<!-- oxlint-disable-next-line svelte/no-navigation-without-resolve -- href resolves to the article above -->
			<a {href}>{post.title}</a>
		</svelte:element>

		{#if post.excerpt}
			<p class="card-excerpt">{post.excerpt}</p>
		{/if}

		<div class="card-footer">
			<div class="card-byline">
				{#if post.author}<span>{post.author.name}</span>{/if}
				{#if date}
					<time datetime={date.toISOString()}>{dateFormatter.format(date)}</time>
				{/if}
			</div>
			<span class="card-read" aria-hidden="true">
				Read article
				<IconArrowUpRight size={17} stroke={1.7} />
			</span>
		</div>
	</div>
</article>

<style>
	.blog-post-card {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		border: 1px solid var(--line);
		border-radius: 0.4rem;
		background: var(--panel);
	}

	.blog-post-card:focus-within {
		outline: 2px solid var(--accent);
		outline-offset: 5px;
	}

	.card-media {
		overflow: hidden;
		flex: none;
		aspect-ratio: var(--photo-aspect, 4 / 3);
		background: var(--bg-soft);
		border-radius: calc(0.4rem - 1px) calc(0.4rem - 1px) 0 0;
	}

	.card-cover-img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.55s var(--ease-out);
	}

	@media (hover: hover) {
		.blog-post-card:hover .card-cover-img {
			transform: scale(1.035);
		}
	}

	.card-body {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		padding: clamp(1.2rem, 2.1vw, 1.65rem);
	}

	.card-meta,
	.card-footer,
	.card-byline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 0.8rem;
		color: var(--muted);
		font-size: 0.875rem;
		line-height: 1.45;
	}

	.card-meta > *,
	.card-byline > * {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.card-meta a {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		color: var(--accent);
		font-weight: 750;
		text-underline-offset: 0.25em;
	}

	.card-meta a:hover {
		color: var(--ink);
	}

	.card-title {
		margin: 0;
		font-size: clamp(1.42rem, 1.16rem + 0.9vw, 2rem);
		font-weight: 660;
		letter-spacing: -0.045em;
		line-height: 1.1;
	}

	.card-title a {
		color: inherit;
		text-decoration: none;
	}

	.card-title a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.card-title a:hover,
	.card-title a:focus-visible {
		color: var(--accent);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
	}

	.card-excerpt {
		margin: 0;
		color: var(--muted);
		font-size: 1rem;
		line-height: 1.57;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-footer {
		justify-content: space-between;
		margin-block-start: auto;
		padding-block-start: 0.85rem;
		border-block-start: 1px solid var(--line);
	}

	.card-byline {
		flex-direction: column;
		align-items: flex-start;
	}

	.card-read {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		color: var(--accent);
		font-weight: 750;
	}

	.blog-post-card:hover .card-read,
	.blog-post-card:focus-within .card-read {
		color: var(--ink);
	}

	.is-lead {
		background: linear-gradient(135deg, var(--panel) 10%, var(--panel2));
	}

	.is-lead .card-body {
		justify-content: center;
		gap: 0.85rem;
		padding: clamp(1.4rem, 4vw, 3.15rem);
	}

	.is-lead .card-title {
		font-size: clamp(1.75rem, 1.18rem + 2.1vw, 2.9rem);
	}

	.is-lead .card-excerpt {
		display: block;
	}

	.is-lead .card-footer {
		margin-block-start: 0.5rem;
	}

	@media (min-width: 761px) {
		.is-lead.has-cover {
			display: grid;
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
			align-items: center;
			padding: clamp(0.6rem, 2vw, 1.4rem);
		}

		.is-lead .card-media {
			border-radius: 0.3rem;
		}

		.is-lead .card-body {
			padding: clamp(0.9rem, 2.8vw, 2.2rem);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card-cover-img {
			transition: none;
		}

		.blog-post-card:hover .card-cover-img {
			transform: none;
		}
	}
</style>
