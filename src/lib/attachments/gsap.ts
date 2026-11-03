import { gsap } from 'gsap';
import type { Attachment } from 'svelte/attachments';

function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
		return true;
	}
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface RevealOptions {
	y?: number;
	delay?: number;
	duration?: number;
	stagger?: number;
	selector?: string;
}

/**
 * Orchestrated hero section entrance using GSAP.
 * Animates `[data-hero-item]` elements in a staggered cascade and `[data-hero-visual]`
 * with a refined editorial scale reveal.
 */
export const gsapHeroEntrance: Attachment<HTMLElement> = (node) => {
	if (prefersReducedMotion()) return;

	const ctx = gsap.context(() => {
		const copyItems = node.querySelectorAll<HTMLElement>('[data-hero-item]');
		const visual = node.querySelector<HTMLElement>('[data-hero-visual]');
		const floatingBadge = node.querySelector<HTMLElement>('[data-hero-float]');

		const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

		if (copyItems.length > 0) {
			tl.fromTo(
				copyItems,
				{ autoAlpha: 0, y: 22 },
				{
					autoAlpha: 1,
					y: 0,
					duration: 0.72,
					stagger: 0.09,
					clearProps: 'transform,opacity,visibility'
				},
				0
			);
		}

		if (visual) {
			tl.fromTo(
				visual,
				{ autoAlpha: 0, y: 24, scale: 0.965 },
				{
					autoAlpha: 1,
					y: 0,
					scale: 1,
					duration: 0.92,
					clearProps: 'transform,opacity,visibility'
				},
				0.14
			);
		}

		if (floatingBadge) {
			gsap.to(floatingBadge, {
				y: -4,
				duration: 2.8,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
				delay: 1.1
			});
		}
	}, node);

	return () => {
		ctx.revert();
	};
};

/**
 * Scroll-triggered GSAP reveal attachment for sections, cards, and grids.
 * Respects `prefers-reduced-motion` and cleans up IntersectionObserver + tweens on destroy.
 */
export function gsapReveal(options: RevealOptions = {}): Attachment<HTMLElement> {
	return (node) => {
		if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

		const { y = 26, delay = 0, duration = 0.72, stagger = 0.1, selector } = options;

		const targets = selector ? Array.from(node.querySelectorAll<HTMLElement>(selector)) : [node];

		if (targets.length === 0) return;

		gsap.set(targets, { autoAlpha: 0, y });

		let tween: gsap.core.Tween | null = null;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						tween = gsap.to(targets, {
							autoAlpha: 1,
							y: 0,
							duration,
							delay,
							stagger: targets.length > 1 ? stagger : 0,
							ease: 'power3.out',
							overwrite: 'auto',
							clearProps: 'transform,opacity,visibility'
						});
						observer.disconnect();
						break;
					}
				}
			},
			{
				threshold: 0.12,
				rootMargin: '0px 0px -36px 0px'
			}
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
			tween?.kill();
		};
	};
}

export interface CounterOptions {
	end: number;
	start?: number;
	prefix?: string;
	suffix?: string;
	duration?: number;
}

/**
 * Animates a numeric impact counter when scrolled into view.
 */
export function gsapCounter(options: CounterOptions): Attachment<HTMLElement> {
	return (node) => {
		const { end, start = 0, prefix = '', suffix = '', duration = 1.45 } = options;
		const finalLabel = `${prefix}${end}${suffix}`;

		if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
			node.textContent = finalLabel;
			return;
		}

		let tween: gsap.core.Tween | null = null;
		const state = { val: start };

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						tween = gsap.to(state, {
							val: end,
							duration,
							ease: 'power2.out',
							onUpdate() {
								node.textContent = `${prefix}${Math.round(state.val)}${suffix}`;
							},
							onComplete() {
								node.textContent = finalLabel;
							}
						});
						observer.disconnect();
						break;
					}
				}
			},
			{ threshold: 0.25 }
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
			tween?.kill();
		};
	};
}

/**
 * Smoothly animates a progress bar width from 0% to target percentage when visible.
 */
export function gsapProgressBar(percent: number): Attachment<HTMLElement> {
	return (node) => {
		const clamped = Math.max(0, Math.min(100, percent));
		if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
			node.style.width = `${clamped}%`;
			return;
		}

		gsap.set(node, { width: '0%' });
		let tween: gsap.core.Tween | null = null;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						tween = gsap.to(node, {
							width: `${clamped}%`,
							duration: 1.35,
							ease: 'power3.out'
						});
						observer.disconnect();
						break;
					}
				}
			},
			{ threshold: 0.2 }
		);

		observer.observe(node);

		return () => {
			observer.disconnect();
			tween?.kill();
		};
	};
}
