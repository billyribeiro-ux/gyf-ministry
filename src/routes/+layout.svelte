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
		IconSoup,
		IconJacket,
		IconHeartHandshake,
		IconPray,
		IconSeedling,
		IconMapPin,
		IconArrowRight,
		IconMenu2,
		IconX,
		IconBuildingChurch,
		IconSparkles
	} from '@tabler/icons-svelte';

	let { children }: LayoutProps = $props();
	let mobileMenuOpen = $state(false);

	const currentPath = $derived(page.url.pathname);
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

{#if !isAdminArea && hasBlogMetaTags && page.data.pageMetaTags}
	<MetaTags {...page.data.pageMetaTags} />
{/if}

{#if isAdminArea}
	{@render children()}
{:else}
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
						<a
							href={resolve(link.href)}
							class={[
								'nav-link',
								{
									active:
										currentPath === link.href ||
										(link.href !== '/' && currentPath.startsWith(link.href))
								}
							]}
						>
							{link.label}
						</a>
					{/each}
				</nav>

				<div class="header-actions">
					<a href={resolve('/partner')} class="btn btn-gold header-cta">
						<IconHeartHandshake size={18} />
						<span>Partner &amp; Donate</span>
					</a>
					<button
						type="button"
						class="mobile-toggle"
						aria-expanded={mobileMenuOpen}
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
				<nav class="mobile-nav" aria-label="Mobile Navigation">
					<div class="container mobile-nav-inner">
						{#each navLinks as link (link.href)}
							<a
								href={resolve(link.href)}
								class="mobile-nav-link"
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
			<div class="container footer-grid">
				<div class="footer-col brand-col">
					<div class="footer-brand">
						<span class="brand-icon" aria-hidden="true">
							<IconCross size={24} stroke={2.2} />
						</span>
						<div>
							<div class="footer-title">{siteConfig.name}</div>
							<div class="footer-tagline">{siteConfig.slogan}</div>
						</div>
					</div>
					<p class="footer-desc">
						Founded by {siteConfig.founder.name} in {siteConfig.foundingYear} to restore shattered dreams,
						reawaken God-given purpose through weekly Friday ministry, and serve Connecticut families
						from Thanksgiving through January 4.
					</p>
					<div class="footer-geo">
						<IconMapPin size={18} />
						<span>Serving Wolcott, Waterbury, New Haven &amp; Hartford Counties, Connecticut</span>
					</div>
				</div>

				<div class="footer-col">
					<h4>Core Pillars &amp; Programs</h4>
					<ul class="footer-links">
						<li>
							<a href={resolve('/programs/friday-ministry')}>
								<IconSeedling size={16} /> Weekly Friday Ministry
							</a>
						</li>
						<li>
							<a href={resolve('/programs/holiday-outreach')}>
								<IconSoup size={16} /> Thanksgiving &amp; Christmas Meals
							</a>
						</li>
						<li>
							<a href={resolve('/programs/holiday-outreach')}>
								<IconJacket size={16} /> Children’s Winter Coat Drive
							</a>
						</li>
						<li>
							<a href={resolve('/restore-your-purpose')}>
								<IconSparkles size={16} /> Purpose &amp; Vision Restoration
							</a>
						</li>
						<li>
							<a href={resolve('/prayer-and-support')}>
								<IconPray size={16} /> Submit a Prayer or Assistance Request
							</a>
						</li>
					</ul>
				</div>

				<div class="footer-col">
					<h4>Ministry Architecture</h4>
					<ul class="footer-links">
						<li><a href={resolve('/')}>Home Hub</a></li>
						<li><a href={resolve('/about')}>About Courtney Ribeiro</a></li>
						<li><a href={resolve('/partner')}>Partner &amp; Sponsor Outreach</a></li>
						<li><a href={resolve('/resources')}>Mustard Seed Devotionals &amp; Blog</a></li>
						<li><a href={resolve('/sitemap.xml')}>XML Sitemap</a></li>
					</ul>
				</div>

				<div class="footer-col">
					<h4>Philanthropy &amp; Authority Bridge</h4>
					<div class="authority-card">
						<div class="authority-header">
							<IconBuildingChurch size={18} />
							<span>Underwritten Stewardship</span>
						</div>
						<p>
							Proudly underwritten by <strong>{siteConfig.founder.parentOrgName}</strong> and executive
							coaching partners since 2014. 100% of public outreach gifts go directly to hot holiday meals
							and children’s winter warmth kits.
						</p>
						<div class="authority-links">
							<a href={siteConfig.founder.parentOrgUrl} rel="noopener noreferrer" target="_blank">
								MWC Digital Agency ↗
							</a>
							<a href={siteConfig.founder.coachingUrl} rel="noopener noreferrer" target="_blank">
								Marketing With Courtney ↗
							</a>
						</div>
					</div>
				</div>
			</div>

			<div class="container footer-bottom">
				<p>
					© {new Date().getFullYear()}
					{siteConfig.name} ({siteConfig.domain}). All rights reserved. Founded by {siteConfig
						.founder.name}.
				</p>
				<p class="scripture-footnote">
					“Faith the size of a mustard seed moves mountains.” — Matthew 17:20
				</p>
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
		color: var(--color-teal);
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
	}

	.mobile-toggle {
		display: none;
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
		padding: 0.65rem 0.75rem;
		font-weight: 600;
		color: var(--color-navy);
		border-radius: var(--radius-sm);
	}

	.mobile-nav-link:hover {
		background: var(--color-parchment);
	}

	.site-footer {
		background-color: var(--color-navy);
		color: rgba(255, 255, 255, 0.86);
		padding: 4.5rem 0 2rem;
		border-top: 4px solid var(--color-gold);
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr 0.9fr 1.3fr;
		gap: 2.5rem;
		padding-bottom: 3rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
	}

	.footer-brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.footer-brand .brand-icon {
		background-color: rgba(212, 168, 67, 0.18);
		border: 1px solid rgba(212, 168, 67, 0.45);
	}

	.footer-title {
		font-family: var(--font-heading);
		font-size: 1.25rem;
		font-weight: 700;
		color: #ffffff;
	}

	.footer-tagline {
		font-size: 0.8rem;
		color: var(--color-gold);
		font-style: italic;
	}

	.footer-desc {
		font-size: 0.92rem;
		color: rgba(255, 255, 255, 0.78);
		margin-bottom: 1rem;
	}

	.footer-geo {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 0.84rem;
		color: var(--color-gold);
		font-weight: 600;
	}

	.footer-col h4 {
		color: #ffffff;
		font-size: 1.05rem;
		margin-bottom: 1.1rem;
	}

	.footer-links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.footer-links a {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.92rem;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	.footer-links a:hover {
		color: var(--color-gold);
	}

	.authority-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: var(--radius-md);
		padding: 1.25rem;
		font-size: 0.88rem;
	}

	.authority-header {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--color-gold);
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.authority-card p {
		color: rgba(255, 255, 255, 0.82);
		margin-bottom: 0.85rem;
	}

	.authority-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.85rem;
	}

	.authority-links a {
		color: var(--color-gold);
		font-weight: 700;
		font-size: 0.84rem;
	}

	.footer-bottom {
		padding-top: 1.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.68);
	}

	.footer-bottom p {
		margin: 0;
	}

	.scripture-footnote {
		color: var(--color-gold);
		font-style: italic;
	}

	@media (max-width: 1100px) {
		.desktop-nav {
			display: none;
		}

		.mobile-toggle {
			display: inline-flex;
		}

		.footer-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 640px) {
		.footer-grid {
			grid-template-columns: 1fr;
		}

		.header-cta span {
			display: none;
		}
	}
</style>
