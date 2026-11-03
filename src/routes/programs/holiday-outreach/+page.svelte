<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { gsapHeroEntrance, gsapReveal, gsapProgressBar } from '#lib/attachments/gsap.js';
	import type { PageProps } from './$types';
	import {
		IconSoup,
		IconJacket,
		IconGift,
		IconHeartHandshake,
		IconMapPin,
		IconCheck,
		IconCalendarHeart
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let selectedTier = $derived(form?.values?.tier ?? '$65');
	let isSubmitting = $state(false);

	const tiers = [
		{
			amount: '$25',
			title: 'Warmth & Meal Bundle',
			badge: 'Essential Care',
			description: 'Provides a Warm Hat, Mittens & Fleece Blanket Bundle + Hot Holiday Meal.'
		},
		{
			amount: '$65',
			title: 'Complete Child’s Winter Package',
			badge: 'Most Popular Impact',
			description:
				'Sponsors 1 Complete Child’s Winter Package (New Heavy Winter Coat, Hat, Mittens, Blanket + Holiday Meal).'
		},
		{
			amount: '$250',
			title: 'Full Family Holiday Sponsorship',
			badge: 'Family of 4',
			description: 'Sponsors an Entire Family of 4 for Thanksgiving & Christmas Outreach.'
		}
	] as const;
</script>

<svelte:head>
	<title>Thanksgiving Meal &amp; Kids Winter Coat Drive | Grow Your Faith Ministries</title>
	<meta
		name="description"
		content="From Thanksgiving through January 4, help us serve hot holiday meals and provide brand-new winter coats, hats, mittens, and blankets for children across Connecticut."
	/>
	<meta
		property="og:title"
		content="Thanksgiving Meal & Kids Winter Coat Drive | Grow Your Faith Ministries"
	/>
	<meta
		property="og:description"
		content="From Thanksgiving through January 4, help us serve hot holiday meals and provide brand-new winter coats, hats, mittens, and blankets for children across Connecticut."
	/>
</svelte:head>

<section class="page-hero" {@attach gsapHeroEntrance}>
	<div class="container">
		<div class="eyebrow-badge" data-hero-item>
			<IconCalendarHeart size={16} />
			<span>40-DAY SEASON OF SERVICE • NOV 26 – JAN 4</span>
		</div>
		<h1 data-hero-item>Warm Meals &amp; Winter Coats: Our Annual Thanksgiving to Jan 4 Outreach</h1>
		<p class="lead" data-hero-item>
			“I take off from Thanksgiving to January 4 every year to serve in the community and spend time
			with friends and family. I serve our community by doing Thanksgiving and Christmas outreach…
			serving a hot holiday meal and purchasing coats, hats, mittens, and blankets for all the
			children.” — Courtney Ribeiro
		</p>
	</div>
</section>

<!-- Live 2026 Campaign Progress Tracker -->
<section class="campaign-tracker" {@attach gsapReveal({ y: 20 })}>
	<div class="container tracker-card">
		<div class="tracker-header">
			<div>
				<span class="badge-emerald">Active 2026 Campaign • Starts Thanksgiving (Nov 26, 2026)</span>
				<h2>Connecticut Children’s Winter Warmth &amp; Holiday Meal Goal</h2>
			</div>
			<div class="tracker-stats">
				<strong>100% Direct Allocation</strong>
				<span>Wolcott • Waterbury • New Haven • Hartford Counties</span>
			</div>
		</div>
		<div
			class="progress-track"
			role="progressbar"
			aria-valuenow={74}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div class="progress-fill" style="width: 74%" {@attach gsapProgressBar(74)}></div>
		</div>
		<div class="tracker-meta">
			<span
				><strong>185 of 250</strong> Children’s Winter Warmth Kits &amp; Family Meals Sponsored</span
			>
			<span><strong>65 Kits Needed</strong> Before Christmas Outreach</span>
		</div>
	</div>
</section>

<!-- Two Flagship Initiatives -->
<section class="section">
	<div
		class="container initiatives-grid"
		{@attach gsapReveal({ selector: '.initiative-card', stagger: 0.14 })}
	>
		<article class="card initiative-card">
			<div class="init-icon">
				<IconSoup size={28} />
			</div>
			<span class="badge-teal">Initiative 1 • Food Dignity</span>
			<h3>Hot Holiday Meals (Thanksgiving &amp; Christmas)</h3>
			<p>
				Serving hot, dignified Thanksgiving and Christmas meals to individuals and families facing
				food insecurity across Greater Waterbury and Central Connecticut. Every meal is prepared and
				delivered with prayer, warmth, and personal care.
			</p>
			<ul class="init-list">
				<li><IconCheck size={17} /> Traditional hot Thanksgiving &amp; Christmas dinners</li>
				<li>
					<IconCheck size={17} /> Direct delivery to families in transition &amp; local shelters
				</li>
				<li><IconCheck size={17} /> Zero cost or barriers for families in need</li>
			</ul>
		</article>

		<article class="card initiative-card">
			<div class="init-icon gold">
				<IconJacket size={28} />
			</div>
			<span class="badge-emerald">Initiative 2 • New England Winter Protection</span>
			<h3>Children’s Winter Warmth Packages</h3>
			<p>
				Purchasing brand-new heavy winter coats, hats, mittens, and fleece blankets so no child in
				our Connecticut communities goes cold during the harsh New England winter.
			</p>
			<ul class="init-list">
				<li><IconCheck size={17} /> Brand-new heavy winter coats sized per child</li>
				<li><IconCheck size={17} /> Matching warm hats, insulated mittens &amp; cozy blankets</li>
				<li>
					<IconCheck size={17} /> Partnered with local schools, churches &amp; family referrals
				</li>
			</ul>
		</article>
	</div>
</section>

<!-- Interactive Sponsorship Tiers & Checkout Form -->
<section class="section-alt" id="sponsor">
	<div class="container">
		<div class="section-intro">
			<span class="badge-teal">Interactive Sponsorship Tiers</span>
			<h2>Sponsor a Child’s Winter Package or Family Holiday Meal</h2>
			<p>
				Select a sponsorship tier below. Because MWC Digital Agency underwrites administrative
				operations, 100% of your contribution purchases meals and children’s winter gear.
			</p>
		</div>

		<div class="tiers-grid">
			{#each tiers as t (t.amount)}
				<div class={['card', 'tier-card', { selected: selectedTier === t.amount }]}>
					<span class="badge-teal">{t.badge}</span>
					<div class="tier-price">{t.amount}</div>
					<h3>{t.title}</h3>
					<p>{t.description}</p>
					<button
						type="button"
						class={selectedTier === t.amount ? 'btn btn-gold' : 'btn btn-navy'}
						style="width: 100%"
						aria-pressed={selectedTier === t.amount}
						onclick={() => (selectedTier = t.amount)}
					>
						{selectedTier === t.amount ? 'Selected Tier ✓' : `Select ${t.amount} Tier`}
					</button>
				</div>
			{/each}
		</div>

		<div class="checkout-grid">
			<div class="card">
				<h3>Complete Your Holiday Sponsorship Pledge ({selectedTier})</h3>
				{#if form?.success}
					<div class="alert-success" role="status">{form.message}</div>
				{/if}
				{#if form?.error}
					<div id="sponsor-form-error" class="alert-error" role="alert">{form.error}</div>
				{/if}
				<form
					method="POST"
					action="?/sponsorHoliday"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
				>
					<input type="hidden" name="tier" value={selectedTier} />
					<div class="form-grid">
						<div class="form-field">
							<label for="sponsor-name">Your Full Name or Business Name *</label>
							<input
								id="sponsor-name"
								name="name"
								type="text"
								autocomplete="name"
								required
								value={form?.values?.name ?? ''}
								aria-invalid={form?.error && !form?.values?.name ? 'true' : undefined}
								aria-describedby={form?.error ? 'sponsor-form-error' : undefined}
								placeholder="Your Name"
							/>
						</div>
						<div class="form-field">
							<label for="sponsor-email">Email Address (for Receipt &amp; Impact Update) *</label>
							<input
								id="sponsor-email"
								name="email"
								type="email"
								autocomplete="email"
								required
								value={form?.values?.email ?? ''}
								aria-invalid={form?.error && !form?.values?.email ? 'true' : undefined}
								aria-describedby={form?.error ? 'sponsor-form-error' : undefined}
								placeholder="you@example.com"
							/>
						</div>
					</div>
					<div class="form-grid">
						<div class="form-field">
							<label for="sponsor-tier-select">Sponsorship Tier</label>
							<select id="sponsor-tier-select" bind:value={selectedTier} name="tierSelect">
								<option value="$25">$25 — Hat, Mittens &amp; Blanket Bundle + Hot Meal</option>
								<option value="$65">$65 — Complete Child’s Winter Coat Package + Meal</option>
								<option value="$250">$250 — Entire Family of 4 Holiday Outreach</option>
								<option value="$500">$500 — Corporate / Client 8-Child Coat Sponsor</option>
							</select>
						</div>
						<div class="form-field">
							<label for="sponsor-city">Your City / State</label>
							<input
								id="sponsor-city"
								name="city"
								type="text"
								autocomplete="address-level2"
								value={form?.values?.city ?? ''}
								placeholder="Wolcott / Waterbury, CT"
							/>
						</div>
					</div>
					<div class="form-field">
						<label for="sponsor-details">Optional Note or Dedication</label>
						<textarea
							id="sponsor-details"
							name="details"
							rows="2"
							value={form?.values?.details ?? ''}
							placeholder="Optional encouragement note for a family or specific coat sizes if donating in-kind..."
						></textarea>
					</div>
					<button
						type="submit"
						class="btn btn-gold"
						style="width: 100%"
						disabled={isSubmitting}
						aria-busy={isSubmitting}
					>
						<IconHeartHandshake size={20} />
						<span
							>{isSubmitting
								? 'Submitting Sponsorship...'
								: `Confirm ${selectedTier} Holiday Outreach Sponsorship`}</span
						>
					</button>
				</form>
			</div>

			<div class="card dropoff-card">
				<IconGift size={30} />
				<h3>Drop-Off &amp; In-Kind Coat Drive Option</h3>
				<p>
					Prefer to purchase brand-new winter coats, hats, mittens, or fleece blankets directly? We
					coordinate local drop-offs across Wolcott and Waterbury as well as direct shipping from
					our ministry wishlist.
				</p>
				<div class="geo-box">
					<IconMapPin size={18} />
					<span><strong>Primary Service Hub:</strong> Wolcott &amp; Greater Waterbury, CT</span>
				</div>
				<p style="margin-top: 1rem;">
					Need to register a family to <strong>receive</strong> Thanksgiving/Christmas meals or children’s
					coats?
				</p>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- query-string tab target on resolved route -->
				<a
					href={`${resolve('/prayer-and-support')}?tab=holiday`}
					class="btn btn-navy"
					style="width: 100%"
				>
					Register a Family for Holiday Assistance →
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.campaign-tracker {
		margin-top: -2rem;
		position: relative;
		z-index: 10;
	}

	.tracker-card {
		background: var(--color-surface);
		border: 2px solid var(--color-gold);
		border-radius: var(--radius-md);
		padding: 1.75rem 2rem;
		box-shadow: var(--shadow-elevated);
	}

	.tracker-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.tracker-header h2 {
		font-size: 1.4rem;
		margin: 0.4rem 0 0;
	}

	.tracker-stats {
		text-align: right;
		display: flex;
		flex-direction: column;
		font-size: 0.88rem;
		color: var(--color-text-muted);
	}

	.tracker-stats strong {
		color: var(--color-navy);
		font-size: 1rem;
	}

	.progress-track {
		width: 100%;
		height: 14px;
		background: var(--color-parchment-alt);
		border-radius: 999px;
		overflow: hidden;
		margin-bottom: 0.65rem;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--color-emerald), var(--color-teal));
		border-radius: 999px;
	}

	.tracker-meta {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.88rem;
		color: var(--color-text-muted);
	}

	.initiatives-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2rem;
	}

	.init-icon {
		width: 54px;
		height: 54px;
		border-radius: 12px;
		background: var(--color-navy);
		color: var(--color-gold);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.init-icon.gold {
		background: var(--color-gold);
		color: var(--color-navy);
	}

	.initiative-card h3 {
		margin-top: 0.65rem;
	}

	.init-list {
		list-style: none;
		padding: 0;
		margin: 1.25rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.init-list li {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 0.94rem;
		font-weight: 500;
	}

	.init-list li :global(svg) {
		color: var(--color-emerald);
		flex-shrink: 0;
	}

	.section-intro {
		text-align: center;
		max-width: 720px;
		margin: 0 auto 2.5rem;
	}

	.section-intro h2 {
		margin-top: 0.75rem;
	}

	.tiers-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}

	.tier-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: all 0.2s ease;
	}

	.tier-card.selected {
		border: 2px solid var(--color-gold);
		box-shadow: var(--shadow-elevated);
	}

	.tier-price {
		font-family: var(--font-heading);
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--color-navy);
		margin: 0.5rem 0;
	}

	.checkout-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		gap: 2rem;
		align-items: start;
	}

	.checkout-grid > * {
		min-width: 0;
	}

	.dropoff-card :global(svg) {
		color: var(--color-gold);
		margin-bottom: 0.6rem;
	}

	.geo-box {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--color-parchment);
		padding: 0.85rem 1rem;
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
	}

	@media (max-width: 960px) {
		.initiatives-grid,
		.tiers-grid,
		.checkout-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
