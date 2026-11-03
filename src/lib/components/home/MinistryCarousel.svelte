<script lang="ts">
	import { gsap } from 'gsap';
	import type { Attachment } from 'svelte/attachments';
	import type { Component } from 'svelte';
	import {
		IconChevronLeft,
		IconChevronRight,
		IconPlayerPause,
		IconPlayerPlay,
		type Icon
	} from '@tabler/icons-svelte';

	export interface CarouselSlide {
		readonly url: string;
		readonly alt: string;
		readonly tag?: string;
		readonly aspect?: 'landscape' | 'portrait';
		readonly focus?: string;
	}

	interface Props {
		badgeText: string;
		badgeVariant?: 'teal' | 'emerald';
		BadgeIcon?: Icon;
		title: string;
		subtitle?: string;
		slides: readonly CarouselSlide[];
		autoPlayMs?: number;
	}

	let {
		badgeText,
		badgeVariant = 'teal',
		BadgeIcon,
		title,
		subtitle,
		slides,
		autoPlayMs = 6200
	}: Props = $props();

	let activeIndex = $state(0);
	let direction = $state<1 | -1>(1);
	let isHovered = $state(false);
	let isManuallyPaused = $state(false);
	let pointerStartX = $state<number | null>(null);

	const currentSlide = $derived(slides[activeIndex] ?? slides[0]);
	const isPaused = $derived(isHovered || isManuallyPaused);

	function selectSlide(nextIndex: number, dir?: 1 | -1) {
		if (slides.length <= 1) return;
		const normalized = (nextIndex + slides.length) % slides.length;
		if (normalized === activeIndex) return;
		direction = dir ?? (normalized > activeIndex ? 1 : -1);
		activeIndex = normalized;
	}

	function prevSlide() {
		selectSlide(activeIndex - 1, -1);
	}

	function nextSlide() {
		selectSlide(activeIndex + 1, 1);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prevSlide();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextSlide();
		}
	}

	function handlePointerDown(event: PointerEvent) {
		pointerStartX = event.clientX;
	}

	function handlePointerUp(event: PointerEvent) {
		if (pointerStartX === null) return;
		const deltaX = event.clientX - pointerStartX;
		pointerStartX = null;
		if (Math.abs(deltaX) > 42) {
			if (deltaX < 0) {
				nextSlide();
			} else {
				prevSlide();
			}
		}
	}

	function animateSlide(index: number, dir: 1 | -1): Attachment<HTMLElement> {
		return (node) => {
			if (
				typeof window === 'undefined' ||
				window.matchMedia('(prefers-reduced-motion: reduce)').matches
			) {
				return;
			}

			// Reference index so attachment re-runs whenever activeIndex changes
			void index;

			const fg = node.querySelector<HTMLElement>('[data-stage-fg]');
			const bg = node.querySelector<HTMLElement>('[data-stage-bg]');
			const caption = node.querySelector<HTMLElement>('[data-stage-caption]');

			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

			if (bg) {
				tl.fromTo(
					bg,
					{ autoAlpha: 0.35, scale: 1.18 },
					{ autoAlpha: 1, scale: 1.12, duration: 0.65 },
					0
				);
			}

			if (fg) {
				tl.fromTo(
					fg,
					{ autoAlpha: 0, x: dir * 22, scale: 1.03 },
					{
						autoAlpha: 1,
						x: 0,
						scale: 1,
						duration: 0.54,
						clearProps: 'transform,opacity,visibility'
					},
					0
				);
			}

			if (caption) {
				tl.fromTo(
					caption,
					{ autoAlpha: 0, y: 8 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 0.42,
						clearProps: 'transform,opacity,visibility'
					},
					0.08
				);
			}

			return () => {
				tl.kill();
			};
		};
	}

	function autoPlayCycle(paused: boolean, intervalMs: number): Attachment<HTMLElement> {
		return () => {
			if (
				paused ||
				intervalMs <= 0 ||
				slides.length <= 1 ||
				typeof window === 'undefined' ||
				window.matchMedia('(prefers-reduced-motion: reduce)').matches
			) {
				return;
			}

			const timer = window.setInterval(() => {
				nextSlide();
			}, intervalMs);

			return () => {
				window.clearInterval(timer);
			};
		};
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<article
	class="card carousel-showcase"
	aria-roledescription="carousel"
	aria-label={title}
	tabindex="0"
	onkeydown={handleKeydown}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	onfocusin={() => (isHovered = true)}
	onfocusout={() => (isHovered = false)}
	{@attach autoPlayCycle(isPaused, autoPlayMs)}
>
	<div class="carousel-header">
		<div class="carousel-title-group">
			<span class={badgeVariant === 'emerald' ? 'badge-emerald' : 'badge-teal'}>
				{#if BadgeIcon}
					<BadgeIcon size={14} />
				{/if}
				<span>{badgeText}</span>
			</span>
			<h3>{title}</h3>
			{#if subtitle}
				<p class="carousel-subtitle">{subtitle}</p>
			{/if}
		</div>

		<div class="carousel-controls">
			<button
				type="button"
				class="carousel-icon-btn pause-btn"
				aria-label={isManuallyPaused ? 'Resume slideshow' : 'Pause slideshow'}
				title={isManuallyPaused ? 'Resume slideshow' : 'Pause slideshow'}
				onclick={() => (isManuallyPaused = !isManuallyPaused)}
			>
				{#if isManuallyPaused}
					<IconPlayerPlay size={15} />
				{:else}
					<IconPlayerPause size={15} />
				{/if}
			</button>

			<div class="carousel-nav-pill">
				<button
					type="button"
					class="carousel-icon-btn"
					aria-label="Previous outreach photo"
					onclick={prevSlide}
				>
					<IconChevronLeft size={18} stroke={2.2} />
				</button>
				<span class="carousel-counter" aria-live="polite">
					<strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
					<span class="counter-sep">/</span>
					<span>{String(slides.length).padStart(2, '0')}</span>
				</span>
				<button
					type="button"
					class="carousel-icon-btn"
					aria-label="Next outreach photo"
					onclick={nextSlide}
				>
					<IconChevronRight size={18} stroke={2.2} />
				</button>
			</div>
		</div>
	</div>

	<!-- Dual-Layer Cinema Stage -->
	<div
		role="group"
		aria-roledescription="slide"
		aria-label="Slide {activeIndex + 1} of {slides.length}"
		class={[
			'carousel-stage',
			currentSlide?.aspect === 'portrait' ? 'stage-portrait' : 'stage-landscape'
		]}
		onpointerdown={handlePointerDown}
		onpointerup={handlePointerUp}
		{@attach animateSlide(activeIndex, direction)}
	>
		<!-- Layer 1: Blurred Ambient Color-Matched Backdrop -->
		<img
			src={currentSlide?.url}
			alt=""
			aria-hidden="true"
			loading="lazy"
			decoding="async"
			class="stage-ambient-bg"
			data-stage-bg
		/>
		<div class="stage-vignette" aria-hidden="true"></div>

		<!-- Layer 2: Crisp Foreground Subject Frame -->
		<div class="stage-foreground-wrap" data-stage-fg>
			<img
				src={currentSlide?.url}
				alt={currentSlide?.alt}
				width={currentSlide?.aspect === 'portrait' ? 900 : 1200}
				height={currentSlide?.aspect === 'portrait' ? 1200 : 900}
				loading="lazy"
				decoding="async"
				style:object-position={currentSlide?.focus ?? 'center 22%'}
				class={[
					'stage-main-img',
					currentSlide?.aspect === 'portrait' ? 'img-portrait' : 'img-landscape'
				]}
			/>
		</div>

		<!-- Layer 3: Floating Context Pill & Edge Controls -->
		{#if currentSlide?.tag}
			<div class="stage-top-bar">
				<span class="stage-tag-pill">{currentSlide.tag}</span>
			</div>
		{/if}

		<button
			type="button"
			class="stage-edge-btn prev"
			aria-label="Previous slide"
			onclick={prevSlide}
		>
			<IconChevronLeft size={20} stroke={2.3} />
		</button>
		<button type="button" class="stage-edge-btn next" aria-label="Next slide" onclick={nextSlide}>
			<IconChevronRight size={20} stroke={2.3} />
		</button>

		<div class="stage-caption-bar" data-stage-caption>
			<p class="stage-caption-text">{currentSlide?.alt}</p>
		</div>
	</div>

	<!-- Interactive Thumbnail Filmstrip -->
	<div class="carousel-filmstrip" role="tablist" aria-label="{title} thumbnails">
		{#each slides as slide, idx (slide.url)}
			<button
				type="button"
				role="tab"
				aria-selected={idx === activeIndex}
				aria-label="View photo {idx + 1}: {slide.alt}"
				class={['filmstrip-thumb', { active: idx === activeIndex }]}
				onclick={() => selectSlide(idx)}
			>
				<img
					src={slide.url}
					alt=""
					loading="lazy"
					decoding="async"
					style:object-position={slide.focus ?? 'center 25%'}
				/>
			</button>
		{/each}
	</div>
</article>

<style>
	.carousel-showcase {
		display: flex;
		flex-direction: column;
		padding: 1.65rem;
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-card);
		transition:
			box-shadow 0.28s ease,
			border-color 0.28s ease;
		outline: none;
	}

	.carousel-showcase:hover,
	.carousel-showcase:focus-visible {
		box-shadow: var(--shadow-elevated);
		border-color: rgba(212, 168, 67, 0.55);
	}

	.carousel-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.15rem;
		flex-wrap: wrap;
	}

	.carousel-title-group h3 {
		font-size: 1.28rem;
		margin: 0.45rem 0 0;
		color: var(--color-navy);
		line-height: 1.25;
	}

	.carousel-subtitle {
		margin: 0.25rem 0 0;
		font-size: 0.86rem;
		color: var(--color-text-muted);
	}

	.carousel-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.carousel-nav-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		background: var(--color-parchment);
		border: 1px solid var(--color-border);
		border-radius: 999px;
		padding: 0.2rem;
	}

	.carousel-icon-btn {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: none;
		background: transparent;
		color: var(--color-navy);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background-color 0.18s ease,
			color 0.18s ease,
			transform 0.18s ease;
	}

	.carousel-icon-btn.pause-btn {
		border: 1px solid var(--color-border);
		background: var(--color-parchment);
	}

	.carousel-icon-btn:hover {
		background: var(--color-gold);
		color: var(--color-navy);
		transform: scale(1.04);
	}

	.carousel-counter {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--color-text-muted);
		padding: 0 0.45rem;
		min-width: 54px;
		text-align: center;
		user-select: none;
	}

	.carousel-counter strong {
		color: var(--color-navy);
		font-weight: 700;
	}

	.counter-sep {
		margin: 0 0.12rem;
		opacity: 0.55;
	}

	/* Dual-Layer Cinema Stage */
	.carousel-stage {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: #091529;
		border: 1px solid rgba(15, 32, 60, 0.14);
		user-select: none;
		touch-action: pan-y;
	}

	.stage-ambient-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(26px) saturate(1.35) brightness(0.48);
		transform: scale(1.14);
		pointer-events: none;
	}

	.stage-vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at center,
			rgba(9, 21, 41, 0.08) 0%,
			rgba(9, 21, 41, 0.52) 100%
		);
		pointer-events: none;
	}

	.stage-foreground-wrap {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stage-main-img.img-landscape {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.stage-main-img.img-portrait {
		width: auto;
		height: 100%;
		max-width: 100%;
		object-fit: contain;
		display: block;
		border-left: 1px solid rgba(255, 255, 255, 0.18);
		border-right: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: 0 18px 42px rgba(0, 0, 0, 0.55);
	}

	.stage-top-bar {
		position: absolute;
		top: 0.85rem;
		left: 0.85rem;
		right: 0.85rem;
		z-index: 4;
		display: flex;
		align-items: center;
		justify-content: space-between;
		pointer-events: none;
	}

	.stage-tag-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.32rem 0.78rem;
		border-radius: 999px;
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		background: rgba(9, 21, 41, 0.82);
		color: var(--color-gold);
		border: 1px solid rgba(212, 168, 67, 0.45);
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}

	.stage-edge-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 4;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background: rgba(9, 21, 41, 0.68);
		color: #ffffff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		backdrop-filter: blur(6px);
		transition:
			opacity 0.2s ease,
			background-color 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease;
	}

	.stage-edge-btn.prev {
		left: 0.75rem;
	}

	.stage-edge-btn.next {
		right: 0.75rem;
	}

	.carousel-stage:hover .stage-edge-btn,
	.carousel-showcase:focus-within .stage-edge-btn {
		opacity: 1;
	}

	.stage-edge-btn:hover {
		background: var(--color-gold);
		border-color: var(--color-gold);
		color: var(--color-navy);
		transform: translateY(-50%) scale(1.06);
	}

	.stage-caption-bar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3;
		padding: 1.85rem 1rem 0.8rem;
		background: linear-gradient(
			180deg,
			rgba(9, 21, 41, 0) 0%,
			rgba(9, 21, 41, 0.78) 48%,
			rgba(9, 21, 41, 0.94) 100%
		);
		pointer-events: none;
	}

	.stage-caption-text {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.95);
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	/* Filmstrip Thumbnails */
	.carousel-filmstrip {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.9rem;
		overflow-x: auto;
		padding-bottom: 0.2rem;
		scrollbar-width: thin;
	}

	.filmstrip-thumb {
		position: relative;
		width: 56px;
		height: 42px;
		border-radius: 7px;
		overflow: hidden;
		padding: 0;
		border: 2px solid transparent;
		background: var(--color-navy);
		cursor: pointer;
		flex-shrink: 0;
		opacity: 0.62;
		transition:
			opacity 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;
	}

	.filmstrip-thumb:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.filmstrip-thumb.active {
		opacity: 1;
		border-color: var(--color-gold);
		box-shadow: 0 0 0 2px rgba(212, 168, 67, 0.28);
	}

	.filmstrip-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 640px) {
		.carousel-showcase {
			padding: 1.15rem;
		}

		.stage-edge-btn {
			opacity: 1;
			width: 34px;
			height: 34px;
		}
	}
</style>
