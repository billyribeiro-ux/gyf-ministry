<script lang="ts">
	import { resolve } from '$app/paths';
	import { cinematicPhotoReveal, gsapHeroEntrance, gsapReveal } from '#lib/attachments/gsap.js';
	import { siteConfig } from '#lib/config/site.js';
	import BlogSection from '#lib/components/home/BlogSection.svelte';
	import MinistryCarousel from '#lib/components/home/MinistryCarousel.svelte';
	import {
		IconArrowDown,
		IconArrowRight,
		IconArrowUpRight,
		IconMapPin,
		IconSeedling
	} from '@tabler/icons-svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const programs = [
		{
			href: '/programs/friday-ministry',
			rhythm: 'PRAYER & MENTORSHIP',
			title: 'Friday Ministry',
			description:
				'We set aside Fridays to listen, pray, and talk one-on-one. You can ask for prayer or request a follow-up call.',
			image: '/images/gallery/carousel1-5.webp',
			compactImage: '/images/gallery/carousel1-5-560w.webp 560w',
			width: 1200,
			height: 900,
			focus: 'center 30%',
			action: 'How Friday ministry works'
		},
		{
			href: '/programs/holiday-outreach',
			rhythm: 'MEALS & WINTER GEAR',
			title: 'Holiday Outreach',
			description:
				'From Thanksgiving through January 4, we serve hot meals and provide coats, hats, mittens, and blankets for local children.',
			image: '/images/gallery/carousel1-2.webp',
			compactImage: '/images/gallery/carousel1-2-560w.webp 560w',
			width: 1200,
			height: 900,
			focus: 'center 50%',
			action: 'Find help or give'
		},
		{
			href: '/restore-your-purpose',
			rhythm: 'SCRIPTURE & REFLECTION',
			title: 'Restore Your Purpose',
			description:
				'Revisit a dream you set aside. Start with seven days of Scripture and reflection, then choose one step you can take this week.',
			image: '/images/courtney-outreach-car-clean.webp',
			compactImage: '/images/courtney-outreach-car-540w.webp 540w',
			width: 900,
			height: 900,
			focus: 'center 24%',
			action: 'Find the free guide'
		}
	] as const;

	const programPhotoSizes =
		'(max-width: 750px) calc(100vw - 2.3rem), (max-width: 1240px) 29vw, 370px';
	const mission = siteConfig.routes[0];
</script>

<svelte:head>
	<title>{mission.title}</title>
	<meta name="description" content={mission.description} />
	<meta property="og:title" content={mission.title} />
	<meta property="og:description" content={mission.description} />
	<meta property="og:type" content="website" />
</svelte:head>

<section class="home-hero" aria-labelledby="home-title" {@attach gsapHeroEntrance}>
	<figure class="hero-visual">
		<img
			src="/images/courtney-editorial-960w.webp"
			srcset="/images/courtney-editorial-640w.webp 640w, /images/courtney-editorial-960w.webp 960w, /images/courtney-editorial-1536w.webp 1536w"
			sizes="(max-width: 760px) 100vw, 91vw"
			width="1536"
			height="1024"
			fetchpriority="high"
			alt="Courtney Ribeiro with her hands clasped in prayer outdoors"
		/>
		<figcaption>Courtney Ribeiro, founder <span>·</span> Retouched archival portrait</figcaption>
	</figure>
	<div class="container hero-grid">
		<div class="hero-copy">
			<p class="eyebrow" data-hero-item>Faith and practical care in Connecticut</p>
			<h1 id="home-title" data-hero-item>
				Hope is <span>still <em>ahead.</em></span>
			</h1>
			<p class="hero-intro" data-hero-item>
				When life makes it hard to see what comes next, you can start with a conversation. We offer
				prayer, Friday mentorship, and practical help for Connecticut families.
			</p>
			<div class="hero-actions" data-hero-item>
				<a href={resolve('/prayer-and-support')} class="btn action-primary">
					Ask for prayer <IconArrowUpRight size={18} aria-hidden="true" />
				</a>
				<a href="#our-work" class="text-link">
					Find support <IconArrowDown size={17} aria-hidden="true" />
				</a>
			</div>
			<p class="hero-location" data-hero-item>
				<IconMapPin size={16} stroke={1.8} aria-hidden="true" /> Serving Greater Waterbury and Central
				Connecticut since {siteConfig.foundingYear}
			</p>
		</div>
	</div>
</section>

<section id="our-work" class="section work-section" aria-labelledby="work-title">
	<div class="container">
		<div class="section-mast" {@attach gsapReveal({ y: 14 })}>
			<div>
				<p class="eyebrow">Our ministry</p>
				<h2 id="work-title">Ways we can help</h2>
			</div>
			<p>
				Reach out for prayer, find seasonal help for your family, or take a first step toward
				something you feel called to do.
			</p>
		</div>

		<div class="work-grid" {@attach gsapReveal({ selector: '.work-card', stagger: 0.07, y: 13 })}>
			{#each programs as program (program.href)}
				<article class="work-card">
					<div class="work-photo" {@attach cinematicPhotoReveal}>
						<img
							src={program.image}
							srcset={`${program.compactImage}, ${program.image} ${program.width}w`}
							sizes={programPhotoSizes}
							alt=""
							width={program.width}
							height={program.height}
							loading="lazy"
							decoding="async"
							style:object-position={program.focus}
						/>
					</div>
					<p class="work-rhythm">{program.rhythm}</p>
					<h3><a href={resolve(program.href)}>{program.title}</a></h3>
					<p class="work-description">{program.description}</p>
					<span class="work-action" aria-hidden="true">
						{program.action}
						<IconArrowUpRight size={18} />
					</span>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="section story-section" aria-labelledby="story-title">
	<div class="container story-grid" {@attach gsapReveal({ selector: '[data-story]', y: 16 })}>
		<figure data-story>
			<div class="story-photo" {@attach cinematicPhotoReveal}>
				<img
					src="/images/gallery/carousel1-6.webp"
					srcset="/images/gallery/carousel1-6-640w.webp 640w, /images/gallery/carousel1-6.webp 1200w"
					sizes="(max-width: 750px) calc(100vw - 2.3rem), (max-width: 1240px) 45vw, 560px"
					width="1200"
					height="900"
					alt="Grow Your Faith Ministries community members gathered together"
					loading="lazy"
					decoding="async"
				/>
			</div>
			<figcaption>Grow Your Faith Ministries in the community</figcaption>
		</figure>
		<div class="story-copy" data-story>
			<p class="eyebrow">Our story</p>
			<h2 id="story-title">It started with listening.</h2>
			<p>
				Courtney Ribeiro founded Grow Your Faith Ministries in 2014 after meeting people who could
				no longer see a future for the dreams they once had. She set Fridays aside to listen and
				pray with people, and the holiday season to serve families across Connecticut.
			</p>
			<p>
				Some people come to us for a meal or a coat. Others are looking for someone to talk with
				about faith and purpose. Both are part of how we serve.
			</p>
			<a href={resolve('/about')} class="text-link">
				Read Courtney’s story <IconArrowUpRight size={17} aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

<section class="scripture-band" aria-label="Scripture that guides the ministry">
	<div class="container scripture-inner" {@attach gsapReveal({ y: 18, duration: 0.75 })}>
		<IconSeedling size={30} stroke={1.5} aria-hidden="true" />
		<blockquote>
			<p>“If you have faith as small as a mustard seed … nothing will be impossible for you.”</p>
			<cite>Matthew 17:20</cite>
		</blockquote>
	</div>
</section>

<section class="section gallery-section" aria-labelledby="gallery-title">
	<div class="container">
		<div class="section-mast" {@attach gsapReveal({ y: 14 })}>
			<div>
				<p class="eyebrow">From the ministry archive</p>
				<h2 id="gallery-title">Outreach in photographs</h2>
			</div>
			<p>
				See the volunteers, meal tables, and winter outreach that have made this work possible in
				Connecticut.
			</p>
		</div>
		<div
			class="gallery-grid"
			{@attach gsapReveal({ selector: '.carousel-showcase', y: 13, duration: 0.68, stagger: 0.07 })}
		>
			<MinistryCarousel
				title="Holiday meals &amp; service"
				slides={siteConfig.legacyPhotos.carousel1}
				autoPlayMs={0}
			/>
			<MinistryCarousel
				title="Winter warmth &amp; street ministry"
				slides={siteConfig.legacyPhotos.carousel2}
				autoPlayMs={0}
			/>
		</div>
	</div>
</section>

<BlogSection posts={data.latestPosts} />

<section class="section partner-section" aria-labelledby="partner-title">
	<div class="container partner-inner" {@attach gsapReveal({ y: 14 })}>
		<div>
			<p class="eyebrow">Support the outreach</p>
			<h2 id="partner-title">Put a meal on the table.</h2>
		</div>
		<div>
			<p>
				Sponsor holiday meals or winter gear for a child. Our clients and partners cover operating
				costs, so outreach contributions go toward meals and supplies.
			</p>
			<a href={resolve('/partner')} class="btn action-primary">
				Explore ways to give <IconArrowRight size={18} aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

<style>
	.home-hero {
		position: relative;
		isolation: isolate;
		display: grid;
		align-items: center;
		min-height: clamp(37rem, 79svh, 51rem);
		overflow: hidden;
		background: var(--color-screen);
		border-bottom: 1px solid var(--color-line);
	}

	.hero-visual {
		position: absolute;
		z-index: -1;
		inset: 0 0 0 9%;
		margin: 0;
		color: var(--color-strong);
		overflow: hidden;
	}

	.hero-visual img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 52%;
	}

	.hero-visual::after {
		position: absolute;
		z-index: 1;
		inset: 0;
		content: '';
		background:
			linear-gradient(
				90deg,
				var(--color-screen) 0%,
				rgb(16 17 22 / 91%) 17%,
				rgb(16 17 22 / 63%) 35%,
				transparent 64%
			),
			linear-gradient(0deg, rgb(16 17 22 / 91%), transparent 35%);
		pointer-events: none;
	}

	.hero-visual figcaption {
		position: absolute;
		z-index: 2;
		right: max(1.5rem, calc((100vw - 1192px) / 2));
		bottom: 1.4rem;
		max-width: calc(100% - 3rem);
		color: var(--color-strong);
		font-size: 0.7rem;
		text-align: right;
	}

	.hero-visual figcaption span {
		padding-inline: 0.2em;
	}

	.hero-grid {
		padding-block: clamp(3rem, 7.5vw, 7rem) 4.5rem;
	}

	.hero-copy {
		max-width: 41rem;
	}

	.eyebrow {
		margin: 0 0 1rem;
		color: var(--color-accent);
		font-size: 0.73rem;
		font-weight: 660;
		letter-spacing: 0.12em;
		line-height: 1.4;
		text-transform: uppercase;
	}

	.hero-copy h1 {
		margin: 0 0 1.45rem;
		color: var(--color-strong);
		font-size: clamp(3.75rem, 8.6vw, 8.75rem);
		font-weight: 680;
		line-height: 0.87;
		letter-spacing: -0.052em;
	}

	.hero-copy h1 > span {
		display: block;
	}

	.hero-copy em {
		color: var(--color-accent);
		font-style: normal;
	}

	.hero-intro {
		max-width: 40ch;
		margin: 0 0 1.65rem;
		color: #e5e9f4;
		font-size: clamp(1.02rem, 1.65vw, 1.27rem);
		line-height: 1.52;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 1.35rem;
	}

	.action-primary {
		min-height: 49px;
		padding: 0.7rem 1rem;
		background: var(--color-accent);
		color: var(--color-on-accent);
	}

	.action-primary:hover,
	.action-primary:focus-visible {
		background: var(--color-accent-hover);
		color: var(--color-on-accent);
	}

	.text-link {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 0.65rem;
		color: var(--color-strong);
		font-size: 0.94rem;
		font-weight: 650;
		text-decoration: underline;
		text-decoration-color: var(--color-accent);
		text-underline-offset: 0.35em;
	}

	.text-link:hover {
		color: var(--color-accent);
	}

	.hero-location {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin: 1.25rem 0 0;
		color: var(--color-soft);
		font-size: 0.76rem;
	}

	.hero-location :global(svg) {
		flex-shrink: 0;
		color: var(--color-accent);
	}

	.work-section,
	.gallery-section {
		padding-block: clamp(3.75rem, 8vw, 7.25rem);
	}

	#our-work {
		scroll-margin-top: 1rem;
	}

	.section-mast {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(15rem, 31ch);
		align-items: end;
		gap: 0.65rem 2.5rem;
		margin-bottom: clamp(2rem, 4.25vw, 3.5rem);
	}

	.section-mast h2,
	.story-copy h2,
	.partner-inner h2 {
		margin: 0;
		font-size: clamp(2.25rem, 5.45vw, 4.85rem);
		font-weight: 630;
		line-height: 1;
		letter-spacing: -0.065em;
		text-wrap: balance;
	}

	.section-mast > p,
	.work-description,
	.story-copy > p:not(.eyebrow),
	.partner-inner p:last-of-type {
		color: var(--color-soft);
		line-height: 1.6;
	}

	.section-mast > p {
		margin: 0;
	}

	.work-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: clamp(1rem, 2.3vw, 2rem);
	}

	.work-card {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 0 0 1rem;
		border-bottom: 1px solid var(--color-line);
	}

	.work-photo,
	.story-photo {
		overflow: hidden;
		aspect-ratio: var(--photo-aspect);
		background: var(--color-panel);
	}

	.work-photo img,
	.story-photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.work-rhythm {
		margin: 1.1rem 0 0.35rem;
		color: var(--color-accent);
		font-size: 0.72rem;
		font-weight: 650;
		letter-spacing: 0.105em;
		text-transform: uppercase;
	}

	.work-card h3 {
		margin: 0 0 0.5rem;
		font-size: clamp(1.23rem, 2.1vw, 1.75rem);
		font-weight: 640;
	}

	.work-card h3 a {
		color: inherit;
	}

	.work-card h3 a::after {
		position: absolute;
		inset: 0;
		content: '';
	}

	.work-card h3 a:focus-visible {
		outline: none;
	}

	.work-card h3 a:focus-visible::after {
		outline: 2px solid var(--color-accent);
		outline-offset: 5px;
	}

	.work-description {
		flex: 1;
		margin-bottom: 1rem;
	}

	.work-action {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		color: var(--color-strong);
		font-size: 0.9rem;
		font-weight: 650;
	}

	.work-card:hover .work-action,
	.work-card:focus-within .work-action {
		color: var(--color-accent);
	}

	.story-section {
		background: var(--color-panel);
		border-block: 1px solid var(--color-line);
	}

	.story-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		align-items: center;
		gap: 2rem clamp(2rem, 7vw, 6.1rem);
	}

	.story-grid figure {
		margin: 0;
	}

	.story-grid figcaption {
		padding-top: 0.6rem;
		color: var(--color-soft);
		font-size: 0.75rem;
	}

	.story-copy h2 {
		margin-bottom: 1.1rem;
	}

	.scripture-band {
		background: #151c2d;
		color: var(--color-accent);
	}

	.scripture-inner {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		justify-content: center;
		gap: clamp(1rem, 3vw, 2rem);
		max-width: 64rem;
		padding-block: clamp(2.15rem, 5.8vw, 5rem);
	}

	.scripture-inner > :global(svg) {
		margin-top: 0.15rem;
	}

	.scripture-inner blockquote {
		margin: 0;
	}

	.scripture-inner p {
		margin: 0 0 0.6rem;
		color: var(--color-strong);
		font-size: clamp(1.33rem, 3.35vw, 2.45rem);
		font-weight: 530;
		line-height: 1.16;
		letter-spacing: -0.035em;
		text-wrap: balance;
	}

	.scripture-inner cite {
		font-size: 0.73rem;
		font-style: normal;
		font-weight: 650;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(1rem, 3vw, 2.75rem);
	}

	.partner-section {
		background: var(--color-panel);
		border-block: 1px solid var(--color-line);
	}

	.partner-inner {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		gap: 1.5rem 3rem;
		align-items: end;
	}

	.partner-inner p:last-of-type {
		max-width: 47ch;
	}

	@media (prefers-reduced-motion: no-preference) {
		.hero-visual img {
			animation: open-frame 1.8s var(--ease-out) both;
			transform-origin: 71% 54%;
		}
	}

	@keyframes open-frame {
		from {
			transform: scale(1.09);
		}
		to {
			transform: scale(1);
		}
	}

	@media (max-width: 850px) {
		.section-mast {
			grid-template-columns: minmax(0, 1fr);
		}

		.section-mast > p {
			max-width: 48ch;
		}
	}

	@media (max-width: 760px) {
		.home-hero {
			min-height: 0;
		}

		.hero-visual {
			position: relative;
			inset: auto;
			height: clamp(12rem, 55vw, 23rem);
		}

		.hero-visual img {
			object-position: 72% 53%;
		}

		.hero-visual::after {
			background: linear-gradient(0deg, var(--color-screen), transparent 54%);
		}

		.hero-visual figcaption {
			right: 1.15rem;
			bottom: 0.7rem;
		}

		.hero-grid {
			padding-block: 1.05rem 2.6rem;
		}

		.hero-copy h1 {
			font-size: clamp(3.1rem, 12.3vw, 6rem);
		}

		.hero-copy h1 > span {
			display: inline;
		}

		.hero-copy .eyebrow {
			margin-bottom: 0.7rem;
		}

		.hero-intro {
			margin-bottom: 1.05rem;
		}

		.story-grid,
		.partner-inner,
		.work-grid,
		.gallery-grid {
			grid-template-columns: minmax(0, 1fr);
		}

		.work-grid,
		.gallery-grid {
			gap: 2rem;
		}
	}
</style>
