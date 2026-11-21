<script lang="ts">
	import { gsap } from 'gsap';
	import { cinematicPhotoReveal } from '#lib/attachments/gsap.js';
	import type { Attachment } from 'svelte/attachments';
	import {
		IconArrowsMaximize,
		IconChevronLeft,
		IconChevronRight,
		IconPlayerPause,
		IconPlayerPlay,
		IconX,
		type Icon
	} from '@tabler/icons-svelte';

	export interface CarouselSlide {
		readonly url: string;
		readonly alt: string;
		readonly tag?: string;
		readonly aspect?: 'landscape' | 'portrait';
		readonly focus?: string;
		readonly legacyUrl?: string;
	}

	interface Props {
		badgeText?: string;
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

	const uid = $props.id();

	let activeIndex = $state(0);
	let previousSlide = $state<CarouselSlide | null>(null);
	let transitionKey = $state(0);
	let direction = $state<1 | -1>(1);

	let isHovered = $state(false);
	let isFocusedWithin = $state(false);
	let isManuallyPaused = $state(false);
	let isDragging = $state(false);
	let isLightboxOpen = $state(false);
	let isDocumentHidden = $state(false);
	let isInViewport = $state(true);
	let reducedMotion = $state(false);

	let dragOffsetX = $state(0);
	let progressFillEl: HTMLElement | null = null;
	let elapsedRatio = 0;

	interface PointerSession {
		id: number;
		startX: number;
		startY: number;
		startTime: number;
	}

	let pointerSession: PointerSession | null = null;

	const currentSlide = $derived(slides[activeIndex] ?? slides[0]);
	const canAutoPlay = $derived(autoPlayMs > 0 && slides.length > 1 && !reducedMotion);
	const isPaused = $derived(
		!canAutoPlay ||
			isHovered ||
			isFocusedWithin ||
			isManuallyPaused ||
			isDragging ||
			isLightboxOpen ||
			isDocumentHidden ||
			!isInViewport
	);

	function setProgressVisual(ratio: number) {
		elapsedRatio = Math.max(0, Math.min(1, ratio));
		if (progressFillEl) {
			progressFillEl.style.transform = `scaleX(${elapsedRatio})`;
		}
	}

	function selectSlide(nextIndex: number, dir?: 1 | -1) {
		if (slides.length <= 1) return;
		const normalized = ((nextIndex % slides.length) + slides.length) % slides.length;
		if (normalized === activeIndex) return;
		previousSlide ??= currentSlide ?? null;
		direction = dir ?? (normalized > activeIndex ? 1 : -1);
		activeIndex = normalized;
		transitionKey += 1;
		setProgressVisual(0);
	}

	function prevSlide() {
		selectSlide(activeIndex - 1, -1);
	}

	function nextSlide() {
		selectSlide(activeIndex + 1, 1);
	}

	function handleVisibilityChange() {
		if (typeof document !== 'undefined') {
			isDocumentHidden = document.hidden;
		}
	}

	function handleFocusOut(event: FocusEvent) {
		const currentTarget = event.currentTarget as HTMLElement | null;
		const relatedTarget = event.relatedTarget as Node | null;
		if (!currentTarget || !relatedTarget || !currentTarget.contains(relatedTarget)) {
			isFocusedWithin = false;
		}
	}

	function handleControlKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			prevSlide();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			nextSlide();
		} else if (event.key === 'Home') {
			event.preventDefault();
			selectSlide(0, -1);
		} else if (event.key === 'End') {
			event.preventDefault();
			selectSlide(slides.length - 1, 1);
		}
	}

	function handleFilmstripKeydown(event: KeyboardEvent) {
		if (slides.length <= 1) return;
		const currentEl = event.currentTarget as HTMLElement | null;
		let targetIndex: number | null = null;
		let dir: 1 | -1 | undefined;

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			event.stopPropagation();
			targetIndex = (activeIndex + 1) % slides.length;
			dir = 1;
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			event.stopPropagation();
			targetIndex = (activeIndex - 1 + slides.length) % slides.length;
			dir = -1;
		} else if (event.key === 'Home') {
			event.preventDefault();
			event.stopPropagation();
			targetIndex = 0;
			dir = -1;
		} else if (event.key === 'End') {
			event.preventDefault();
			event.stopPropagation();
			targetIndex = slides.length - 1;
			dir = 1;
		}

		if (targetIndex !== null) {
			selectSlide(targetIndex, dir);
			const tabs = currentEl?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
			tabs?.[targetIndex]?.focus({ preventScroll: true });
		}
	}

	function handlePointerDown(event: PointerEvent) {
		if (slides.length <= 1) return;
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		const target = event.target as HTMLElement | null;
		if (target?.closest('button')) return;

		pointerSession = {
			id: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			startTime: performance.now()
		};
		dragOffsetX = 0;
	}

	function handlePointerMove(event: PointerEvent) {
		if (!pointerSession || event.pointerId !== pointerSession.id) return;
		const dx = event.clientX - pointerSession.startX;
		const dy = event.clientY - pointerSession.startY;

		if (!isDragging) {
			if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
				isDragging = true;
			} else {
				return;
			}
		}

		dragOffsetX = Math.max(-110, Math.min(110, dx * 0.42));
	}

	function finishPointerGesture(event: PointerEvent, cancelled = false) {
		if (!pointerSession) return;
		const dx = event.clientX - pointerSession.startX;
		const dy = event.clientY - pointerSession.startY;
		const elapsedMs = Math.max(1, performance.now() - pointerSession.startTime);
		const velocity = Math.abs(dx) / elapsedMs;

		pointerSession = null;
		dragOffsetX = 0;
		isDragging = false;

		if (cancelled) return;

		const isHorizontal = Math.abs(dx) >= Math.abs(dy);
		if (isHorizontal && (Math.abs(dx) > 42 || (Math.abs(dx) > 18 && velocity > 0.35))) {
			if (dx < 0) {
				nextSlide();
			} else {
				prevSlide();
			}
		}
	}

	function handleLightboxBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			isLightboxOpen = false;
		}
	}

	const bindProgressFill: Attachment<HTMLElement> = (node) => {
		progressFillEl = node;
		node.style.transform = `scaleX(${elapsedRatio})`;
		return () => {
			if (progressFillEl === node) {
				progressFillEl = null;
			}
		};
	};

	const observeEnvironment: Attachment<HTMLElement> = (node) => {
		if (typeof window === 'undefined') return;

		const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mql.matches;
		const onMotionChange = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
		};
		mql.addEventListener('change', onMotionChange);

		let observer: IntersectionObserver | undefined;
		if ('IntersectionObserver' in window) {
			observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (entry) {
						isInViewport = entry.isIntersecting;
					}
				},
				{ threshold: 0.2 }
			);
			observer.observe(node);
		}

		return () => {
			mql.removeEventListener('change', onMotionChange);
			observer?.disconnect();
		};
	};

	const stageInteractions: Attachment<HTMLElement> = (node) => {
		const onPointerUp = (e: PointerEvent) => finishPointerGesture(e, false);
		const onPointerCancel = (e: PointerEvent) => finishPointerGesture(e, true);
		const onDblClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (target?.closest('button')) return;
			isLightboxOpen = true;
		};

		node.addEventListener('pointerdown', handlePointerDown);
		node.addEventListener('pointermove', handlePointerMove);
		node.addEventListener('pointerup', onPointerUp);
		node.addEventListener('pointercancel', onPointerCancel);
		node.addEventListener('dblclick', onDblClick);
		node.addEventListener('keydown', handleControlKeydown);

		return () => {
			node.removeEventListener('pointerdown', handlePointerDown);
			node.removeEventListener('pointermove', handlePointerMove);
			node.removeEventListener('pointerup', onPointerUp);
			node.removeEventListener('pointercancel', onPointerCancel);
			node.removeEventListener('dblclick', onDblClick);
			node.removeEventListener('keydown', handleControlKeydown);
		};
	};

	function preloadAdjacentSlides(index: number, inView: boolean): Attachment<HTMLElement> {
		return () => {
			if (!inView || slides.length <= 1 || typeof Image === 'undefined') return;

			const nextIdx = (index + 1) % slides.length;
			const prevIdx = (index - 1 + slides.length) % slides.length;
			const candidates = [slides[nextIdx]?.url, slides[prevIdx]?.url];

			for (let i = 0; i < candidates.length; i += 1) {
				const url = candidates[i];
				if (!url || (i === 1 && url === candidates[0])) continue;
				const img = new Image();
				img.decoding = 'async';
				img.src = url;
				img.decode?.().catch(() => {});
			}
		};
	}

	function animateSlide(key: number, dir: 1 | -1, reduceMotion: boolean): Attachment<HTMLElement> {
		return (node) => {
			if (key === 0 || !node.querySelector('.stage-prev-foreground-wrap')) return;
			if (reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				previousSlide = null;
				return;
			}

			const foreground = node.querySelector<HTMLElement>('[data-stage-fg]');
			const image = foreground?.querySelector('img');
			if (!foreground || !image) return;

			// Leave the previous sharp frame in place while the incoming image decodes.
			const context = gsap.context(() => {
				gsap.set(foreground, { opacity: 0 });
			}, node);
			let disposed = false;

			function startTransition() {
				if (disposed || key !== transitionKey) return;
				context.add(() => {
					const timeline = gsap.timeline({
						defaults: { ease: 'power3.out' },
						onComplete() {
							context.revert();
							if (key === transitionKey) previousSlide = null;
						}
					});

					timeline.fromTo(
						foreground,
						{ opacity: 0, x: dir * 18, scale: 1.025 },
						{ opacity: 1, x: 0, scale: 1, duration: 0.6 },
						0
					);
				});
			}

			void image.decode().then(startTransition, startTransition);

			return () => {
				disposed = true;
				context.revert();
			};
		};
	}

	function autoPlayCycle(
		paused: boolean,
		intervalMs: number,
		index: number
	): Attachment<HTMLElement> {
		return () => {
			void index;
			if (
				paused ||
				intervalMs <= 0 ||
				slides.length <= 1 ||
				typeof window === 'undefined' ||
				window.matchMedia('(prefers-reduced-motion: reduce)').matches
			) {
				return;
			}

			let rafId = 0;
			let lastTime = performance.now();

			const tick = (now: number) => {
				const dt = Math.max(0, now - lastTime);
				lastTime = now;
				const nextRatio = elapsedRatio + dt / intervalMs;

				if (nextRatio >= 1) {
					setProgressVisual(0);
					nextSlide();
					return;
				}

				setProgressVisual(nextRatio);
				rafId = window.requestAnimationFrame(tick);
			};

			rafId = window.requestAnimationFrame(tick);

			return () => {
				window.cancelAnimationFrame(rafId);
			};
		};
	}

	function syncFilmstripScroll(index: number): Attachment<HTMLElement> {
		return (filmstripNode) => {
			if (typeof window === 'undefined') return;
			const thumbs = filmstripNode.querySelectorAll<HTMLElement>('.filmstrip-thumb');
			const activeThumb = thumbs[index];
			if (!activeThumb) return;

			const thumbLeft = activeThumb.offsetLeft;
			const thumbWidth = activeThumb.offsetWidth;
			const filmstripWidth = filmstripNode.clientWidth;
			const targetLeft = Math.max(0, thumbLeft - filmstripWidth / 2 + thumbWidth / 2);

			filmstripNode.scrollTo({
				left: targetLeft,
				behavior: reducedMotion ? 'auto' : 'smooth'
			});
		};
	}

	function manageLightboxDialog(open: boolean): Attachment<HTMLDialogElement> {
		return (dialogNode) => {
			if (typeof window === 'undefined') return;
			if (open) {
				if (!dialogNode.open && typeof dialogNode.showModal === 'function') {
					dialogNode.showModal();
				}
			} else if (dialogNode.open && typeof dialogNode.close === 'function') {
				dialogNode.close();
			}

			return () => {
				if (dialogNode.open && typeof dialogNode.close === 'function') {
					dialogNode.close();
				}
			};
		};
	}
</script>

<svelte:document onvisibilitychange={handleVisibilityChange} />

<section
	class="carousel-showcase"
	aria-roledescription="carousel"
	aria-label={title}
	data-active-index={activeIndex}
	data-autoplay-paused={isPaused ? 'true' : 'false'}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	onfocusin={() => (isFocusedWithin = true)}
	onfocusout={handleFocusOut}
	{@attach observeEnvironment}
	{@attach preloadAdjacentSlides(activeIndex, isInViewport)}
	{@attach autoPlayCycle(isPaused, autoPlayMs, activeIndex)}
>
	<div class="sr-only" aria-live={isPaused ? 'polite' : 'off'} aria-atomic="true">
		Slide {activeIndex + 1} of {slides.length}: {currentSlide?.alt}
	</div>

	<div class="carousel-header">
		<div class="carousel-title-group">
			{#if badgeText}
				<span class={badgeVariant === 'emerald' ? 'badge-emerald' : 'badge-teal'}>
					{#if BadgeIcon}
						<BadgeIcon size={14} />
					{/if}
					<span>{badgeText}</span>
				</span>
			{/if}
			<h3>{title}</h3>
			{#if subtitle}
				<p class="carousel-subtitle">{subtitle}</p>
			{/if}
		</div>

		<div class="carousel-controls" role="group" aria-label="Slideshow controls">
			{#if canAutoPlay}
				<button
					type="button"
					class={['carousel-icon-btn', 'pause-btn', { 'is-paused': isManuallyPaused }]}
					aria-label={isManuallyPaused ? 'Resume slideshow' : 'Pause slideshow'}
					aria-pressed={isManuallyPaused}
					title={isManuallyPaused ? 'Resume slideshow' : 'Pause slideshow'}
					onclick={() => (isManuallyPaused = !isManuallyPaused)}
					onkeydown={handleControlKeydown}
				>
					{#if isManuallyPaused}
						<IconPlayerPlay size={15} />
					{:else}
						<IconPlayerPause size={15} />
					{/if}
				</button>
			{/if}

			<div class="carousel-nav-pill">
				<button
					type="button"
					class="carousel-icon-btn"
					aria-label="Previous outreach photo"
					onclick={prevSlide}
					onkeydown={handleControlKeydown}
				>
					<IconChevronLeft size={18} stroke={2.2} />
				</button>
				<span class="carousel-counter" aria-hidden="true">
					<strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
					<span class="counter-sep">/</span>
					<span>{String(slides.length).padStart(2, '0')}</span>
				</span>
				<button
					type="button"
					class="carousel-icon-btn"
					aria-label="Next outreach photo"
					onclick={nextSlide}
					onkeydown={handleControlKeydown}
				>
					<IconChevronRight size={18} stroke={2.2} />
				</button>
			</div>
		</div>
	</div>

	<figure class="carousel-figure">
		<div
			id="{uid}-stage"
			role="group"
			aria-roledescription="slide"
			aria-label="Slide {activeIndex + 1} of {slides.length}"
			class={['carousel-stage', { 'is-dragging': isDragging }]}
			{@attach stageInteractions}
			{@attach cinematicPhotoReveal}
			{@attach animateSlide(transitionKey, direction, reducedMotion)}
		>
			{#if previousSlide}
				<div class="stage-prev-foreground-wrap" aria-hidden="true">
					<img
						src={previousSlide.url}
						alt=""
						width={previousSlide.aspect === 'portrait' ? 900 : 1200}
						height={previousSlide.aspect === 'portrait' ? 1200 : 900}
						decoding="async"
						style:object-position={previousSlide.focus ?? 'center 22%'}
						class="stage-prev-img"
					/>
				</div>
			{/if}

			<div
				class="stage-foreground-wrap"
				style:transform={dragOffsetX !== 0 ? `translate3d(${dragOffsetX}px, 0, 0)` : undefined}
				data-stage-fg
			>
				<img
					src={currentSlide?.url}
					alt={currentSlide?.alt}
					width={currentSlide?.aspect === 'portrait' ? 900 : 1200}
					height={currentSlide?.aspect === 'portrait' ? 1200 : 900}
					loading="lazy"
					decoding="async"
					draggable="false"
					style:object-position={currentSlide?.focus ?? 'center 22%'}
					class="stage-main-img"
					data-cinematic-image
				/>
			</div>

			<button
				type="button"
				class="stage-expand-btn"
				aria-label="Expand photo in fullscreen view"
				title="Expand photo in fullscreen view"
				onclick={() => (isLightboxOpen = true)}
				onkeydown={handleControlKeydown}
			>
				<IconArrowsMaximize size={16} stroke={2.2} />
			</button>

			<button
				type="button"
				class="stage-edge-btn prev"
				aria-label="Previous slide"
				onclick={prevSlide}
				onkeydown={handleControlKeydown}
			>
				<IconChevronLeft size={20} stroke={2.3} />
			</button>
			<button
				type="button"
				class="stage-edge-btn next"
				aria-label="Next slide"
				onclick={nextSlide}
				onkeydown={handleControlKeydown}
			>
				<IconChevronRight size={20} stroke={2.3} />
			</button>

			{#if canAutoPlay}
				<div class="stage-progress-track" aria-hidden="true">
					<div class="stage-progress-fill" {@attach bindProgressFill}></div>
				</div>
			{/if}
		</div>
		<figcaption class="carousel-caption">
			{#if currentSlide?.tag}<strong>{currentSlide.tag}</strong>{/if}
			<span>{currentSlide?.alt}</span>
		</figcaption>
	</figure>

	<!-- Interactive Thumbnail Filmstrip (WAI-ARIA Roving Tabindex) -->
	<div
		class="carousel-filmstrip"
		role="tablist"
		aria-label="{title} thumbnails"
		tabindex="-1"
		onkeydown={handleFilmstripKeydown}
		{@attach syncFilmstripScroll(activeIndex)}
	>
		{#each slides as slide, idx (slide.url)}
			<button
				type="button"
				id="{uid}-tab-{idx}"
				role="tab"
				tabindex={idx === activeIndex ? 0 : -1}
				aria-selected={idx === activeIndex}
				aria-controls="{uid}-stage"
				aria-label="View photo {idx + 1}: {slide.alt}"
				class={['filmstrip-thumb', { active: idx === activeIndex }]}
				onclick={() => selectSlide(idx)}
			>
				<img
					src={slide.url}
					alt=""
					width="56"
					height="42"
					loading="lazy"
					decoding="async"
					draggable="false"
					style:object-position={slide.focus ?? 'center 25%'}
				/>
			</button>
		{/each}
	</div>

	<!-- Fullscreen Cinema Lightbox Modal -->
	<dialog
		class="carousel-lightbox"
		aria-label="{title} fullscreen gallery"
		onclose={() => (isLightboxOpen = false)}
		onclick={handleLightboxBackdropClick}
		onkeydown={handleControlKeydown}
		{@attach manageLightboxDialog(isLightboxOpen)}
	>
		{#if isLightboxOpen}
			<div class="lightbox-shell">
				<header class="lightbox-header">
					<div class="lightbox-title-wrap">
						{#if badgeText}
							<span class={badgeVariant === 'emerald' ? 'badge-emerald' : 'badge-teal'}>
								{#if BadgeIcon}
									<BadgeIcon size={14} />
								{/if}
								<span>{badgeText}</span>
							</span>
						{/if}
						<span class="lightbox-title">{title}</span>
					</div>

					<div class="lightbox-actions">
						<span class="lightbox-counter">
							{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
						</span>
						<button
							type="button"
							class="lightbox-close-btn"
							aria-label="Close fullscreen view"
							onclick={() => (isLightboxOpen = false)}
						>
							<IconX size={20} stroke={2.2} />
						</button>
					</div>
				</header>

				<div class="lightbox-stage">
					<button
						type="button"
						class="lightbox-nav-btn prev"
						aria-label="Previous fullscreen photo"
						onclick={prevSlide}
					>
						<IconChevronLeft size={24} stroke={2.3} />
					</button>

					<figure class="lightbox-figure">
						<img
							src={currentSlide?.url}
							alt={currentSlide?.alt}
							width={currentSlide?.aspect === 'portrait' ? 900 : 1200}
							height={currentSlide?.aspect === 'portrait' ? 1200 : 900}
							decoding="async"
							class="lightbox-img"
						/>
						<figcaption class="lightbox-caption">
							{#if currentSlide?.tag}
								<span class="lightbox-tag">{currentSlide.tag}</span>
							{/if}
							<p>{currentSlide?.alt}</p>
						</figcaption>
					</figure>

					<button
						type="button"
						class="lightbox-nav-btn next"
						aria-label="Next fullscreen photo"
						onclick={nextSlide}
					>
						<IconChevronRight size={24} stroke={2.3} />
					</button>
				</div>

				<div class="lightbox-thumbs" role="group" aria-label="Fullscreen photo switcher">
					{#each slides as slide, idx (slide.url)}
						<button
							type="button"
							class={['lightbox-thumb-btn', { active: idx === activeIndex }]}
							aria-label="Switch to photo {idx + 1}"
							aria-current={idx === activeIndex ? 'true' : undefined}
							onclick={() => selectSlide(idx)}
						>
							<img
								src={slide.url}
								alt=""
								width="56"
								height="42"
								loading="lazy"
								decoding="async"
								class="lightbox-thumb-img"
								style:object-position={slide.focus ?? 'center 25%'}
							/>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</dialog>
</section>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.carousel-showcase {
		display: flex;
		flex-direction: column;
		min-width: 0;
		max-width: 100%;
		padding: 1rem 0 0;
		border-top: 1px solid var(--color-rule);
		outline: none;
	}

	@media (width > 750px) {
		@supports (grid-template-rows: subgrid) {
			:global(.gallery-grid) > .carousel-showcase {
				display: grid;
				grid-row: span 3;
				grid-template-rows: subgrid;
				row-gap: 0;
			}
		}
	}

	.carousel-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.15rem;
		min-height: 2.9rem;
		flex-wrap: wrap;
	}

	.carousel-title-group {
		flex: 1 1 min(100%, 13.75rem);
		min-width: 0;
	}

	.carousel-title-group h3 {
		font-size: clamp(1.25rem, 2.1vw, 1.65rem);
		margin: 0.2rem 0 0;
		color: var(--color-navy);
		line-height: 1.25;
		letter-spacing: var(--tracking-h3, -0.01em);
	}

	.carousel-subtitle {
		margin: 0.25rem 0 0;
		font-size: 0.86rem;
		line-height: 1.45;
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
		box-shadow: inset 0 1px 2px rgba(15, 32, 60, 0.04);
	}

	.carousel-icon-btn {
		width: 40px;
		height: 40px;
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
			border-color 0.18s ease,
			color 0.18s ease,
			transform 0.18s ease;
	}

	.carousel-icon-btn.pause-btn {
		border: 1px solid var(--color-border);
		background: var(--color-parchment);
	}

	.carousel-icon-btn.pause-btn.is-paused {
		background: rgba(173, 200, 255, 0.18);
		border-color: var(--color-gold);
		color: var(--color-navy);
	}

	.carousel-icon-btn:hover {
		background: var(--color-accent);
		color: var(--color-on-accent);
		transform: scale(1.04);
	}

	.carousel-icon-btn:focus-visible,
	.filmstrip-thumb:focus-visible {
		outline: 2px solid var(--color-rust);
		outline-offset: 2px;
	}

	.stage-edge-btn:focus-visible,
	.stage-expand-btn:focus-visible,
	.lightbox-close-btn:focus-visible,
	.lightbox-nav-btn:focus-visible,
	.lightbox-thumb-btn:focus-visible {
		outline: 2px solid var(--color-gold);
		outline-offset: 2px;
	}

	.carousel-counter {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-variant-numeric: tabular-nums;
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

	.carousel-stage {
		position: relative;
		width: 100%;
		aspect-ratio: var(--photo-aspect, 4 / 3);
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-navy-dark);
		user-select: none;
		touch-action: pan-y;
		cursor: grab;
	}

	.carousel-stage.is-dragging {
		cursor: grabbing;
	}

	.stage-prev-foreground-wrap,
	.stage-foreground-wrap {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.stage-prev-foreground-wrap {
		z-index: 2;
		pointer-events: none;
	}

	.stage-foreground-wrap {
		position: relative;
		z-index: 3;
		transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.carousel-stage.is-dragging .stage-foreground-wrap {
		transition: none;
	}

	.stage-prev-img,
	.stage-main-img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.stage-expand-btn {
		position: absolute;
		inset-block-start: 0.85rem;
		inset-inline-end: 0.85rem;
		z-index: 5;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background: rgba(7, 17, 34, 0.76);
		color: #ffffff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
		transition:
			opacity 0.2s ease,
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease;
	}

	.carousel-stage:hover .stage-expand-btn,
	.carousel-showcase:focus-within .stage-expand-btn {
		opacity: 1;
	}

	.stage-expand-btn:hover {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: var(--color-on-accent);
		transform: scale(1.06);
	}

	.stage-edge-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 5;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background: rgba(7, 17, 34, 0.72);
		color: #ffffff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		backdrop-filter: blur(8px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
		transition:
			opacity 0.2s ease,
			background-color 0.2s ease,
			border-color 0.2s ease,
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
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: var(--color-on-accent);
		transform: translateY(-50%) scale(1.06);
	}

	.carousel-figure {
		margin: 0;
	}

	.carousel-caption {
		display: grid;
		align-content: start;
		gap: 0.1rem;
		margin-top: 0.55rem;
		min-height: 2.65em;
		color: var(--color-text-muted);
		font-size: 0.94rem;
		line-height: 1.4;
	}

	.carousel-caption strong {
		color: var(--color-navy);
	}

	.stage-progress-track {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 3px;
		z-index: 6;
		background: rgba(255, 255, 255, 0.14);
		pointer-events: none;
	}

	.stage-progress-fill {
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, var(--color-teal), var(--color-gold));
		transform: scaleX(0);
		transform-origin: left center;
		will-change: transform;
	}

	/* Filmstrip Thumbnails */
	.carousel-filmstrip {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.95rem;
		overflow-x: auto;
		padding: 0.18rem 0.12rem 0.28rem;
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
		opacity: 0.6;
		transition:
			opacity 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}

	.filmstrip-thumb:hover {
		opacity: 0.92;
		transform: translateY(-1px);
	}

	.filmstrip-thumb.active {
		opacity: 1;
		border-color: var(--color-gold);
		box-shadow: 0 0 0 2px rgba(173, 200, 255, 0.28);
	}

	.filmstrip-thumb img {
		width: 56px;
		height: 42px;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
	}

	/* Fullscreen Cinema Lightbox Modal */
	.carousel-lightbox {
		width: min(94vw, 1080px);
		max-height: 92vh;
		margin: auto;
		padding: 0;
		border: 1px solid rgba(173, 200, 255, 0.38);
		border-radius: var(--radius-lg);
		background: var(--color-screen);
		color: #ffffff;
		box-shadow: 0 28px 80px rgba(0, 0, 0, 0.8);
		overflow: hidden;
	}

	.carousel-lightbox::backdrop {
		background: rgba(5, 12, 24, 0.86);
		backdrop-filter: blur(10px);
	}

	.lightbox-shell {
		display: flex;
		flex-direction: column;
		max-height: 92vh;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: 1.25rem 1.5rem 1.35rem;
		gap: 1rem;
	}

	.lightbox-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.lightbox-title-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.lightbox-title {
		font-weight: 700;
		font-size: 1.05rem;
		color: #ffffff;
	}

	.lightbox-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.lightbox-counter {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-variant-numeric: tabular-nums;
		color: rgba(255, 255, 255, 0.78);
	}

	.lightbox-close-btn,
	.lightbox-nav-btn {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.24);
		background: rgba(255, 255, 255, 0.08);
		color: #ffffff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		flex-shrink: 0;
		transition:
			background-color 0.18s ease,
			color 0.18s ease,
			border-color 0.18s ease;
	}

	.lightbox-close-btn:hover,
	.lightbox-nav-btn:hover {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: var(--color-on-accent);
	}

	.lightbox-stage {
		position: relative;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem;
		min-height: 0;
		flex-shrink: 0;
	}

	.lightbox-figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
	}

	.lightbox-img {
		max-width: 100%;
		max-height: 62vh;
		width: auto;
		height: auto;
		object-fit: contain;
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.16);
		box-shadow: 0 18px 48px rgba(0, 0, 0, 0.55);
	}

	.lightbox-caption {
		text-align: center;
		max-width: 68ch;
	}

	.lightbox-tag {
		display: inline-block;
		font-size: 0.74rem;
		font-weight: 700;
		color: var(--color-gold);
		margin-bottom: 0.25rem;
	}

	.lightbox-caption p {
		margin: 0;
		font-size: 0.92rem;
		color: rgba(255, 255, 255, 0.92);
	}

	.lightbox-thumbs {
		display: flex;
		align-items: center;
		justify-content: safe center;
		gap: 0.5rem;
		overflow-x: auto;
		padding-bottom: 0.2rem;
	}

	.lightbox-thumb-btn {
		width: 56px;
		height: 42px;
		padding: 0;
		border-radius: 6px;
		overflow: hidden;
		border: 2px solid transparent;
		background: var(--color-screen);
		opacity: 0.58;
		cursor: pointer;
		flex-shrink: 0;
		transition:
			opacity 0.18s ease,
			border-color 0.18s ease;
	}

	.lightbox-thumb-btn.active {
		opacity: 1;
		border-color: var(--color-gold);
	}

	.lightbox-thumb-img {
		width: 56px;
		height: 42px;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 640px) {
		.carousel-header {
			min-height: 0;
		}

		.carousel-icon-btn {
			width: 44px;
			height: 44px;
			min-width: 44px;
			min-height: 44px;
		}

		.stage-edge-btn,
		.stage-expand-btn {
			opacity: 1;
			width: 44px;
			height: 44px;
			min-width: 44px;
			min-height: 44px;
		}

		.filmstrip-thumb {
			min-width: 56px;
			min-height: 44px;
		}

		.lightbox-shell {
			padding: 1rem;
		}

		.lightbox-stage {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.6rem;
		}

		.lightbox-figure {
			grid-area: 1 / 1 / 2 / -1;
		}
		.lightbox-img {
			max-height: 50svh;
		}
		.lightbox-nav-btn {
			grid-row: 2;
		}
		.lightbox-nav-btn.prev {
			justify-self: start;
		}
		.lightbox-nav-btn.next {
			justify-self: end;
		}

		.lightbox-close-btn,
		.lightbox-nav-btn {
			width: 44px;
			height: 44px;
			min-width: 44px;
			min-height: 44px;
		}
	}
</style>
