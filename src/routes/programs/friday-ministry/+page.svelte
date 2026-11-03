<script lang="ts">
	import { enhance } from '$app/forms';
	import { gsapHeroEntrance, gsapReveal } from '#lib/attachments/gsap.js';
	import type { PageProps } from './$types';
	import {
		IconCalendarHeart,
		IconPray,
		IconHeartHandshake,
		IconSparkles,
		IconMapPin,
		IconPhoneCall
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Friday Outreach &amp; Faith Mentorship | Grow Your Faith Ministries</title>
	<meta
		name="description"
		content="Every Friday year-round is set aside exclusively to minister to those in need through 1-on-1 spiritual encouragement, life-purpose coaching, and community care in CT."
	/>
	<meta
		property="og:title"
		content="Friday Outreach & Faith Mentorship | Grow Your Faith Ministries"
	/>
	<meta
		property="og:description"
		content="Every Friday year-round is set aside exclusively to minister to those in need through 1-on-1 spiritual encouragement, life-purpose coaching, and community care in CT."
	/>
</svelte:head>

<section class="page-hero" {@attach gsapHeroEntrance}>
	<div class="container">
		<div class="eyebrow-badge" data-hero-item>
			<IconCalendarHeart size={16} />
			<span>EVERY FRIDAY YEAR-ROUND • 52 FRIDAYS/YR</span>
		</div>
		<h1 data-hero-item>Fridays Are For Restoration: Dedicated Weekly Ministry for Those in Need</h1>
		<p class="lead" data-hero-item>
			“God has so abundantly blessed me that I am now able to take Friday off every week to minister
			to those in need.” — Courtney Ribeiro
		</p>
	</div>
</section>

<!-- Why Every Friday & Who We Serve -->
<section class="section">
	<div
		class="container friday-grid"
		{@attach gsapReveal({ selector: '.friday-grid > *', stagger: 0.14 })}
	>
		<div>
			<span class="badge-teal">Why Every Friday?</span>
			<h2>A Covenant Commitment to Step Away From Commercial Work</h2>
			<p>
				In a world that measures worth by billable hours, Grow Your Faith Ministries operates on a
				different kingdom economy. Every single Friday year-round is set aside exclusively to serve
				the brokenhearted, the stuck, and the hurting.
			</p>
			<p>
				Whether someone has experienced a devastating career loss, personal heartbreak, or spiritual
				exhaustion, Friday Ministry exists to remind them that God has not forgotten their name—and
				their best days are still ahead.
			</p>

			<h3 style="margin-top: 2rem;">Who We Serve on Fridays</h3>
			<div class="serve-list">
				<div class="card serve-card">
					<IconSparkles size={24} />
					<div>
						<h4>Individuals Navigating Shattered Dreams</h4>
						<p>
							Free 1-on-1 Christian life restoration mentorship for people navigating career loss,
							burnout, or buried personal visions.
						</p>
					</div>
				</div>
				<div class="card serve-card">
					<IconPray size={24} />
					<div>
						<h4>Prayer &amp; Spiritual Grounding</h4>
						<p>
							Dedicated Friday prayer calls and scripture encouragement for individuals and families
							walking through heavy seasons.
						</p>
					</div>
				</div>
				<div class="card serve-card">
					<IconMapPin size={24} />
					<div>
						<h4>Connecticut Street &amp; Community Outreach</h4>
						<p>
							Direct visits across Wolcott, Waterbury, New Haven, and Hartford counties—supporting
							shelters, families in transition, and community centers.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- How to Connect on a Friday Intake Form -->
		<div class="card intake-card" id="book-friday">
			<span class="badge-emerald"><IconPhoneCall size={14} /> Free Weekly Ministry Intake</span>
			<h3>Request a Friday Session or Refer Someone in Need</h3>
			<p class="intake-sub">
				Use this portal to request a 1-on-1 Friday encouragement call, prayer session, or local
				Connecticut community visit.
			</p>

			{#if form?.success}
				<div class="alert-success">{form.message}</div>
			{/if}

			<form method="POST" action="?/requestFridaySession" use:enhance>
				<div class="form-field">
					<label for="friday-name">Your Name (or Name of Person Referred) *</label>
					<input id="friday-name" name="name" type="text" required placeholder="Full Name" />
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="friday-email">Email Address</label>
						<input id="friday-email" name="email" type="email" placeholder="you@example.com" />
					</div>
					<div class="form-field">
						<label for="friday-phone">Phone Number</label>
						<input id="friday-phone" name="phone" type="tel" placeholder="(203) 555-0199" />
					</div>
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="friday-city">City / County</label>
						<input
							id="friday-city"
							name="city"
							type="text"
							placeholder="Waterbury / Wolcott, CT (or Remote)"
						/>
					</div>
					<div class="form-field">
						<label for="friday-type">How Can We Minister to You?</label>
						<select id="friday-type" name="sessionType">
							<option value="1-on-1 Encouragement Call"
								>1-on-1 Encouragement &amp; Vision Call</option
							>
							<option value="Friday Prayer Session">Dedicated Friday Prayer Session</option>
							<option value="Local CT Community Visit">Local CT Outreach / Shelter Visit</option>
							<option value="Refer Someone in Need">Refer a Friend or Family in Need</option>
						</select>
					</div>
				</div>
				<div class="form-field">
					<label for="friday-details">Share Your Story or Prayer Need *</label>
					<textarea
						id="friday-details"
						name="details"
						rows="4"
						required
						placeholder="Tell us what season you are walking through and how Courtney can pray for or encourage you this Friday..."
					></textarea>
				</div>
				<button type="submit" class="btn btn-gold" style="width: 100%">
					<IconHeartHandshake size={19} />
					<span>Request a Friday Session</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.friday-grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 3rem;
		align-items: start;
	}

	.friday-grid h2 {
		margin-top: 0.75rem;
	}

	.serve-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}

	.serve-card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.35rem;
	}

	.serve-card :global(svg) {
		color: var(--color-teal);
		flex-shrink: 0;
		margin-top: 0.2rem;
	}

	.serve-card h4 {
		margin: 0 0 0.35rem;
		font-size: 1.1rem;
	}

	.serve-card p {
		margin: 0;
		font-size: 0.94rem;
		color: var(--color-text-muted);
	}

	.intake-card {
		border-top: 4px solid var(--color-gold);
	}

	.intake-card h3 {
		margin-top: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.intake-sub {
		font-size: 0.94rem;
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	@media (max-width: 960px) {
		.friday-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
