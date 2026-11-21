<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { gsapReveal } from '#lib/attachments/gsap.js';
	import MinistryMasthead from '#lib/components/ministry/MinistryMasthead.svelte';
	import type { PageProps } from './$types';
	import {
		IconSeedling,
		IconCross,
		IconSparkles,
		IconMountain,
		IconDownload,
		IconArrowRight
	} from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let isSubmitting = $state(false);

	const reflections = [
		{
			title: 'Begin with a mustard seed',
			scripture: 'Matthew 17:20',
			prompt: 'Name one hope you are ready to bring to God in prayer.'
		},
		{
			title: 'Make room for what hurts',
			scripture: 'Psalm 34:18',
			prompt:
				'Write down a setback you are still carrying. What would it feel like to share it with God?'
		},
		{
			title: 'Remember who made you',
			scripture: 'Ephesians 2:10',
			prompt:
				'Recall a time you used a gift to help someone. What did that experience show you about how God made you?'
		},
		{
			title: 'Ask for wisdom',
			scripture: 'James 1:5',
			prompt: 'Name one decision you are facing. What guidance do you want to ask God for?'
		},
		{
			title: 'Put a gift to work',
			scripture: '1 Peter 4:10',
			prompt: 'Choose one talent you can use to care for a neighbor this week.'
		},
		{
			title: 'Let someone walk with you',
			scripture: 'Galatians 6:2',
			prompt: 'Who could listen, pray with you, or help you follow through on your next step?'
		},
		{
			title: 'Take one faithful step',
			scripture: 'Philippians 1:6',
			prompt:
				'Choose one small action you can take in the next seven days. Make time for it and pray as you begin.'
		}
	];

	const guideText = [
		'The Seven-Day Mustard Seed Reflection Guide',
		'Grow Your Faith Ministries',
		'Read the Scripture each day, spend a few minutes in prayer, and write down where it leads you.',
		...reflections.map(
			({ title, scripture, prompt }, index) =>
				`Day ${index + 1}. ${title}\n${scripture}\n\n${prompt}\n\n______________________________\n\n______________________________`
		)
	].join('\n\n');
	const guideDownload = `data:text/plain;charset=utf-8,${encodeURIComponent(guideText)}`;
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

<MinistryMasthead
	label="Restore Your Purpose"
	title="Begin again with a little faith."
	actions={[
		{ href: '#vision-guide', label: 'Start the seven-day guide' },
		{ href: resolve('/programs/friday-ministry'), label: 'Find personal encouragement' }
	]}
>
	<p>
		If a setback left you unsure what comes next, this seven-day guide gives you space to read
		Scripture, pray, and choose one step forward.
	</p>
</MinistryMasthead>

<!-- Three ways to take a next step -->
<section class="section">
	<div class="container">
		<div class="section-intro" {@attach gsapReveal({ y: 20 })}>
			<span class="ministry-kicker"><IconMountain size={15} /> Matthew 17:20</span>
			<h2>Three ways to take a next step</h2>
			<p>
				Jesus used the mustard seed to teach what small faith can do. Start with the step you can
				take today.
			</p>
		</div>

		<div class="steps-grid" {@attach gsapReveal({ selector: '.step-card', stagger: 0.12 })}>
			<article class="card step-card">
				<div class="step-num">Step 01</div>
				<div class="step-icon">
					<IconSeedling size={28} />
				</div>
				<h3>Name what you still hope for</h3>
				<p>Think of a hope or goal you put aside. What part of it still matters to you?</p>
			</article>

			<article class="card step-card">
				<div class="step-num">Step 02</div>
				<div class="step-icon">
					<IconCross size={28} />
				</div>
				<h3>Remember how God sees you</h3>
				<p>
					Take a moment to remember that God loves you and knows you, even when life has gone
					differently than you hoped.
				</p>
			</article>

			<article class="card step-card">
				<div class="step-num">Step 03</div>
				<div class="step-icon">
					<IconSparkles size={28} />
				</div>
				<h3>Use one gift this week</h3>
				<p>
					Choose something you already know how to do and offer it to someone who could use your
					help.
				</p>
			</article>
		</div>
	</div>
</section>

<section class="section-alt" id="vision-guide">
	<div class="container workbook-grid">
		<div class="guide" {@attach gsapReveal()}>
			<h2>The seven-day mustard seed reflection guide</h2>
			<p>
				Read the Scripture each day, spend a few minutes in prayer, and write down where it leads
				you.
			</p>
			<ol class="reflections">
				{#each reflections as reflection, index (reflection.scripture)}
					<li>
						<span class="reflection-day">Day {index + 1}</span>
						<div>
							<h3>{reflection.title}</h3>
							<p class="scripture">{reflection.scripture}</p>
							<p>{reflection.prompt}</p>
						</div>
					</li>
				{/each}
			</ol>
			<a
				class="btn ministry-secondary"
				href={guideDownload}
				download="mustard-seed-reflection-guide.txt"
			>
				<IconDownload size={19} aria-hidden="true" />
				Download the reflection guide
			</a>
		</div>

		<div class="card guide-follow-up">
			<h3>Ask for encouragement</h3>
			<p>
				Leave your contact details if you would like to hear from the ministry as you work through
				the guide.
			</p>
			<div class="need-more-box">
				<p>Every Friday, Courtney sets aside time for free spiritual mentorship.</p>
				<a href={resolve('/programs/friday-ministry')} class="pillar-link">
					<span>Request a Friday session</span>
					<IconArrowRight size={18} />
				</a>
			</div>

			{#if form?.success}
				<div class="alert-success" role="status">{form.message}</div>
			{/if}
			{#if form?.error}
				<div id="guide-form-error" class="alert-error" role="alert">{form.error}</div>
			{/if}
			<form
				method="POST"
				action="?/downloadGuide"
				aria-describedby={form?.error ? 'guide-form-error' : undefined}
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="form-field">
					<label for="guide-name">First &amp; Last Name *</label>
					<input
						id="guide-name"
						name="name"
						type="text"
						autocomplete="name"
						required
						value={form?.values?.name ?? ''}
						aria-invalid={form?.error && !form?.values?.name ? 'true' : undefined}
						aria-describedby={form?.error ? 'guide-form-error' : undefined}
						placeholder="Your Name"
					/>
				</div>
				<div class="form-field">
					<label for="guide-email">Email Address *</label>
					<input
						id="guide-email"
						name="email"
						type="email"
						autocomplete="email"
						required
						value={form?.values?.email ?? ''}
						aria-invalid={form?.error && !form?.values?.email ? 'true' : undefined}
						aria-describedby={form?.error ? 'guide-form-error' : undefined}
						placeholder="you@example.com"
					/>
				</div>
				<div class="form-field">
					<label for="guide-goal">What would you like encouragement with? (Optional)</label>
					<textarea
						id="guide-goal"
						name="visionGoal"
						rows="3"
						value={form?.values?.visionGoal ?? ''}
						placeholder="Share a dream or calling you want to bring back to life..."></textarea>
				</div>
				<button
					type="submit"
					class="btn ministry-primary"
					style="width: 100%"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					<span>{isSubmitting ? 'Sending request…' : 'Request encouragement'}</span>
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
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.75rem;
	}

	.step-card {
		position: relative;
		border-top: 2px solid var(--color-accent, #adc8ff);
	}

	.step-num {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-accent, #adc8ff);
		margin-bottom: 0.75rem;
	}

	.step-icon {
		width: 50px;
		height: 50px;
		border-radius: 12px;
		background: var(--color-raised, #222631);
		color: var(--color-accent, #adc8ff);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.workbook-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
		gap: 3rem;
		align-items: start;
	}

	.workbook-grid > * {
		min-width: 0;
	}

	.guide h2 {
		max-width: 22ch;
		margin-bottom: 0.6rem;
	}

	.reflections {
		margin: 1.5rem 0;
		padding: 0;
		list-style: none;
	}

	.reflections li {
		display: grid;
		grid-template-columns: 3.3rem minmax(0, 1fr);
		gap: 1rem;
		padding-block: 0.95rem;
		border-top: 1px solid var(--color-line, #343946);
	}

	.reflections li:last-child {
		border-bottom: 1px solid var(--color-line, #343946);
	}

	.reflection-day {
		padding-top: 0.15rem;
		color: var(--color-accent, #adc8ff);
		font-size: 0.79rem;
		font-weight: 750;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.reflections h3,
	.reflections p {
		margin: 0;
	}

	.reflections .scripture {
		margin-block: 0.15rem 0.2rem;
		color: var(--color-accent, #adc8ff);
		font-weight: 650;
		font-size: 0.9rem;
	}

	.need-more-box {
		margin-bottom: 1.25rem;
		padding: 0.9rem 1rem;
		background: var(--color-screen, #101116);
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
		min-height: 36px;
		font-weight: 700;
		color: var(--color-strong, #f5f7fb);
	}

	.guide-follow-up h3 {
		margin-bottom: 0.5rem;
	}

	@media (max-width: 960px) {
		.steps-grid,
		.workbook-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
