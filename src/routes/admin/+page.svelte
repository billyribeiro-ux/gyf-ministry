<script lang="ts">
	import { resolve } from '$app/paths';
	import SEO from '#lib/components/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEO
	title="Dashboard | Admin"
	description="Grow Your Faith Ministries content administration overview"
	noindex={true}
/>

<div class="admin-dash">
	<header class="dash-header">
		<div>
			<span class="dash-kicker">Grow Your Faith Ministries</span>
			<h1>Blog &amp; Content Dashboard</h1>
			<p class="dash-sub">
				Manage devotionals, Friday mentorship articles, categories, tags, and media assets.
			</p>
		</div>
		<div class="dash-actions">
			<a href={resolve('/blog')} target="_blank" rel="noopener noreferrer" class="btn-ghost">
				View Public Blog ↗
			</a>
			<a href={resolve('/admin/posts/new')} class="btn-primary">New Post +</a>
		</div>
	</header>

	<section class="stats-grid" aria-label="Post status summary">
		<div class="stat-card">
			<span class="stat-label">Published</span>
			<strong class="stat-value is-emerald">{data.counts.published}</strong>
		</div>
		<div class="stat-card">
			<span class="stat-label">Drafts</span>
			<strong class="stat-value">{data.counts.drafts}</strong>
		</div>
		<div class="stat-card">
			<span class="stat-label">In Review</span>
			<strong class="stat-value is-amber">{data.counts.inReview}</strong>
		</div>
		<div class="stat-card">
			<span class="stat-label">Scheduled</span>
			<strong class="stat-value is-teal">{data.counts.scheduled}</strong>
		</div>
		<div class="stat-card">
			<span class="stat-label">Archived</span>
			<strong class="stat-value">{data.counts.archived}</strong>
		</div>
		<div class="stat-card">
			<span class="stat-label">In Trash</span>
			<strong class="stat-value is-coral">{data.counts.trashed}</strong>
		</div>
	</section>

	<div class="quick-links">
		<a href={resolve('/admin/posts')} class="quick-link-card">
			<strong>Manage All Posts ({data.counts.activeTotal})</strong>
			<span>Filter, bulk edit, manage categories, tags, and authors.</span>
		</a>
		<a href={resolve('/admin/posts/new')} class="quick-link-card">
			<strong>Write New Article</strong>
			<span>Launch the TipTap 3 rich text editor with live 100-point SEO scoring.</span>
		</a>
		<a href={resolve('/admin/media')} class="quick-link-card">
			<strong>Media Library</strong>
			<span>Upload, crop (16:9, 4:3, 1:1), and manage WebP ministry images.</span>
		</a>
	</div>

	<section class="recent-section" aria-labelledby="recent-posts-heading">
		<div class="recent-header">
			<h2 id="recent-posts-heading">Recently Updated Articles</h2>
			<a href={resolve('/admin/posts')} class="view-all-link">View all →</a>
		</div>

		{#if data.recent.length === 0}
			<p class="empty-msg">No articles created yet.</p>
		{:else}
			<div class="recent-list">
				{#each data.recent as post (post.id)}
					<a href={resolve('/admin/posts/[id]', { id: String(post.id) })} class="recent-row">
						<div>
							<strong class="recent-title">{post.title}</strong>
							<span class="recent-date">
								Updated {new Date(post.updatedAt).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric'
								})}
							</span>
						</div>
						<span class="status-pill status-{post.status}">{post.status}</span>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.admin-dash {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	.dash-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.dash-kicker {
		display: block;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--acid);
		margin-bottom: 0.35rem;
	}

	.dash-header h1 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 1.85rem;
		color: var(--text);
	}

	.dash-sub {
		margin: 0.35rem 0 0;
		color: var(--muted);
		font-size: 0.92rem;
	}

	.dash-actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.btn-primary,
	.btn-ghost {
		padding: 0.55rem 1.1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		font-weight: 700;
		text-decoration: none;
	}

	.btn-primary {
		background: var(--acid);
		color: var(--ink);
	}

	.btn-ghost {
		background: var(--panel);
		border: 1px solid var(--line-strong);
		color: var(--text);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.stat-label {
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
	}

	.stat-value {
		font-family: var(--font-display);
		font-size: 1.85rem;
		color: var(--text);
	}

	.stat-value.is-emerald {
		color: #22b573;
	}

	.stat-value.is-amber {
		color: #f59e0b;
	}

	.stat-value.is-teal {
		color: #0fa4af;
	}

	.stat-value.is-coral {
		color: var(--coral);
	}

	.quick-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
		margin-bottom: 2.5rem;
	}

	.quick-link-card {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		text-decoration: none;
		color: var(--text);
		transition: border-color 0.15s ease;
	}

	.quick-link-card:hover {
		border-color: var(--acid);
	}

	.quick-link-card span {
		font-size: 0.85rem;
		color: var(--muted);
	}

	.recent-section {
		background: var(--panel);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 1.5rem;
	}

	.recent-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.recent-header h2 {
		margin: 0;
		font-size: 1.15rem;
		color: var(--text);
	}

	.view-all-link {
		color: var(--acid);
		font-size: 0.85rem;
		font-weight: 700;
		text-decoration: none;
	}

	.recent-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.recent-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.85rem 1rem;
		border-radius: 8px;
		background: var(--bg-soft);
		border: 1px solid var(--line);
		text-decoration: none;
		color: var(--text);
	}

	.recent-row:hover {
		border-color: var(--line-strong);
	}

	.recent-title {
		display: block;
		font-size: 0.95rem;
	}

	.recent-date {
		font-size: 0.78rem;
		color: var(--muted);
	}

	.status-pill {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 700;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: var(--panel2);
		color: var(--muted);
	}

	.status-published {
		background: rgba(34, 181, 115, 0.16);
		color: #22b573;
	}

	.empty-msg {
		color: var(--muted);
		margin: 0;
	}
</style>

