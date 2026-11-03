<script lang="ts">
	import { enhance } from '$app/forms';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { gsapHeroEntrance, gsapReveal } from '#lib/attachments/gsap.js';
	import type { PageProps } from './$types';
	import { IconPray, IconJacket, IconSoup, IconHeartHandshake } from '@tabler/icons-svelte';

	let { form }: PageProps = $props();
	let selectedTabOverride = $state<'prayer' | 'holiday' | null>(null);
	let activeTab = $derived<'prayer' | 'holiday'>(
		selectedTabOverride ??
			(form?.tab === 'holiday' || page.url.searchParams.get('tab') === 'holiday'
				? 'holiday'
				: 'prayer')
	);
	let isSubmitting = $state(false);

	function switchTab(nextTab: 'prayer' | 'holiday') {
		if (nextTab === activeTab) return;
		selectedTabOverride = nextTab;
		if (typeof window !== 'undefined') {
			if (nextTab === 'holiday') {
				// oxlint-disable-next-line svelte/no-navigation-without-resolve -- query-string tab target on resolved route
				replaceState(`${resolve('/prayer-and-support')}?tab=holiday`, page.state);
			} else {
				replaceState(resolve('/prayer-and-support'), page.state);
			}
		}
	}

	function handleTabKeydown(event: KeyboardEvent) {
		const tablist = (event.currentTarget as HTMLElement).parentElement;
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			const nextTab = activeTab === 'prayer' ? 'holiday' : 'prayer';
			switchTab(nextTab);
			tablist?.querySelector<HTMLButtonElement>(`#tab-${nextTab}`)?.focus();
		} else if (event.key === 'Home') {
			event.preventDefault();
			switchTab('prayer');
			tablist?.querySelector<HTMLButtonElement>('#tab-prayer')?.focus();
		} else if (event.key === 'End') {
			event.preventDefault();
			switchTab('holiday');
			tablist?.querySelector<HTMLButtonElement>('#tab-holiday')?.focus();
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

<section class="page-hero" {@attach gsapHeroEntrance}>
	<div class="container">
		<div class="eyebrow-badge" data-hero-item>
			<IconPray size={16} />
			<span>INTERACTIVE PRAYER &amp; ASSISTANCE INTAKE PORTAL</span>
		</div>
		<h1 data-hero-item>How Can We Pray For You or Serve Your Family Today?</h1>
		<p class="lead" data-hero-item>
			Whether you need immediate spiritual encouragement and prayer on a Friday, or you need to
			register a family for Thanksgiving and Christmas meals and children’s winter coats in
			Connecticut, we are here to stand with you.
		</p>
	</div>
</section>

<section class="section">
	<div class="container-narrow" {@attach gsapReveal({ y: 22 })}>
		<!-- Dual-Tab Interactive Switcher -->
		<div class="tabs-bar" role="tablist" aria-label="Prayer and Assistance Portal Tabs">
			<button
				id="tab-prayer"
				type="button"
				role="tab"
				tabindex={activeTab === 'prayer' ? 0 : -1}
				aria-selected={activeTab === 'prayer'}
				aria-controls="panel-prayer"
				class={['tab-btn', { active: activeTab === 'prayer' }]}
				onclick={() => switchTab('prayer')}
				onkeydown={handleTabKeydown}
			>
				<IconPray size={20} />
				<span>Tab A: Submit a Prayer Request</span>
			</button>
			<button
				id="tab-holiday"
				type="button"
				role="tab"
				tabindex={activeTab === 'holiday' ? 0 : -1}
				aria-selected={activeTab === 'holiday'}
				aria-controls="panel-holiday"
				class={['tab-btn', { active: activeTab === 'holiday' }]}
				onclick={() => switchTab('holiday')}
				onkeydown={handleTabKeydown}
			>
				<IconJacket size={20} />
				<span>Tab B: Nominate a Family for Meals &amp; Coats</span>
			</button>
		</div>

		{#if form?.success}
			<div class="alert-success" role="status">{form.message}</div>
		{/if}
		{#if form?.error}
			<div id="portal-form-error" class="alert-error" role="alert">{form.error}</div>
		{/if}

		{#if activeTab === 'prayer'}
			<div id="panel-prayer" class="card portal-card" role="tabpanel" aria-labelledby="tab-prayer">
				<span class="badge-teal"
					><IconPray size={14} /> Confidential Prayer &amp; Encouragement</span
				>
				<h2>Submit a Prayer Request</h2>
				<p>
					Every prayer request is personally lifted up during our weekly Friday Ministry. You may
					also request a 1-on-1 Friday encouragement follow-up call.
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
						<label for="prayer-friday">Would you like a Friday follow-up encouragement call?</label>
						<select
							id="prayer-friday"
							name="fridayCall"
							value={form?.tab === 'prayer' ? (form?.values?.fridayCall ?? 'yes') : 'yes'}
						>
							<option value="yes"
								>Yes — Please schedule a Friday encouragement follow-up call</option
							>
							<option value="no">No — Please pray over my request privately</option>
						</select>
					</div>
					<div class="form-field">
						<label for="prayer-need">How Can We Pray For You? *</label>
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
							placeholder="Share your prayer need, buried dream, or family circumstance..."
						></textarea>
					</div>
					<button
						type="submit"
						class="btn btn-gold"
						style="width: 100%"
						disabled={isSubmitting}
						aria-busy={isSubmitting}
					>
						<IconPray size={20} />
						<span
							>{isSubmitting
								? 'Submitting Request...'
								: 'Submit Prayer or Assistance Request'}</span
						>
					</button>
				</form>
			</div>
		{:else}
			<div
				id="panel-holiday"
				class="card portal-card"
				role="tabpanel"
				aria-labelledby="tab-holiday"
			>
				<span class="badge-emerald">
					<IconSoup size={14} /> Thanksgiving – Jan 4 Connecticut Outreach
				</span>
				<h2>Nominate a Family for Holiday Meals &amp; Children’s Coats</h2>
				<p>
					Register your household or nominate a local Connecticut family in need (Wolcott,
					Waterbury, New Haven, or Hartford counties) for hot Thanksgiving &amp; Christmas meals and
					brand-new children’s coats, hats, mittens, and blankets.
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
						class="btn btn-gold"
						style="width: 100%"
						disabled={isSubmitting}
						aria-busy={isSubmitting}
					>
						<IconHeartHandshake size={20} />
						<span
							>{isSubmitting
								? 'Submitting Request...'
								: 'Submit Holiday Meal & Coat Assistance Request'}</span
						>
					</button>
				</form>
			</div>
		{/if}

		<!-- Closing Blessing Quote -->
		<div class="closing-blessing">
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
	.tabs-bar {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 1.75rem;
	}

	.tab-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		padding: 1rem 1.25rem;
		font-family: var(--font-body);
		font-weight: 700;
		font-size: 0.96rem;
		background: var(--color-surface);
		color: var(--color-navy);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab-btn.active {
		background: var(--color-navy);
		color: var(--color-gold);
		border-color: var(--color-navy);
	}

	.portal-card h2 {
		margin-top: 0.75rem;
	}

	.closing-blessing {
		margin-top: 3rem;
		background: var(--color-navy);
		color: #ffffff;
		padding: 2.5rem;
		border-radius: var(--radius-md);
		border-left: 5px solid var(--color-gold);
		text-align: center;
	}

	.closing-blessing :global(svg) {
		color: var(--color-gold);
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
		color: var(--color-gold);
		font-size: 0.92rem;
	}

	@media (max-width: 680px) {
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
