<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { IconArrowRight, IconSeedling } from '@tabler/icons-svelte';

	const isMissing = $derived(page.status === 404);
	const title = $derived(isMissing ? 'Page not found' : 'Something went wrong');
</script>

<svelte:head>
	<title>{title} | Grow Your Faith Ministries</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="section error-section" aria-labelledby="error-title">
	<div class="container-narrow">
		<IconSeedling size={34} stroke={1.4} aria-hidden="true" />
		<h1 id="error-title">{title}</h1>
		<p>
			{isMissing
				? 'The page you were looking for may have moved. You can return home or go straight to prayer and support.'
				: 'Please try again in a moment. You can also return to the ministry homepage.'}
		</p>
		<div class="error-actions">
			<a class="btn btn-navy" href={resolve('/')}>
				Return home <IconArrowRight size={18} aria-hidden="true" />
			</a>
			<a class="support-link" href={resolve('/prayer-and-support')}>Find prayer &amp; support</a>
		</div>
	</div>
</section>

<style>
	.error-section {
		min-height: 54vh;
		display: grid;
		align-items: center;
		border-bottom: 1px solid var(--color-rule);
	}

	.error-section :global(svg:first-child) {
		color: var(--color-rust);
	}

	h1 {
		margin: 0.75rem 0 1rem;
		font-size: clamp(2.7rem, 6.5vw, 5.6rem);
		line-height: 1;
	}

	p {
		max-width: 50ch;
		color: var(--color-text-muted);
	}

	.error-actions {
		display: flex;
		align-items: center;
		gap: 0.6rem 1.45rem;
		flex-wrap: wrap;
	}

	.support-link {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		color: var(--color-rust);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}
</style>
