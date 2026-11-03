<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { siteConfig } from '#lib/config/site.js';
	import { gsapHeroEntrance, gsapReveal } from '#lib/attachments/gsap.js';
	import type { PageProps } from './$types';
	import {
		IconCross,
		IconSeedling,
		IconHeartHandshake,
		IconMicrophone,
		IconCalendarHeart,
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

<section class="page-hero" {@attach gsapHeroEntrance}>
	<div class="container">
		<div class="eyebrow-badge" data-hero-item>
			<IconCross size={16} />
			<span>FOUNDER AUTHORITY &amp; 2014 ORIGIN STORY</span>
		</div>
		<h1 data-hero-item>A Calling to Serve: How a Mustard Seed of Faith Became a Movement</h1>
		<p class="lead" data-hero-item>
			Founded in 2014 by {siteConfig.founder.name}, Grow Your Faith Ministries bridges executive
			stewardship with compassionate Christian outreach across Wolcott, Waterbury, New Haven, and
			Hartford counties.
		</p>
	</div>
</section>

<!-- 1. The Breaking Point That Sparked a Mission (2014) -->
<section class="section">
	<div
		class="container about-grid"
		{@attach gsapReveal({ selector: '.about-copy, .authority-bio-card', stagger: 0.14 })}
	>
		<div class="about-copy">
			<span class="badge-teal">The 2014 Origin</span>
			<h2>The Breaking Point That Sparked a Mission</h2>
			<p>
				There were so many people Courtney Ribeiro met that had lost all hope and their dreams had
				been shattered. It broke her heart wide open to realize those individuals no longer had
				faith in themselves to live the life that God truly had designed for them.
			</p>
			<p>
				“I’ve always had a burning desire to minister to others and share the love of Christ with
				everyone I meet,” Courtney shares. “It has always been my mission to see others achieve
				success and live life to their fullest by utilizing their God-given talents.”
			</p>
			<p>
				In 2014, what began as one-on-one encouragement and holiday generosity became <strong
					>Grow Your Faith Ministries</strong
				>—a structured Christian outreach dedicated to helping people
				<strong>restore their dreams, goals, and visions</strong> buried deep inside of them, and teaching
				them that their lives have meaning and purpose far beyond their current circumstances.
			</p>
		</div>

		<div class="card authority-bio-card">
			<img
				src="/images/courtney-praying-clean.webp"
				width="900"
				height="900"
				alt="Courtney Ribeiro, Founder of Grow Your Faith Ministries and MWC Digital Agency"
				class="bio-img"
			/>
			<div class="bio-body">
				<span class="badge-emerald">Founder &amp; Ministry Leader</span>
				<h3>Courtney Ribeiro</h3>
				<p>
					Executive Founder of <strong>MWC Digital Agency</strong> (<a
						href={siteConfig.founder.parentOrgUrl}
						target="_blank"
						rel="noopener noreferrer">mwcdigitalagency.com</a
					>) and Christian mentor who has dedicated every Friday and every holiday season since 2014
					to serving individuals and families in need across Connecticut.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- 2. The Stewardship Rhythm (The 4-Day Workweek & Holiday Sabbatical) -->
<section class="section-alt">
	<div class="container">
		<div class="section-intro" {@attach gsapReveal({ y: 20 })}>
			<span class="badge-teal"><IconCalendarHeart size={15} /> The Stewardship Rhythm</span>
			<h2>Structuring Business Life to Honor God First</h2>
			<p>
				God’s word says that it takes faith the size of a mustard seed to move a mountain. Rather
				than fitting ministry into leftover margins, Courtney structured her entire professional
				calendar around two non-negotiable covenants:
			</p>
		</div>

		<div class="rhythm-grid" {@attach gsapReveal({ selector: '.card', stagger: 0.14 })}>
			<div class="card">
				<div class="rhythm-badge">20% of Every Workweek</div>
				<h3>Every Friday Year-Round (52 Fridays/Yr)</h3>
				<p>
					“God has so abundantly blessed me that I am now able to take Friday off every week to
					minister to those in need.” Every Friday is protected from commercial agency work for
					1-on-1 encouragement, prayer, and street/community outreach.
				</p>
				<a href={resolve('/programs/friday-ministry')} class="btn btn-navy">
					Explore Friday Ministry →
				</a>
			</div>

			<div class="card">
				<div class="rhythm-badge gold">6 Weeks Every Winter (40 Days)</div>
				<h3>Thanksgiving Through January 4 Sabbatical</h3>
				<p>
					“And, I take off from Thanksgiving to January 4 every year to serve in the community and
					spend time with friends and family. I serve our community by doing Thanksgiving and
					Christmas outreach… serving a hot holiday meal and purchasing coats, hats, mittens, and
					blankets for all the children.”
				</p>
				<a href={resolve('/programs/holiday-outreach')} class="btn btn-gold">
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
			<span class="badge-teal">Statement of Faith &amp; Core Values</span>
			<h2>Four Pillars of Restorative Christian Leadership</h2>
		</div>

		<div class="values-grid" {@attach gsapReveal({ selector: '.value-card', stagger: 0.1 })}>
			<div class="card value-card">
				<IconHeartHandshake size={28} />
				<h3>Human Dignity</h3>
				<p>
					Every person is created in the image of God with intrinsic worth, regardless of past
					heartbreak, financial hardship, or temporary setbacks.
				</p>
			</div>
			<div class="card value-card">
				<IconBuildingChurch size={28} />
				<h3>Tangible Love</h3>
				<p>
					Faith without works is incomplete. We pair spiritual encouragement with hot holiday meals
					and brand-new winter coats, hats, mittens, and blankets.
				</p>
			</div>
			<div class="card value-card">
				<IconSparkles size={28} />
				<h3>Stewardship of Talents</h3>
				<p>
					We believe marketplace success and client partnerships are blessings meant to underwrite
					generosity and unlock God-given gifts in others.
				</p>
			</div>
			<div class="card value-card">
				<IconMountain size={28} />
				<h3>Mustard-Seed Boldness</h3>
				<p>
					Anchored in Matthew 17:20, we teach individuals that even the smallest spark of
					surrendered faith can move mountains of doubt.
				</p>
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
			<div class="eyebrow-badge">
				<IconMicrophone size={16} />
				<span>CHRISTIAN WOMEN IN LEADERSHIP &amp; KEYNOTE SPEAKING</span>
			</div>
			<h2>Invite Courtney Ribeiro to Speak</h2>
			<p>
				Book Courtney for churches, women’s ministry conferences, Christian entrepreneurship
				summits, and community leadership events on purpose-driven mentorship, marketplace
				stewardship, and overcoming shattered dreams through faith.
			</p>
			<ul class="speaker-topics">
				<li>
					<IconSeedling size={18} />
					<span><strong>Keynote 1:</strong> Mustard-Seed Faith for Mountain-Sized Setbacks</span>
				</li>
				<li>
					<IconSeedling size={18} />
					<span
						><strong>Keynote 2:</strong> The Friday Covenant: Turning Marketplace Success into Ministry</span
					>
				</li>
				<li>
					<IconSeedling size={18} />
					<span><strong>Keynote 3:</strong> Unburying the Vision God Placed Inside You</span>
				</li>
			</ul>
		</div>

		<div class="card speaker-form-card">
			<h3>Speaker &amp; Media Booking Inquiry</h3>
			{#if form?.success}
				<div class="alert-success" role="status">{form.message}</div>
			{/if}
			{#if form?.error}
				<div class="alert-error" role="alert">{form.error}</div>
			{/if}
			<form
				method="POST"
				action="?/inviteSpeaker"
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
						required
						placeholder="Pastor / Event Coordinator"
					/>
				</div>
				<div class="form-field">
					<label for="speaker-email">Email Address *</label>
					<input
						id="speaker-email"
						name="email"
						type="email"
						required
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
							placeholder="Grace Fellowship CT"
						/>
					</div>
					<div class="form-field">
						<label for="speaker-type">Event Format</label>
						<select id="speaker-type" name="eventType">
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
						placeholder="Share your proposed dates, location in CT or nationwide, and audience needs..."
					></textarea>
				</div>
				<button
					type="submit"
					class="btn btn-gold"
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
		grid-template-columns: 1.3fr 1fr;
		gap: 3rem;
		align-items: start;
	}

	.about-copy h2 {
		margin-top: 0.75rem;
	}

	.authority-bio-card {
		padding: 0;
		overflow: hidden;
		border: 2px solid rgba(212, 168, 67, 0.45);
		box-shadow: var(--shadow-elevated);
	}

	.bio-img {
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3.4;
		object-fit: cover;
		object-position: center 20%;
		display: block;
	}

	.bio-body {
		padding: 1.75rem;
	}

	.bio-body h3 {
		margin: 0.65rem 0 0.5rem;
	}

	.section-intro {
		text-align: center;
		max-width: 720px;
		margin: 0 auto 2.75rem;
	}

	.section-intro h2 {
		margin-top: 0.75rem;
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
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		background: var(--color-teal-soft);
		color: var(--color-teal);
		margin-bottom: 0.85rem;
	}

	.rhythm-badge.gold {
		background: var(--color-gold-soft);
		color: #9a6e12;
	}

	.values-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.5rem;
	}

	.value-card :global(svg) {
		color: var(--color-gold);
		margin-bottom: 0.75rem;
	}

	.speaker-grid {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: 3rem;
		align-items: center;
	}

	.speaker-grid h2 {
		margin-top: 1rem;
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
		color: var(--color-gold);
		flex-shrink: 0;
	}

	.speaker-form-card {
		color: var(--color-text);
	}

	.speaker-form-card h3 {
		color: var(--color-navy);
		margin-bottom: 1.25rem;
	}

	@media (max-width: 960px) {
		.about-grid,
		.rhythm-grid,
		.speaker-grid {
			grid-template-columns: 1fr;
		}

		.values-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 560px) {
		.values-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
