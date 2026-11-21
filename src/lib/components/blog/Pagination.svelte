<script module lang="ts">
	export interface PaginationData {
		page: number;
		total: number;
		totalPages: number;
	}
</script>

<script lang="ts">
	import { IconArrowLeft, IconArrowRight } from '@tabler/icons-svelte';

	let {
		pagination,
		pathname,
		search = ''
	}: {
		pagination: PaginationData;
		pathname: string;
		search?: string;
	} = $props();

	function pageHref(pageNumber: number) {
		const params = new URLSearchParams({ page: String(pageNumber) });
		if (search) params.set('search', search);
		return `${pathname}?${params}`;
	}
</script>

{#if pagination.totalPages > 1}
	<!-- oxlint-disable svelte/no-navigation-without-resolve -- pathname is resolved by the caller -->
	<nav aria-label="Journal pagination">
		{#if pagination.page > 1}
			<a href={pageHref(pagination.page - 1)} rel="prev">
				<IconArrowLeft size={17} aria-hidden="true" />
				Previous
			</a>
		{/if}
		<p>Page {pagination.page} of {pagination.totalPages} ({pagination.total} articles)</p>
		{#if pagination.page < pagination.totalPages}
			<a href={pageHref(pagination.page + 1)} rel="next">
				Next
				<IconArrowRight size={17} aria-hidden="true" />
			</a>
		{/if}
	</nav>
	<!-- oxlint-enable svelte/no-navigation-without-resolve -->
{/if}

<style>
	nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.5rem 1rem;
		margin-block-start: clamp(1.5rem, 4vw, 3rem);
		padding-block-start: 1.15rem;
		border-block-start: 1px solid var(--line);
	}

	p {
		margin: 0;
		color: var(--muted);
		font-size: 0.9rem;
	}

	a {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		min-block-size: 44px;
		padding-inline: 0.85rem;
		border: 1px solid var(--line-strong);
		border-radius: 0.25rem;
		color: var(--ink);
		font-weight: 700;
		text-decoration: none;
	}

	a:hover {
		background: var(--bg-soft);
		border-color: var(--accent);
		color: var(--accent);
	}
</style>
