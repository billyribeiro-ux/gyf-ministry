<script lang="ts">
	import { enhance } from '$app/forms';
	import { siteConfig } from '#lib/config/site.js';
	import { gsapHeroEntrance, gsapReveal } from '#lib/attachments/gsap.js';
	import type { PageProps } from './$types';
	import {
		IconHeartHandshake,
		IconBuildingChurch,
		IconJacket,
		IconGift,
		IconShieldCheck,
		IconCheck
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
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

<section class="page-hero" {@attach gsapHeroEntrance}>
	<div class="container">
		<div class="eyebrow-badge" data-hero-item>
			<IconHeartHandshake size={16} />
			<span>CORPORATE &amp; INDIVIDUAL STEWARDSHIP PORTAL</span>
		</div>
		<h1 data-hero-item>With the Help and Support of Clients &amp; Partners Like You</h1>
		<p class="lead" data-hero-item>
			Because {siteConfig.founder.parentOrgName} underwrites our administrative operations, 100% of your
			partnership directly funds hot Thanksgiving and Christmas meals and brand-new winter coats, hats,
			mittens, and blankets for children in need.
		</p>
	</div>
</section>

<!-- Three Ways to Partner -->
<section class="section">
	<div class="container">
		<div class="section-intro" {@attach gsapReveal({ y: 20 })}>
			<span class="badge-teal">Three Ways to Partner</span>
			<h2>How Your Support Multiplies Impact Across Connecticut</h2>
		</div>

		<div class="ways-grid" {@attach gsapReveal({ selector: '.way-card', stagger: 0.12 })}>
			<article class="card way-card">
				<div class="way-icon">
					<IconHeartHandshake size={28} />
				</div>
				<span class="badge-teal">Option 1 • Recurring or One-Time</span>
				<h3>Individual One-Time or Monthly Giving</h3>
				<p>
					Become a Monthly Mustard Seed Partner to sustain our 52 Fridays of mentorship and build
					our year-round reserve for holiday meals and winter coats.
				</p>
				<ul class="way-list">
					<li><IconCheck size={16} /> $25/mo — Feeds &amp; equips 5 children per year</li>
					<li><IconCheck size={16} /> $65/mo — Sponsors 12 complete child winter kits/yr</li>
					<li><IconCheck size={16} /> 100% allocated directly to meals &amp; winter gear</li>
				</ul>
			</article>

			<article class="card way-card featured">
				<div class="way-icon gold">
					<IconBuildingChurch size={28} />
				</div>
				<span class="badge-emerald">Option 2 • Client &amp; Corporate Impact</span>
				<h3>Corporate / Business Sponsorship</h3>
				<p>
					Ideal for fellow business owners, executives, and MWC Digital Agency clients wanting to
					underwrite 10, 25, or 50 children’s winter warmth kits during our Nov 26 – Jan 4 drive.
				</p>
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
				<span class="badge-teal">Option 3 • Physical Collection</span>
				<h3>In-Kind Gear Drives</h3>
				<p>
					Host a brand-new winter coat, hat, mitten, and fleece blanket collection box at your
					Connecticut office, church, or storefront between November and January 4.
				</p>
				<ul class="way-list">
					<li><IconCheck size={16} /> Official GYFM collection box &amp; signage provided</li>
					<li><IconCheck size={16} /> Pickup coordinated across Waterbury &amp; Central CT</li>
					<li><IconCheck size={16} /> Direct delivery to local children &amp; shelters</li>
				</ul>
			</article>
		</div>
	</div>
</section>

<!-- Partner Registration & Sponsorship Form -->
<section class="section-alt">
	<div class="container partner-form-grid">
		<div>
			<span class="badge-emerald"><IconShieldCheck size={15} /> 100% Direct Outreach Promise</span>
			<h2>Become a Monthly Mustard Seed Partner or Corporate Sponsor</h2>
			<p>
				Complete the form to pledge your individual monthly partnership, sponsor a block of
				children’s winter coat packages, or request an In-Kind Coat Drive box for your business.
			</p>
			<div class="card bridge-note">
				<h4>MWC Digital Agency Philanthropy Bridge</h4>
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
			<h3>Partner &amp; Sponsorship Commitment</h3>
			{#if form?.success}
				<div class="alert-success">{form.message}</div>
			{/if}
			<form method="POST" action="?/submitPartner" use:enhance>
				<div class="form-field">
					<label for="part-name">Your Name or Company Name *</label>
					<input
						id="part-name"
						name="name"
						type="text"
						required
						placeholder="Full Name / Company"
					/>
				</div>
				<div class="form-field">
					<label for="part-email">Email Address *</label>
					<input id="part-email" name="email" type="email" required placeholder="you@company.com" />
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="part-way">Partnership Pathway</label>
						<select id="part-way" name="partnerWay">
							<option value="Monthly Mustard Seed Partner">Monthly Mustard Seed Partner</option>
							<option value="One-Time Holiday Outreach Gift">One-Time Holiday Outreach Gift</option>
							<option value="Corporate Winter Kit Sponsorship"
								>Corporate Winter Kit Sponsorship (10/25/50 Kits)</option
							>
							<option value="Host an In-Kind Coat Drive Box"
								>Host an In-Kind Coat Drive Box in CT</option
							>
						</select>
					</div>
					<div class="form-field">
						<label for="part-amount">Commitment Tier</label>
						<select id="part-amount" name="amount">
							<option value="$25 / Warmth Bundle">$25 — Warmth &amp; Holiday Meal Bundle</option>
							<option value="$65 / Child Winter Coat Kit"
								>$65 — 1 Complete Child’s Winter Package</option
							>
							<option value="$250 / Full Family of 4"
								>$250 — Full Family of 4 Holiday Outreach</option
							>
							<option value="$650 / 10 Children Kits"
								>$650 — Corporate: 10 Children’s Winter Kits</option
							>
							<option value="$1,625 / 25 Children Kits"
								>$1,625 — Corporate: 25 Children’s Winter Kits</option
							>
							<option value="In-Kind Coat Collection Box"
								>In-Kind Coat &amp; Blanket Collection Box</option
							>
						</select>
					</div>
				</div>
				<div class="form-field">
					<label for="part-details">Partnership Notes or Business Recognition Preferences</label>
					<textarea
						id="part-details"
						name="details"
						rows="3"
						placeholder="Let us know how we can coordinate your sponsorship or coat drive box..."
					></textarea>
				</div>
				<button type="submit" class="btn btn-gold" style="width: 100%">
					<IconJacket size={19} />
					<span>Become a Monthly Mustard Seed Partner</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.section-intro {
		text-align: center;
		max-width: 720px;
		margin: 0 auto 2.75rem;
	}

	.section-intro h2 {
		margin-top: 0.75rem;
	}

	.ways-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.75rem;
	}

	.way-card.featured {
		border: 2px solid var(--color-gold);
	}

	.way-icon {
		width: 52px;
		height: 52px;
		border-radius: 12px;
		background: var(--color-navy);
		color: var(--color-gold);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.way-icon.gold {
		background: var(--color-gold);
		color: var(--color-navy);
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
		color: var(--color-emerald);
		flex-shrink: 0;
	}

	.partner-form-grid {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 3rem;
		align-items: start;
	}

	.partner-form-grid h2 {
		margin-top: 0.75rem;
	}

	.bridge-note {
		margin-top: 1.5rem;
		border-left: 4px solid var(--color-gold);
	}

	.bridge-note h4 {
		margin-bottom: 0.5rem;
	}

	.bridge-note p {
		margin: 0;
		font-size: 0.94rem;
	}

	@media (max-width: 960px) {
		.ways-grid,
		.partner-form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
