<script lang="ts">
	import { enhance } from '$app/forms';
	import { asset, resolve } from '$app/paths';
	import { siteConfig } from '#lib/config/site.js';
	import { cinematicPhotoReveal, gsapReveal } from '#lib/attachments/gsap.js';
	import MinistryMasthead from '#lib/components/ministry/MinistryMasthead.svelte';
	import type { PageProps } from './$types';
	import {
		IconSeedling,
		IconHeartHandshake,
		IconMicrophone,
		IconSparkles,
		IconMountain,
		IconBuildingChurch
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>About Courtney Ribeiro &amp; Our Mission | Grow Your Faith Ministries</title>
	<meta
		name="description"
		content="Learn how Courtney Ribeiro founded Grow Your Faith Ministries in 2014, structuring a 4-day workweek and 40-day holiday sabbatical to serve Connecticut communities."
	/>
	<meta
		property="og:title"
		content="About Courtney Ribeiro & Our Mission | Grow Your Faith Ministries"
	/>
	<meta
		property="og:description"
		content="Learn how Courtney Ribeiro founded Grow Your Faith Ministries in 2014, structuring a 4-day workweek and 40-day holiday sabbatical to serve Connecticut communities."
	/>
</svelte:head>

<MinistryMasthead
	label="Our story"
	title="Faith put to work."
	photo={{
		src: 'images/courtney-praying-clean.webp',
		alt: 'Courtney Ribeiro with hands clasped in prayer outdoors',
		width: 900,
		height: 900,
		small: { src: 'images/courtney-praying-540.webp', width: 540 },
		caption: 'Courtney Ribeiro, founder of Grow Your Faith Ministries',
		focus: 'center 46%'
	}}
	actions={[
		{ href: '#our-story', label: 'Read our story' },
		{ href: '#invite-courtney', label: 'Invite Courtney to speak' }
	]}
>
	<p>
		{siteConfig.founder.name} started Grow Your Faith Ministries in 2014 with a simple conviction. People
		going through a hard season deserve someone who will listen, pray with them, and show up.
	</p>
</MinistryMasthead>

<!-- 1. The Breaking Point That Sparked a Mission (2014) -->
<section class="section" id="our-story">
	<div class="container about-grid" {@attach gsapReveal({ selector: '.about-copy' })}>
		<div class="about-copy">
			<h2>It started with listening</h2>
			<p>
				People Courtney met had stopped dreaming about what came next. Hardship had worn down their
				confidence, and many wondered whether God still had a purpose for them.
			</p>
			<blockquote>
				“I’ve always had a burning desire to minister to others and share the love of Christ with
				everyone I meet,” Courtney shares. “It has always been my mission to see others achieve
				success and live life to their fullest by utilizing their God-given talents.”
			</blockquote>
			<p>
				She began with one-on-one encouragement and holiday outreach. That work grew into a ministry
				that helps people rediscover their God-given gifts and take a next step.
			</p>
		</div>

		<figure class="authority-bio-card">
			<div class="bio-frame" {@attach cinematicPhotoReveal}>
				<img
					src={asset('images/courtney-outreach-car-clean.webp')}
					srcset="{asset('images/courtney-outreach-car-540w.webp')} 540w, {asset(
						'images/courtney-outreach-car-clean.webp'
					)} 900w"
					sizes="(max-width: 640px) calc(100vw - 2.3rem), (max-width: 780px) calc(100vw - 3rem), (max-width: 1240px) 53vw, 650px"
					width="900"
					height="900"
					alt="Courtney Ribeiro sitting in a car packed with outreach supplies"
					class="bio-img"
					loading="lazy"
					decoding="async"
					data-cinematic-image
				/>
			</div>
			<figcaption class="bio-body">
				<p>
					Courtney also founded <a
						href={siteConfig.founder.parentOrgUrl}
						target="_blank"
						rel="noopener noreferrer">MWC Digital Agency</a
					> and has set aside Fridays and the holiday season for ministry since 2014.
				</p>
			</figcaption>
		</figure>
	</div>
</section>

<!-- 2. The Stewardship Rhythm (The 4-Day Workweek & Holiday Sabbatical) -->
<section class="section-alt">
	<div class="container">
		<div class="section-intro" {@attach gsapReveal({ y: 20 })}>
			<h2>Time set aside for our neighbors</h2>
			<p>
				Courtney sets aside Fridays and the holiday season for ministry. Here’s what that looks like
				over the course of a year.
			</p>
		</div>

		<div class="rhythm-grid" {@attach gsapReveal({ selector: '.card', stagger: 0.14 })}>
			<div class="card">
				<div class="rhythm-badge">Every week</div>
				<h3>Friday Ministry</h3>
				<p>
					Courtney spends Fridays listening, praying, offering one-on-one encouragement, and
					visiting Connecticut shelters and community centers.
				</p>
				<a href={resolve('/programs/friday-ministry')} class="btn ministry-secondary">
					Explore Friday Ministry →
				</a>
			</div>

			<div class="card">
				<div class="rhythm-badge">Thanksgiving through January 4</div>
				<h3>Holiday Outreach</h3>
				<p>
					From Thanksgiving through January 4, volunteers share hot meals and give children new
					coats, hats, mittens, and blankets.
				</p>
				<a href={resolve('/programs/holiday-outreach')} class="btn ministry-primary">
					View Holiday Outreach →
				</a>
			</div>
		</div>
	</div>
</section>

<!-- 3. Statement of Faith & Core Values -->
<section class="section">
	<div class="container">
		<div class="section-intro" {@attach gsapReveal({ y: 20 })}>
			<h2>What we believe</h2>
		</div>

		<div class="values-grid" {@attach gsapReveal({ selector: '.value-card', stagger: 0.1 })}>
			<div class="card value-card">
				<IconHeartHandshake size={28} />
				<h3>Everyone has dignity</h3>
				<p>
					We believe every person is made in the image of God and deserves to be treated with care.
				</p>
			</div>
			<div class="card value-card">
				<IconBuildingChurch size={28} />
				<h3>Love takes action</h3>
				<p>
					We pray with our neighbors and help meet practical needs, from a hot holiday meal to a
					winter coat that fits.
				</p>
			</div>
			<div class="card value-card">
				<IconSparkles size={28} />
				<h3>Gifts are meant to be shared</h3>
				<p>
					We use what God has given us to serve others and help them rediscover what they can offer.
				</p>
			</div>
			<div class="card value-card">
				<IconMountain size={28} />
				<h3>Small faith can move mountains</h3>
				<p>Matthew 17:20 reminds us that faith the size of a mustard seed can move mountains.</p>
			</div>
		</div>
	</div>
</section>

<!-- 4. Speaker & Media Kit Block -->
<section class="section-navy" id="invite-courtney">
	<div
		class="container speaker-grid"
		{@attach gsapReveal({ selector: '.speaker-grid > *', stagger: 0.14 })}
	>
		<div>
			<h2>Invite Courtney to speak</h2>
			<p>
				Courtney speaks to churches, women’s ministries, business leaders, and community groups
				about rebuilding after a setback and making room to serve.
			</p>
			<ul class="speaker-topics">
				<li>
					<IconSeedling size={18} />
					<span>Holding on to faith through hard seasons</span>
				</li>
				<li>
					<IconSeedling size={18} />
					<span>Making time to serve while running a business</span>
				</li>
				<li>
					<IconSeedling size={18} />
					<span>Rediscovering the gifts God gave you</span>
				</li>
			</ul>
		</div>

		<div class="card speaker-form-card">
			<h3>Tell us about your event</h3>
			{#if form?.success}
				<div class="alert-success" role="status">{form.message}</div>
			{/if}
			{#if form?.error}
				<div id="speaker-form-error" class="alert-error" role="alert">{form.error}</div>
			{/if}
			<form
				method="POST"
				action="?/inviteSpeaker"
				aria-describedby={form?.error ? 'speaker-form-error' : undefined}
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="form-field">
					<label for="speaker-name">Your Name *</label>
					<input
						id="speaker-name"
						name="name"
						type="text"
						autocomplete="name"
						required
						value={form?.values?.name ?? ''}
						aria-invalid={form?.error && !form?.values?.name ? 'true' : undefined}
						placeholder="Pastor / Event Coordinator"
					/>
				</div>
				<div class="form-field">
					<label for="speaker-email">Email Address *</label>
					<input
						id="speaker-email"
						name="email"
						type="email"
						autocomplete="email"
						required
						value={form?.values?.email ?? ''}
						aria-invalid={form?.error && !form?.values?.email ? 'true' : undefined}
						placeholder="you@church.org"
					/>
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="speaker-org">Church / Organization</label>
						<input
							id="speaker-org"
							name="organization"
							type="text"
							autocomplete="organization"
							value={form?.values?.organization ?? ''}
							placeholder="Grace Fellowship CT"
						/>
					</div>
					<div class="form-field">
						<label for="speaker-type">Event Format</label>
						<select
							id="speaker-type"
							name="eventType"
							value={form?.values?.eventType ?? 'Womens Conference'}
						>
							<option value="Womens Conference">Women’s Ministry Conference</option>
							<option value="Sunday Service">Church Service / Guest Message</option>
							<option value="Faith & Business">Faith &amp; Business Summit</option>
							<option value="Podcast / Media">Podcast / Media Interview</option>
						</select>
					</div>
				</div>
				<div class="form-field">
					<label for="speaker-details">Event Date, Location &amp; Theme *</label>
					<textarea
						id="speaker-details"
						name="details"
						rows="3"
						required
						value={form?.values?.details ?? ''}
						aria-invalid={form?.error && !form?.values?.details ? 'true' : undefined}
						placeholder="Share your proposed dates, location in CT or nationwide, and audience needs..."
					></textarea>
				</div>
				<button
					type="submit"
					class="btn ministry-primary"
					style="width: 100%"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					<IconMicrophone size={18} />
					<span>{isSubmitting ? 'Sending Inquiry...' : 'Invite Courtney to Speak'}</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.about-grid {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(2rem, 4vw, 4rem);
		align-items: start;
	}

	.about-copy h2 {
		max-width: 16ch;
	}

	.about-copy > p,
	.about-copy blockquote {
		max-width: 62ch;
	}

	.about-copy blockquote {
		margin: 1.8rem 0;
		padding-left: 1.15rem;
		border-left: 2px solid var(--color-accent, #adc8ff);
		color: var(--color-strong, #f5f7fb);
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 2.4vw, 1.85rem);
		line-height: 1.35;
	}

	.authority-bio-card {
		margin: 0;
	}

	.bio-frame {
		width: 100%;
		aspect-ratio: var(--photo-aspect, 4 / 3);
		background: var(--color-panel);
		overflow: hidden;
	}

	.bio-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 50%;
		display: block;
	}

	.bio-body {
		margin-top: 0.7rem;
		padding-top: 0.55rem;
		border-top: 1px solid var(--color-line, #343946);
		font-size: 0.92rem;
		color: var(--color-soft, #b6bed0);
	}

	.bio-body p {
		margin: 0;
	}

	.bio-body a {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.section-intro {
		max-width: 60ch;
		margin: 0 0 2rem;
	}

	.rhythm-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.rhythm-badge {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-accent, #adc8ff);
		margin-bottom: 0.85rem;
	}

	.rhythm-grid > .card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.rhythm-grid .btn {
		margin-top: auto;
	}

	.values-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.25rem;
	}

	.value-card {
		padding: 1.2rem 0;
		border: 0;
		border-top: 1px solid var(--color-line, #343946);
		border-radius: 0;
		background: transparent;
		box-shadow: none;
	}

	.value-card :global(svg) {
		color: var(--color-accent, #adc8ff);
		margin-bottom: 0.75rem;
	}

	.speaker-grid {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: 3rem;
		align-items: center;
	}

	.speaker-topics {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.speaker-topics li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: rgba(255, 255, 255, 0.92);
	}

	.speaker-topics li :global(svg) {
		color: var(--color-accent, #adc8ff);
		flex-shrink: 0;
	}

	.speaker-form-card {
		color: var(--color-soft, #b6bed0);
	}

	.speaker-form-card h3 {
		color: var(--color-strong, #f5f7fb);
		margin-bottom: 1.25rem;
	}

	@media (max-width: 960px) {
		.rhythm-grid,
		.speaker-grid {
			grid-template-columns: 1fr;
		}

		.values-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 780px) {
		.about-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 560px) {
		.values-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
