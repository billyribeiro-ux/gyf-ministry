<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { gsapReveal } from '#lib/attachments/gsap.js';
	import MinistryMasthead from '#lib/components/ministry/MinistryMasthead.svelte';
	import type { PageProps } from './$types';
	import { sponsorshipTiers } from './sponsorship.js';
	import {
		IconSoup,
		IconJacket,
		IconGift,
		IconHeartHandshake,
		IconMapPin,
		IconCheck
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let selectedTier = $derived(form?.values?.tier ?? '$65');
	let isSubmitting = $state(false);
	const holidayAssistanceHref = `${resolve('/prayer-and-support')}?tab=holiday#support-request`;
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

<MinistryMasthead
	label="Holiday Outreach · Thanksgiving through January 4"
	title="A warm meal. A winter coat."
	photo={{
		src: 'images/gallery/carousel1-2.webp',
		alt: 'Volunteers stand beside tables of prepared meals at a winter outreach event',
		width: 1200,
		height: 900,
		small: { src: 'images/gallery/carousel1-2-560w.webp', width: 560 },
		caption: 'Preparing to serve holiday meals in Connecticut'
	}}
	actions={[
		{ href: '#sponsor', label: 'Pledge meals or coats' },
		{ href: holidayAssistanceHref, label: 'Request holiday assistance' }
	]}
>
	<p>
		From Thanksgiving through January 4, we serve holiday meals and help children in Connecticut get
		the winter gear they need. You can ask for help or pledge support here.
	</p>
</MinistryMasthead>

<section class="campaign-goal" aria-labelledby="campaign-goal-heading">
	<div class="container goal-inner">
		<div>
			<p>2026 Holiday Outreach</p>
			<h2 id="campaign-goal-heading">Help us provide 250 winter kits and holiday meals.</h2>
		</div>
		<p>November 26, 2026 through January 4, 2027<br />Greater Waterbury and Central Connecticut</p>
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
			<h2>Hot holiday meals</h2>
			<p>
				We serve hot Thanksgiving and Christmas meals to neighbors in Greater Waterbury and Central
				Connecticut.
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
			<div class="init-icon">
				<IconJacket size={28} />
			</div>
			<h2>Winter kits for children</h2>
			<p>Each kit includes a new winter coat, a hat, mittens, and a fleece blanket.</p>
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

<section class="section-alt" id="sponsor">
	<div class="container">
		<div class="section-intro">
			<h2>Make a holiday pledge</h2>
			<p>
				Choose an amount below to make a pledge. MWC Digital Agency covers administrative costs, so
				contributions go directly to meals and children’s winter gear.
			</p>
		</div>

		<fieldset class="tiers">
			<legend>Choose a sponsorship amount</legend>
			<div class="tiers-grid">
				{#each sponsorshipTiers as tier (tier.amount)}
					<label class="card tier-card">
						<span class="tier-choice">
							<span class="tier-price">{tier.amount}</span>
							<input
								type="radio"
								name="tier"
								form="holiday-pledge"
								value={tier.amount}
								checked={selectedTier === tier.amount}
								aria-label={`${tier.amount} for ${tier.title}`}
								required
							/>
						</span>
						<strong>{tier.title}</strong>
						<span>{tier.description}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<div class="checkout-grid">
			<div class="card">
				<h3>Your sponsorship details</h3>
				{#if form?.success}
					<div class="alert-success" role="status">{form.message}</div>
				{/if}
				{#if form?.error}
					<div id="sponsor-form-error" class="alert-error" role="alert">{form.error}</div>
				{/if}
				<form
					id="holiday-pledge"
					method="POST"
					action="?/sponsorHoliday"
					aria-describedby={form?.error ? 'sponsor-form-error' : undefined}
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
						};
					}}
				>
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
							<label for="sponsor-email">Email address *</label>
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
						class="btn ministry-primary"
						style="width: 100%"
						disabled={isSubmitting}
						aria-busy={isSubmitting}
					>
						<IconHeartHandshake size={20} />
						<span>{isSubmitting ? 'Sending pledge…' : 'Send sponsorship pledge'}</span>
					</button>
				</form>
			</div>

			<div class="card dropoff-card">
				<IconGift size={30} />
				<h3>Give coats or winter gear</h3>
				<p>
					If you’d like to give new winter gear directly, we can arrange a local drop-off in Wolcott
					or Waterbury.
				</p>
				<div class="geo-box">
					<IconMapPin size={18} />
					<span><strong>Based in</strong> Wolcott &amp; Greater Waterbury, CT</span>
				</div>
				<p style="margin-top: 1rem;">
					Need to register a family to <strong>receive</strong> Thanksgiving/Christmas meals or children’s
					coats?
				</p>
				<!-- oxlint-disable-next-line svelte/no-navigation-without-resolve -- route resolved above -->
				<a href={holidayAssistanceHref} class="btn ministry-secondary" style="width: 100%">
					Request holiday assistance →
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.campaign-goal {
		background: var(--color-panel, #1a1d25);
		color: var(--color-strong, #f5f7fb);
		border-bottom: 1px solid var(--color-line, #343946);
		padding-block: clamp(1.6rem, 4vw, 3.1rem);
	}

	.goal-inner {
		display: flex;
		align-items: end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1.25rem 2.5rem;
	}

	.goal-inner p,
	.goal-inner h2 {
		margin: 0;
		color: inherit;
	}

	.goal-inner div > p {
		margin-bottom: 0.42rem;
		color: var(--color-accent, #adc8ff);
		font-size: 0.79rem;
		font-weight: 700;
		letter-spacing: 0.11em;
		text-transform: uppercase;
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
		background: var(--color-raised, #222631);
		color: var(--color-accent, #adc8ff);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.initiative-card h2 {
		font-size: clamp(1.7rem, 3vw, 2.2rem);
		margin-bottom: 0.65rem;
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
		color: var(--color-accent, #adc8ff);
		flex-shrink: 0;
	}

	.section-intro {
		max-width: 62ch;
		margin-bottom: 2rem;
	}

	.tiers {
		min-width: 0;
		padding: 0;
		margin: 0 0 2rem;
		border: 0;
	}

	.tiers legend {
		margin-bottom: 0.7rem;
		padding: 0;
		font-weight: 700;
		color: var(--color-strong, #f5f7fb);
	}

	.tiers-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.tier-card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		box-shadow: none;
		padding: clamp(1rem, 2.2vw, 1.6rem);
		cursor: pointer;
		color: var(--color-soft, #b6bed0);
		font-size: 1rem;
		line-height: 1.45;
	}

	.tier-card strong {
		color: var(--color-strong, #f5f7fb);
	}

	.tier-card:has(input:checked) {
		border-color: var(--color-accent, #adc8ff);
		box-shadow: inset 0 0 0 1px var(--color-accent, #adc8ff);
	}

	.tier-card:has(input:focus-visible) {
		outline: 2px solid var(--color-accent, #adc8ff);
		outline-offset: 3px;
	}

	.tier-choice {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.45rem;
	}

	.tier-choice input {
		width: 1.15rem;
		height: 1.15rem;
		margin: 0;
		accent-color: var(--color-strong, #f5f7fb);
	}

	.tier-price {
		font-family: var(--font-heading);
		font-size: 2.65rem;
		font-weight: 500;
		color: var(--color-strong, #f5f7fb);
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
		color: var(--color-accent, #adc8ff);
		margin-bottom: 0.6rem;
	}

	.geo-box {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--color-screen, #101116);
		padding: 0.85rem 1rem;
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
	}

	@media (max-width: 960px) {
		.tiers-grid,
		.initiatives-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.checkout-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 560px) {
		.initiatives-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 360px) {
		.tiers-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
