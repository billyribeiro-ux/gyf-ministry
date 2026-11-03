<script lang="ts">
	import '../app.css';
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '#lib/paraglide/runtime.js';
	import favicon from '#lib/assets/favicon.svg';
	import Toast from '#lib/components/Toast.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { siteConfig, getCanonicalUrl } from '#lib/config/site.js';
	import { generateRootOrganizationSchema } from '#lib/seo/schema.js';
	import type { LayoutProps } from './$types';
	import {
		IconCross,
		IconJacket,
		IconHeartHandshake,
		IconPray,
		IconMapPin,
		IconArrowRight,
		IconMenu2,
		IconX,
		IconShieldCheck,
		IconCalendarHeart
	} from '@tabler/icons-svelte';

	let { children }: LayoutProps = $props();

	const currentPath = $derived(page.url.pathname);
	let mobileMenuOpen = $derived(currentPath ? false : false);
	const isAdminArea = $derived(currentPath === '/admin' || currentPath.startsWith('/admin/'));
	const hasBlogMetaTags = $derived(Boolean(page.data.pageMetaTags));
	const canonicalUrl = $derived(getCanonicalUrl(currentPath));
	const schemaJson = $derived(
		`<script type="application/ld+json">${JSON.stringify(generateRootOrganizationSchema())}<` +
			`/script>`
	);

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About Courtney' },
		{ href: '/programs/friday-ministry', label: 'Friday Ministry' },
		{ href: '/programs/holiday-outreach', label: 'Holiday Outreach' },
		{ href: '/restore-your-purpose', label: 'Restore Purpose' },
		{ href: '/prayer-and-support', label: 'Prayer & Support' },
		{ href: '/resources', label: 'Resources' },
		{ href: '/blog', label: 'Blog' }
	] as const;

	function isLinkActive(href: string, pathname: string): boolean {
		return pathname === href || (href !== '/' && pathname.startsWith(href));
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if !isAdminArea && !hasBlogMetaTags}
		<link rel="canonical" href={canonicalUrl} />
		<meta property="og:site_name" content={siteConfig.name} />
		<meta property="og:locale" content="en_US" />
		<meta property="og:url" content={canonicalUrl} />
		<meta property="og:image" content="{siteConfig.url}/images/gyfm-holiday-outreach-hero.webp" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="675" />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content="@courtneyt01" />
		<meta name="geo.region" content="US-CT" />
		<meta name="geo.placename" content="Wolcott, Waterbury, New Haven, Hartford, Connecticut" />
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html schemaJson}
	{/if}
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && mobileMenuOpen) mobileMenuOpen = false;
	}}
/>

{#if !isAdminArea && hasBlogMetaTags && page.data.pageMetaTags}
	<MetaTags {...page.data.pageMetaTags} />
{/if}

{#if isAdminArea}
	{@render children()}
{:else}
	<a href="#main-content" class="skip-to-content">Skip to main content</a>
	<div class="site-shell">
		<!-- 1. Top Announcement Bar (Seasonal Dynamic Banner) -->
		<aside class="announcement-bar" aria-label="Seasonal Outreach Campaign Announcement">
			<div class="container announcement-inner">
				<span class="status-dot" aria-hidden="true"></span>
				<p class="announcement-text">
					<strong>2026 Holiday Outreach Active (Nov 26 – Jan 4):</strong> Help us provide hot holiday
					meals and winter coats, hats, mittens, and blankets to children in our community.
				</p>
				<a href={resolve('/programs/holiday-outreach')} class="announcement-cta">
					<span>Sponsor a Child Today</span>
					<IconArrowRight size={16} stroke={2.2} />
				</a>
			</div>
		</aside>

		<!-- Site Header -->
		<header class="site-header">
			<div class="container header-inner">
				<a href={resolve('/')} class="brand-logo" aria-label="{siteConfig.name} Home">
					<span class="brand-icon" aria-hidden="true">
						<IconCross size={24} stroke={2.2} />
					</span>
					<div class="brand-text">
						<span class="brand-title">Grow Your Faith</span>
						<span class="brand-subtitle">Ministries • Est. {siteConfig.foundingYear}</span>
					</div>
				</a>

				<nav class="desktop-nav" aria-label="Primary Ministry Navigation">
					{#each navLinks as link (link.href)}
						{@const active = isLinkActive(link.href, currentPath)}
						<a
							href={resolve(link.href)}
							class={['nav-link', { active }]}
							aria-current={active ? 'page' : undefined}
						>
							{link.label}
						</a>
					{/each}
				</nav>

				<div class="header-actions">
					<a
						href={resolve('/partner')}
						class={['btn', 'btn-gold', 'header-cta', { 'is-active': currentPath === '/partner' }]}
						aria-current={currentPath === '/partner' ? 'page' : undefined}
						aria-label="Partner &amp; Donate"
					>
						<IconHeartHandshake size={18} />
						<span>Partner &amp; Donate</span>
					</a>
					<button
						type="button"
						class="mobile-toggle"
						aria-expanded={mobileMenuOpen}
						aria-controls="mobile-primary-nav"
						aria-label="Toggle navigation menu"
						onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					>
						{#if mobileMenuOpen}
							<IconX size={24} />
						{:else}
							<IconMenu2 size={24} />
						{/if}
					</button>
				</div>
			</div>

			{#if mobileMenuOpen}
				<nav id="mobile-primary-nav" class="mobile-nav" aria-label="Mobile Navigation">
					<div class="container mobile-nav-inner">
						{#each navLinks as link (link.href)}
							{@const active = isLinkActive(link.href, currentPath)}
							<a
								href={resolve(link.href)}
								class={['mobile-nav-link', { active }]}
								aria-current={active ? 'page' : undefined}
								onclick={() => (mobileMenuOpen = false)}
							>
								{link.label}
							</a>
						{/each}
						<a
							href={resolve('/partner')}
							class="btn btn-gold"
							onclick={() => (mobileMenuOpen = false)}
						>
							<IconHeartHandshake size={18} />
							<span>Partner With Our Mission</span>
						</a>
					</div>
				</nav>
			{/if}
		</header>

		<main id="main-content">
			{@render children()}
		</main>

		<!-- Site Footer -->
		<footer class="site-footer">
			<div class="container">
				<!-- Tier 1: Stewardship & Direct-Impact Callout Banner -->
				<div class="footer-cta-banner">
					<div class="footer-cta-copy">
						<div class="footer-stewardship-pill">
							<IconShieldCheck size={15} />
							<span>100% DIRECT-TO-COMMUNITY STEWARDSHIP</span>
						</div>
						<h2 class="footer-cta-title">
							Underwritten by {siteConfig.founder.parentOrgName} Since {siteConfig.foundingYear}
						</h2>
						<p class="footer-cta-desc">
							Administrative overhead is privately underwritten by {siteConfig.founder
								.parentOrgName} and executive coaching partners so 100% of public outreach gifts go directly
							to hot holiday meals and brand-new winter coats for Connecticut children.
						</p>
					</div>

					<div class="footer-cta-actions">
						<a href={resolve('/partner')} class="btn btn-gold">
							<IconHeartHandshake size={18} />
							<span>Partner With Our Mission</span>
						</a>
						<a href={resolve('/prayer-and-support')} class="btn btn-outline-light">
							<IconPray size={18} />
							<span>Request Prayer or Support</span>
						</a>
					</div>
				</div>

				<!-- Tier 2: Balanced 4-Column Architectural Navigation Grid -->
				<div class="footer-grid">
					<div class="footer-col brand-col">
						<a href={resolve('/')} class="footer-brand" aria-label="{siteConfig.name} Home">
							<span class="brand-icon" aria-hidden="true">
								<IconCross size={24} stroke={2.2} />
							</span>
							<div>
								<div class="footer-title">{siteConfig.name}</div>
								<div class="footer-tagline">
									{siteConfig.slogan} • Est. {siteConfig.foundingYear}
								</div>
							</div>
						</a>
						<p class="footer-desc">
							Founded by {siteConfig.founder.name} in {siteConfig.foundingYear} to restore shattered dreams,
							reawaken God-given purpose through weekly Friday ministry, and serve Connecticut families
							from Thanksgiving through January 4.
						</p>
						<div class="footer-geo">
							<span class="footer-geo-icon" aria-hidden="true">
								<IconMapPin size={18} />
							</span>
							<span>
								Serving Wolcott, Waterbury, New Haven &amp; Hartford Counties, CT + National Faith
								Mentorship
							</span>
						</div>
					</div>

					<nav class="footer-col" aria-label="Ministry Programs">
						<h3 class="footer-heading">Ministry Programs</h3>
						<ul class="footer-links">
							<li>
								<a href={resolve('/programs/friday-ministry')}>Weekly Friday Ministry</a>
							</li>
							<li>
								<a href={resolve('/programs/holiday-outreach')}> Holiday Meals &amp; Coat Drive </a>
							</li>
							<li>
								<a href={resolve('/restore-your-purpose')}>Purpose &amp; Vision Restoration</a>
							</li>
							<li>
								<a href={resolve('/prayer-and-support')}>Submit a Prayer Request</a>
							</li>
							<li>
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<a href={`${resolve('/prayer-and-support')}?tab=holiday`}>
									Holiday Family Registration
								</a>
							</li>
						</ul>
					</nav>

					<nav class="footer-col" aria-label="Explore and Resources">
						<h3 class="footer-heading">Explore &amp; Resources</h3>
						<ul class="footer-links">
							<li><a href={resolve('/')}>Ministry Home</a></li>
							<li><a href={resolve('/about')}>About Courtney Ribeiro</a></li>
							<li><a href={resolve('/blog')}>Faith &amp; Purpose Blog</a></li>
							<li><a href={resolve('/resources')}>Mustard Seed Devotionals</a></li>
							<li><a href={resolve('/partner')}>Partner &amp; Sponsor Outreach</a></li>
						</ul>
					</nav>

					<div class="footer-col rhythm-col">
						<h3 class="footer-heading">Ministry Rhythm &amp; Covenant</h3>
						<div class="footer-rhythm-list">
							<div class="footer-rhythm-card">
								<div class="rhythm-kicker">
									<IconCalendarHeart size={15} />
									<span>Every Friday Year-Round</span>
								</div>
								<p>52 Fridays/yr set aside strictly for 1-on-1 prayer, mentorship &amp; care.</p>
							</div>
							<div class="footer-rhythm-card">
								<div class="rhythm-kicker">
									<IconJacket size={15} />
									<span>Thanksgiving – January 4</span>
								</div>
								<p>40-day annual sabbatical for hot holiday meals &amp; children’s winter coats.</p>
							</div>
						</div>

						<div class="footer-ecosystem">
							<span class="ecosystem-label">Founder &amp; Underwriting Partners</span>
							<div class="authority-links">
								<a href={siteConfig.founder.parentOrgUrl} rel="noopener noreferrer" target="_blank">
									<span>MWC Digital Agency</span>
									<span aria-hidden="true">↗</span>
								</a>
								<a href={siteConfig.founder.coachingUrl} rel="noopener noreferrer" target="_blank">
									<span>Marketing With Courtney</span>
									<span aria-hidden="true">↗</span>
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- Tier 3: Bottom Legal, Scripture & Sitemap Bar -->
				<div class="footer-bottom">
					<p class="footer-copyright">
						© {new Date().getFullYear()}
						{siteConfig.name} ({siteConfig.domain}). All rights reserved. Founded by {siteConfig
							.founder.name}.
					</p>
					<div class="footer-bottom-meta">
						<p class="scripture-footnote">
							“Faith the size of a mustard seed moves mountains.” — Matthew 17:20
						</p>
						<span class="footer-bottom-sep" aria-hidden="true">•</span>
						<a href={resolve('/sitemap.xml')} class="footer-sitemap-link">XML Sitemap</a>
					</div>
				</div>
			</div>
		</footer>

		<div style="display:none">
			{#each locales as locale (locale)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
			{/each}
		</div>

		<Toast />
	</div>
{/if}

<style>
	.site-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}

	.announcement-bar {
		background-color: #091529;
		color: #ffffff;
		border-bottom: 1px solid rgba(212, 168, 67, 0.3);
		font-size: 0.88rem;
		padding: 0.65rem 0;
	}

	.announcement-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		text-align: center;
	}

	.status-dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background-color: var(--color-emerald);
		box-shadow: 0 0 0 4px rgba(34, 181, 115, 0.25);
		flex-shrink: 0;
		animation: pulseDot 2.4s infinite ease-in-out;
	}

	@keyframes pulseDot {
		0%,
		100% {
			box-shadow: 0 0 0 3px rgba(34, 181, 115, 0.24);
		}
		50% {
			box-shadow: 0 0 0 6px rgba(34, 181, 115, 0.42);
		}
	}

	.announcement-text {
		margin: 0;
		color: rgba(255, 255, 255, 0.92);
	}

	.announcement-text strong {
		color: var(--color-gold);
	}

	.announcement-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		min-height: 36px;
		padding: 0.25rem 0.4rem;
		color: var(--color-gold);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 3px;
		white-space: nowrap;
	}

	.announcement-cta:hover {
		color: #ffffff;
	}

	.site-header {
		background-color: rgba(255, 255, 255, 0.92);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(230, 224, 214, 0.85);
		position: sticky;
		top: 0;
		z-index: 50;
		box-shadow: 0 8px 28px -12px rgba(15, 32, 60, 0.08);
	}

	.header-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 78px;
		gap: 1rem;
	}

	.brand-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
	}

	.brand-icon {
		width: 42px;
		height: 42px;
		border-radius: 10px;
		background-color: var(--color-navy);
		color: var(--color-gold);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.brand-text {
		display: flex;
		flex-direction: column;
	}

	.brand-title {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.2rem;
		color: var(--color-navy);
		line-height: 1.15;
	}

	.brand-subtitle {
		font-size: 0.73rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-teal-text);
	}

	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.nav-link {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text);
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm);
	}

	.nav-link:hover {
		color: var(--color-navy);
		background-color: var(--color-parchment);
	}

	.nav-link.active {
		color: var(--color-navy);
		background-color: var(--color-gold-soft);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-cta {
		padding: 0.6rem 1.1rem;
		font-size: 0.88rem;
		min-height: 44px;
	}

	.header-cta.is-active {
		box-shadow: 0 0 0 2px var(--color-navy);
	}

	.skip-to-content {
		position: fixed;
		top: 0.5rem;
		left: 50%;
		z-index: 2000;
		padding: 0.65rem 1rem;
		background: var(--color-gold);
		color: var(--color-navy);
		font-weight: 700;
		font-size: 0.88rem;
		border-radius: var(--radius-sm);
		text-decoration: none;
		transform: translate(-50%, -200%);
		transition: transform 0.18s ease;
		box-shadow: var(--shadow-elevated);
	}

	.skip-to-content:focus-visible {
		transform: translate(-50%, 0);
		outline: 3px solid var(--color-navy);
		outline-offset: 2px;
	}

	.mobile-toggle {
		display: none;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		padding: 0.45rem;
		color: var(--color-navy);
		cursor: pointer;
	}

	.mobile-nav {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		padding: 1rem 0 1.5rem;
	}

	.mobile-nav-inner {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mobile-nav-link {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 0.65rem 0.75rem;
		font-weight: 600;
		color: var(--color-navy);
		border-radius: var(--radius-sm);
	}

	.mobile-nav-link:hover {
		background: var(--color-parchment);
	}

	.mobile-nav-link.active {
		background: var(--color-gold-soft);
		color: var(--color-navy);
	}

	.site-footer {
		background:
			radial-gradient(circle at 88% 12%, rgba(212, 168, 67, 0.12) 0%, transparent 45%),
			radial-gradient(circle at 12% 85%, rgba(15, 164, 175, 0.1) 0%, transparent 42%),
			linear-gradient(180deg, #0b1930 0%, var(--color-navy) 100%);
		color: rgba(255, 255, 255, 0.88);
		padding: 4rem 0 2.25rem;
		border-top: 4px solid var(--color-gold);
	}

	.footer-cta-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		padding: 2rem 2.25rem;
		margin-bottom: 3.25rem;
		border-radius: var(--radius-lg);
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.05) 0%,
			rgba(212, 168, 67, 0.09) 100%
		);
		border: 1px solid rgba(212, 168, 67, 0.32);
		box-shadow: 0 20px 44px -20px rgba(0, 0, 0, 0.45);
	}

	.footer-cta-copy {
		max-width: 640px;
	}

	.footer-stewardship-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.28rem 0.72rem;
		border-radius: 999px;
		background: rgba(212, 168, 67, 0.16);
		border: 1px solid rgba(212, 168, 67, 0.42);
		color: var(--color-gold);
		font-size: 0.73rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		margin-bottom: 0.65rem;
	}

	.footer-cta-title {
		color: #ffffff;
		font-size: clamp(1.25rem, 2vw, 1.55rem);
		line-height: 1.25;
		margin: 0 0 0.45rem;
	}

	.footer-cta-desc {
		margin: 0;
		font-size: 0.93rem;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.82);
	}

	.footer-cta-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.85rem;
		flex-shrink: 0;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.95fr) minmax(0, 0.95fr) minmax(0, 1.25fr);
		gap: 2.5rem;
		align-items: start;
		padding-bottom: 3rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
	}

	.footer-col {
		min-width: 0;
	}

	.footer-brand {
		display: inline-flex;
		align-items: center;
		gap: 0.8rem;
		margin-bottom: 1.05rem;
		text-decoration: none;
	}

	.footer-brand .brand-icon {
		width: 44px;
		height: 44px;
		background-color: rgba(212, 168, 67, 0.16);
		border: 1px solid rgba(212, 168, 67, 0.48);
		box-shadow: 0 8px 18px -6px rgba(0, 0, 0, 0.35);
	}

	.footer-title {
		font-family: var(--font-heading);
		font-size: 1.22rem;
		font-weight: 700;
		color: #ffffff;
		line-height: 1.2;
	}

	.footer-tagline {
		font-size: 0.78rem;
		color: var(--color-gold);
		font-weight: 600;
		margin-top: 0.15rem;
	}

	.footer-desc {
		font-size: 0.91rem;
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.8);
		margin: 0 0 1.15rem;
		max-width: 40ch;
	}

	.footer-geo {
		display: flex;
		align-items: flex-start;
		gap: 0.55rem;
		padding: 0.75rem 0.9rem;
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.11);
		font-size: 0.82rem;
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 600;
		max-width: 40ch;
	}

	.footer-geo-icon {
		color: var(--color-gold);
		flex-shrink: 0;
		display: inline-flex;
		margin-top: 0.1rem;
	}

	.footer-col h3.footer-heading {
		color: #ffffff;
		font-family: var(--font-body);
		font-size: 0.82rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin: 0 0 1.1rem;
		padding-bottom: 0.65rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
		position: relative;
	}

	.footer-col h3.footer-heading::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -1px;
		width: 32px;
		height: 2px;
		background: var(--color-gold);
		border-radius: 2px;
	}

	.footer-links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.footer-links a {
		color: rgba(255, 255, 255, 0.82);
		font-size: 0.91rem;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		min-height: 36px;
		padding: 0.2rem 0;
		text-decoration: none;
		transition:
			color 0.18s ease,
			transform 0.18s ease;
	}

	.footer-links a:hover {
		color: var(--color-gold);
		transform: translateX(3px);
	}

	.footer-rhythm-list {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		margin-bottom: 1.1rem;
	}

	.footer-rhythm-card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.11);
		border-radius: var(--radius-sm);
		padding: 0.75rem 0.9rem;
	}

	.rhythm-kicker {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--color-gold);
		font-size: 0.8rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.footer-rhythm-card p {
		margin: 0;
		font-size: 0.81rem;
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.8);
	}

	.footer-ecosystem {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.ecosystem-label {
		font-size: 0.74rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.68);
	}

	.authority-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.authority-links a {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		min-height: 36px;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		background: rgba(212, 168, 67, 0.1);
		border: 1px solid rgba(212, 168, 67, 0.35);
		color: var(--color-gold);
		font-weight: 700;
		font-size: 0.8rem;
		text-decoration: none;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease,
			color 0.18s ease;
	}

	.authority-links a:hover {
		background: var(--color-gold);
		border-color: var(--color-gold);
		color: var(--color-navy);
	}

	.footer-bottom {
		padding-top: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.84rem;
		color: rgba(255, 255, 255, 0.72);
	}

	.footer-bottom p {
		margin: 0;
	}

	.footer-bottom-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.scripture-footnote {
		color: var(--color-gold);
		font-style: italic;
	}

	.footer-bottom-sep {
		color: rgba(255, 255, 255, 0.35);
	}

	.footer-sitemap-link {
		color: rgba(255, 255, 255, 0.82);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
		min-height: 36px;
		display: inline-flex;
		align-items: center;
	}

	.footer-sitemap-link:hover {
		color: var(--color-gold);
	}

	@media (max-width: 1100px) {
		.desktop-nav {
			display: none;
		}

		.mobile-toggle {
			display: inline-flex;
		}

		.footer-cta-banner {
			flex-direction: column;
			align-items: flex-start;
			padding: 1.75rem;
		}

		.footer-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.brand-col {
			grid-column: 1 / -1;
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 1.25rem 2rem;
			align-items: start;
			padding-bottom: 1.5rem;
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		}

		.brand-col .footer-brand {
			grid-column: 1 / -1;
			margin-bottom: 0;
		}

		.brand-col .footer-desc {
			margin-bottom: 0;
			max-width: none;
		}

		.brand-col .footer-geo {
			max-width: none;
		}
	}

	@media (max-width: 768px) {
		.footer-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 2rem 1.5rem;
		}

		.brand-col {
			grid-template-columns: minmax(0, 1fr);
			gap: 0.9rem;
		}

		.rhythm-col {
			grid-column: 1 / -1;
		}

		.footer-rhythm-list {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.75rem;
		}
	}

	@media (max-width: 640px) {
		.site-footer {
			padding: 3rem 0 2rem;
		}

		.footer-cta-banner {
			padding: 1.35rem 1.25rem;
			margin-bottom: 2.25rem;
		}

		.footer-cta-actions {
			width: 100%;
			flex-direction: column;
			align-items: stretch;
		}

		.footer-cta-actions .btn {
			width: 100%;
		}

		.footer-grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 1.85rem;
		}

		.footer-rhythm-list {
			grid-template-columns: minmax(0, 1fr);
		}

		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
		}

		.header-cta {
			padding: 0.55rem 0.75rem;
			min-width: 44px;
			min-height: 44px;
		}

		.header-cta span {
			display: none;
		}
	}
</style>
