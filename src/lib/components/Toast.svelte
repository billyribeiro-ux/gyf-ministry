<script lang="ts">
	import { toast, getToasts } from '#lib/stores/toast.svelte.js';
	import CheckCircleIcon from 'phosphor-svelte/lib/CheckCircleIcon';
	import XCircleIcon from 'phosphor-svelte/lib/XCircleIcon';
	import WarningIcon from 'phosphor-svelte/lib/WarningIcon';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import XIcon from 'phosphor-svelte/lib/XIcon';

	let toasts = $derived(getToasts());
	let exitingIds = $state<Set<string>>(new Set());

	function handleDismiss(id: string) {
		exitingIds = new Set([...exitingIds, id]);
		setTimeout(() => {
			toast.dismiss(id);
			exitingIds = new Set([...exitingIds].filter((i) => i !== id));
		}, 200);
	}

	function handleKeydown(e: KeyboardEvent, id: string) {
		if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleDismiss(id);
		}
	}
</script>

<!-- Persistent live regions for screen reader announcements — must exist in DOM before announcements are made -->
<div id="aria-live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
<div id="aria-live-region-assertive" class="sr-only" aria-live="assertive" aria-atomic="true"></div>

{#if toasts.length > 0}
	<div class="toast-container" role="region" aria-label="Notifications">
		{#each toasts as item (item.id)}
			<!-- Visual only. The store announces each toast once through the app
			     shell's live regions; a live role here as well read it twice. -->
			<div class={[`toast toast--${item.type}`, { 'toast--exiting': exitingIds.has(item.id) }]}>
				{#if item.type === 'success'}
					<CheckCircleIcon class="toast__icon toast__icon--success" size={20} aria-hidden="true" />
				{:else if item.type === 'error'}
					<XCircleIcon class="toast__icon toast__icon--error" size={20} aria-hidden="true" />
				{:else if item.type === 'warning'}
					<WarningIcon class="toast__icon toast__icon--warning" size={20} aria-hidden="true" />
				{:else}
					<InfoIcon class="toast__icon toast__icon--info" size={20} aria-hidden="true" />
				{/if}

				<div class="toast__content">
					{#if item.title}
						<p class="toast__title">{item.title}</p>
					{/if}
					<p class="toast__message">{item.message}</p>
				</div>

				{#if item.dismissible}
					<button
						type="button"
						class="toast__close"
						onclick={() => handleDismiss(item.id)}
						onkeydown={(e) => handleKeydown(e, item.id)}
						aria-label="Dismiss notification"
					>
						<XIcon size={16} aria-hidden="true" />
					</button>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
