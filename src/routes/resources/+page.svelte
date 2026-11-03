<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { gsapHeroEntrance, gsapReveal } from '#lib/attachments/gsap.js';
	import type { PageProps } from './$types';
	import {
		IconBible,
		IconSeedling,
		IconMountain,
		IconSparkles,
		IconJacket,
		IconMailOpened,
		IconArrowRight
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();

	const devotionals = [
		{
			category: 'Biblical Foundation • Matthew 17:20',
			title: 'Faith the Size of a Mustard Seed: What It Actually Means When Your Dreams Are Buried',
			excerpt:
				'God’s word says that it takes faith the size of a mustard seed to move a mountain. Discover why small, surrendered obedience in hard times unlocks supernatural restoration.',
			readTime: '6 min read',
			slug: 'faith-the-size-of-a-mustard-seed-matthew-17-20'
		},
		{
			category: 'Purpose & Calling',
			title: 'Rebuilding Shattered Dreams After Failure: How to Use Your God-Given Talents Again',
			excerpt:
				'When life’s circumstances break your heart wide open, it is easy to believe your calling has expired. Here is our 3-step Friday mentorship framework to bring buried visions back to life.',
			readTime: '6 min read',
			slug: 'how-to-rebuild-your-vision-after-a-shattered-season'
		},
		{
			category: 'Christian Stewardship & Community Impact',
			title:
				'Stewarding Your God-Given Talents in Business and Life (Why We Pause From Thanksgiving to Jan 4)',
			excerpt:
				'Inside our unique stewardship model funding weekly Friday ministry and our 40-day holiday sabbatical serving hot meals and equipping children across Wolcott and Waterbury with winter gear.',
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

<section class="page-hero" {@attach gsapHeroEntrance}>
	<div class="container">
		<div class="eyebrow-badge" data-hero-item>
			<IconBible size={16} />
			<span>DEVOTIONALS, FAITH RESTORATION &amp; OUTREACH RECAPS</span>
		</div>
		<h1 data-hero-item>Mustard Seed Faith Devotionals &amp; Community Impact Hub</h1>
		<p class="lead" data-hero-item>
			Practical Christian encouragement for hard times, biblical wisdom on stewarding your God-given
			talents, and real-time updates from our Friday and holiday outreach in Connecticut.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="articles-grid" {@attach gsapReveal({ selector: '.article-card', stagger: 0.12 })}>
			{#each devotionals as article (article.title)}
				<article class="card article-card">
					<div>
						<span class="badge-teal">{article.category}</span>
						<h2>{article.title}</h2>
						<p>{article.excerpt}</p>
					</div>
					<div class="article-footer">
						<span class="read-time">{article.readTime}</span>
						<a href={resolve('/blog/[slug]', { slug: article.slug })} class="article-link">
							<span>Read Full Devotional</span>
							<IconArrowRight size={17} />
						</a>
					</div>
				</article>
			{/each}
		</div>
		<div style="text-align: center; margin-top: 2.5rem;">
			<a href={resolve('/blog')} class="btn btn-gold">
				<IconBible size={19} />
				<span>Browse All Devotionals &amp; Articles on the Blog</span>
				<IconArrowRight size={18} />
			</a>
		</div>
	</div>
</section>

<!-- Subscribe to Weekly Friday Encouragement -->
<section class="section-navy">
	<div class="container subscribe-grid">
		<div>
			<div class="eyebrow-badge">
				<IconSeedling size={16} />
				<span>EVERY FRIDAY MORNING</span>
			</div>
			<h2>Subscribe to Weekly Friday Encouragement</h2>
			<p>
				Receive a short, faith-building devotional from Courtney Ribeiro every Friday morning—along
				with prayer prompts and updates on our Thanksgiving through January 4 children’s winter coat
				and meal outreach.
			</p>
			<div class="topic-tags">
				<span><IconMountain size={15} /> Mustard Seed Faith</span>
				<span><IconSparkles size={15} /> God-Given Talents</span>
				<span><IconJacket size={15} /> CT Outreach Updates</span>
			</div>
		</div>

		<div class="card sub-card">
			<h3>Join the Friday Encouragement List</h3>
			{#if form?.success}
				<div class="alert-success">{form.message}</div>
			{/if}
			<form method="POST" action="?/subscribeEncouragement" use:enhance>
				<div class="form-field">
					<label for="sub-name">First &amp; Last Name *</label>
					<input id="sub-name" name="name" type="text" required placeholder="Your Name" />
				</div>
				<div class="form-field">
					<label for="sub-email">Email Address *</label>
					<input id="sub-email" name="email" type="email" required placeholder="you@example.com" />
				</div>
				<button type="submit" class="btn btn-gold" style="width: 100%">
					<IconMailOpened size={19} />
					<span>Subscribe to Weekly Friday Encouragement</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.articles-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.75rem;
	}

	.article-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.article-card h2 {
		font-size: 1.35rem;
		margin-top: 0.85rem;
		margin-bottom: 0.75rem;
	}

	.article-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 1.25rem;
		margin-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.read-time {
		font-size: 0.84rem;
		color: var(--color-text-muted);
		font-weight: 600;
	}

	.article-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-weight: 700;
		color: var(--color-teal);
	}

	.subscribe-grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 3rem;
		align-items: center;
	}

	.subscribe-grid h2 {
		margin-top: 0.85rem;
	}

	.topic-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.topic-tags span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.4rem 0.85rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		color: var(--color-gold);
	}

	.sub-card {
		color: var(--color-text);
	}

	.sub-card h3 {
		color: var(--color-navy);
		margin-bottom: 1.15rem;
	}

	@media (max-width: 960px) {
		.articles-grid,
		.subscribe-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
