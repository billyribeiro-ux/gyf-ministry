<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import { SvelteSet } from 'svelte/reactivity';
	import { siteConfig } from '#lib/config/site.js';
	import {
		IconArrowUpRight,
		IconChevronDown,
		IconCross,
		IconMenu2,
		IconX
	} from '@tabler/icons-svelte';

	let { currentPath }: { currentPath: string } = $props();

	const ministryLinks = [
		{
			href: '/programs/friday-ministry',
			label: 'Friday Ministry',
			summary: 'Prayer and one-on-one mentorship'
		},
		{
			href: '/programs/holiday-outreach',
			label: 'Holiday Outreach',
			summary: 'Hot meals and winter coats'
		},
		{
			href: '/restore-your-purpose',
			label: 'Restore Your Purpose',
			summary: 'The Mustard Seed Framework'
		}
	] as const;
	const exploreLinks = [
		{ href: '/about', label: 'About' },
		{ href: '/resources', label: 'Resources' },
		{ href: '/blog', label: 'Blog' }
	] as const;

	const menus = new SvelteSet<HTMLDetailsElement>();
	const registerMenu: Attachment<HTMLDetailsElement> = (menu) => {
		menus.add(menu);
		return () => {
			menus.delete(menu);
		};
	};

	const syncHeaderHeight: Attachment<HTMLElement> = (header) => {
		if (typeof ResizeObserver === 'undefined') return;
		const rootStyle = document.documentElement.style;
		const observer = new ResizeObserver(() => {
			rootStyle.setProperty('--site-header-height', `${header.offsetHeight}px`);
		});
		observer.observe(header);
		return () => {
			observer.disconnect();
			rootStyle.removeProperty('--site-header-height');
		};
	};

	function closeMenusOutside(target: EventTarget | null) {
		if (!(target instanceof Node)) return;
		for (const menu of menus) {
			if (menu.open && !menu.contains(target)) menu.open = false;
		}
	}

	function closeMenusWithEscape(event: KeyboardEvent) {
		if (event.key !== 'Escape' || event.defaultPrevented) return;
		for (const menu of menus) {
			if (!menu.open || !menu.getClientRects().length) continue;
			menu.open = false;
			menu.querySelector('summary')?.focus();
			event.preventDefault();
		}
	}

	function isWithin(href: string): boolean {
		return currentPath === href || currentPath.startsWith(`${href}/`);
	}

	afterNavigate(() => {
		for (const menu of menus) menu.open = false;
	});
</script>

<svelte:window
	onpointerdown={(event) => closeMenusOutside(event.target)}
	onfocusin={(event) => closeMenusOutside(event.target)}
	onkeydown={closeMenusWithEscape}
/>

<aside class="announcement-bar" aria-label="Holiday outreach">
	<div class="container announcement-inner">
		<p>
			Holiday outreach<span class="announcement-dates">
				· {siteConfig.seasonalCampaign.window}</span
			>
		</p>
		<a href={resolve('/programs/holiday-outreach#sponsor')}>
			Sponsor a child <IconArrowUpRight size={15} aria-hidden="true" />
		</a>
	</div>
</aside>

<header class="site-header" {@attach syncHeaderHeight}>
	<div class="container header-inner">
		<a href={resolve('/')} class="brand" aria-label="{siteConfig.name} home">
			<span class="brand-icon" aria-hidden="true"><IconCross size={21} stroke={1.65} /></span>
			<span class="brand-type">
				<span class="brand-title">Grow Your Faith</span>
				<span class="brand-subtitle">Ministries</span>
			</span>
		</a>

		<nav class="desktop-nav" aria-label="Main navigation">
			<a
				class="nav-label"
				href={resolve('/about')}
				aria-current={currentPath === '/about' ? 'page' : undefined}>About</a
			>
			<details class="ministry-menu" {@attach registerMenu}>
				<summary
					class={['nav-label', { current: ministryLinks.some(({ href }) => isWithin(href)) }]}
				>
					Ministry <IconChevronDown class="menu-chevron" size={15} aria-hidden="true" />
				</summary>
				<ul class="ministry-panel">
					{#each ministryLinks as link (link.href)}
						<li>
							<a
								href={resolve(link.href)}
								aria-current={currentPath === link.href ? 'page' : undefined}
							>
								<span>{link.label}</span>
								<small>{link.summary}</small>
							</a>
						</li>
					{/each}
				</ul>
			</details>
			<a
				class="nav-label"
				href={resolve('/resources')}
				aria-current={currentPath === '/resources' ? 'page' : undefined}>Resources</a
			>
			<a
				class={['nav-label', { current: isWithin('/blog') }]}
				href={resolve('/blog')}
				aria-current={currentPath === '/blog' ? 'page' : undefined}>Blog</a
			>
		</nav>

		<div class="header-actions">
			<a
				class="prayer-link nav-label"
				href={resolve('/prayer-and-support')}
				aria-current={currentPath === '/prayer-and-support' ? 'page' : undefined}>Request prayer</a
			>
			<a
				class="give-link"
				href={resolve('/partner')}
				aria-current={currentPath === '/partner' ? 'page' : undefined}
			>
				Give <IconArrowUpRight size={15} aria-hidden="true" />
			</a>
			<details class="mobile-menu" {@attach registerMenu}>
				<summary class="mobile-toggle" aria-label="Main menu">
					<span class="menu-icon" aria-hidden="true"><IconMenu2 size={23} /></span>
					<span class="close-icon" aria-hidden="true"><IconX size={23} /></span>
				</summary>
				<nav class="mobile-panel" aria-label="Mobile navigation">
					<div class="container mobile-menu-inner">
						<ul class="mobile-links">
							{#each ministryLinks as link (link.href)}
								<li>
									<a
										href={resolve(link.href)}
										aria-current={currentPath === link.href ? 'page' : undefined}>{link.label}</a
									>
								</li>
							{/each}
						</ul>
						<ul class="mobile-links">
							{#each exploreLinks as link (link.href)}
								<li>
									<a
										href={resolve(link.href)}
										class={{ current: isWithin(link.href) }}
										aria-current={currentPath === link.href ? 'page' : undefined}>{link.label}</a
									>
								</li>
							{/each}
						</ul>
						<a
							class="mobile-prayer"
							href={resolve('/prayer-and-support')}
							aria-current={currentPath === '/prayer-and-support' ? 'page' : undefined}
						>
							Request prayer or support <IconArrowUpRight size={17} aria-hidden="true" />
						</a>
					</div>
				</nav>
			</details>
		</div>
	</div>
</header>

<style>
	.announcement-bar {
		background: var(--color-panel, #1a1d25);
		border-bottom: 1px solid var(--color-line, #343946);
		color: var(--color-strong, #f5f7fb);
	}

	.announcement-inner {
		min-height: 2.65rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		column-gap: 1rem;
		font-size: 0.84rem;
		line-height: 1.3;
	}

	.announcement-inner p {
		margin: 0;
	}

	.announcement-dates {
		margin-inline-start: 0.32em;
		color: var(--color-soft, #b6bed0);
	}

	.announcement-inner a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		min-height: 2.65rem;
		color: var(--color-accent, #adc8ff);
		font-weight: 650;
		text-decoration: underline;
		text-underline-offset: 0.22em;
	}

	.announcement-inner a:hover {
		color: var(--color-strong, #f5f7fb);
	}

	.site-header {
		background: var(--color-screen, #101116);
		color: var(--color-strong, #f5f7fb);
		border-bottom: 1px solid var(--color-line, #343946);
		position: sticky;
		top: 0;
		z-index: 50;
	}

	:is(.site-header, .announcement-bar) :focus-visible {
		outline-color: var(--color-accent, #adc8ff);
	}

	.desktop-nav,
	.header-actions {
		display: flex;
		align-items: center;
	}

	.header-inner {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: clamp(0.65rem, 2vw, 1.75rem);
		min-height: var(--nav-height);
		padding-block: 0.5rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		color: var(--color-strong, #f5f7fb);
		min-width: 0;
		justify-self: start;
	}

	.brand:hover {
		color: var(--color-accent, #adc8ff);
	}

	.brand-icon {
		display: grid;
		place-items: center;
		width: 2.65rem;
		height: 2.65rem;
		flex: none;
		border: 1px solid var(--color-line, #343946);
		background: var(--color-panel, #1a1d25);
		color: var(--color-accent, #adc8ff);
		border-radius: var(--radius-sm);
	}

	.brand-type {
		display: grid;
		gap: 0.15rem;
	}
	.brand-title {
		font-family: var(--font-heading);
		font-size: 1.12rem;
		font-weight: 720;
		line-height: 1.12;
		letter-spacing: -0.035em;
	}

	.brand-subtitle {
		color: var(--color-soft, #b6bed0);
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		line-height: 1.2;
		text-transform: uppercase;
	}

	.desktop-nav {
		justify-content: center;
		flex-wrap: wrap;
		gap: 0 clamp(0.6rem, 1.8vw, 1.6rem);
	}

	.header-actions {
		justify-content: flex-end;
		justify-self: end;
		gap: clamp(0.45rem, 1.5vw, 1rem);
	}

	.nav-label,
	.give-link,
	.mobile-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.3rem;
		min-height: 2.75rem;
		color: var(--color-strong, #f5f7fb);
		font-size: 1rem;
		font-weight: 670;
		line-height: 1.2;
	}

	.nav-label {
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 0.35em;
		transition:
			color 160ms ease,
			text-decoration-color 160ms ease;
	}

	.nav-label:is(:hover, :focus-visible, [aria-current], .current),
	.ministry-menu[open] > .nav-label {
		text-decoration-color: var(--color-accent, #adc8ff);
		color: var(--color-accent, #adc8ff);
	}

	summary {
		list-style: none;
		cursor: pointer;
	}
	summary::-webkit-details-marker {
		display: none;
	}

	.ministry-menu {
		position: relative;
	}
	.ministry-menu :global(.menu-chevron) {
		transition: transform 180ms var(--ease-out);
	}
	.ministry-menu[open] :global(.menu-chevron) {
		transform: rotate(180deg);
	}

	.ministry-panel {
		position: absolute;
		inset-block-start: calc(100% + 0.5rem);
		inset-inline-start: -1rem;
		width: min(20rem, 75vw);
		margin: 0;
		padding: 0.4rem 1rem;
		border: 1px solid var(--color-line, #343946);
		border-top: 2px solid var(--color-accent, #adc8ff);
		background: var(--color-panel, #1a1d25);
		list-style: none;
		box-shadow: 0 16px 30px -22px rgb(0 0 0 / 62%);
	}

	.ministry-panel li + li {
		border-top: 1px solid var(--color-line, #343946);
	}
	.ministry-panel a {
		display: grid;
		gap: 0.15rem;
		padding: 0.8rem 0.2rem;
		line-height: 1.25;
		color: var(--color-strong, #f5f7fb);
		font-size: 1.05rem;
		font-weight: 670;
	}

	.ministry-panel a:is(:hover, [aria-current]) {
		color: var(--color-accent, #adc8ff);
	}
	.ministry-panel small {
		color: var(--color-soft, #b6bed0);
		font-size: 0.88rem;
		font-weight: 450;
	}

	.give-link {
		background: var(--color-accent, #adc8ff);
		border: 1px solid var(--color-accent, #adc8ff);
		color: var(--color-on-accent, #101b31);
		border-radius: var(--radius-sm);
		padding-inline: 0.95rem;
	}

	.give-link:is(:hover, [aria-current]) {
		background: var(--color-strong, #f5f7fb);
		border-color: var(--color-strong, #f5f7fb);
		color: var(--color-on-accent, #101b31);
	}

	.mobile-menu {
		display: none;
	}
	.mobile-toggle {
		width: 2.75rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-line, #343946);
	}

	.mobile-toggle:hover {
		background: var(--color-panel, #1a1d25);
	}
	.mobile-toggle > span {
		display: grid;
		place-items: center;
	}
	.mobile-menu .close-icon,
	.mobile-menu[open] .menu-icon {
		display: none;
	}
	.mobile-menu[open] .close-icon {
		display: grid;
	}

	.mobile-panel {
		position: absolute;
		inset: 100% 0 auto;
		max-height: calc(100vh - var(--site-header-height, var(--nav-height)) - 4rem);
		max-height: calc(100dvh - var(--site-header-height, var(--nav-height)) - 4rem);
		overflow-y: auto;
		overscroll-behavior: contain;
		border-block: 1px solid var(--color-line, #343946);
		background: var(--color-panel, #1a1d25);
		box-shadow: 0 18px 28px -21px rgb(0 0 0 / 60%);
	}

	.mobile-menu-inner {
		display: grid;
		padding-block: 0.7rem 1.25rem;
	}
	.mobile-links {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.mobile-links a,
	.mobile-prayer {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2.8rem;
		color: var(--color-strong, #f5f7fb);
		font-weight: 650;
		line-height: 1.25;
		padding-block: 0.5rem;
	}

	.mobile-links a {
		border-bottom: 1px solid var(--color-line, #343946);
	}
	.mobile-links a:is(:hover, :focus-visible, [aria-current], .current),
	.mobile-prayer:is(:hover, :focus-visible, [aria-current]) {
		color: var(--color-accent, #adc8ff);
	}
	.mobile-prayer {
		margin-top: 0.65rem;
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}

	@media (prefers-reduced-motion: no-preference) {
		:is(.announcement-inner a, .give-link, .mobile-prayer) :global(svg) {
			transition: translate 170ms var(--ease-out);
		}

		:is(.announcement-inner a, .give-link, .mobile-prayer):is(:hover, :focus-visible) :global(svg) {
			translate: 2px -2px;
		}

		.ministry-menu[open] .ministry-panel,
		.mobile-menu[open] .mobile-panel {
			animation: menu-enter 240ms var(--ease-out) both;
		}
	}

	@keyframes menu-enter {
		from {
			opacity: 0.88;
			transform: translateY(-0.45rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 59.99rem) {
		.header-inner {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}

		.brand {
			flex: 1 1 min(8.75rem, 100%);
		}

		.header-actions {
			flex: none;
			margin-inline-start: auto;
		}

		.desktop-nav,
		.prayer-link {
			display: none;
		}
		.mobile-menu {
			display: block;
		}
	}

	@media (min-width: 32rem) and (max-width: 59.99rem) {
		.mobile-menu-inner {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 2rem;
		}
		.mobile-prayer {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 32rem) {
		.announcement-dates {
			display: none;
		}
		.brand-title {
			font-size: clamp(0.98rem, 4.85vw, 1.12rem);
		}
		.brand-icon {
			width: 2.25rem;
			height: 2.25rem;
		}
		.give-link {
			padding-inline: 0.68rem;
		}
	}
</style>
