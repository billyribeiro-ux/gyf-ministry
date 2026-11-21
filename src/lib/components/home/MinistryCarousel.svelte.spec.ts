import '../../../app.css';
import '#lib/styles/prose.css';
import { describe, expect, it } from 'vite-plus/test';
import { page } from 'vite-plus/test/browser';
import { render } from 'vitest-browser-svelte';
import MinistryCarousel from './MinistryCarousel.svelte';

const SAMPLE_SLIDES = [
	{
		url: '/images/gallery/carousel1-1.webp',
		tag: 'Community Outreach • Connecticut',
		aspect: 'landscape' as const,
		focus: 'center 22%',
		alt: 'Courtney Ribeiro serving families in Connecticut'
	},
	{
		url: '/images/gallery/carousel2-2.webp',
		tag: 'Holiday Gifts for Children',
		aspect: 'portrait' as const,
		focus: 'center 24%',
		alt: 'Children show holiday gifts they received'
	},
	{
		url: '/images/gallery/carousel1-3.webp',
		tag: 'Holiday Meal Delivery',
		aspect: 'landscape' as const,
		focus: 'center 25%',
		alt: 'Delivering hot Thanksgiving meals to neighbors in need'
	}
];

describe('MinistryCarousel - Enterprise Grade Functionality, A11y & CLS Prevention', () => {
	it('reserves space for the foreground photo and lazy-loaded thumbnails', async () => {
		await render(MinistryCarousel, {
			badgeText: 'OUTREACH ARCHIVE',
			title: 'Faith in Action Gallery',
			subtitle: 'Documented Outreach Archive',
			slides: SAMPLE_SLIDES
		});

		const stage = document.querySelector<HTMLElement>('.carousel-stage')!;
		const foregroundImg = stage.querySelector<HTMLImageElement>('.stage-main-img');
		expect(stage.querySelectorAll('img')).toHaveLength(1);
		expect(foregroundImg?.getAttribute('loading')).toBe('lazy');
		expect(foregroundImg?.getAttribute('width')).toBe('1200');
		expect(foregroundImg?.getAttribute('height')).toBe('900');

		const thumbImgs = document.querySelectorAll<HTMLImageElement>('.filmstrip-thumb img');
		expect(thumbImgs.length).toBe(SAMPLE_SLIDES.length);
		for (const thumb of thumbImgs) {
			expect(thumb.getAttribute('loading')).toBe('lazy');
			expect(thumb.getAttribute('width')).toBe('56');
			expect(thumb.getAttribute('height')).toBe('42');
		}
	});

	it('maintains fluid non-overflowing layout across 320px, 390px, 768px, 1024px, 1440px, and 1920px viewports', async () => {
		await render(MinistryCarousel, {
			badgeText: 'OUTREACH ARCHIVE',
			title: 'Faith in Action Gallery',
			subtitle: 'Documented Outreach Archive',
			slides: SAMPLE_SLIDES
		});

		const viewports = [
			{ width: 320, height: 568 },
			{ width: 390, height: 844 },
			{ width: 768, height: 1024 },
			{ width: 1024, height: 768 },
			{ width: 1440, height: 900 },
			{ width: 1920, height: 1080 }
		];

		const showcase = document.querySelector<HTMLElement>('.carousel-showcase');
		expect(showcase).not.toBeNull();

		for (const vp of viewports) {
			await page.viewport(vp.width, vp.height);
			const rect = showcase!.getBoundingClientRect();
			expect(rect.width).toBeLessThanOrEqual(vp.width);
			expect(rect.width).toBeGreaterThan(0);
		}
	});

	it('fills the same 4:3 stage with landscape and portrait photos', async () => {
		await page.viewport(390, 844);
		await render(MinistryCarousel, {
			title: 'Outreach gallery',
			slides: SAMPLE_SLIDES,
			autoPlayMs: 0
		});

		const stage = document.querySelector<HTMLElement>('.carousel-stage')!;
		const image = stage.querySelector<HTMLImageElement>('.stage-main-img')!;
		const size = [stage.clientWidth, stage.clientHeight];
		expect(size[0]! / size[1]!).toBeCloseTo(4 / 3, 2);
		expect([image.clientWidth, image.clientHeight]).toEqual(size);

		await page.getByRole('button', { name: 'Next outreach photo' }).click();
		await expect.poll(() => image.getAttribute('src')).toBe(SAMPLE_SLIDES[1]!.url);
		expect([image.clientWidth, image.clientHeight]).toEqual(size);
		expect(getComputedStyle(image).objectFit).toBe('cover');
		expect(getComputedStyle(image).objectPosition).toBe('50% 24%');

		await page.getByRole('button', { name: 'Expand photo in fullscreen view' }).click();
		const fullscreen = document.querySelector<HTMLImageElement>('dialog[open] .lightbox-img')!;
		expect(getComputedStyle(fullscreen).objectFit).toBe('contain');
	});

	it('implements W3C WAI-ARIA roving tabindex on filmstrip tabs, keyboard navigation, and wrap-around slide controls', async () => {
		await render(MinistryCarousel, {
			badgeText: 'OUTREACH ARCHIVE',
			title: 'Faith in Action Gallery',
			subtitle: 'Documented Outreach Archive',
			slides: SAMPLE_SLIDES
		});

		const showcase = document.querySelector<HTMLElement>('.carousel-showcase')!;
		const tabs = document.querySelectorAll<HTMLButtonElement>('.filmstrip-thumb[role="tab"]');
		const stage = document.querySelector<HTMLElement>('.carousel-stage')!;

		expect(tabs.length).toBe(3);
		expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
		expect(tabs[0]?.getAttribute('tabindex')).toBe('0');
		expect(tabs[0]?.getAttribute('aria-controls')).toBe(stage.id);
		expect(tabs[1]?.getAttribute('aria-selected')).toBe('false');
		expect(tabs[1]?.getAttribute('tabindex')).toBe('-1');

		// Navigate via filmstrip keyboard ArrowRight / End / Home
		const filmstrip = document.querySelector<HTMLElement>('.carousel-filmstrip')!;
		filmstrip.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		await new Promise((r) => setTimeout(r, 20));
		expect(showcase.getAttribute('data-active-index')).toBe('1');
		expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
		expect(tabs[1]?.getAttribute('tabindex')).toBe('0');
		expect(tabs[0]?.getAttribute('tabindex')).toBe('-1');

		filmstrip.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
		await new Promise((r) => setTimeout(r, 20));
		expect(showcase.getAttribute('data-active-index')).toBe('2');

		filmstrip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
		await new Promise((r) => setTimeout(r, 20));
		expect(showcase.getAttribute('data-active-index')).toBe('0');

		// Wrap-around backwards from slide 0 -> slide 2
		const prevBtn = document.querySelector<HTMLButtonElement>(
			'button[aria-label="Previous outreach photo"]'
		)!;
		prevBtn.click();
		await new Promise((r) => setTimeout(r, 20));
		expect(showcase.getAttribute('data-active-index')).toBe('2');
	});

	it('supports pause/resume toggle, horizontal pointer swipe gestures, and fullscreen cinema lightbox', async () => {
		await render(MinistryCarousel, {
			badgeText: 'OUTREACH ARCHIVE',
			title: 'Faith in Action Gallery',
			subtitle: 'Documented Outreach Archive',
			slides: SAMPLE_SLIDES
		});

		const showcase = document.querySelector<HTMLElement>('.carousel-showcase')!;
		const pauseBtn = document.querySelector<HTMLButtonElement>('.pause-btn')!;
		expect(pauseBtn.getAttribute('aria-pressed')).toBe('false');

		pauseBtn.click();
		await new Promise((r) => setTimeout(r, 20));
		expect(pauseBtn.getAttribute('aria-pressed')).toBe('true');
		expect(showcase.getAttribute('data-autoplay-paused')).toBe('true');

		// Horizontal swipe left on stage -> advances from slide 0 to slide 1
		const stage = document.querySelector<HTMLElement>('.carousel-stage')!;
		stage.dispatchEvent(
			new PointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'touch',
				clientX: 260,
				clientY: 150,
				bubbles: true
			})
		);
		stage.dispatchEvent(
			new PointerEvent('pointermove', {
				pointerId: 1,
				pointerType: 'touch',
				clientX: 160,
				clientY: 152,
				bubbles: true
			})
		);
		stage.dispatchEvent(
			new PointerEvent('pointerup', {
				pointerId: 1,
				pointerType: 'touch',
				clientX: 160,
				clientY: 152,
				bubbles: true
			})
		);
		await new Promise((r) => setTimeout(r, 20));
		expect(showcase.getAttribute('data-active-index')).toBe('1');

		// Open fullscreen cinema lightbox
		const expandBtn = document.querySelector<HTMLButtonElement>('.stage-expand-btn')!;
		expandBtn.click();
		await new Promise((r) => setTimeout(r, 30));

		const dialog = document.querySelector<HTMLDialogElement>('.carousel-lightbox')!;
		expect(dialog.open).toBe(true);

		const closeBtn = dialog.querySelector<HTMLButtonElement>('.lightbox-close-btn')!;
		closeBtn.click();
		await new Promise((r) => setTimeout(r, 30));
		expect(dialog.open).toBe(false);
	});

	it('announces visitor-controlled slides and omits playback controls when autoplay is disabled', async () => {
		await render(MinistryCarousel, {
			title: 'Outreach gallery',
			slides: SAMPLE_SLIDES,
			autoPlayMs: 0
		});

		const gallery = document.querySelector<HTMLElement>('.carousel-showcase')!;
		expect(gallery.querySelector('.pause-btn')).toBeNull();
		expect(gallery.querySelector('.stage-progress-track')).toBeNull();
		expect(gallery.querySelector('[aria-live]')?.getAttribute('aria-live')).toBe('polite');
	});

	it('resolves shared navigation and status tokens, public section width, and form feedback styles', async () => {
		await page.viewport(1280, 800);
		const rootStyles = getComputedStyle(document.documentElement);
		expect(rootStyles.getPropertyValue('--nav-height').trim()).toBe('78px');
		expect(rootStyles.getPropertyValue('--status-amber-text').trim()).toBe('#f59e0b');
		expect(rootStyles.getPropertyValue('--tracking-h3').trim()).toBe('-0.01em');

		const host = document.createElement('div');
		host.className = 'section';
		host.innerHTML = `
			<div class="container">
				<div class="alert-error" role="alert">Validation error</div>
				<div class="prose-base"><h2 id="sample-h2">Heading</h2></div>
			</div>
		`;
		document.body.appendChild(host);

		try {
			const contentSection = host.querySelector<HTMLElement>('.container')!;
			const sectionStyles = getComputedStyle(contentSection);
			expect(sectionStyles.maxWidth).toBe('1240px');
			expect(parseFloat(sectionStyles.paddingLeft)).toBeGreaterThanOrEqual(18);

			const alertError = host.querySelector<HTMLElement>('.alert-error')!;
			const alertStyles = getComputedStyle(alertError);
			expect(alertStyles.borderTopStyle).toBe('solid');
			expect(parseFloat(alertStyles.paddingTop)).toBeGreaterThan(0);

			const proseH2 = host.querySelector<HTMLElement>('#sample-h2')!;
			const h2Styles = getComputedStyle(proseH2);
			expect(h2Styles.scrollMarginTop).toBe('102px');
		} finally {
			host.remove();
		}
	});
});
