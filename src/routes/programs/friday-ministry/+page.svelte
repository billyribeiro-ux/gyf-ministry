<script lang="ts">
	import { enhance } from '$app/forms';
	import { gsapReveal } from '#lib/attachments/gsap.js';
	import MinistryMasthead from '#lib/components/ministry/MinistryMasthead.svelte';
	import type { PageProps } from './$types';
	import { IconPray, IconHeartHandshake, IconSparkles, IconMapPin } from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let isSubmitting = $state(false);
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

<MinistryMasthead
	label="Friday Ministry"
	title="Someone to talk to on Friday."
	photo={{
		src: 'images/gallery/carousel1-6.webp',
		alt: 'Grow Your Faith Ministries community members gathered for a group photo',
		width: 1200,
		height: 900,
		small: { src: 'images/gallery/carousel1-6-640w.webp', width: 640 },
		caption: 'From the Grow Your Faith Ministries photo archive'
	}}
	actions={[{ href: '#book-friday', label: 'Request a Friday session' }]}
>
	<p>
		If you’re facing a setback or carrying something hard, Courtney sets aside Fridays for free
		one-on-one conversations, prayer, and visits with Connecticut neighbors.
	</p>
</MinistryMasthead>

<!-- Why Every Friday & Who We Serve -->
<section class="section">
	<div
		class="container friday-grid"
		{@attach gsapReveal({ selector: '.friday-grid > *', stagger: 0.14 })}
	>
		<div>
			<h2>Courtney keeps Fridays open for you</h2>
			<p>
				“God has so abundantly blessed me that I am now able to take Friday off every week to
				minister to those in need,” Courtney says.
			</p>
			<p>
				You can reach out after a job loss, a change you didn’t expect, or a stretch when your faith
				feels worn down.
			</p>

			<h3 class="serve-heading">What a Friday session can look like</h3>
			<div class="serve-list">
				<div class="serve-card">
					<IconSparkles size={24} />
					<div>
						<h4>One-on-one mentorship</h4>
						<p>Talk through a setback, name what matters to you, and consider one next step.</p>
					</div>
				</div>
				<div class="serve-card">
					<IconPray size={24} />
					<div>
						<h4>Prayer and encouragement</h4>
						<p>Ask for a prayer call and Scripture to reflect on during a difficult week.</p>
					</div>
				</div>
				<div class="serve-card">
					<IconMapPin size={24} />
					<div>
						<h4>Visits in Connecticut</h4>
						<p>
							Courtney visits shelters and community centers and meets with families across Greater
							Waterbury and Central Connecticut.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- How to Connect on a Friday Intake Form -->
		<div class="card intake-card" id="book-friday">
			<h2>Request a Friday session</h2>
			<p class="intake-sub">
				Ask for a call, prayer session, or local visit. You can also reach out on someone else’s
				behalf.
			</p>

			{#if form?.success}
				<div class="alert-success" role="status">{form.message}</div>
			{/if}
			{#if form?.error}
				<div id="friday-form-error" class="alert-error" role="alert">{form.error}</div>
			{/if}

			<form
				method="POST"
				action="?/requestFridaySession"
				aria-describedby={form?.error ? 'friday-form-error' : undefined}
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="form-field">
					<label for="friday-name">Your Name (or Name of Person Referred) *</label>
					<input
						id="friday-name"
						name="name"
						type="text"
						autocomplete="name"
						required
						value={form?.values?.name ?? ''}
						aria-invalid={form?.error && !form?.values?.name ? 'true' : undefined}
						placeholder="Full Name"
					/>
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="friday-email">Email Address</label>
						<input
							id="friday-email"
							name="email"
							type="email"
							autocomplete="email"
							value={form?.values?.email ?? ''}
							placeholder="you@example.com"
						/>
					</div>
					<div class="form-field">
						<label for="friday-phone">Phone Number</label>
						<input
							id="friday-phone"
							name="phone"
							type="tel"
							autocomplete="tel"
							value={form?.values?.phone ?? ''}
							placeholder="(203) 555-0199"
						/>
					</div>
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="friday-city">City / County</label>
						<input
							id="friday-city"
							name="city"
							type="text"
							autocomplete="address-level2"
							value={form?.values?.city ?? ''}
							placeholder="Waterbury / Wolcott, CT (or Remote)"
						/>
					</div>
					<div class="form-field">
						<label for="friday-type">What kind of support would help?</label>
						<select
							id="friday-type"
							name="sessionType"
							value={form?.values?.sessionType ?? '1-on-1 Encouragement Call'}
						>
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
					<label for="friday-details">What would you like Courtney to know? *</label>
					<textarea
						id="friday-details"
						name="details"
						rows="4"
						required
						value={form?.values?.details ?? ''}
						aria-invalid={form?.error && !form?.values?.details ? 'true' : undefined}
						placeholder="Share as much as you feel comfortable sharing."></textarea>
				</div>
				<button
					type="submit"
					class="btn ministry-primary"
					style="width: 100%"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					<IconHeartHandshake size={19} />
					<span>{isSubmitting ? 'Sending request…' : 'Send Friday session request'}</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.friday-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
		gap: 3rem;
		align-items: start;
	}

	.friday-grid > * {
		min-width: 0;
	}

	.serve-heading {
		margin: 2rem 0 0.6rem;
	}

	.serve-list {
		display: flex;
		flex-direction: column;
	}

	.serve-card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding-block: 1rem;
		border-top: 1px solid var(--color-line, #343946);
	}

	.serve-card > div {
		min-width: 0;
	}

	.serve-card :global(svg) {
		color: var(--color-accent, #adc8ff);
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
		color: var(--color-soft, #b6bed0);
	}

	.intake-card {
		border-top: 2px solid var(--color-accent, #adc8ff);
	}

	.intake-card h2 {
		margin-bottom: 0.5rem;
		font-size: clamp(1.75rem, 3vw, 2.45rem);
	}

	.intake-sub {
		font-size: 0.94rem;
		color: var(--color-soft, #b6bed0);
		margin-bottom: 1.5rem;
	}

	@media (max-width: 960px) {
		.friday-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
