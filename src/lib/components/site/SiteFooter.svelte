<script lang="ts">
	import { resolve } from '$app/paths';
	import { siteConfig } from '#lib/config/site.js';
	import { IconArrowUpRight, IconCross } from '@tabler/icons-svelte';
</script>

<footer class="site-footer">
	<div class="container">
		<div class="footer-invite">
			<div>
				<h2>Prayer, care &amp; community.</h2>
				<p>Find encouragement for your family or help us care for our neighbors in Connecticut.</p>
			</div>
			<div class="footer-actions">
				<a href={resolve('/prayer-and-support')} class="footer-button primary">
					Request prayer or support <IconArrowUpRight size={17} aria-hidden="true" />
				</a>
				<a href={resolve('/partner')} class="footer-button secondary">
					Support local outreach <IconArrowUpRight size={17} aria-hidden="true" />
				</a>
			</div>
		</div>

		<div class="footer-directory">
			<div class="footer-identity">
				<a href={resolve('/')} class="footer-brand" aria-label="{siteConfig.name} home">
					<span class="footer-mark" aria-hidden="true"><IconCross size={21} stroke={1.65} /></span>
					<span>{siteConfig.name}</span>
				</a>
				<p>Helping people rediscover hope and God-given purpose since {siteConfig.foundingYear}.</p>
				<p>Serving Wolcott, Waterbury, New Haven, and Hartford, Connecticut.</p>
			</div>

			<nav aria-label="Find support">
				<h3>Find support</h3>
				<ul class="footer-links">
					<li><a href={resolve('/programs/friday-ministry')}>Friday mentorship</a></li>
					<li><a href={resolve('/prayer-and-support?tab=holiday')}>Request holiday help</a></li>
					<li><a href={resolve('/restore-your-purpose')}>Restore your purpose</a></li>
				</ul>
			</nav>

			<nav aria-label="Explore the ministry">
				<h3>Explore</h3>
				<ul class="footer-links">
					<li><a href={resolve('/about')}>About Courtney</a></li>
					<li><a href={resolve('/resources')}>Devotionals &amp; resources</a></li>
					<li><a href={resolve('/blog')}>Faith &amp; purpose blog</a></li>
				</ul>
			</nav>

			<div class="footer-schedule">
				<h3>When we serve</h3>
				<dl>
					<dt>Every Friday</dt>
					<dd>Prayer and one-on-one mentorship</dd>
					<dt>Thanksgiving–January 4</dt>
					<dd>
						<a href={resolve('/programs/holiday-outreach')}>Holiday meals and winter coats</a>
					</dd>
				</dl>
			</div>
		</div>

		<div class="footer-meta">
			<figure>
				<p class="footer-verse">Faith the size of a mustard seed can move mountains.</p>
				<figcaption>From Matthew 17:20</figcaption>
			</figure>
			<p class="footer-credit">
				Administrative costs are underwritten by
				<a href={siteConfig.founder.parentOrgUrl} target="_blank" rel="noopener noreferrer"
					>{siteConfig.founder.parentOrgName}</a
				>
				and
				<a href={siteConfig.founder.coachingUrl} target="_blank" rel="noopener noreferrer"
					>Marketing With Courtney</a
				>.
			</p>
		</div>

		<div class="footer-bottom">
			<p>© {new Date().getFullYear()} {siteConfig.name}</p>
			<a href={resolve('/sitemap.xml')}>XML sitemap</a>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: linear-gradient(
			180deg,
			var(--color-panel, #1a1d25),
			var(--color-screen, #101116) 40%
		);
		border-top: 1px solid var(--footer-rule);
		color: var(--color-strong, #f5f7fb);
		--footer-rule: var(--color-line, #343946);
		--footer-muted: var(--color-soft, #b6bed0);
		font-size: 1rem;
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	.site-footer a {
		color: inherit;
	}
	.site-footer a:hover {
		color: var(--color-accent, #adc8ff);
	}

	.footer-invite {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(13rem, 17rem);
		align-items: end;
		gap: 1.4rem 3rem;
		padding-block: clamp(2.5rem, 6vw, 5.15rem);
		border-bottom: 1px solid var(--footer-rule);
	}

	.footer-invite h2 {
		margin-bottom: 0.55rem;
		max-width: 16ch;
		font-family: var(--font-heading);
		font-size: clamp(2.25rem, 5vw, 4.65rem);
		line-height: 0.99;
		font-weight: 680;
		letter-spacing: -0.06em;
		text-wrap: balance;
		color: var(--color-strong, #f5f7fb);
	}

	.footer-invite p {
		margin: 0;
		color: var(--footer-muted);
		max-width: 54ch;
	}

	.footer-actions {
		display: grid;
		gap: 0.55rem;
	}

	.footer-actions .footer-button {
		display: inline-flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.65rem;
		min-height: 3.15rem;
		padding: 0.7rem 0.95rem;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		font-weight: 680;
		line-height: 1.2;
	}

	.footer-actions .primary {
		background: var(--color-accent, #adc8ff);
		color: var(--color-on-accent, #101b31);
	}
	.footer-actions .primary:hover {
		background: var(--color-strong, #f5f7fb);
		color: var(--color-on-accent, #101b31);
	}
	.footer-actions .secondary {
		border-color: #687287;
		color: var(--color-strong, #f5f7fb);
	}
	.footer-actions .secondary:hover {
		border-color: var(--color-accent, #adc8ff);
		color: var(--color-accent, #adc8ff);
	}
	.footer-button :global(svg) {
		flex: none;
	}

	.footer-directory {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) repeat(2, minmax(0, 0.85fr)) minmax(0, 1fr);
		gap: 1.5rem clamp(1.2rem, 3vw, 3.5rem);
		padding-block: clamp(2rem, 4vw, 3.45rem);
		border-bottom: 1px solid var(--footer-rule);
	}

	.footer-brand {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		margin-bottom: 0.75rem;
		font-family: var(--font-heading);
		font-size: 1.12rem;
		font-weight: 720;
		line-height: 1.12;
		letter-spacing: -0.035em;
	}

	.footer-mark {
		display: grid;
		place-items: center;
		width: 2.55rem;
		height: 2.55rem;
		flex: none;
		color: var(--color-accent, #adc8ff);
		background: var(--color-panel, #1a1d25);
		border: 1px solid var(--footer-rule);
		border-radius: var(--radius-sm);
	}

	.footer-identity p {
		margin: 0 0 0.5rem;
		color: var(--footer-muted);
	}
	.footer-directory h3 {
		margin-bottom: 0.65rem;
		color: var(--color-strong, #f5f7fb);
		font-family: var(--font-body);
		font-size: 1.06rem;
		font-weight: 730;
		line-height: 1.25;
	}

	.footer-links {
		display: grid;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.footer-links a,
	.footer-schedule a {
		display: inline-flex;
		align-items: center;
		min-height: 2.55rem;
		padding-block: 0.25rem;
		color: var(--footer-muted);
		line-height: 1.3;
		text-decoration: underline;
		text-decoration-color: transparent;
		text-underline-offset: 0.22em;
	}

	.footer-links a:is(:hover, :focus-visible),
	.footer-schedule a:is(:hover, :focus-visible) {
		text-decoration-color: currentColor;
	}
	.footer-schedule dl {
		margin: 0;
	}
	.footer-schedule dt {
		font-weight: 700;
	}
	.footer-schedule dd {
		margin: 0 0 0.65rem;
		color: var(--footer-muted);
	}
	.footer-schedule dd:last-child {
		margin: 0;
	}
	.footer-schedule dd:last-child a {
		align-items: start;
	}

	.footer-meta,
	.footer-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		column-gap: 2.25rem;
	}

	.footer-meta {
		gap: 0.9rem 2.25rem;
		padding-block: 1.3rem;
		border-bottom: 1px solid var(--footer-rule);
	}
	.footer-meta figure {
		margin: 0;
		border-inline-start: 2px solid var(--color-accent, #adc8ff);
		padding-inline-start: 0.9rem;
	}
	.footer-verse {
		font-family: var(--font-heading);
		font-size: clamp(1.06rem, 2vw, 1.32rem);
		font-weight: 550;
		line-height: 1.3;
		margin: 0 0 0.2rem;
	}

	.footer-meta figcaption {
		color: var(--color-accent, #adc8ff);
		font-size: 0.9rem;
	}
	.footer-credit {
		color: var(--footer-muted);
		margin: 0;
		max-width: 42ch;
		font-size: 0.91rem;
	}
	.footer-credit a,
	.footer-bottom a {
		text-decoration: underline;
		text-underline-offset: 0.22em;
	}
	.footer-bottom {
		padding-block: 0.65rem;
		color: var(--footer-muted);
		font-size: 0.9rem;
	}
	.footer-bottom p {
		margin: 0;
	}
	.footer-bottom a {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
	}

	@media (prefers-reduced-motion: no-preference) {
		.footer-button :global(svg) {
			transition: translate 170ms var(--ease-out);
		}

		.footer-button:is(:hover, :focus-visible) :global(svg) {
			translate: 2px -2px;
		}
	}

	@media (max-width: 55rem) {
		.footer-directory {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.footer-identity {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 42rem) {
		.footer-invite {
			grid-template-columns: minmax(0, 1fr);
		}
		.footer-actions {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 35rem) {
		.footer-directory {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.footer-schedule {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 31rem) {
		.footer-actions {
			grid-template-columns: minmax(0, 1fr);
		}
	}

	@media (max-width: 23rem) {
		.footer-directory {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
