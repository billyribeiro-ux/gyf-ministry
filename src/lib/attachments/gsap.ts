import { gsap } from 'gsap';
import type { Attachment } from 'svelte/attachments';

interface RevealOptions {
	y?: number;
	delay?: number;
	duration?: number;
	stagger?: number;
	selector?: string;
}

function withMotion(setup: () => (() => void) | undefined): (() => void) | undefined {
	const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (preference.matches) return;

	let stop = setup();
	if (!stop) return;

	function cleanup() {
		preference.removeEventListener('change', onPreferenceChange);
		stop?.();
		stop = undefined;
	}

	function onPreferenceChange(event: MediaQueryListEvent) {
		if (event.matches) cleanup();
	}

	preference.addEventListener('change', onPreferenceChange);
	return cleanup;
}

function play(node: HTMLElement, build: () => gsap.core.Timeline): (() => void) | undefined {
	if (node.matches(':focus-within')) return;

	const context = gsap.context(() => {
		build().eventCallback('onComplete', cleanup);
	}, node);

	function cleanup() {
		node.removeEventListener('focusin', cleanup);
		context.revert();
	}

	// Finish immediately when a visitor tabs into the animated region.
	node.addEventListener('focusin', cleanup, { once: true });
	return cleanup;
}

/** Stagger the masthead copy while keeping every line readable from the first frame. */
export const gsapHeroEntrance: Attachment<HTMLElement> = (node) => {
	const copy = node.querySelectorAll<HTMLElement>('[data-hero-item]');
	if (!copy.length) return;

	return withMotion(() =>
		play(node, () =>
			gsap.timeline().from(copy, {
				y: 14,
				duration: 0.62,
				stagger: 0.065,
				ease: 'power3.out'
			})
		)
	);
};

/** Open an aperture over a featured photograph and settle its crop after it enters view. */
export const cinematicPhotoReveal: Attachment<HTMLElement> = (frame) => {
	if (typeof IntersectionObserver === 'undefined') return;

	const photo =
		frame instanceof HTMLImageElement
			? frame
			: (frame.querySelector<HTMLImageElement>('img[data-cinematic-image]') ??
				frame.querySelector('img'));
	if (!photo) return;

	return withMotion(() => {
		let active = true;
		let stop: (() => void) | undefined;

		const reveal = () => {
			if (!active || !photo.naturalWidth) return;
			stop = play(frame, () =>
				gsap
					.timeline()
					.fromTo(
						photo,
						{ clipPath: 'inset(7% 32% 9% 0%)' },
						{ clipPath: 'inset(0% 0% 0% 0%)', duration: 0.92, ease: 'power3.inOut' },
						0
					)
					.fromTo(
						photo,
						{ scale: 1.085, yPercent: 2.4 },
						{ scale: 1, yPercent: 0, duration: 1.22, ease: 'power3.out' },
						0
					)
			);
		};

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				observer.disconnect();
				if (photo.complete) reveal();
				else void photo.decode().then(reveal, () => {});
			},
			{ rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
		);

		observer.observe(frame);
		return () => {
			active = false;
			observer.disconnect();
			stop?.();
		};
	});
};

/** Add a brief scroll cue to content that is already visible and available to readers. */
export function gsapReveal(options: RevealOptions = {}): Attachment<HTMLElement> {
	return (node) => {
		if (typeof IntersectionObserver === 'undefined') return;

		const { y = 18, delay = 0, duration = 0.7, stagger = 0.075, selector } = options;
		const targets = selector ? [...node.querySelectorAll<HTMLElement>(selector)] : [node];
		if (!targets.length) return;

		return withMotion(() => {
			const cleanups: (() => void)[] = [];
			const observer = new IntersectionObserver(
				(entries) => {
					const visible = entries.filter((entry) => entry.isIntersecting);
					if (!visible.length) return;

					const entering = visible.map(({ target }) => target);
					for (const target of entering) observer.unobserve(target);

					const stop = play(node, () =>
						gsap.timeline().from(entering, {
							y: gsap.utils.clamp(-24, 24, y),
							duration,
							delay,
							stagger: Math.min(stagger, 0.09),
							ease: 'power3.out'
						})
					);
					if (stop) cleanups.push(stop);
				},
				{ rootMargin: '0px 0px -24px 0px' }
			);

			for (const target of targets) observer.observe(target);
			return () => {
				observer.disconnect();
				observer.takeRecords();
				for (const cleanup of cleanups) cleanup();
			};
		});
	};
}
