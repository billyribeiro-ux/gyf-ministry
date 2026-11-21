<script lang="ts">
	import { resolve } from '$app/paths';
	import { IconSearch } from '@tabler/icons-svelte';

	let { query = '' }: { query?: string } = $props();
</script>

<form method="GET" action={resolve('/blog')} role="search" aria-label="Journal">
	<label>
		<IconSearch size={19} stroke={1.6} aria-hidden="true" />
		{#key query}
			<input
				type="search"
				name="search"
				defaultValue={query}
				aria-label="Search articles"
				placeholder="Search articles"
			/>
		{/key}
	</label>
	<button type="submit">Search</button>
</form>

<style>
	form {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		max-width: 31rem;
	}

	label {
		flex: 1 1 12rem;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding-inline: 0.8rem;
		background: var(--panel);
		color: var(--muted);
		border: 1px solid var(--line-strong);
		border-radius: 0.25rem;
	}

	label:focus-within {
		outline: 2px solid var(--acid);
		outline-offset: 3px;
	}

	label :global(svg) {
		flex-shrink: 0;
	}

	input,
	button {
		min-height: 48px;
		font: inherit;
	}

	input {
		flex: 1;
		width: 100%;
		min-width: 0;
		border: 0;
		padding: 0;
		background: transparent;
		color: var(--text);
		outline: none;
	}

	input::placeholder {
		color: var(--muted);
		opacity: 1;
	}

	button {
		flex-grow: 1;
		padding-inline: 1.35rem;
		border: 1px solid var(--accent);
		border-radius: 0.25rem;
		background: var(--accent);
		color: var(--on-accent);
		font-weight: 700;
		cursor: pointer;
	}

	button:hover {
		background: var(--btn-acid-hover);
		border-color: var(--btn-acid-hover);
	}

	@media (min-width: 24rem) {
		button {
			flex-grow: 0;
		}
	}
</style>
