<script lang="ts">
	import '#lib/styles/inner-page.css';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { IconArrowLeft } from '@tabler/icons-svelte';
	import SearchForm from '#lib/components/blog/SearchForm.svelte';

	let status = $derived(page.status);
	let heading = $derived(
		status === 404
			? 'We couldn’t find that article.'
			: status === 403
				? 'This article is restricted.'
				: 'The journal is temporarily unavailable.'
	);
	let subtext = $derived(
		status === 404
			? 'Try searching for the title, a topic, or a phrase you remember.'
			: status === 403
				? 'Access is limited to authorized members or editors.'
				: 'Try refreshing in a moment or return to the journal.'
	);
</script>

<svelte:head>
	<title>{heading} | Grow Your Faith Ministries</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div id="blog-error-page" class="inner-page blog-error-page">
	<section class="blog-width blog-content error-content" aria-labelledby="error-h1">
		<div class="error-inner">
			<span class="blog-kicker">Mustard Seed Journal</span>
			<h1 id="error-h1" class="blog-section-title">{heading}</h1>
			<p>{subtext}</p>
			{#if status === 404}
				<SearchForm />
			{/if}
			<a href={resolve('/blog')} class="back-link">
				<IconArrowLeft size={18} aria-hidden="true" />
				Back to the journal
			</a>
		</div>
	</section>
</div>

<style>
	.error-content {
		min-height: 24rem;
	}

	.error-inner {
		max-width: 43rem;
		margin-inline: auto;
		padding-block-start: clamp(1.35rem, 4vw, 2.5rem);
		border-block-start: 1px solid var(--line);
	}

	h1 {
		margin-block-start: 0.65rem;
	}

	p {
		margin-block: 0.85rem 1.25rem;
		color: var(--muted);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		min-block-size: 44px;
		margin-block-start: 0.75rem;
		color: var(--acid);
		font-weight: 700;
		text-underline-offset: 0.24em;
	}

	.back-link:hover {
		color: var(--accent);
	}
</style>
