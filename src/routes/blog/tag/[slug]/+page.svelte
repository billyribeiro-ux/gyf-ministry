<script lang="ts">
	import '#lib/styles/inner-page.css';
	import Archive from '#lib/components/blog/Archive.svelte';
	import SEO from '#lib/components/blog/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SEO schema={data.jsonLdSchema} />

<Archive
	kind="tag"
	topic={data.tag}
	topics={data.sidebarTags}
	posts={data.posts}
	pagination={data.pagination}
/>
