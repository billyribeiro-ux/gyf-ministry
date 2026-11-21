<script lang="ts">
	import '#lib/styles/inner-page.css';
	import '#lib/styles/prose.css';
	import { resolve } from '$app/paths';
	import { IconArrowLeft, IconArrowUpRight, IconChevronDown } from '@tabler/icons-svelte';
	import { cinematicPhotoReveal, gsapHeroEntrance } from '#lib/attachments/gsap.js';
	import PostCard from '#lib/components/blog/PostCard.svelte';
	import SEO from '#lib/components/blog/SEO.svelte';
	import { SITE_ORIGIN } from '#lib/seo/structured-data';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();

	let readingProgress = $state(0);
	let isReading = $state(false);
	let copyLinkStatus = $state('');
	let canNativeShare = $derived(
		typeof navigator !== 'undefined' && typeof navigator.share === 'function'
	);

	// Server (getPublicPostViewBySlug) already runs normalizePostHeadings once (SSOT)
	// and supplies 1:1 synchronized heading IDs and TOC items.
	let toc = $derived(data.post?.toc ?? []);
	let activeHeadingId = $state('');
	let processedContent = $derived(data.post?.content ?? '');
	let isTocEnabled = $derived.by(() => {
		const raw = data.post?.customFields;
		if (!raw) return true;
		try {
			const parsed: unknown = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				return !parsed.some(
					(entry) =>
						typeof entry === 'object' &&
						entry !== null &&
						(entry as Record<string, unknown>).key === '__enableToc' &&
						(entry as Record<string, unknown>).value === 'false'
				);
			}
		} catch {
			// ignore malformed customFields
		}
		return true;
	});
	let showToc = $derived(isTocEnabled && toc.length >= 3);

	// Real files only: the server derives the srcset from the media row's stored variants.
	let coverSrcset = $derived(data.post?.coverSrcset ?? undefined);

	let shareUrl = $derived(
		data.post
			? `${SITE_ORIGIN}/blog/${data.post.slug}`
			: data.payload
				? `${SITE_ORIGIN}/blog/${data.payload.slug}`
				: `${SITE_ORIGIN}/blog`
	);

	let shareTitle = $derived(
		data.post?.title ?? data.payload?.title ?? 'Grow Your Faith Ministries'
	);

	function trackArticlePageview() {
		const activeSlug = data.post?.slug;
		const isPreview = data.post?.isPreview;
		if (!activeSlug || isPreview || typeof window === 'undefined') return;

		const path = window.location.pathname;
		fetch('/api/analytics/pageview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				path,
				referrer: document.referrer || undefined
			}),
			keepalive: true
		}).catch((err) => {
			console.debug('[pageview] Failed to record pageview:', err);
		});
	}

	function trackReadingProgress(content: HTMLElement) {
		const slug = data.post?.slug;
		if (!slug) return;

		const update = () => {
			const bounds = content.getBoundingClientRect();
			const readingLine = Math.min(150, window.innerHeight / 3);
			readingProgress = Math.min(
				1,
				Math.max(0, (readingLine - bounds.top) / Math.max(1, bounds.height))
			);
			isReading = bounds.top <= readingLine && bounds.bottom > 0;
		};
		const observer = new ResizeObserver(update);
		observer.observe(content);
		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);
		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	}

	/**
	 * Reactive TOC scroll-spy attachment (re-runs whenever `toc` or the `<details>`
	 * panel node changes across client-side post navigations) and keeps the active
	 * entry visible inside the sticky TOC scroll container via `panel.scrollTop` math.
	 */
	function setupTocScrollSpy(panel: HTMLDetailsElement) {
		const items = toc;
		const headings = items.flatMap(({ id }) => {
			const heading = document.getElementById(id);
			return heading ? [heading] : [];
		});

		if (headings.length === 0) return;
		panel.open = window.matchMedia('(min-width: 768px)').matches;

		const followActiveInPanel = (activeLink: HTMLElement | null) => {
			if (!activeLink) return;
			if (panel.scrollHeight <= panel.clientHeight) return;
			const itemTop =
				activeLink.getBoundingClientRect().top -
				panel.getBoundingClientRect().top +
				panel.scrollTop;
			const itemBottom = itemTop + activeLink.offsetHeight;
			const viewTop = panel.scrollTop;
			const viewBottom = viewTop + panel.clientHeight;
			const margin = 24;
			if (itemTop < viewTop + margin) {
				panel.scrollTop = Math.max(0, itemTop - margin);
			} else if (itemBottom > viewBottom - margin) {
				panel.scrollTop = itemBottom - panel.clientHeight + margin;
			}
		};

		const updateActiveHeading = () => {
			let currentId = headings[0].id;
			for (const heading of headings) {
				if (heading.getBoundingClientRect().top <= 150) {
					currentId = heading.id;
				}
			}
			activeHeadingId = currentId;
			if (panel.open) {
				followActiveInPanel(
					panel.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(currentId)}"]`)
				);
			}
		};

		updateActiveHeading();
		window.addEventListener('scroll', updateActiveHeading, { passive: true });
		return () => {
			window.removeEventListener('scroll', updateActiveHeading);
		};
	}

	async function handleCopyShareLink() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			copyLinkStatus = 'Link copied to clipboard.';
			setTimeout(() => {
				copyLinkStatus = '';
			}, 3000);
		} catch (err) {
			console.warn('[share] Clipboard copy failed:', err);
			copyLinkStatus = 'Could not copy link.';
		}
	}

	async function handleNativeShare() {
		if (!navigator.share) return;
		try {
			await navigator.share({
				title: shareTitle,
				url: shareUrl
			});
		} catch (err) {
			console.debug('[share] Native share cancelled or failed:', err);
		}
	}
</script>

<SEO schema={data.jsonLdSchema} />

<div id="blog-article-page" class="inner-page blog-article-page">
	{#if data.locked && data.payload}
		<section class="blog-width blog-content" aria-labelledby="locked-h1">
			<nav class="blog-breadcrumbs" aria-label="Breadcrumb">
				<ol>
					<li><a href={resolve('/')}>Home</a></li>
					<li><a href={resolve('/blog')}>Journal</a></li>
					<li aria-current="page">{data.payload.title}</li>
				</ol>
			</nav>

			<div class="locked-card">
				<span class="blog-kicker">Protected article</span>
				<h1 id="locked-h1" class="article-h1">{data.payload.title}</h1>
				<p class="locked-notice">{data.payload.notice}</p>

				{#if form?.unlockError}
					<div class="unlock-error" role="alert">
						{form.unlockError}
					</div>
				{/if}

				<form method="POST" action="?/unlock" class="unlock-form">
					<label for="unlock-password-input" class="unlock-label"> Access Password </label>
					<div class="unlock-input-row">
						<input
							id="unlock-password-input"
							type="password"
							name="password"
							autocomplete="current-password"
							required
							class="unlock-input"
							placeholder="Enter password..."
						/>
						<button type="submit" class="unlock-submit-btn"> Unlock Article </button>
					</div>
				</form>
			</div>
		</section>
	{:else if data.post}
		{#if isReading}
			<div
				class="reading-progress-track"
				aria-hidden="true"
				style:--progress={readingProgress}
			></div>
		{/if}
		{#if data.post.isPreview}
			<div class="preview-banner" role="status">
				Draft preview. Publish this article to make it public.
			</div>
		{/if}

		<article class="article-container" {@attach trackArticlePageview}>
			<header class="article-header journal-dark-band">
				<div class="blog-width">
					<div class="article-header-inner" {@attach gsapHeroEntrance}>
						<nav class="blog-breadcrumbs" aria-label="Breadcrumb">
							<ol>
								<li><a href={resolve('/')}>Home</a></li>
								<li><a href={resolve('/blog')}>Journal</a></li>
								<li aria-current="page">Article</li>
							</ol>
						</nav>

						<div class="article-meta-badges" data-hero-item>
							{#if data.post.category}
								<a
									href={resolve('/blog/category/[slug]', { slug: data.post.category.slug })}
									class="article-category-badge"
								>
									{data.post.category.name}
								</a>
							{/if}
							{#if data.post.seriesName}
								<span class="article-pillar-badge">{data.post.seriesName}</span>
							{/if}
							{#if data.post.isPillar}
								<span class="article-pillar-badge">Cornerstone guide</span>
							{/if}
							{#if data.post.readingTime}
								<span class="article-reading-time">{data.post.readingTime} min read</span>
							{/if}
						</div>

						<h1 class="article-h1" data-hero-item>{data.post.title}</h1>

						{#if data.post.subtitle}
							<p class="article-subtitle" data-hero-item>{data.post.subtitle}</p>
						{/if}

						{#if data.post.excerpt}
							<p class="article-excerpt" data-hero-item>{data.post.excerpt}</p>
						{/if}

						<div class="article-byline-row" data-hero-item>
							{#if data.post.author}
								<div class="byline-author">
									<a href={resolve('/about')} class="byline-author-link">
										<strong>{data.post.author.name}</strong>
									</a>
									{#if data.post.author.jobTitle}
										<span class="byline-role">{data.post.author.jobTitle}</span>
									{/if}
								</div>
							{/if}
							{#if data.post.publishedAt}
								<time class="byline-date" datetime={new Date(data.post.publishedAt).toISOString()}>
									Published {new Date(data.post.publishedAt).toLocaleDateString('en-US', {
										month: 'long',
										day: 'numeric',
										year: 'numeric',
										timeZone: 'UTC'
									})}
								</time>
							{/if}
							{#if data.post.contentUpdatedAt && (!data.post.publishedAt || new Date(data.post.contentUpdatedAt).getTime() - new Date(data.post.publishedAt).getTime() > 60_000)}
								<time
									class="byline-date"
									datetime={new Date(data.post.contentUpdatedAt).toISOString()}
								>
									Updated {new Date(data.post.contentUpdatedAt).toLocaleDateString('en-US', {
										month: 'long',
										day: 'numeric',
										year: 'numeric',
										timeZone: 'UTC'
									})}
								</time>
							{/if}
						</div>
					</div>
				</div>
			</header>

			{#if data.post.coverImage}
				<div class="article-cover-band">
					<div class="blog-width">
						<figure class="article-cover-figure">
							<div class="article-cover-frame journal-photo" {@attach cinematicPhotoReveal}>
								<img
									src={data.post.coverImage}
									srcset={coverSrcset}
									sizes={coverSrcset ? '(max-width: 974px) 92vw, 896px' : undefined}
									alt={data.post.coverImageAlt || data.post.title}
									width={data.post.coverWidth ?? 1200}
									height={data.post.coverHeight ?? 675}
									loading="eager"
									fetchpriority="high"
									decoding="async"
									class="article-cover-img"
									data-cinematic-image
								/>
							</div>
							{#if data.post.coverImageCaption}
								<figcaption class="article-cover-caption">
									{data.post.coverImageCaption}
								</figcaption>
							{/if}
						</figure>
					</div>
				</div>
			{/if}

			<div class="blog-width article-reading">
				<div class={['article-body-layout', { 'has-toc': showToc }]}>
					{#if showToc}
						<aside class="article-toc-aside" aria-label="Table of contents">
							<details {@attach setupTocScrollSpy} class="toc-details">
								<summary class="toc-summary">
									<span>In this article</span>
									<IconChevronDown class="toc-caret" size={17} aria-hidden="true" />
								</summary>
								<nav aria-label="Article sections">
									<ol class="toc-list">
										{#each toc as item (item.id)}
											<li class={`toc-item toc-level-${item.level}`}>
												<a
													href={`#${item.id}`}
													data-toc-id={item.id}
													class="toc-link"
													aria-current={activeHeadingId === item.id ? 'location' : undefined}
													onclick={(event) => {
														activeHeadingId = item.id;
														if (window.matchMedia('(max-width: 767px)').matches) {
															const details = event.currentTarget.closest('details');
															if (details) details.open = false;
														}
													}}
												>
													{item.text}
												</a>
											</li>
										{/each}
									</ol>
								</nav>
							</details>
						</aside>
					{/if}

					<div class="article-main-column">
						<div class="prose-base article-prose" {@attach trackReadingProgress}>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html processedContent}
						</div>

						{#if data.post.tags.length > 0}
							<nav class="article-tag-list" aria-label="Article tags">
								{#each data.post.tags as tag (tag.id)}
									<a
										href={resolve('/blog/tag/[slug]', { slug: tag.slug })}
										class="article-tag-chip"
									>
										#{tag.name}
									</a>
								{/each}
							</nav>
						{/if}

						<section class="article-service-cta journal-dark-band" aria-labelledby="service-cta-h2">
							<span class="blog-kicker">Faith in action</span>
							<h2 id="service-cta-h2">You don’t have to carry this alone.</h2>
							<p>
								Tell us how we can pray for you. You can also talk with us on a Friday or find out
								how we bring meals and winter coats to Connecticut families.
							</p>
							<div class="service-cta-links">
								<a href={resolve('/prayer-and-support')} class="btn-cta-primary">Request prayer</a>
								<a href={resolve('/programs/friday-ministry')}>
									Friday Ministry <IconArrowUpRight size={17} aria-hidden="true" />
								</a>
								<a href={resolve('/programs/holiday-outreach')}>
									Holiday outreach <IconArrowUpRight size={17} aria-hidden="true" />
								</a>
							</div>
						</section>

						{#if data.post.faqList.length > 0}
							<section class="article-faq-section" aria-labelledby="article-faq-h2">
								<h2 id="article-faq-h2">Common questions</h2>
								<div class="faq-accordion">
									{#each data.post.faqList as faq, idx (faq.question)}
										<details class="faq-details" open={idx === 0}>
											<summary class="faq-summary">
												<h3 class="faq-question">{faq.question}</h3>
											</summary>
											<div class="faq-answer">
												<p>{faq.answer}</p>
											</div>
										</details>
									{/each}
								</div>
							</section>
						{/if}

						{#if data.post.author}
							<section class="author-bio-box" aria-label="About the author">
								{#if data.post.author.avatar}
									<img
										src={data.post.author.avatar}
										alt={data.post.author.avatarAlt || data.post.author.name}
										width="72"
										height="72"
										loading="lazy"
										decoding="async"
										class="author-avatar"
									/>
								{/if}
								<div class="author-bio-content">
									<div class="author-bio-header">
										<h2 class="author-name">
											<a href={resolve('/about')} class="author-name-link"
												>{data.post.author.name}</a
											>
										</h2>
										{#if data.post.author.jobTitle}
											<span class="author-role">{data.post.author.jobTitle}</span>
										{/if}
										{#if data.post.author.credentials}
											<span class="author-creds">
												({data.post.author.credentials})
											</span>
										{/if}
									</div>
									{#if data.post.author.bio || data.post.author.shortBio}
										<p class="author-description">
											{data.post.author.bio || data.post.author.shortBio}
										</p>
									{/if}
									<div class="author-links">
										<!-- eslint-disable svelte/no-navigation-without-resolve -- external author profile URLs -->
										{#if data.post.author.linkedin}
											<a href={data.post.author.linkedin} target="_blank" rel="noopener noreferrer">
												LinkedIn (opens in new tab)
											</a>
										{/if}
										{#if data.post.author.twitter}
											<a href={data.post.author.twitter} target="_blank" rel="noopener noreferrer">
												X (opens in new tab)
											</a>
										{/if}
										{#if data.post.author.website}
											<a href={data.post.author.website} target="_blank" rel="noopener noreferrer">
												Website (opens in new tab)
											</a>
										{/if}
										<!-- eslint-enable svelte/no-navigation-without-resolve -->
									</div>
								</div>
							</section>
						{/if}

						<section class="article-share-bar" aria-label="Share this article">
							<span class="share-label">Share this article</span>
							<div class="share-buttons">
								<a
									href={`https://x.com/intent/post?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Share on X (opens in new tab)"
									class="share-btn"
								>
									X
								</a>
								<a
									href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Share on LinkedIn (opens in new tab)"
									class="share-btn"
								>
									LinkedIn
								</a>
								<a
									href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Share via Email (opens in new tab)"
									class="share-btn"
								>
									Email
								</a>
								<button type="button" class="share-btn" onclick={handleCopyShareLink}>
									Copy Link
								</button>
								{#if canNativeShare}
									<button type="button" class="share-btn" onclick={handleNativeShare}>
										Share
									</button>
								{/if}
							</div>
							{#if copyLinkStatus}
								<span class="copy-status" role="status">{copyLinkStatus}</span>
							{/if}
						</section>

						{#if data.post.previousPost || data.post.nextPost}
							<nav class="prev-next-nav" aria-label="Previous and next articles">
								{#if data.post.previousPost}
									<a
										href={resolve('/blog/[slug]', { slug: data.post.previousPost.slug })}
										class="prev-next-card is-prev"
									>
										<span class="pn-label">Previous Article</span>
										<strong class="pn-title">{data.post.previousPost.title}</strong>
									</a>
								{/if}
								{#if data.post.nextPost}
									<a
										href={resolve('/blog/[slug]', { slug: data.post.nextPost.slug })}
										class="prev-next-card is-next"
									>
										<span class="pn-label">Next Article</span>
										<strong class="pn-title">{data.post.nextPost.title}</strong>
									</a>
								{/if}
							</nav>
						{/if}
					</div>
				</div>

				{#if data.post.relatedPosts.length > 0}
					<section class="related-articles-section" aria-labelledby="related-h2">
						<h2 id="related-h2" class="blog-section-title">Keep reading</h2>
						<div class="posts-grid">
							{#each data.post.relatedPosts as rel (rel.id)}
								<PostCard
									post={{
										id: rel.id,
										title: rel.title,
										slug: rel.slug,
										excerpt: rel.excerpt,
										coverImage: rel.coverImage,
										coverImageAlt: rel.coverImageAlt,
										readingTime: rel.readingTime,
										publishedAt: rel.publishedAt,
										category:
											rel.categoryName && rel.categorySlug
												? {
														name: rel.categoryName,
														slug: rel.categorySlug
													}
												: null
									}}
									headingLevel="h3"
								/>
							{/each}
						</div>
					</section>
				{/if}

				<div class="back-to-blog-row">
					<a href={resolve('/blog')} class="back-to-blog-link">
						<IconArrowLeft size={18} aria-hidden="true" /> Back to the journal
					</a>
				</div>
			</div>
		</article>
	{/if}
</div>

<style>
	.reading-progress-track {
		position: fixed;
		inset: 0 0 auto;
		height: 3px;
		z-index: 90;
		pointer-events: none;
		background: var(--color-accent, #adc8ff);
		transform: scaleX(var(--progress));
		transform-origin: left;
	}

	.preview-banner {
		padding: 0.65rem var(--journal-gutter);
		border-block-end: 1px solid var(--status-amber-text);
		background: var(--bg-soft);
		color: var(--status-amber-text);
		font-size: 0.9rem;
		font-weight: 650;
		text-align: center;
	}

	.article-reading {
		padding-block: clamp(2.25rem, 6vw, 5rem) clamp(3rem, 7vw, 6rem);
	}

	.article-header {
		padding-block: clamp(1.15rem, 3vw, 2rem) clamp(1.65rem, 4vw, 3.75rem);
	}

	.article-header-inner {
		max-width: 56rem;
		margin-inline: auto;
	}

	.article-meta-badges,
	.article-tag-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.25rem 0.85rem;
	}

	.article-meta-badges {
		padding-block-start: 0.5rem;
	}

	.article-category-badge {
		display: inline-flex;
		align-items: center;
		min-block-size: 44px;
		color: var(--accent);
		font-size: 0.85rem;
		font-weight: 750;
		letter-spacing: 0.045em;
		text-underline-offset: 0.25em;
	}

	.article-category-badge:hover {
		color: var(--ink);
	}

	.article-reading-time,
	.article-pillar-badge {
		color: var(--muted);
		font-size: 0.85rem;
	}

	.article-h1 {
		margin: 0.35rem 0 0.95rem;
		font-size: clamp(2.05rem, 1.1rem + 4.4vw, 5rem);
		font-weight: 680;
		letter-spacing: -0.06em;
		line-height: 1;
		text-wrap: pretty;
	}

	.article-subtitle {
		margin: 0 0 0.75rem;
		color: var(--text);
		font-size: clamp(1.15rem, 1rem + 0.75vw, 1.55rem);
		font-weight: 550;
		line-height: 1.4;
	}

	.article-excerpt {
		max-width: 64ch;
		margin: 0 0 clamp(1.4rem, 3vw, 2.3rem);
		color: var(--muted);
		font-size: clamp(1.09rem, 1rem + 0.55vw, 1.35rem);
		line-height: 1.55;
	}

	.article-byline-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem 1.25rem;
		padding-block: 0.45rem;
		border-block-start: 1px solid var(--line);
		font-size: 0.9rem;
	}

	.byline-author {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 0.5rem;
	}

	.byline-author-link,
	.author-name-link {
		display: inline-flex;
		align-items: center;
		min-block-size: 44px;
		color: var(--ink);
		text-underline-offset: 0.22em;
	}

	.byline-author-link:hover,
	.author-name-link:hover {
		color: var(--accent);
	}

	.byline-role,
	.byline-date {
		color: var(--muted);
	}

	.article-tag-list {
		margin-block-start: 1.75rem;
		gap: 0.45rem;
	}

	.article-tag-chip {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding-inline: 0.65rem;
		border: 1px solid var(--line);
		border-radius: 0.25rem;
		color: var(--muted);
		font-size: 0.86rem;
		text-decoration: none;
	}

	.article-tag-chip:hover,
	.share-btn:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.article-cover-figure {
		max-width: 56rem;
		margin: 0 auto;
	}

	.article-cover-band {
		background: linear-gradient(to bottom, var(--color-screen, #101116) 52%, var(--bg) 52%);
	}

	.article-cover-frame {
		overflow: hidden;
		aspect-ratio: var(--photo-aspect, 4 / 3);
		border-radius: 0.4rem;
		background: var(--color-panel, #1a1d25);
		box-shadow: 0 24px 55px -36px rgb(21 26 38 / 62%);
	}

	.article-cover-img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.article-cover-caption {
		margin-block-start: 0.65rem;
		color: var(--muted);
		font-size: 0.87rem;
	}

	.article-body-layout {
		display: grid;
		grid-template-columns: minmax(0, 45rem);
		justify-content: center;
		gap: clamp(1.5rem, 4vw, 3.25rem);
		align-items: start;
	}

	.article-main-column,
	.article-toc-aside {
		min-width: 0;
	}

	.article-prose {
		font-family: var(--font-body);
		font-size: clamp(1.0625rem, 1rem + 0.31vw, 1.225rem);
		line-height: 1.72;
	}

	.article-prose :global(h2),
	.article-prose :global(h3) {
		font-weight: 690;
		letter-spacing: -0.045em;
	}

	.article-prose :global(blockquote) {
		margin-block: 1.85em;
		padding: 0.95em 1.1em;
		border: 0;
		border-inline-start: 3px solid var(--accent);
		border-radius: 0 0.4rem 0.4rem 0;
		background: var(--bg-soft);
		color: var(--ink);
		font-size: 1.09em;
		font-style: normal;
		font-weight: 550;
		line-height: 1.6;
	}

	.article-prose :global(blockquote > :last-child) {
		margin-block-end: 0;
	}

	@media (min-width: 1080px) {
		.article-body-layout.has-toc {
			grid-template-columns: minmax(13rem, 16rem) minmax(0, 45rem);
			align-items: stretch;
		}

		.toc-details {
			position: sticky;
			inset-block-start: calc(var(--nav-height) + 1rem);
			max-height: calc(100dvh - var(--nav-height) - 2rem);
			overflow-y: auto;
			overscroll-behavior: contain;
			scrollbar-width: thin;
		}
	}

	.toc-details {
		padding: 0.25rem 0.85rem;
		border-block: 1px solid var(--line);
		background: var(--panel);
	}

	.toc-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.55rem;
		min-height: 48px;
		color: var(--ink);
		font-size: 0.9rem;
		font-weight: 750;
		cursor: pointer;
		list-style: none;
	}

	.toc-summary::-webkit-details-marker {
		display: none;
	}

	.toc-summary :global(.toc-caret) {
		flex-shrink: 0;
	}

	.toc-details[open] .toc-summary :global(.toc-caret) {
		transform: rotate(180deg);
	}

	.toc-list {
		display: grid;
		gap: 0.2rem;
		list-style: none;
		padding: 0.5rem 0;
		margin: 0;
		border-block-start: 1px solid var(--line);
	}

	@media (min-width: 768px) and (max-width: 1079px) {
		.toc-list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 0.6rem;
		}
	}

	.toc-link {
		display: flex;
		align-items: center;
		min-block-size: 44px;
		padding: 0.4rem 0.6rem;
		border-inline-start: 2px solid transparent;
		color: var(--muted);
		font-size: 0.88rem;
		font-weight: 650;
		line-height: 1.35;
		text-decoration: none;
	}

	.toc-link[aria-current='location'],
	.toc-link:hover {
		border-inline-start-color: var(--accent);
		background: var(--bg-soft);
		color: var(--ink);
	}

	.toc-level-3 {
		padding-inline-start: 0.6rem;
	}

	.toc-level-4,
	.toc-level-5,
	.toc-level-6 {
		padding-inline-start: 1rem;
	}

	.article-service-cta {
		margin-block: clamp(2.75rem, 6vw, 4.5rem);
		padding: clamp(1.35rem, 4vw, 2.6rem);
		border-radius: 0.4rem;
		background: radial-gradient(ellipse at 100% 0, #28344d, var(--bg) 80%);
		color: var(--muted);
	}

	.article-service-cta h2 {
		margin: 0.45rem 0 0.65rem;
		color: var(--text);
		font-size: clamp(1.7rem, 1.2rem + 1.75vw, 2.65rem);
		font-weight: 665;
		letter-spacing: -0.045em;
		line-height: 1.1;
	}

	.article-service-cta p {
		max-width: 55ch;
		margin: 0;
	}

	.service-cta-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem 1rem;
		margin-block-start: 1rem;
	}

	.service-cta-links a {
		display: inline-flex;
		align-items: center;
		gap: 0.25em;
		min-block-size: 44px;
		color: var(--text);
		font-weight: 700;
		text-underline-offset: 0.23em;
	}

	.service-cta-links a:hover {
		color: var(--accent);
	}

	.service-cta-links a:focus-visible {
		outline-color: var(--accent);
	}

	.service-cta-links .btn-cta-primary {
		padding-inline: 0.9rem;
		border-radius: 0.25rem;
		background: var(--accent);
		color: var(--on-accent);
		text-decoration: none;
	}

	.service-cta-links .btn-cta-primary:hover {
		background: var(--btn-acid-hover);
		color: var(--on-accent);
	}

	.article-faq-section {
		margin-block: 2.5rem;
	}

	.faq-accordion {
		margin-block-start: 1rem;
		border-block-end: 1px solid var(--line);
	}

	.faq-details {
		padding: 0.35rem 0.4rem;
		border-block-start: 1px solid var(--line);
	}

	.faq-summary {
		min-height: 44px;
		padding-block: 0.45rem;
		color: var(--accent);
		cursor: pointer;
	}

	.faq-question {
		display: inline;
		margin: 0;
		font-size: 1.08rem;
		font-weight: 650;
	}

	.faq-answer p {
		margin: 0.15rem 0 0.8rem;
		color: var(--muted);
		line-height: 1.6;
	}

	.author-bio-box {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		margin-block: 2.5rem;
		padding: clamp(1.15rem, 3vw, 1.85rem);
		border-block-start: 1px solid var(--line);
		background: var(--bg-soft);
	}

	.author-avatar {
		width: clamp(2.5rem, 7vw, 4.5rem);
		height: auto;
		aspect-ratio: 1;
		flex-shrink: 0;
		border-radius: 50%;
		object-fit: cover;
	}

	.author-bio-content {
		min-width: 0;
	}

	.author-name {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 500;
	}

	.author-role,
	.author-creds,
	.author-description {
		color: var(--muted);
		font-size: 0.95rem;
	}

	.author-description {
		margin: 0.4rem 0 0;
		line-height: 1.56;
	}

	.author-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 0.85rem;
		font-size: 0.86rem;
	}

	.author-links a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		color: var(--acid);
		font-weight: 650;
		text-underline-offset: 0.24em;
	}

	.article-share-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.65rem 0.9rem;
		margin-block: 2rem;
		padding-block: 1rem;
		border-block: 1px solid var(--line);
	}

	.share-label {
		color: var(--muted);
		font-size: 0.9rem;
		font-weight: 700;
	}

	.share-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.share-btn,
	.unlock-submit-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0.35rem 0.85rem;
		border: 1px solid var(--line-strong);
		border-radius: 0.25rem;
		background: var(--panel);
		color: var(--text);
		font: inherit;
		font-size: 0.9rem;
		font-weight: 650;
		text-decoration: none;
		cursor: pointer;
	}

	.copy-status {
		color: var(--acid);
		font-size: 0.9rem;
	}

	.prev-next-nav {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 14.75rem), 1fr));
		gap: 1rem;
		margin-block: 2rem;
	}

	.prev-next-card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem;
		border-block-start: 1px solid var(--line);
		background: var(--panel);
		color: var(--ink);
		text-decoration: none;
	}

	.prev-next-card:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.pn-label {
		color: var(--muted);
		font-size: 0.83rem;
	}

	.pn-title {
		font-family: var(--font-heading);
		font-size: 1.16rem;
		font-weight: 550;
		line-height: 1.25;
	}

	.related-articles-section {
		display: grid;
		gap: 1.25rem;
		margin-block-start: clamp(2.5rem, 6vw, 5rem);
		padding-block-start: 1.4rem;
		border-block-start: 1px solid var(--line);
	}

	.back-to-blog-row {
		margin-block-start: 2.5rem;
		text-align: center;
	}

	.back-to-blog-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		min-block-size: 44px;
		color: var(--acid);
		font-weight: 700;
		text-underline-offset: 0.24em;
	}

	.back-to-blog-link:hover {
		color: var(--accent);
	}

	.locked-card {
		max-width: 43rem;
		margin-inline: auto;
		padding: clamp(1.25rem, 4vw, 2.6rem);
		border-block-start: 1px solid var(--line);
		background: var(--panel);
	}

	.locked-card .article-h1 {
		font-size: clamp(2rem, 1.25rem + 3.15vw, 3.65rem);
	}

	.locked-notice {
		margin-block: 0 1.25rem;
		color: var(--muted);
	}

	.unlock-error {
		margin-block-end: 1rem;
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--coral);
		background: color-mix(in srgb, var(--coral) 7%, var(--panel));
		color: var(--coral);
		font-size: 0.92rem;
	}

	.unlock-label {
		display: block;
		margin-block-end: 0.4rem;
		font-size: 0.93rem;
		font-weight: 700;
	}

	.unlock-input-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.unlock-input {
		flex: 1 1 12rem;
		min-width: 0;
		min-height: 48px;
		padding-inline: 0.85rem;
		border: 1px solid var(--line-strong);
		border-radius: 0.25rem;
		background: var(--panel);
		color: var(--text);
		font: inherit;
	}

	.unlock-submit-btn {
		min-height: 48px;
		border-color: var(--ink);
		background: var(--ink);
		color: var(--panel);
	}

	.unlock-submit-btn:hover {
		border-color: var(--accent);
		background: var(--accent);
	}
</style>
