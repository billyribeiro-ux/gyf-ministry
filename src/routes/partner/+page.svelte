<script lang="ts">
	import { enhance } from '$app/forms';
	import { siteConfig } from '#lib/config/site.js';
	import { gsapReveal } from '#lib/attachments/gsap.js';
	import MinistryMasthead from '#lib/components/ministry/MinistryMasthead.svelte';
	import type { PageProps } from './$types';
	import { partnershipCommitments } from './commitments.js';
	import {
		IconHeartHandshake,
		IconBuildingChurch,
		IconJacket,
		IconGift,
		IconCheck
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Partner With Us &amp; Sponsor Outreach | Grow Your Faith Ministries</title>
	<meta
		name="description"
		content="With the help and support of clients and partners like you, 100% of outreach contributions directly fund hot holiday meals and brand-new winter gear for children."
	/>
	<meta
		property="og:title"
		content="Partner With Us & Sponsor Outreach | Grow Your Faith Ministries"
	/>
	<meta
		property="og:description"
		content="With the help and support of clients and partners like you, 100% of outreach contributions directly fund hot holiday meals and brand-new winter gear for children."
	/>
</svelte:head>

<MinistryMasthead
	label="Partner with us"
	title="Help a neighbor get through winter."
	photo={{
		src: 'images/gallery/carousel1-5.webp',
		alt: 'Volunteers gathered around an outdoor table during ministry outreach',
		width: 1200,
		height: 900,
		small: { src: 'images/gallery/carousel1-5-560w.webp', width: 560 },
		caption: 'Serving together in Connecticut'
	}}
	actions={[{ href: '#partnership-pledge', label: 'Choose how to help' }]}
>
	<p>
		Give toward a holiday meal, help a child get a coat, or organize a winter gear drive in your
		community. {siteConfig.founder.parentOrgName} covers administrative costs so contributions go directly
		to meals and gear.
	</p>
</MinistryMasthead>

<!-- Three Ways to Partner -->
<section class="section">
	<div class="container">
		<div class="section-intro" {@attach gsapReveal({ y: 20 })}>
			<h2>Give, sponsor, or organize a drive</h2>
		</div>

		<div class="ways-grid" {@attach gsapReveal({ selector: '.way-card', stagger: 0.12 })}>
			<article class="card way-card">
				<div class="way-icon">
					<IconHeartHandshake size={28} />
				</div>
				<h3>One-time or monthly giving</h3>
				<p>
					Make a single gift or contribute monthly so the ministry can plan for holiday meals and
					winter gear.
				</p>
				<ul class="way-list">
					<li><IconCheck size={16} /> Pledge $25 or $65 a month</li>
					<li><IconCheck size={16} /> Make a one-time gift for a child or family</li>
				</ul>
			</article>

			<article class="card way-card">
				<div class="way-icon">
					<IconBuildingChurch size={28} />
				</div>
				<h3>Business sponsorship</h3>
				<p>Businesses can sponsor 10, 25, or 50 winter kits for Connecticut children.</p>
				<ul class="way-list">
					<li><IconCheck size={16} /> 10 Children’s Winter Kits ($650)</li>
					<li><IconCheck size={16} /> 25 Children’s Winter Kits ($1,625)</li>
					<li><IconCheck size={16} /> 50 Children’s Winter Kits ($3,250)</li>
				</ul>
			</article>

			<article class="card way-card">
				<div class="way-icon">
					<IconGift size={28} />
				</div>
				<h3>Winter gear drives</h3>
				<p>
					Collect new coats, hats, mittens, and fleece blankets at your workplace, church, or shop.
				</p>
				<ul class="way-list">
					<li><IconCheck size={16} /> Ask for a collection box and signage</li>
					<li>
						<IconCheck size={16} /> Arrange pickup in Greater Waterbury or Central Connecticut
					</li>
				</ul>
			</article>
		</div>
	</div>
</section>

<!-- Partner Registration & Sponsorship Form -->
<section class="section-alt" id="partnership-pledge">
	<div class="container partner-form-grid">
		<div {@attach gsapReveal()}>
			<h2>Make a partnership pledge</h2>
			<p>Choose how you’d like to help and leave your contact information so we can follow up.</p>
			<div class="card bridge-note">
				<h3>Already an MWC client?</h3>
				<p>
					Are you a client of <a
						href={siteConfig.founder.parentOrgUrl}
						target="_blank"
						rel="noopener noreferrer">MWC Digital Agency</a
					>
					or
					<a href={siteConfig.founder.coachingUrl} target="_blank" rel="noopener noreferrer"
						>Marketing With Courtney</a
					>? Thank you—your business partnership already helps underwrite every Friday of ministry
					and our annual 40-day holiday sabbatical!
				</p>
			</div>
		</div>

		<div class="card">
			<h3>Tell us how you’d like to help</h3>
			{#if form?.success}
				<div class="alert-success" role="status">{form.message}</div>
			{/if}
			{#if form?.error}
				<div id="partner-form-error" class="alert-error" role="alert">{form.error}</div>
			{/if}
			<form
				method="POST"
				action="?/submitPartner"
				aria-describedby={form?.error ? 'partner-form-error' : undefined}
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="form-field">
					<label for="part-name">Your Name or Company Name *</label>
					<input
						id="part-name"
						name="name"
						type="text"
						autocomplete="name"
						required
						value={form?.values?.name ?? ''}
						aria-invalid={form?.error && !form?.values?.name ? 'true' : undefined}
						aria-describedby={form?.error ? 'partner-form-error' : undefined}
						placeholder="Full Name / Company"
					/>
				</div>
				<div class="form-field">
					<label for="part-email">Email Address *</label>
					<input
						id="part-email"
						name="email"
						type="email"
						autocomplete="email"
						required
						value={form?.values?.email ?? ''}
						aria-invalid={form?.error && !form?.values?.email ? 'true' : undefined}
						aria-describedby={form?.error ? 'partner-form-error' : undefined}
						placeholder="you@company.com"
					/>
				</div>
				<div class="form-field">
					<label for="part-commitment">How would you like to partner? *</label>
					<select
						id="part-commitment"
						name="commitment"
						required
						value={form?.values?.commitment ?? ''}
					>
						<option value="">Choose a way to partner</option>
						{#each partnershipCommitments as group (group.path)}
							<optgroup label={group.path}>
								{#each group.options as option (option.id)}
									<option value={option.id}>{option.label}</option>
								{/each}
							</optgroup>
						{/each}
					</select>
				</div>
				<div class="form-field">
					<label for="part-details">Anything we should know about your pledge?</label>
					<textarea
						id="part-details"
						name="details"
						rows="3"
						value={form?.values?.details ?? ''}
						placeholder="Let us know how we can coordinate your sponsorship or coat drive box..."
					></textarea>
				</div>
				<button
					type="submit"
					class="btn ministry-primary"
					style="width: 100%"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					<IconJacket size={19} />
					<span>{isSubmitting ? 'Sending pledge…' : 'Send partnership pledge'}</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.section-intro {
		max-width: 60ch;
		margin: 0 0 2rem;
	}

	.ways-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.75rem;
	}

	.way-card {
		border-top: 2px solid var(--color-accent, #adc8ff);
		box-shadow: none;
	}

	.way-icon {
		display: inline-flex;
		color: var(--color-accent, #adc8ff);
	}

	.way-card h3 {
		margin-top: 0.65rem;
	}

	.way-list {
		list-style: none;
		padding: 0;
		margin: 1.25rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.way-list li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.92rem;
		font-weight: 500;
	}

	.way-list li :global(svg) {
		color: var(--color-accent, #adc8ff);
		flex-shrink: 0;
	}

	.partner-form-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		gap: 3rem;
		align-items: start;
	}

	.partner-form-grid > * {
		min-width: 0;
	}

	.partner-form-grid h2 {
		margin-top: 0.75rem;
	}

	.bridge-note {
		margin-top: 1.5rem;
		border-left: 2px solid var(--color-accent, #adc8ff);
		box-shadow: none;
	}

	.bridge-note h3 {
		font-size: 1.15rem;
		margin-bottom: 0.5rem;
	}

	.bridge-note p {
		margin: 0;
		font-size: 0.94rem;
	}

	.bridge-note a {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	@media (max-width: 960px) {
		.ways-grid,
		.partner-form-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
