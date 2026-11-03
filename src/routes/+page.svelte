<script lang="ts">
	import { resolve } from '$app/paths';
	import { siteConfig } from '#lib/config/site.js';
	import BlogSection from '#lib/components/home/BlogSection.svelte';
	import type { PageProps } from './$types';
	import {
		IconSeedling,
		IconSoup,
		IconJacket,
		IconHeartHandshake,
		IconPray,
		IconMountain,
		IconArrowRight,
		IconChevronLeft,
		IconChevronRight,
		IconSparkles,
		IconMapPin,
		IconCheck,
		IconShieldCheck,
		IconCalendarHeart
	} from '@tabler/icons-svelte';

	let { data }: PageProps = $props();

	let carousel1Index = $state(0);
	let carousel2Index = $state(0);

	const slides1 = siteConfig.legacyPhotos.carousel1;
	const slides2 = siteConfig.legacyPhotos.carousel2;

	function prevSlide1() {
		carousel1Index = (carousel1Index - 1 + slides1.length) % slides1.length;
	}

	function nextSlide1() {
		carousel1Index = (carousel1Index + 1) % slides1.length;
	}

	function prevSlide2() {
		carousel2Index = (carousel2Index - 1 + slides2.length) % slides2.length;
	}

	function nextSlide2() {
		carousel2Index = (carousel2Index + 1) % slides2.length;
	}
</script>

<svelte:head>
	<title>Grow Your Faith Ministries | Restoring Hope &amp; Purpose (CT)</title>
	<meta
		name="description"
		content="Founded by Courtney Ribeiro in 2014, Grow Your Faith Ministries restores shattered dreams through weekly Friday mentorship and holiday community outreach."
	/>
	<meta property="og:title" content="Grow Your Faith Ministries | Restoring Hope & Purpose (CT)" />
	<meta
		property="og:description"
		content="Founded by Courtney Ribeiro in 2014, Grow Your Faith Ministries restores shattered dreams through weekly Friday mentorship and holiday community outreach."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<!-- 2. Hero Section (Split 60/40 Layout on Deep Navy #0F203C) -->
<section class="hero-section">
	<div class="container hero-grid">
		<div class="hero-copy">
			<div class="eyebrow-badge">
				<IconSeedling size={16} />
				<span>HELPING INDIVIDUALS FIND HOPE SINCE 2014</span>
			</div>

			<h1>Restoring Shattered Dreams. Reawakening God-Given Purpose.</h1>

			<p class="hero-subheadline">
				Too many people walk through life believing their best days are behind them. At Grow Your
				Faith Ministries, we step into the gap—combining weekly one-on-one faith restoration with
				tangible community outreach to prove that your life has meaning far beyond your current
				circumstances.
			</p>

			<div class="hero-ctas">
				<a href={resolve('/partner')} class="btn btn-gold">
					<IconHeartHandshake size={20} />
					<span>Partner With Our Mission</span>
				</a>
				<a href={resolve('/prayer-and-support')} class="btn btn-outline-light">
					<IconPray size={20} />
					<span>Request Prayer or Mentorship</span>
				</a>
			</div>

			<div class="hero-local-anchor">
				<IconMapPin size={17} />
				<span>
					Serving Wolcott, Waterbury, New Haven &amp; Hartford Counties in Connecticut + National
					Faith Mentorship
				</span>
			</div>
		</div>

		<div class="hero-visual">
			<div class="hero-image-frame">
				<img
					src="/images/gyfm-holiday-outreach-hero.webp"
					width="1200"
					height="675"
					fetchpriority="high"
					alt="Courtney Ribeiro serving in the Connecticut community through Grow Your Faith Ministries"
					class="hero-img"
				/>
				<div class="scripture-overlay">
					<div class="scripture-icon">
						<IconMountain size={20} />
					</div>
					<blockquote>
						“Faith the size of a mustard seed moves mountains.”
						<cite>— Matthew 17:20</cite>
					</blockquote>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- 3. Quantified Impact Bar (4-Column Metric Strip) -->
<section class="impact-strip" aria-label="Quantified Ministry Impact Ledger">
	<div class="container impact-grid">
		<div class="impact-item">
			<span class="impact-number">2014</span>
			<span class="impact-label">Year Founded &amp; Serving Continuously (12+ Years Active)</span>
		</div>
		<div class="impact-item">
			<span class="impact-number">52 Fridays/Yr</span>
			<span class="impact-label">Dedicated Strictly to Ministry &amp; Mentorship (500+ Served)</span
			>
		</div>
		<div class="impact-item">
			<span class="impact-number">40 Days</span>
			<span class="impact-label"
				>Annual Holiday Sabbatical (Thanksgiving – Jan 4) for Full-Time Outreach</span
			>
		</div>
		<div class="impact-item">
			<span class="impact-number">100%</span>
			<span class="impact-label"
				>Of Outreach Contributions Go Directly to Meals &amp; Children’s Winter Gear</span
			>
		</div>
	</div>
</section>

<!-- 4. The Heart of the Mission (Editorial Story Block) -->
<section class="section">
	<div class="container story-grid">
		<div class="story-media">
			<img
				src="/images/gyfm-mustard-seed-ministry.webp"
				width="1200"
				height="675"
				loading="lazy"
				alt="Grow Your Faith Ministries founder Courtney Ribeiro sharing faith and mentorship"
				class="story-img"
			/>
			<div class="story-caption">
				<i>With the help and support of clients like you</i> — restoring hope across Connecticut since
				2014.
			</div>
		</div>

		<div class="story-content">
			<span class="badge-teal">
				<IconSparkles size={15} />
				<span>The Heart of the Mission</span>
			</span>
			<h2 class="story-heading">When Dreams Are Buried, We Help Bring Them Back to Life</h2>

			<blockquote class="founder-quote">
				<p>
					“Over the years, I met countless individuals who had lost all hope. Their dreams had been
					shattered by life’s circumstances, and it broke my heart wide open to realize they no
					longer had faith in themselves to live the life God truly designed for them.
				</p>
				<p>
					Grow Your Faith Ministries was born in 2014 from a burning desire to share the love of
					Christ in both word and action. Our mission is simple but urgent: to help you uncover the
					visions buried deep inside you, ignite your God-given talents, and walk boldly into your
					calling.”
				</p>
				<footer>— <strong>Courtney Ribeiro</strong>, Founder</footer>
			</blockquote>

			<div class="legacy-highlight">
				<p>
					Grow Your Faith Ministries’ main goal is to help people <strong
						>restore their dreams, goals, and visions</strong
					>
					that are buried deep inside of them; to bring them back to life and to
					<strong
						>teach them that their lives have meaning and purpose far beyond their current
						circumstances</strong
					>.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- 5. Three Core Ministry Pillars (3-Card Grid) -->
<section class="section-alt">
	<div class="container">
		<div class="section-header">
			<span class="badge-teal">Three Core Ministry Pillars</span>
			<h2>Faith in Word and Action Across Every Season</h2>
			<p>
				Every pillar of Grow Your Faith Ministries is designed to meet individuals right where they
				are—spiritually, emotionally, and practically.
			</p>
		</div>

		<div class="pillars-grid">
			<!-- Card 1 -->
			<article class="card pillar-card">
				<div class="pillar-top">
					<span class="pillar-icon">
						<IconCalendarHeart size={26} />
					</span>
					<span class="badge-teal">Every Friday Year-Round</span>
				</div>
				<h3>Weekly Friday Ministry</h3>
				<p>
					God has abundantly blessed our work so that every Friday is set aside exclusively to
					minister to those in need—offering spiritual encouragement, life-purpose coaching, and
					direct community care.
				</p>
				<a href={resolve('/programs/friday-ministry')} class="pillar-link">
					<span>Explore Friday Ministry</span>
					<IconArrowRight size={18} />
				</a>
			</article>

			<!-- Card 2 -->
			<article class="card pillar-card featured-pillar">
				<div class="pillar-top">
					<span class="pillar-icon gold">
						<IconJacket size={26} />
					</span>
					<span class="badge-emerald">Thanksgiving through January 4</span>
				</div>
				<h3>Thanksgiving &amp; Christmas Outreach</h3>
				<p>
					Every holiday season, we pause business operations for six weeks to serve hot holiday
					meals and purchase brand-new coats, hats, mittens, and blankets for children in need.
				</p>
				<a href={resolve('/programs/holiday-outreach')} class="pillar-link">
					<span>Support the Holiday Drive</span>
					<IconArrowRight size={18} />
				</a>
			</article>

			<!-- Card 3 -->
			<article class="card pillar-card">
				<div class="pillar-top">
					<span class="pillar-icon">
						<IconSeedling size={26} />
					</span>
					<span class="badge-teal">Mustard Seed Mentorship</span>
				</div>
				<h3>Purpose &amp; Vision Restoration</h3>
				<p>
					Practical, faith-rooted guidance designed to help individuals overcome adversity,
					rediscover their self-worth in Christ, and steward their God-given talents.
				</p>
				<a href={resolve('/restore-your-purpose')} class="pillar-link">
					<span>Start Your Restoration Journey</span>
					<IconArrowRight size={18} />
				</a>
			</article>
		</div>
	</div>
</section>

<!-- Community Impact Galleries (Preserving all 13 original ministry photos with descriptive local alt attributes) -->
<section class="section">
	<div class="container">
		<div class="section-header">
			<span class="badge-teal">Authentic Ministry Proof</span>
			<h2>Serving Hot Holiday Meals &amp; Children’s Winter Warmth Since 2014</h2>
			<p>
				God’s word says that it takes faith the size of a mustard seed to move a mountain. Every
				Friday and every Thanksgiving through January 4, we put that faith to work in our community.
			</p>
		</div>

		<div class="carousels-grid">
			<!-- Carousel 1: Thanksgiving & Meals Outreach -->
			<div class="card carousel-card">
				<div class="carousel-header">
					<div>
						<span class="badge-teal"><IconSoup size={14} /> Holiday Meals &amp; Service</span>
						<h3>Thanksgiving &amp; Community Meal Outreach</h3>
					</div>
					<div class="carousel-controls">
						<button
							type="button"
							class="carousel-btn"
							aria-label="Previous Thanksgiving outreach photo"
							onclick={prevSlide1}
						>
							<IconChevronLeft size={20} />
						</button>
						<span class="carousel-counter">{carousel1Index + 1} / {slides1.length}</span>
						<button
							type="button"
							class="carousel-btn"
							aria-label="Next Thanksgiving outreach photo"
							onclick={nextSlide1}
						>
							<IconChevronRight size={20} />
						</button>
					</div>
				</div>
				<div class="carousel-viewport">
					<img
						src={slides1[carousel1Index].url}
						alt={slides1[carousel1Index].alt}
						loading="lazy"
						class="carousel-image"
					/>
				</div>
				<p class="carousel-caption">{slides1[carousel1Index].alt}</p>
			</div>

			<!-- Carousel 2: Coats, Hats, Mittens, Blankets & Homeless Outreach -->
			<div class="card carousel-card">
				<div class="carousel-header">
					<div>
						<span class="badge-emerald"><IconJacket size={14} /> Winter Warmth &amp; Care</span>
						<h3>Children’s Coats, Blankets &amp; Street Ministry</h3>
					</div>
					<div class="carousel-controls">
						<button
							type="button"
							class="carousel-btn"
							aria-label="Previous winter outreach photo"
							onclick={prevSlide2}
						>
							<IconChevronLeft size={20} />
						</button>
						<span class="carousel-counter">{carousel2Index + 1} / {slides2.length}</span>
						<button
							type="button"
							class="carousel-btn"
							aria-label="Next winter outreach photo"
							onclick={nextSlide2}
						>
							<IconChevronRight size={20} />
						</button>
					</div>
				</div>
				<div class="carousel-viewport">
					<img
						src={slides2[carousel2Index].url}
						alt={slides2[carousel2Index].alt}
						loading="lazy"
						class="carousel-image"
					/>
				</div>
				<p class="carousel-caption">{slides2[carousel2Index].alt}</p>
			</div>
		</div>
	</div>
</section>

<!-- 6. Latest Blog Articles Section (Displaying last few blogs + See All Blogs button) -->
<BlogSection posts={data.latestPosts} />

<!-- 7. The "Client & Partner Fuel" Section (Bridging MWC Digital Agency & Donors) -->
<section class="section-navy">
	<div class="container partner-fuel-grid">
		<div class="partner-fuel-copy">
			<div class="eyebrow-badge">
				<IconShieldCheck size={16} />
				<span>WITH THE HELP AND SUPPORT OF CLIENTS LIKE YOU</span>
			</div>
			<h2>Powered by Faith. Fueled by Clients &amp; Partners Like You.</h2>
			<p class="partner-lead">
				Grow Your Faith Ministries thrives because of a unique stewardship model. A portion of time,
				resources, and revenue from our corporate partners—including <strong
					>MWC Digital Agency</strong
				>
				and our executive coaching clients—directly underwrites our Friday ministry and winter children’s
				drives. When you partner with us, you put hot meals on tables and warm coats on children’s shoulders.
			</p>

			<ul class="stewardship-points">
				<li>
					<IconCheck size={18} />
					<span
						><strong>Zero Overhead Leakage:</strong> Corporate underwriting covers administrative costs
						so 100% of donor sponsorships go directly to families.</span
					>
				</li>
				<li>
					<IconCheck size={18} />
					<span
						><strong>24 Days Until Thanksgiving 2026:</strong> Our Nov 26 – Jan 4 winter coat and meal
						drive is actively equipping children across Connecticut.</span
					>
				</li>
			</ul>

			<div class="hero-ctas">
				<a href={resolve('/partner')} class="btn btn-gold">
					<IconHeartHandshake size={20} />
					<span>Become a Monthly Mustard Seed Partner</span>
				</a>
				<a href={resolve('/programs/holiday-outreach')} class="btn btn-outline-light">
					<IconJacket size={20} />
					<span>Sponsor a Child’s Winter Kit ($65)</span>
				</a>
			</div>
		</div>

		<div class="partner-fuel-card">
			<div class="prayer-blessing-box">
				<IconPray size={32} />
				<h3>A Prayer Over Your Calling</h3>
				<p>
					“I pray that you allow God to open your eyes, your heart, and your mind so that you can
					live the life you’ve been called to live through Him.”
				</p>
				<span>— Courtney Ribeiro</span>
				<hr />
				<div class="quick-links">
					<a href={resolve('/about')}>Read Courtney’s 2014 Origin Story →</a>
					<a href={resolve('/prayer-and-support')}>Submit a Confidential Prayer Request →</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-section {
		background: linear-gradient(135deg, var(--color-navy) 0%, #142b52 100%);
		color: #ffffff;
		padding: 4.5rem 0 5rem;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: 1.35fr 1fr;
		gap: 3rem;
		align-items: center;
	}

	.hero-copy h1 {
		color: #ffffff;
		margin-top: 1rem;
		margin-bottom: 1.25rem;
	}

	.hero-subheadline {
		font-size: 1.12rem;
		color: rgba(255, 255, 255, 0.88);
		margin-bottom: 2rem;
		max-width: 640px;
	}

	.hero-ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.75rem;
	}

	.hero-local-anchor {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.86rem;
		color: var(--color-gold);
		font-weight: 600;
	}

	.hero-image-frame {
		position: relative;
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 2px solid rgba(212, 168, 67, 0.45);
		box-shadow: var(--shadow-elevated);
		background: #091529;
	}

	.hero-img {
		width: 100%;
		height: auto;
		display: block;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	.scripture-overlay {
		background: rgba(15, 32, 60, 0.94);
		border-top: 1px solid rgba(212, 168, 67, 0.4);
		padding: 1.15rem 1.35rem;
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
	}

	.scripture-icon {
		color: var(--color-gold);
		flex-shrink: 0;
		margin-top: 0.15rem;
	}

	.scripture-overlay blockquote {
		margin: 0;
		font-family: var(--font-heading);
		font-style: italic;
		font-size: 1rem;
		color: #ffffff;
	}

	.scripture-overlay cite {
		display: block;
		font-family: var(--font-body);
		font-style: normal;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-gold);
		margin-top: 0.25rem;
	}

	/* Impact Strip */
	.impact-strip {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		padding: 2.25rem 0;
		box-shadow: 0 8px 24px -12px rgba(15, 32, 60, 0.06);
	}

	.impact-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.75rem;
	}

	.impact-item {
		display: flex;
		flex-direction: column;
		border-left: 3px solid var(--color-gold);
		padding-left: 1.1rem;
	}

	.impact-number {
		font-family: var(--font-heading);
		font-size: 1.9rem;
		font-weight: 700;
		color: var(--color-navy);
		line-height: 1.15;
	}

	.impact-label {
		font-size: 0.88rem;
		color: var(--color-text-muted);
		font-weight: 500;
		margin-top: 0.25rem;
	}

	/* Editorial Story */
	.story-grid {
		display: grid;
		grid-template-columns: 1fr 1.25fr;
		gap: 3.5rem;
		align-items: center;
	}

	.story-img {
		width: 100%;
		height: auto;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-card);
	}

	.story-caption {
		margin-top: 0.75rem;
		font-size: 0.88rem;
		color: var(--color-text-muted);
		text-align: center;
	}

	.story-heading {
		margin-top: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.founder-quote {
		margin: 0 0 1.5rem;
		padding: 1.5rem 1.75rem;
		background: var(--color-surface);
		border-left: 4px solid var(--color-gold);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
		box-shadow: var(--shadow-card);
	}

	.founder-quote p {
		font-size: 1.03rem;
		color: var(--color-text);
	}

	.founder-quote footer {
		font-size: 0.95rem;
		color: var(--color-navy);
		margin-top: 0.5rem;
	}

	.legacy-highlight {
		background: rgba(15, 164, 175, 0.08);
		border: 1px solid rgba(15, 164, 175, 0.25);
		padding: 1.15rem 1.35rem;
		border-radius: var(--radius-sm);
		font-size: 0.96rem;
	}

	.legacy-highlight p {
		margin: 0;
	}

	/* Pillars */
	.section-header {
		text-align: center;
		max-width: 720px;
		margin: 0 auto 3rem;
	}

	.section-header h2 {
		margin-top: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.section-header p {
		color: var(--color-text-muted);
		margin: 0;
	}

	.pillars-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.75rem;
	}

	.pillar-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: transform 0.2s ease;
	}

	.pillar-card:hover {
		transform: translateY(-4px);
	}

	.featured-pillar {
		border: 2px solid var(--color-gold);
	}

	.pillar-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.pillar-icon {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: var(--color-navy);
		color: var(--color-gold);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.pillar-icon.gold {
		background: var(--color-gold);
		color: var(--color-navy);
	}

	.pillar-link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-weight: 700;
		color: var(--color-teal);
		margin-top: 0.75rem;
	}

	.pillar-link:hover {
		color: var(--color-navy);
	}

	/* Carousels */
	.carousels-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.carousel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.carousel-header h3 {
		font-size: 1.2rem;
		margin: 0.4rem 0 0;
	}

	.carousel-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.carousel-btn {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1px solid var(--color-border);
		background: var(--color-parchment);
		color: var(--color-navy);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.carousel-btn:hover {
		background: var(--color-gold);
		border-color: var(--color-gold);
	}

	.carousel-counter {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--color-text-muted);
		min-width: 44px;
		text-align: center;
	}

	.carousel-viewport {
		width: 100%;
		aspect-ratio: 16 / 10;
		background: #0f203c;
		border-radius: var(--radius-sm);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.carousel-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.carousel-caption {
		margin: 0.75rem 0 0;
		font-size: 0.86rem;
		color: var(--color-text-muted);
		font-style: italic;
	}

	/* Partner Fuel */
	.partner-fuel-grid {
		display: grid;
		grid-template-columns: 1.35fr 1fr;
		gap: 3rem;
		align-items: center;
	}

	.partner-fuel-copy h2 {
		margin-top: 1rem;
	}

	.partner-lead {
		color: rgba(255, 255, 255, 0.88);
		font-size: 1.05rem;
	}

	.stewardship-points {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}

	.stewardship-points li {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.95rem;
	}

	.stewardship-points li :global(svg) {
		color: var(--color-emerald);
		flex-shrink: 0;
		margin-top: 0.25rem;
	}

	.prayer-blessing-box {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(212, 168, 67, 0.4);
		border-radius: var(--radius-md);
		padding: 2.25rem;
		color: #ffffff;
	}

	.prayer-blessing-box :global(svg) {
		color: var(--color-gold);
		margin-bottom: 0.75rem;
	}

	.prayer-blessing-box p {
		font-family: var(--font-heading);
		font-style: italic;
		font-size: 1.15rem;
		color: rgba(255, 255, 255, 0.95);
	}

	.prayer-blessing-box span {
		font-weight: 700;
		color: var(--color-gold);
		font-size: 0.9rem;
	}

	.prayer-blessing-box hr {
		border: none;
		border-top: 1px solid rgba(255, 255, 255, 0.15);
		margin: 1.5rem 0;
	}

	.quick-links {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.quick-links a {
		color: var(--color-gold);
		font-weight: 600;
		font-size: 0.92rem;
	}

	@media (max-width: 960px) {
		.hero-grid,
		.story-grid,
		.pillars-grid,
		.carousels-grid,
		.partner-fuel-grid {
			grid-template-columns: 1fr;
		}

		.impact-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 560px) {
		.impact-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
