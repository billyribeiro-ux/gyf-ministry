<script lang="ts">
	import { asset } from '$app/paths';
	import type { AssetPath } from '$app/types';
	import { cinematicPhotoReveal, gsapHeroEntrance } from '#lib/attachments/gsap.js';
	import { IconArrowDown, IconArrowRight } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';
	import './ministry.css';

	let {
		label,
		title,
		children,
		photo,
		actions = []
	}: {
		label: string;
		title: string;
		children: Snippet;
		photo?: {
			src: AssetPath;
			alt: string;
			width: number;
			height: number;
			small?: { src: AssetPath; width: number };
			caption?: string;
			focus?: string;
		};
		actions?: { href: string; label: string }[];
	} = $props();
</script>

<header class="ministry-masthead" class:with-photo={photo} {@attach gsapHeroEntrance}>
	<div class="container masthead-inner">
		<div class="masthead-copy">
			<p class="masthead-label" data-hero-item>{label}</p>
			<h1 data-hero-item>{title}</h1>
			<div class="masthead-lead" data-hero-item>{@render children()}</div>
			{#if actions.length}
				<div class="masthead-actions" data-hero-item>
					{#each actions as action, index (action.href)}
						<!-- oxlint-disable-next-line svelte/no-navigation-without-resolve -- URLs are resolved by the caller -->
						<a
							href={action.href}
							class={index === 0 ? 'btn ministry-primary' : 'masthead-text-link'}
						>
							<span>{action.label}</span>
							{#if action.href.startsWith('#')}
								<IconArrowDown size={17} aria-hidden="true" />
							{:else}
								<IconArrowRight size={17} aria-hidden="true" />
							{/if}
						</a>
					{/each}
				</div>
			{/if}
		</div>

		{#if photo}
			<figure>
				<div class="photo" {@attach cinematicPhotoReveal}>
					<img
						src={asset(photo.src)}
						srcset={photo.small
							? `${asset(photo.small.src)} ${photo.small.width}w, ${asset(photo.src)} ${photo.width}w`
							: undefined}
						sizes={photo.small
							? '(max-width: 640px) calc(100vw - 2.3rem), (max-width: 780px) calc(100vw - 3rem), (max-width: 1240px) 53vw, 650px'
							: undefined}
						alt={photo.alt}
						width={photo.width}
						height={photo.height}
						style:object-position={photo.focus}
						decoding="async"
						fetchpriority="high"
						data-cinematic-image
					/>
				</div>
				{#if photo.caption}
					<figcaption>{photo.caption}</figcaption>
				{/if}
			</figure>
		{/if}
	</div>
</header>

<style>
	.ministry-masthead {
		background:
			radial-gradient(ellipse at 78% -35%, #232d47 0, transparent 58%), var(--color-screen, #101116);
		border-block-end: 1px solid var(--color-line, #343946);
		padding-block: clamp(3rem, 6.3vw, 5.5rem);
	}

	.masthead-inner {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: end;
		gap: clamp(2rem, 4vw, 4rem);
	}

	.with-photo .masthead-inner {
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
	}

	.with-photo .masthead-copy {
		padding-block-end: clamp(0rem, 3vw, 3rem);
	}

	.masthead-label {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		color: var(--color-accent, #adc8ff);
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.17em;
		line-height: 1.45;
		margin-bottom: clamp(1rem, 3vw, 1.95rem);
		text-transform: uppercase;
	}

	.masthead-label::before {
		content: '';
		width: 1.25rem;
		height: 1px;
		background: currentColor;
		flex: 0 0 auto;
	}

	h1 {
		max-width: 18ch;
		margin: 0;
		font-family: var(--font-heading);
		color: var(--color-strong, #f5f7fb);
		font-size: clamp(2.85rem, 6.3vw, 6.4rem);
		font-weight: 660;
		letter-spacing: -0.064em;
		line-height: 0.95;
		text-wrap: balance;
	}

	.with-photo h1 {
		font-size: clamp(2.65rem, 5.4vw, 5.3rem);
	}

	.masthead-lead {
		margin-top: clamp(1.15rem, 2.6vw, 1.9rem);
		max-width: 52ch;
		color: var(--color-soft, #b6bed0);
		font-size: clamp(1.05rem, 1.75vw, 1.27rem);
		line-height: 1.5;
		text-wrap: pretty;
	}

	.masthead-lead :global(:last-child) {
		margin-bottom: 0;
	}

	.masthead-actions {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 0.55rem 1.4rem;
		margin-top: clamp(1.4rem, 2.6vw, 2rem);
	}

	.masthead-actions :global(svg) {
		flex: 0 0 auto;
	}

	.masthead-text-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 3rem;
		color: var(--color-strong, #f5f7fb);
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 0.23em;
		text-decoration-color: var(--color-accent, #adc8ff);
	}

	.masthead-text-link:hover {
		color: var(--color-accent, #adc8ff);
		text-decoration-color: currentColor;
	}

	figure {
		min-width: 0;
		margin: 0;
	}

	.photo {
		position: relative;
		overflow: hidden;
		aspect-ratio: var(--photo-aspect, 4 / 3);
		background: var(--color-panel, #1a1d25);
		box-shadow: 0 22px 65px -37px #000;
	}

	.photo::after {
		position: absolute;
		inset: 0;
		border: 1px solid rgb(244 247 255 / 15%);
		content: '';
		pointer-events: none;
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	figcaption {
		margin-top: 0.75rem;
		color: var(--color-soft, #b6bed0);
		font-size: 0.82rem;
		line-height: 1.4;
	}

	@media (max-width: 780px) {
		.with-photo .masthead-inner {
			grid-template-columns: minmax(0, 1fr);
		}

		.with-photo .masthead-copy {
			padding-block-end: 0;
		}
	}
</style>
