<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { gsapHeroEntrance, gsapReveal } from '#lib/attachments/gsap.js';
	import type { PageProps } from './$types';
	import {
		IconSeedling,
		IconCross,
		IconSparkles,
		IconBible,
		IconMountain,
		IconDownload,
		IconArrowRight
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Restore Your Dreams &amp; God-Given Purpose | Grow Your Faith Ministries</title>
	<meta
		name="description"
		content="Discover the 3-step Mustard Seed Framework to unbury your vision, reclaim your identity in Christ, and steward your God-given talents beyond current circumstances."
	/>
	<meta
		property="og:title"
		content="Restore Your Dreams & God-Given Purpose | Grow Your Faith Ministries"
	/>
	<meta
		property="og:description"
		content="Discover the 3-step Mustard Seed Framework to unbury your vision, reclaim your identity in Christ, and steward your God-given talents beyond current circumstances."
	/>
</svelte:head>

<section class="page-hero" {@attach gsapHeroEntrance}>
	<div class="container">
		<div class="eyebrow-badge" data-hero-item>
			<IconSeedling size={16} />
			<span>FAITH &amp; VISION RESTORATION HUB</span>
		</div>
		<h1 data-hero-item>Your Circumstances Do Not Define Your Calling</h1>
		<p class="lead" data-hero-item>
			Grow Your Faith Ministries’ main goal is to help people restore their dreams, goals, and
			visions that are buried deep inside of them; to bring them back to life and to teach them that
			their lives have meaning and purpose far beyond their current circumstances.
		</p>
	</div>
</section>

<!-- The Mustard Seed Framework (3 Steps to Restoration) -->
<section class="section">
	<div class="container">
		<div class="section-intro" {@attach gsapReveal({ y: 20 })}>
			<span class="badge-teal"><IconMountain size={15} /> Matthew 17:20 Blueprint</span>
			<h2>The Mustard Seed Framework (3 Steps to Restoration)</h2>
			<p>
				When life’s hardships shatter your confidence, rebuilding doesn’t start with willpower—it
				starts with a mustard seed of surrendered faith in the One who designed you.
			</p>
		</div>

		<div class="steps-grid" {@attach gsapReveal({ selector: '.step-card', stagger: 0.12 })}>
			<article class="card step-card">
				<div class="step-num">Step 01</div>
				<div class="step-icon">
					<IconSeedling size={28} />
				</div>
				<h3>Unbury the Vision</h3>
				<p>
					Identifying the dreams, goals, and God-given visions that life’s setbacks,
					disappointments, or heartbreak convinced you to abandon. What God planted in your spirit
					was not meant to stay buried.
				</p>
			</article>

			<article class="card step-card">
				<div class="step-num">Step 02</div>
				<div class="step-icon">
					<IconCross size={28} />
				</div>
				<h3>Reclaim Your Identity in Christ</h3>
				<p>
					Shifting from self-doubt and past regret to unshakeable faith in the Designer who gave you
					your specific talents. Your value is anchored in Christ’s love—not your current
					circumstances.
				</p>
			</article>

			<article class="card step-card">
				<div class="step-num">Step 03</div>
				<div class="step-icon">
					<IconSparkles size={28} />
				</div>
				<h3>Steward Your Gifts</h3>
				<p>
					Turning restored faith into daily discipline, purposeful work, and compassionate service
					to others—living life to the fullest by utilizing your God-given talents.
				</p>
			</article>
		</div>
	</div>
</section>

<!-- Lead Magnet / Free Resource -->
<section class="section-alt" id="vision-guide">
	<div class="container workbook-grid">
		<div>
			<span class="badge-emerald"><IconBible size={15} /> Free Ministry Resource</span>
			<h2>Download the Mustard Seed Vision Guide</h2>
			<h3>“The 7-Day Mustard Seed Restoration Devotional &amp; Vision Workbook”</h3>
			<p>
				Written by founder Courtney Ribeiro, this practical 7-day devotional and goal-restoration
				workbook walks you through scripture reflections, prayer prompts, and vision-mapping
				exercises to bring buried dreams back to life.
			</p>
			<div class="need-more-box">
				<p>
					<strong>Need personal 1-on-1 encouragement right now?</strong> Every Friday is dedicated to
					free spiritual mentorship and vision restoration calls.
				</p>
				<a href={resolve('/programs/friday-ministry')} class="pillar-link">
					<span>Request a 1-on-1 Friday Mentorship Session</span>
					<IconArrowRight size={18} />
				</a>
			</div>
		</div>

		<div class="card">
			<h3>Get Instant Access to the 7-Day Workbook</h3>
			{#if form?.success}
				<div class="alert-success">{form.message}</div>
			{/if}
			<form method="POST" action="?/downloadGuide" use:enhance>
				<div class="form-field">
					<label for="guide-name">First &amp; Last Name *</label>
					<input id="guide-name" name="name" type="text" required placeholder="Your Name" />
				</div>
				<div class="form-field">
					<label for="guide-email">Email Address *</label>
					<input
						id="guide-email"
						name="email"
						type="email"
						required
						placeholder="you@example.com"
					/>
				</div>
				<div class="form-field">
					<label for="guide-goal"
						>What dream or goal are you asking God to restore? (Optional)</label
					>
					<textarea
						id="guide-goal"
						name="visionGoal"
						rows="3"
						placeholder="Share a dream or calling you want to bring back to life..."></textarea>
				</div>
				<button type="submit" class="btn btn-gold" style="width: 100%">
					<IconDownload size={19} />
					<span>Download the Mustard Seed Vision Guide</span>
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

	.steps-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.75rem;
	}

	.step-card {
		position: relative;
		border-top: 4px solid var(--color-gold);
	}

	.step-num {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-teal);
		margin-bottom: 0.75rem;
	}

	.step-icon {
		width: 50px;
		height: 50px;
		border-radius: 12px;
		background: var(--color-navy);
		color: var(--color-gold);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.workbook-grid {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: 3rem;
		align-items: center;
	}

	.workbook-grid h2 {
		margin-top: 0.75rem;
		margin-bottom: 0.35rem;
	}

	.workbook-grid h3 {
		color: var(--color-teal);
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	.need-more-box {
		margin-top: 1.5rem;
		padding: 1.25rem;
		background: var(--color-surface);
		border-left: 4px solid var(--color-teal);
		border-radius: var(--radius-sm);
	}

	.need-more-box p {
		margin-bottom: 0.5rem;
		font-size: 0.95rem;
	}

	.pillar-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-weight: 700;
		color: var(--color-navy);
	}

	@media (max-width: 960px) {
		.steps-grid,
		.workbook-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
