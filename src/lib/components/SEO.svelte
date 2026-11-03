<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		canonical?: string;
		noindex?: boolean;
		nofollow?: boolean;
	}

	let {
		title,
		description = '',
		canonical = '',
		noindex = false,
		nofollow = false
	}: Props = $props();

	const robotsContent = $derived.by(() => {
		if (!noindex && !nofollow) return null;
		return `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
	});
</script>

<svelte:head>
	<title>{title}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}
	{#if robotsContent}
		<meta name="robots" content={robotsContent} />
	{/if}
</svelte:head>
