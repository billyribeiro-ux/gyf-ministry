import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	inviteSpeaker: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const organization = String(data.get('organization') ?? '').trim();
		const eventType = String(data.get('eventType') ?? '').trim();
		const details = String(data.get('details') ?? '').trim();

		if (!name || !email || !details) {
			return fail(400, {
				error: 'Please provide your name, email, and event details.'
			});
		}

		await recordMinistrySubmission({
			type: 'speaker_inquiry',
			name,
			email,
			city: organization || 'Church / Conference Event',
			details,
			metadata: { organization, eventType }
		});

		return {
			success: true,
			message: `Thank you, ${name}! Courtney Ribeiro's ministry team has received your speaking invitation.`
		};
	}
};
