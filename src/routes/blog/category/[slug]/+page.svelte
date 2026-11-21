<script lang="ts">
	import '#lib/styles/inner-page.css';
	import '#lib/styles/prose.css';
	import Archive from '#lib/components/blog/Archive.svelte';
	import SEO from '#lib/components/blog/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEO schema={data.jsonLdSchema} />

<Archive
	kind="category"
	topic={data.category}
	topics={data.sidebarCategories}
	posts={data.posts}
	pagination={data.pagination}
/>
