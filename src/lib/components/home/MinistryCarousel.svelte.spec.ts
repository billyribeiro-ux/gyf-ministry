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
		url: '/images/gallery/carousel1-2.webp',
		tag: 'Thanksgiving Meal Preparation',
		aspect: 'portrait' as const,
		focus: 'center 28%',
		alt: 'Preparing hot holiday meals for local families'
	}
];

describe('MinistryCarousel - Responsive & Layout CLS Prevention', () => {
	it('ensures all lazy-loaded images (ambient backdrop, foreground, thumbnails) have explicit width and height attributes', async () => {
		await render(MinistryCarousel, {
			badgeText: 'OUTREACH ARCHIVE',
			title: 'Faith in Action Gallery',
			subtitle: 'Documented Outreach Archive',
			slides: SAMPLE_SLIDES
		});

		// 1. Ambient backdrop image
		const ambientImg = document.querySelector<HTMLImageElement>('.stage-ambient-bg');
		expect(ambientImg).not.toBeNull();
		expect(ambientImg?.getAttribute('loading')).toBe('lazy');
		expect(ambientImg?.getAttribute('width')).toBe('1200');
		expect(ambientImg?.getAttribute('height')).toBe('900');

		// 2. Foreground main image
		const foregroundImg = document.querySelector<HTMLImageElement>('.stage-main-img');
		expect(foregroundImg).not.toBeNull();
		expect(foregroundImg?.getAttribute('width')).toBe('1200');
		expect(foregroundImg?.getAttribute('height')).toBe('900');

		// 3. Filmstrip thumbnail images
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
});
