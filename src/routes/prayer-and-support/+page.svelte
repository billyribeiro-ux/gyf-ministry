<script lang="ts">
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { gsapReveal } from '#lib/attachments/gsap.js';
	import MinistryMasthead from '#lib/components/ministry/MinistryMasthead.svelte';
	import type { PageProps } from './$types';
	import { IconPray, IconJacket, IconHeartHandshake } from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let selectedTabOverride = $state<'prayer' | 'holiday' | null>(null);
	let activeTab = $derived<'prayer' | 'holiday'>(
		selectedTabOverride ??
			(form?.tab === 'holiday' || page.url.searchParams.get('tab') === 'holiday'
				? 'holiday'
				: 'prayer')
	);
	let isSubmitting = $state(false);
	const prayerHref = resolve('/prayer-and-support');
	const holidayHref = `${prayerHref}?tab=holiday`;

	function switchTab(nextTab: 'prayer' | 'holiday') {
		if (nextTab === activeTab) return;
		selectedTabOverride = nextTab;
		if (nextTab === 'holiday') {
			// oxlint-disable-next-line svelte/no-navigation-without-resolve -- query-string on resolved route
			replaceState(holidayHref, page.state);
		} else {
			// oxlint-disable-next-line svelte/no-navigation-without-resolve -- resolved route
			replaceState(prayerHref, page.state);
		}
	}

	function selectTab(event: MouseEvent, nextTab: 'prayer' | 'holiday') {
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		event.preventDefault();
		switchTab(nextTab);
	}

	function handleTabKeydown(event: KeyboardEvent) {
		const tablist = (event.currentTarget as HTMLElement).parentElement;
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			const nextTab = activeTab === 'prayer' ? 'holiday' : 'prayer';
			switchTab(nextTab);
			tablist?.querySelector<HTMLAnchorElement>(`#tab-${nextTab}`)?.focus();
		} else if (event.key === 'Home') {
			event.preventDefault();
			switchTab('prayer');
			tablist?.querySelector<HTMLAnchorElement>('#tab-prayer')?.focus();
		} else if (event.key === 'End') {
			event.preventDefault();
			switchTab('holiday');
			tablist?.querySelector<HTMLAnchorElement>('#tab-holiday')?.focus();
		}
	}
</script>

<svelte:head>
	<title>Request Prayer or Holiday Outreach Support | Grow Your Faith Ministries</title>
	<meta
		name="description"
		content="Submit a confidential prayer request, book a Friday encouragement call, or register a family in need for Thanksgiving and Christmas meals and children’s winter coats."
	/>
	<meta
		property="og:title"
		content="Request Prayer or Holiday Outreach Support | Grow Your Faith Ministries"
	/>
	<meta
		property="og:description"
		content="Submit a confidential prayer request, book a Friday encouragement call, or register a family in need for Thanksgiving and Christmas meals and children’s winter coats."
	/>
</svelte:head>

<MinistryMasthead
	label="Prayer &amp; Support"
	title="Tell us how we can help."
	actions={[{ href: '#support-request', label: 'Choose the support you need' }]}
>
	<p>
		Share a prayer request in confidence, ask for a Friday call, or request holiday meals and winter
		gear for a Connecticut family.
	</p>
</MinistryMasthead>

<section class="section support-section" id="support-request">
	<div class="container-narrow">
		<nav class="tabs-bar" aria-label="Choose the support you need">
			<!-- oxlint-disable-next-line svelte/no-navigation-without-resolve -- route resolved above -->
			<a
				id="tab-prayer"
				href={prayerHref}
				aria-current={activeTab === 'prayer' ? 'page' : undefined}
				aria-controls="panel-prayer"
				class={['tab-btn', { active: activeTab === 'prayer' }]}
				onclick={(event) => selectTab(event, 'prayer')}
				onkeydown={handleTabKeydown}
			>
				<IconPray size={20} aria-hidden="true" />
				<span>Prayer request</span>
			</a>
			<!-- oxlint-disable-next-line svelte/no-navigation-without-resolve -- route resolved above -->
			<a
				id="tab-holiday"
				href={holidayHref}
				aria-current={activeTab === 'holiday' ? 'page' : undefined}
				aria-controls="panel-holiday"
				class={['tab-btn', { active: activeTab === 'holiday' }]}
				onclick={(event) => selectTab(event, 'holiday')}
				onkeydown={handleTabKeydown}
			>
				<IconJacket size={20} aria-hidden="true" />
				<span>Holiday assistance</span>
			</a>
		</nav>

		{#if form?.tab === activeTab && form.success}
			<div class="alert-success" role="status">{form.message}</div>
		{/if}
		{#if form?.tab === activeTab && form.error}
			<div id="portal-form-error" class="alert-error" role="alert">{form.error}</div>
		{/if}

		<section
			id="panel-prayer"
			class="card portal-card"
			hidden={activeTab !== 'prayer'}
			aria-labelledby="prayer-heading"
		>
			<h2 id="prayer-heading">Share a prayer request</h2>
			<p>
				Our ministry prays for requests during Friday Ministry. If you’d like someone to call, leave
				a phone number or email below.
			</p>

			<form
				method="POST"
				action="?/submitPrayer"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="form-field">
					<label for="prayer-name">Your Name *</label>
					<input
						id="prayer-name"
						name="name"
						type="text"
						autocomplete="name"
						required
						value={form?.tab === 'prayer' ? (form?.values?.name ?? '') : ''}
						aria-invalid={form?.tab === 'prayer' && form?.error && !form?.values?.name
							? 'true'
							: undefined}
						aria-describedby={form?.tab === 'prayer' && form?.error
							? 'portal-form-error'
							: undefined}
						placeholder="First & Last Name"
					/>
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="prayer-email">Email Address (Optional)</label>
						<input
							id="prayer-email"
							name="email"
							type="email"
							autocomplete="email"
							value={form?.tab === 'prayer' ? (form?.values?.email ?? '') : ''}
							placeholder="you@example.com"
						/>
					</div>
					<div class="form-field">
						<label for="prayer-phone">Phone Number (Optional)</label>
						<input
							id="prayer-phone"
							name="phone"
							type="tel"
							autocomplete="tel"
							value={form?.tab === 'prayer' ? (form?.values?.phone ?? '') : ''}
							placeholder="(203) 555-0199"
						/>
					</div>
				</div>
				<div class="form-field">
					<label for="prayer-friday">Would you like a Friday prayer or encouragement call?</label>
					<select
						id="prayer-friday"
						name="fridayCall"
						value={form?.tab === 'prayer' ? (form?.values?.fridayCall ?? 'no') : 'no'}
						aria-describedby="prayer-follow-up-help"
					>
						<option value="no">No, please pray for me privately</option>
						<option value="yes">Yes, please contact me</option>
					</select>
					<small id="prayer-follow-up-help"
						>If you choose yes, please include your phone number or email.</small
					>
				</div>
				<div class="form-field">
					<label for="prayer-need">How can we pray for you? *</label>
					<textarea
						id="prayer-need"
						name="prayerNeed"
						rows="5"
						required
						value={form?.tab === 'prayer' ? (form?.values?.prayerNeed ?? '') : ''}
						aria-invalid={form?.tab === 'prayer' && form?.error && !form?.values?.prayerNeed
							? 'true'
							: undefined}
						aria-describedby={form?.tab === 'prayer' && form?.error
							? 'portal-form-error'
							: undefined}
						placeholder="Share as much as you feel comfortable sharing."></textarea>
				</div>
				<button
					type="submit"
					class="btn ministry-primary"
					style="width: 100%"
					disabled={isSubmitting}
					aria-busy={isSubmitting}
				>
					<IconPray size={20} />
					<span>{isSubmitting ? 'Sending request…' : 'Send prayer request'}</span>
				</button>
			</form>
		</section>
		<section
			id="panel-holiday"
			class="card portal-card"
			hidden={activeTab !== 'holiday'}
			aria-labelledby="holiday-heading"
		>
			<h2 id="holiday-heading">Request meals and coats for a family</h2>
			<p>
				Request hot holiday meals and new coats, hats, mittens, and blankets for your household or a
				Connecticut family you know.
			</p>

			<form
				method="POST"
				action="?/nominateFamily"
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
						<label for="nom-name">Parent / Guardian or Nominator Name *</label>
						<input
							id="nom-name"
							name="name"
							type="text"
							autocomplete="name"
							required
							value={form?.tab === 'holiday' ? (form?.values?.name ?? '') : ''}
							aria-invalid={form?.tab === 'holiday' && form?.error && !form?.values?.name
								? 'true'
								: undefined}
							aria-describedby={form?.tab === 'holiday' && form?.error
								? 'portal-form-error'
								: undefined}
							placeholder="Full Name"
						/>
					</div>
					<div class="form-field">
						<label for="nom-phone">Best Contact Phone Number *</label>
						<input
							id="nom-phone"
							name="phone"
							type="tel"
							autocomplete="tel"
							required
							value={form?.tab === 'holiday' ? (form?.values?.phone ?? '') : ''}
							aria-invalid={form?.tab === 'holiday' && form?.error && !form?.values?.phone
								? 'true'
								: undefined}
							aria-describedby={form?.tab === 'holiday' && form?.error
								? 'portal-form-error'
								: undefined}
							placeholder="(203) 555-0199"
						/>
					</div>
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="nom-email">Email Address</label>
						<input
							id="nom-email"
							name="email"
							type="email"
							autocomplete="email"
							value={form?.tab === 'holiday' ? (form?.values?.email ?? '') : ''}
							placeholder="you@example.com"
						/>
					</div>
					<div class="form-field">
						<label for="nom-city">Connecticut City / Town *</label>
						<input
							id="nom-city"
							name="city"
							type="text"
							autocomplete="address-level2"
							required
							value={form?.tab === 'holiday' ? (form?.values?.city ?? '') : ''}
							aria-invalid={form?.tab === 'holiday' && form?.error && !form?.values?.city
								? 'true'
								: undefined}
							aria-describedby={form?.tab === 'holiday' && form?.error
								? 'portal-form-error'
								: undefined}
							placeholder="Waterbury, Wolcott, New Haven, Hartford..."
						/>
					</div>
				</div>
				<div class="form-grid">
					<div class="form-field">
						<label for="nom-size">Total Household / Family Size *</label>
						<input
							id="nom-size"
							name="familySize"
							type="number"
							min="1"
							max="15"
							value={form?.tab === 'holiday' ? (form?.values?.familySize ?? '4') : '4'}
							required
						/>
					</div>
					<div class="form-field">
						<label for="nom-coats">Children’s Ages &amp; Winter Coat Sizes *</label>
						<input
							id="nom-coats"
							name="coatSizes"
							type="text"
							required
							value={form?.tab === 'holiday' ? (form?.values?.coatSizes ?? '') : ''}
							aria-invalid={form?.tab === 'holiday' && form?.error && !form?.values?.coatSizes
								? 'true'
								: undefined}
							aria-describedby={form?.tab === 'holiday' && form?.error
								? 'portal-form-error'
								: undefined}
							placeholder="e.g., Girl 7 (Youth M), Boy 10 (Youth L)"
						/>
					</div>
				</div>
				<div class="form-field">
					<label for="nom-details">Delivery Notes, Dietary Needs, or Special Requests</label>
					<textarea
						id="nom-details"
						name="details"
						rows="3"
						value={form?.tab === 'holiday' ? (form?.values?.details ?? '') : ''}
						placeholder="Let us know if the family needs Thanksgiving meal delivery, Christmas meal delivery, blankets, or specific winter gear..."
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
					<span>{isSubmitting ? 'Sending request…' : 'Send holiday assistance request'}</span>
				</button>
			</form>
		</section>

		<!-- Closing Blessing Quote -->
		<div class="closing-blessing" {@attach gsapReveal()}>
			<IconPray size={28} />
			<blockquote>
				“I pray that you allow God to open your eyes, your heart, and your mind so that you can live
				the life you’ve been called to live through Him.”
			</blockquote>
			<cite>— Courtney Ribeiro, Founder of Grow Your Faith Ministries</cite>
		</div>
	</div>
</section>

<style>
	.support-section {
		padding-top: clamp(2rem, 5vw, 4rem);
	}

	.tabs-bar {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.35rem;
		margin-bottom: 1.25rem;
		padding: 0.35rem;
		border: 1px solid var(--color-line, #343946);
		border-radius: var(--radius-sm);
		background: var(--color-panel, #1a1d25);
	}

	.tab-btn {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0.55rem;
		min-height: 3.25rem;
		padding: 0.65rem 1rem;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 0.96rem;
		background: transparent;
		color: var(--color-strong, #f5f7fb);
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-decoration: none;
	}

	.tab-btn:hover {
		background: var(--color-raised, #222631);
	}

	.tab-btn.active {
		background: var(--color-accent, #adc8ff);
		color: var(--color-on-accent, #101b31);
		border-color: var(--color-accent, #adc8ff);
	}

	.closing-blessing {
		margin-top: 3rem;
		background: var(--color-panel, #1a1d25);
		color: var(--color-strong, #f5f7fb);
		padding: 2.5rem;
		border-radius: var(--radius-md);
		border-left: 2px solid var(--color-accent, #adc8ff);
		text-align: center;
	}

	.closing-blessing :global(svg) {
		color: var(--color-accent, #adc8ff);
		margin-bottom: 0.75rem;
	}

	.closing-blessing blockquote {
		font-family: var(--font-heading);
		font-size: 1.35rem;
		font-style: italic;
		margin: 0 0 0.85rem;
	}

	.closing-blessing cite {
		font-style: normal;
		font-weight: 700;
		color: var(--color-accent, #adc8ff);
		font-size: 0.92rem;
	}

	@media (max-width: 380px) {
		.tabs-bar {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 480px) {
		.closing-blessing {
			padding: 1.5rem 1.15rem;
		}
	}
</style>
