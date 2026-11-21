<script lang="ts">
	import { resolve } from '$app/paths';
	import { IconArrowLeft } from '@tabler/icons-svelte';
	import Pagination, { type PaginationData } from './Pagination.svelte';
	import PostCard, { type PostCardItem } from './PostCard.svelte';

	interface Topic {
		id: number;
		slug: string;
		name: string;
		postCount: number;
	}

	interface Props {
		kind: 'category' | 'tag';
		topic: Topic & { description?: string | null; pillarHtml?: string | null };
		topics: Topic[];
		posts: PostCardItem[];
		pagination: PaginationData;
	}

	let { kind, topic, topics, posts, pagination }: Props = $props();
	let isTag = $derived(kind === 'tag');
	let prefix = $derived(isTag ? '#' : '');

	function topicHref(slug: string) {
		return kind === 'tag'
			? resolve('/blog/tag/[slug]', { slug })
			: resolve('/blog/category/[slug]', { slug });
	}
</script>

<div id={`blog-${kind}-page`} class="inner-page blog-taxonomy-page">
	<header class="blog-masthead">
		<div class="blog-width">
			<nav class="blog-breadcrumbs" aria-label="Breadcrumb">
				<ol>
					<li><a href={resolve('/')}>Home</a></li>
					<li><a href={resolve('/blog')}>Journal</a></li>
					<li aria-current="page">{topic.name}</li>
				</ol>
			</nav>
			<span class="blog-kicker">{isTag ? 'Journal tag' : 'From the journal'}</span>
			<h1 class="blog-masthead-title">{prefix}{topic.name}</h1>
			{#if topic.description}
				<p class="blog-masthead-intro">{topic.description}</p>
			{/if}
		</div>
	</header>

	<div class="blog-width blog-content archive-layout">
		<div class="archive-stories">
			{#if topic.pillarHtml}
				<div class="pillar-intro prose-base">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- loader sanitizes the category introduction -->
					{@html topic.pillarHtml}
				</div>
			{/if}

			{#if posts.length > 0}
				<div class="posts-grid">
					{#each posts as post, index (post.id)}
						<PostCard {post} eager={index === 0} headingLevel="h2" />
					{/each}
				</div>
			{:else}
				<div class="blog-empty">
					<p>There are no articles on this page.</p>
					<!-- oxlint-disable-next-line svelte/no-navigation-without-resolve -- topicHref resolves the archive route -->
					<a href={topicHref(topic.slug)}>Return to the first page</a>
				</div>
			{/if}
			<Pagination {pagination} pathname={topicHref(topic.slug)} />
		</div>

		<aside class="archive-sidebar" aria-labelledby="related-topics-title">
			<h2 id="related-topics-title">{isTag ? 'More tags' : 'Browse topics'}</h2>
			<nav aria-labelledby="related-topics-title">
				<ul>
					{#each topics as item (item.id)}
						<li>
							<!-- oxlint-disable-next-line svelte/no-navigation-without-resolve -- topicHref resolves the archive route -->
							<a
								href={topicHref(item.slug)}
								aria-current={item.id === topic.id ? 'page' : undefined}
							>
								<span>{prefix}{item.name}</span>
								<span>{item.postCount}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
			<a href={resolve('/blog')} class="archive-back">
				<IconArrowLeft size={17} aria-hidden="true" />
				All journal articles
			</a>
		</aside>
	</div>
</div>

<style>
	.archive-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(12rem, 15rem);
		gap: clamp(2rem, 5vw, 4.5rem);
		align-items: start;
	}

	.archive-stories :global(.posts-grid) {
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
	}

	.pillar-intro {
		margin-block-end: 2rem;
		padding-block-end: 2rem;
		border-block-end: 1px solid var(--line);
	}

	.archive-sidebar {
		min-width: 0;
		padding: 1rem;
		border: 1px solid var(--line);
		border-radius: 0.4rem;
		background: var(--panel);
	}

	.archive-sidebar h2 {
		margin: 0 0 0.75rem;
		font-size: 1.45rem;
		font-weight: 650;
		letter-spacing: -0.035em;
	}

	.archive-sidebar ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.archive-sidebar li + li {
		border-block-start: 1px solid var(--line);
	}

	.archive-sidebar li a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		min-block-size: 44px;
		padding: 0.35rem 0.6rem;
		color: var(--ink);
		line-height: 1.28;
		text-decoration: none;
	}

	.archive-sidebar li a:hover,
	.archive-sidebar li a[aria-current='page'] {
		background: var(--bg-soft);
		color: var(--accent);
	}

	.archive-sidebar li a[aria-current='page'] {
		font-weight: 750;
	}

	.archive-back {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		min-block-size: 44px;
		margin-block-start: 0.7rem;
		color: var(--acid);
		font-weight: 700;
		text-underline-offset: 0.24em;
	}

	.archive-back:hover {
		color: var(--accent);
	}

	@media (max-width: 760px) {
		.archive-layout {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
