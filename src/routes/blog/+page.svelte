<script lang="ts">
	import '#lib/styles/inner-page.css';
	import { asset, resolve } from '$app/paths';
	import { IconArrowDown, IconArrowUpRight } from '@tabler/icons-svelte';
	import { cinematicPhotoReveal, gsapHeroEntrance } from '#lib/attachments/gsap.js';
	import Pagination from '#lib/components/blog/Pagination.svelte';
	import PostCard from '#lib/components/blog/PostCard.svelte';
	import SearchForm from '#lib/components/blog/SearchForm.svelte';
	import SEO from '#lib/components/blog/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let featuredStory = $derived(data.featuredPosts[0]);
	let featuredIds = $derived(new Set(data.featuredPosts.map((post) => post.id)));
	let archivePosts = $derived(data.posts.filter((post) => !featuredIds.has(post.id)));
</script>

<SEO schema={data.jsonLdSchema} />

<div id="blog-page" class="inner-page blog-index-page">
	<header class="blog-masthead">
		<div class="blog-width">
			<nav class="blog-breadcrumbs" aria-label="Breadcrumb">
				<ol>
					<li><a href={resolve('/')}>Home</a></li>
					<li aria-current="page">Journal</li>
				</ol>
			</nav>
			<div class="masthead-layout" {@attach gsapHeroEntrance}>
				<div class="masthead-copy">
					<span class="blog-kicker" data-hero-item>Devotionals &amp; outreach</span>
					<h1 class="blog-masthead-title" data-hero-item>The Mustard Seed <span>Journal</span></h1>
					<p class="blog-masthead-intro" data-hero-item>
						Devotionals for difficult days, reflections from Friday Ministry, and stories of
						neighbors caring for one another in Connecticut.
					</p>
					<a class="masthead-read" href="#journal-stories" data-hero-item>
						Explore the journal <IconArrowDown size={17} aria-hidden="true" />
					</a>
				</div>
				<figure>
					<div class="masthead-photograph journal-photo" {@attach cinematicPhotoReveal}>
						<img
							src={asset('images/gallery/carousel1-2.webp')}
							srcset={`${asset('images/gallery/carousel1-2-560w.webp')} 560w, ${asset('images/gallery/carousel1-2.webp')} 1200w`}
							sizes="(max-width: 720px) 92vw, (max-width: 1240px) 46vw, 556px"
							alt="Volunteers and neighbors gather around tables of meals during the ministry’s winter outreach"
							width="1200"
							height="900"
							fetchpriority="high"
							decoding="async"
							data-cinematic-image
						/>
					</div>
					<figcaption>
						<a href={resolve('/programs/holiday-outreach')}>
							Connecticut holiday outreach <IconArrowUpRight size={15} aria-hidden="true" />
						</a>
					</figcaption>
				</figure>
			</div>
		</div>
	</header>

	<div class="blog-width blog-content" id="journal-stories">
		<div class="journal-tools">
			<SearchForm query={data.search} />
			{#if data.categories.length > 0}
				<nav class="topics-nav" aria-label="Journal categories">
					<a href={resolve('/blog')} aria-current={data.search ? undefined : 'page'}>All topics</a>
					{#each data.categories as category (category.id)}
						<a href={resolve('/blog/category/[slug]', { slug: category.slug })}>
							{category.name}
						</a>
					{/each}
				</nav>
			{/if}
		</div>

		{#if featuredStory}
			<section class="journal-section" aria-labelledby="featured-articles-heading">
				<h2 id="featured-articles-heading" class="blog-section-title">
					{data.featuredPosts.length === 1 ? 'Featured story' : 'Featured stories'}
				</h2>
				<PostCard post={featuredStory} lead />
				{#if data.featuredPosts.length > 1}
					<div class="posts-grid">
						{#each data.featuredPosts.slice(1) as post (post.id)}
							<PostCard {post} />
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		{#if data.search || archivePosts.length > 0 || !featuredStory}
			<section class="journal-section" aria-labelledby="all-articles-heading">
				<h2 id="all-articles-heading" class="blog-section-title">
					{data.search
						? `Search results for “${data.search}”`
						: featuredStory
							? 'More stories and devotionals'
							: 'All articles'}
				</h2>

				{#if archivePosts.length === 0}
					<div class="blog-empty">
						{#if data.search}
							<p>No articles match this search.</p>
							<a href={resolve('/blog')}>Clear search</a>
						{:else}
							<p>New articles will appear here when they are published.</p>
							<a href={resolve('/resources')}>Browse ministry resources</a>
						{/if}
					</div>
				{:else}
					<div class="posts-grid">
						{#each archivePosts as post (post.id)}
							<PostCard {post} />
						{/each}
					</div>
				{/if}
			</section>
		{/if}

		<Pagination pagination={data.pagination} pathname={resolve('/blog')} search={data.search} />
	</div>
</div>

<style>
	.masthead-layout {
		display: grid;
		align-items: center;
		grid-template-columns: minmax(0, 0.97fr) minmax(0, 1.03fr);
		gap: clamp(1.65rem, 4.5vw, 4.25rem);
	}

	.masthead-copy {
		min-width: 0;
	}

	.masthead-copy h1 {
		max-width: 12ch;
		text-wrap: initial;
	}

	.masthead-copy h1 span {
		display: block;
		color: var(--accent);
	}

	.masthead-read {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-block-size: 46px;
		margin-block-start: 1.3rem;
		padding: 0.45rem 0.85rem;
		border: 1px solid var(--line-strong);
		border-radius: 0.3rem;
		color: var(--ink);
		font-weight: 650;
	}

	.masthead-read:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	figure {
		min-width: 0;
		margin: 0;
	}

	.masthead-photograph {
		overflow: hidden;
		aspect-ratio: var(--photo-aspect, 4 / 3);
		background: var(--panel);
		border-radius: 0.35rem;
		box-shadow: 0 24px 55px -34px rgb(0 0 0 / 86%);
	}

	.masthead-photograph img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	figcaption {
		margin-block-start: 0.45rem;
		color: var(--muted);
		font-size: 0.83rem;
	}

	figcaption a {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		min-block-size: 36px;
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	figcaption a:hover {
		color: var(--accent);
	}

	.journal-tools {
		display: grid;
		grid-template-columns: minmax(17rem, 0.85fr) minmax(0, 1fr);
		align-items: center;
		gap: 1.15rem 1.75rem;
		margin-block-end: clamp(1.75rem, 4vw, 3.2rem);
	}

	.journal-tools > :global(form:only-child) {
		grid-column: 1 / -1;
	}

	.topics-nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.45rem 0.55rem;
	}

	.topics-nav a {
		display: inline-flex;
		align-items: center;
		min-block-size: 44px;
		padding: 0.4rem 0.85rem;
		border: 1px solid var(--line);
		border-radius: 0.25rem;
		color: var(--ink);
		font-size: 0.93rem;
		font-weight: 650;
		line-height: 1.3;
		text-decoration: none;
	}

	.topics-nav a:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.topics-nav a[aria-current='page'] {
		border-color: var(--accent);
		background: var(--accent);
		color: var(--on-accent);
	}

	.journal-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: clamp(1rem, 2.5vw, 1.6rem);
		padding-block-start: clamp(1rem, 3vw, 2rem);
		border-block-start: 1px solid var(--line);
	}

	.journal-section + .journal-section {
		margin-block-start: clamp(2.5rem, 6vw, 5rem);
	}

	@media (max-width: 960px) {
		.journal-tools {
			grid-template-columns: minmax(0, 1fr);
		}

		.topics-nav {
			justify-content: flex-start;
		}
	}

	@media (max-width: 720px) {
		.masthead-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
