<script lang="ts">
	import { gsap } from 'gsap';
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
	const isPaused = $derived(
		isHovered ||
			isFocusedWithin ||
			isManuallyPaused ||
			isDragging ||
			isLightboxOpen ||
			isDocumentHidden ||
			!isInViewport ||
			reducedMotion
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
		previousSlide = currentSlide ?? null;
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

	function animateSlide(key: number, dir: 1 | -1): Attachment<HTMLElement> {
		return (node) => {
			if (key === 0) return;

			if (
				typeof window === 'undefined' ||
				window.matchMedia('(prefers-reduced-motion: reduce)').matches
			) {
				previousSlide = null;
				return;
			}

			const prevBg = node.querySelector<HTMLElement>('[data-stage-prev-bg]');
			const prevFg = node.querySelector<HTMLElement>('[data-stage-prev-fg]');
			const bg = node.querySelector<HTMLElement>('[data-stage-bg]');
			const fg = node.querySelector<HTMLElement>('[data-stage-fg]');
			const caption = node.querySelector<HTMLElement>('[data-stage-caption]');

			const tl = gsap.timeline({
				defaults: { ease: 'expo.out' },
				onComplete: () => {
					previousSlide = null;
				}
			});

			if (prevBg) {
				tl.fromTo(
					prevBg,
					{ autoAlpha: 1, scale: 1.14 },
					{ autoAlpha: 0, scale: 1.08, duration: 0.62, ease: 'power3.out' },
					0
				);
			}

			if (prevFg) {
				tl.fromTo(
					prevFg,
					{ autoAlpha: 1, x: 0, scale: 1 },
					{ autoAlpha: 0, x: -dir * 26, scale: 0.98, duration: 0.56, ease: 'power3.out' },
					0
				);
			}

			if (bg) {
				tl.fromTo(
					bg,
					{ autoAlpha: 0.25, scale: 1.2 },
					{ autoAlpha: 1, scale: 1.14, duration: 0.68 },
					0
				);
			}

			if (fg) {
				tl.fromTo(
					fg,
					{ autoAlpha: 0, x: dir * 26, scale: 1.03 },
					{
						autoAlpha: 1,
						x: 0,
						scale: 1,
						duration: 0.6,
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
						duration: 0.44,
						ease: 'power3.out',
						clearProps: 'transform,opacity,visibility'
					},
					0.06
				);
			}

			return () => {
				tl.kill();
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
	class="card carousel-showcase"
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

		<div class="carousel-controls" role="group" aria-label="Slideshow controls">
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

	<!-- Dual-Layer Cinema Stage -->
	<div
		id="{uid}-stage"
		role="group"
		aria-roledescription="slide"
		aria-label="Slide {activeIndex + 1} of {slides.length}"
		class={[
			'carousel-stage',
			currentSlide?.aspect === 'portrait' ? 'stage-portrait' : 'stage-landscape',
			{ 'is-dragging': isDragging }
		]}
		{@attach stageInteractions}
		{@attach animateSlide(transitionKey, direction)}
	>
		<!-- Outgoing Crossfade Buffer Layer (Excluded from active test selectors) -->
		{#if previousSlide}
			<img
				src={previousSlide.url}
				alt=""
				aria-hidden="true"
				width={previousSlide.aspect === 'portrait' ? 900 : 1200}
				height={previousSlide.aspect === 'portrait' ? 1200 : 900}
				decoding="async"
				class="stage-prev-ambient-bg"
				data-stage-prev-bg
			/>
			<div class="stage-prev-foreground-wrap" aria-hidden="true" data-stage-prev-fg>
				<img
					src={previousSlide.url}
					alt=""
					width={previousSlide.aspect === 'portrait' ? 900 : 1200}
					height={previousSlide.aspect === 'portrait' ? 1200 : 900}
					decoding="async"
					style:object-position={previousSlide.focus ?? 'center 22%'}
					class={[
						'stage-prev-img',
						previousSlide.aspect === 'portrait' ? 'img-portrait' : 'img-landscape'
					]}
				/>
			</div>
		{/if}

		<!-- Layer 1: Blurred Ambient Color-Matched Backdrop -->
		<img
			src={currentSlide?.url}
			alt=""
			aria-hidden="true"
			width={currentSlide?.aspect === 'portrait' ? 900 : 1200}
			height={currentSlide?.aspect === 'portrait' ? 1200 : 900}
			loading="lazy"
			decoding="async"
			class="stage-ambient-bg"
			data-stage-bg
		/>
		<div class="stage-vignette" aria-hidden="true"></div>

		<!-- Layer 2: Crisp Foreground Subject Frame -->
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
				class={[
					'stage-main-img',
					currentSlide?.aspect === 'portrait' ? 'img-portrait' : 'img-landscape'
				]}
			/>
		</div>

		<!-- Layer 3: Floating Context Pill & Fullscreen Trigger -->
		<div class="stage-top-bar">
			{#if currentSlide?.tag}
				<span class="stage-tag-pill">
					<span class="tag-pill-dot" aria-hidden="true"></span>
					<span>{currentSlide.tag}</span>
				</span>
			{:else}
				<span></span>
			{/if}

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
		</div>

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

		<div class="stage-caption-bar" data-stage-caption>
			<span class="stage-caption-index" aria-hidden="true">
				{String(activeIndex + 1).padStart(2, '0')}
			</span>
			<p class="stage-caption-text">{currentSlide?.alt}</p>
		</div>

		<!-- Drift-Free Smooth Autoplay Progress Bar -->
		<div class="stage-progress-track" aria-hidden="true">
			<div class="stage-progress-fill" {@attach bindProgressFill}></div>
		</div>
	</div>

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
						<span class={badgeVariant === 'emerald' ? 'badge-emerald' : 'badge-teal'}>
							{#if BadgeIcon}
								<BadgeIcon size={14} />
							{/if}
							<span>{badgeText}</span>
						</span>
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
		padding: 1.65rem;
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-card);
		transition:
			box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1),
			border-color 0.28s ease;
		outline: none;
	}

	.carousel-showcase:hover,
	.carousel-showcase:focus-within {
		box-shadow: var(--shadow-elevated);
		border-color: rgba(212, 168, 67, 0.58);
	}

	.carousel-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.15rem;
		min-height: 4.65rem;
		flex-wrap: wrap;
	}

	.carousel-title-group {
		flex: 1 1 220px;
		min-width: 0;
	}

	.carousel-title-group h3 {
		font-size: 1.28rem;
		margin: 0.45rem 0 0;
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
			border-color 0.18s ease,
			color 0.18s ease,
			transform 0.18s ease;
	}

	.carousel-icon-btn.pause-btn {
		border: 1px solid var(--color-border);
		background: var(--color-parchment);
	}

	.carousel-icon-btn.pause-btn.is-paused {
		background: rgba(212, 168, 67, 0.18);
		border-color: var(--color-gold);
		color: var(--color-navy);
	}

	.carousel-icon-btn:hover {
		background: var(--color-gold);
		color: var(--color-navy);
		transform: scale(1.04);
	}

	.carousel-icon-btn:focus-visible,
	.stage-edge-btn:focus-visible,
	.stage-expand-btn:focus-visible,
	.filmstrip-thumb:focus-visible,
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

	/* Dual-Layer Cinema Stage */
	.carousel-stage {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: #071122;
		border: 1px solid rgba(15, 32, 60, 0.16);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
		user-select: none;
		touch-action: pan-y;
		cursor: grab;
	}

	.carousel-stage.is-dragging {
		cursor: grabbing;
	}

	.stage-prev-ambient-bg,
	.stage-ambient-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		filter: blur(28px) saturate(1.38) brightness(0.46);
		transform: scale(1.14);
		pointer-events: none;
	}

	.stage-prev-ambient-bg {
		z-index: 0;
	}

	.stage-ambient-bg {
		z-index: 1;
	}

	.stage-vignette {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: radial-gradient(
			circle at center,
			rgba(7, 17, 34, 0.06) 0%,
			rgba(7, 17, 34, 0.54) 100%
		);
		pointer-events: none;
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

	.stage-prev-img.img-landscape,
	.stage-main-img.img-landscape {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.stage-prev-img.img-portrait,
	.stage-main-img.img-portrait {
		width: auto;
		height: 100%;
		max-width: 100%;
		object-fit: contain;
		display: block;
		border-left: 1px solid rgba(255, 255, 255, 0.2);
		border-right: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 20px 46px rgba(0, 0, 0, 0.6);
	}

	.stage-top-bar {
		position: absolute;
		top: 0.85rem;
		left: 0.85rem;
		right: 0.85rem;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		pointer-events: none;
	}

	.stage-tag-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.42rem;
		padding: 0.34rem 0.82rem;
		border-radius: 999px;
		font-size: 0.74rem;
		font-weight: 700;
		letter-spacing: 0.025em;
		background: rgba(7, 17, 34, 0.84);
		color: #ffffff;
		border: 1px solid rgba(212, 168, 67, 0.48);
		backdrop-filter: blur(10px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
	}

	.tag-pill-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-gold);
		box-shadow: 0 0 0 2px rgba(212, 168, 67, 0.28);
		flex-shrink: 0;
	}

	.stage-expand-btn {
		pointer-events: auto;
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
		background: var(--color-gold);
		border-color: var(--color-gold);
		color: var(--color-navy);
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
		z-index: 4;
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 2.1rem 1rem 0.95rem;
		background: linear-gradient(
			180deg,
			rgba(7, 17, 34, 0) 0%,
			rgba(7, 17, 34, 0.76) 46%,
			rgba(7, 17, 34, 0.96) 100%
		);
		pointer-events: none;
	}

	.stage-caption-index {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--color-gold);
		background: rgba(212, 168, 67, 0.16);
		border: 1px solid rgba(212, 168, 67, 0.42);
		border-radius: 6px;
		padding: 0.14rem 0.44rem;
		flex-shrink: 0;
	}

	.stage-caption-text {
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.96);
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
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
		box-shadow: 0 0 0 2px rgba(212, 168, 67, 0.28);
	}

	.filmstrip-thumb img {
		width: 100%;
		height: 100%;
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
		border: 1px solid rgba(212, 168, 67, 0.38);
		border-radius: var(--radius-lg);
		background: #071122;
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
		background: var(--color-gold);
		border-color: var(--color-gold);
		color: var(--color-navy);
	}

	.lightbox-stage {
		position: relative;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem;
		min-height: 0;
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
		justify-content: center;
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
		background: #091529;
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
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 640px) {
		.carousel-showcase {
			padding: 1.15rem;
		}

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

		.lightbox-close-btn,
		.lightbox-nav-btn {
			width: 44px;
			height: 44px;
			min-width: 44px;
			min-height: 44px;
		}
	}
</style>
