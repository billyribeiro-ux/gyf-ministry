<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { gsapReveal } from '#lib/attachments/gsap.js';
	import MinistryMasthead from '#lib/components/ministry/MinistryMasthead.svelte';
	import type { PageProps } from './$types';
	import { IconBible, IconMailOpened, IconArrowRight } from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let isSubmitting = $state(false);

	const devotionals = [
		{
			category: 'Matthew 17:20',
			title: 'Faith the size of a mustard seed',
			excerpt:
				'A reflection on Matthew 17:20 and what a little faith can look like when hope feels far away.',
			readTime: '6 min read',
			slug: 'faith-the-size-of-a-mustard-seed-matthew-17-20'
		},
		{
			category: 'Purpose & Calling',
			title: 'Rebuilding your vision after a setback',
			excerpt:
				'Three questions to help you revisit a dream you set aside and decide what to do next.',
			readTime: '6 min read',
			slug: 'how-to-rebuild-your-vision-after-a-shattered-season'
		},
		{
			category: 'Christian stewardship',
			title: 'Putting your God-given gifts to work',
			excerpt:
				'See how Courtney makes room for Friday ministry and holiday outreach, and consider where you could make room to serve.',
			readTime: '6 min read',
			slug: 'stewarding-your-god-given-talents-in-business-and-life'
		}
	] as const;
</script>

<svelte:head>
	<title>Faith &amp; Purpose Devotionals &amp; Impact Recaps | Grow Your Faith Ministries</title>
	<meta
		name="description"
		content="Read mustard-seed faith devotionals, practical guides on rebuilding shattered dreams after adversity, and Connecticut community outreach impact reports."
	/>
	<meta
		property="og:title"
		content="Faith & Purpose Devotionals & Impact Recaps | Grow Your Faith Ministries"
	/>
	<meta
		property="og:description"
		content="Read mustard-seed faith devotionals, practical guides on rebuilding shattered dreams after adversity, and Connecticut community outreach impact reports."
	/>
</svelte:head>

<MinistryMasthead
	label="Faith resources"
	title="A place to pause and reflect."
	actions={[
		{ href: '#devotionals', label: 'Read a devotional' },
		{ href: '#friday-encouragement', label: 'Join Friday encouragement' }
	]}
>
	<p>
		Read a devotional, revisit a dream you set aside, or reflect on how you can use your gifts to
		serve a neighbor.
	</p>
</MinistryMasthead>

<section class="section" id="devotionals" aria-labelledby="devotionals-heading">
	<div class="container">
		<h2 id="devotionals-heading">Read at your own pace</h2>
		<div class="articles-grid" {@attach gsapReveal({ selector: '.article-card', stagger: 0.12 })}>
			{#each devotionals as article, index (article.slug)}
				<article class="card article-card" class:featured={index === 0}>
					<div>
						<p class="article-category">{article.category}</p>
						<h3>{article.title}</h3>
						<p>{article.excerpt}</p>
					</div>
					<div class="article-footer">
						<span class="read-time">{article.readTime}</span>
						<a
							href={resolve('/blog/[slug]', { slug: article.slug })}
							class="article-link"
							aria-label={`Read devotional “${article.title}”`}
						>
							<span>Read devotional</span>
							<IconArrowRight size={17} aria-hidden="true" />
						</a>
					</div>
				</article>
			{/each}
		</div>
		<div class="blog-link">
			<a href={resolve('/blog')} class="btn ministry-primary">
				<IconBible size={19} />
				<span>Browse all devotionals</span>
				<IconArrowRight size={18} />
			</a>
		</div>
	</div>
</section>

<!-- Sign up for Friday encouragement -->
<section class="section-navy" id="friday-encouragement">
	<div class="container subscribe-grid">
		<div {@attach gsapReveal()}>
			<h2>Get Friday encouragement by email</h2>
			<p>
				Sign up for devotionals from Courtney Ribeiro, prayer prompts, and updates on the ministry’s
				holiday meal and winter coat outreach.
			</p>
		</div>

		<div class="card sub-card">
			<h3>Leave your name and email</h3>
			{#if form?.success}
				<div class="alert-success" role="status">{form.message}</div>
			{/if}
			{#if form?.error}
				<div id="sub-form-error" class="alert-error" role="alert">{form.error}</div>
			{/if}
			<form
				method="POST"
				action="?/subscribeEncouragement"
				aria-describedby={form?.error ? 'sub-form-error' : undefined}
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="form-field">
					<label for="sub-name">First &amp; Last Name *</label>
					<input
						id="sub-name"
						name="name"
						type="text"
						autocomplete="name"
						required
						value={form?.values?.name ?? ''}
						aria-invalid={form?.error && !form?.values?.name ? 'true' : undefined}
						aria-describedby={form?.error ? 'sub-form-error' : undefined}
						placeholder="Your Name"
					/>
				</div>
				<div class="form-field">
					<label for="sub-email">Email Address *</label>
					<input
						id="sub-email"
						name="email"
						type="email"
						autocomplete="email"
						required
						value={form?.values?.email ?? ''}
						aria-invalid={form?.error && !form?.values?.email ? 'true' : undefined}
						aria-describedby={form?.error ? 'sub-form-error' : undefined}
						placeholder="you@example.com"
					/>
				</div>
				<button
					type="submit"
					class="btn ministry-primary"
					style="width: 100%"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					<IconMailOpened size={19} />
					<span>{isSubmitting ? 'Sending request…' : 'Sign up for Friday encouragement'}</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.articles-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.16fr) minmax(0, 1fr);
		gap: 1rem;
	}

	.article-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-shadow: none;
	}

	.article-card.featured {
		grid-row: span 2;
		background: var(--color-raised, #222631);
		border-color: var(--color-line, #343946);
	}

	.article-card h3 {
		font-size: clamp(1.45rem, 2.4vw, 2rem);
		margin-bottom: 0.7rem;
	}

	.featured h3 {
		font-size: clamp(2.3rem, 5.2vw, 4.4rem);
		max-width: 12ch;
	}

	.article-category {
		margin: 0 0 0.55rem;
		color: var(--color-accent, #adc8ff);
		font-size: 0.79rem;
		font-weight: 750;
		letter-spacing: 0.11em;
		text-transform: uppercase;
	}

	.article-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.4rem 1rem;
		padding-top: 0.55rem;
		border-top: 1px solid var(--color-line, #343946);
	}

	.read-time {
		font-size: 0.84rem;
		color: var(--color-soft, #b6bed0);
		font-weight: 600;
	}

	.article-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		min-height: 44px;
		font-weight: 700;
		color: var(--color-accent, #adc8ff);
	}

	.blog-link {
		margin-top: 2rem;
	}

	.blog-link .btn {
		max-inline-size: 100%;
		padding-inline: clamp(0.8rem, 4vw, 1.55rem);
	}

	.blog-link span {
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	.blog-link :global(svg) {
		flex: 0 0 auto;
	}

	.subscribe-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
		gap: 3rem;
		align-items: center;
	}

	.subscribe-grid > * {
		min-width: 0;
	}

	.sub-card {
		color: var(--color-soft, #b6bed0);
	}

	.sub-card h3 {
		color: var(--color-strong, #f5f7fb);
		margin-bottom: 1.15rem;
	}

	@media (max-width: 800px) {
		.subscribe-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 660px) {
		.articles-grid {
			grid-template-columns: 1fr;
		}

		.article-card.featured {
			grid-row: auto;
		}
	}
</style>
