<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { deLocalizeUrl, locales, localizeHref } from '#lib/paraglide/runtime.js';
	import favicon from '#lib/assets/ministry-mark.png';
	import Toast from '#lib/components/Toast.svelte';
	import SiteHeader from '#lib/components/site/SiteHeader.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { siteConfig, getCanonicalUrl } from '#lib/config/site.js';
	import { generateRootOrganizationSchema } from '#lib/seo/schema.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const currentPath = $derived(page.url.pathname);
	const unlocalizedPath = $derived(deLocalizeUrl(page.url).pathname);
	const isAdminArea = $derived(
		unlocalizedPath === '/admin' || unlocalizedPath.startsWith('/admin/')
	);
	const hasBlogMetaTags = $derived(Boolean(page.data.pageMetaTags));
	const canonicalUrl = $derived(getCanonicalUrl(currentPath));
	const schemaJson = $derived(
		`<script type="application/ld+json">${JSON.stringify(generateRootOrganizationSchema())}<` +
			`/script>`
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if !isAdminArea}
		<meta name="theme-color" content="#101116" />
	{/if}
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
	<a href="#main-content" class="skip-to-content">Skip to main content</a>
	<div class="site-shell">
		<SiteHeader currentPath={unlocalizedPath} />

		<main id="main-content" tabindex="-1">
			{@render children()}
		</main>

		<SiteFooter />

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

	:global(html:has(.site-shell)) {
		scroll-padding-top: calc(var(--site-header-height, var(--nav-height)) + 0.65rem);
	}

	.skip-to-content {
		position: fixed;
		z-index: 1000;
		inset-block-start: 1rem;
		inset-inline-start: 1rem;
		transform: translateY(calc(-100% - 1rem));
		padding: 0.7rem 1rem;
		background: var(--color-accent, #adc8ff);
		color: var(--color-on-accent, #101b31);
		font-weight: 700;
	}

	.skip-to-content:focus {
		transform: none;
	}
</style>
