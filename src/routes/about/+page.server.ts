import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	inviteSpeaker: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const organization = textValue(data.get('organization'), '').trim();
		const eventType = textValue(data.get('eventType'), '').trim();
		const details = textValue(data.get('details'), '').trim();

		if (!name || !email || !details) {
			return fail(400, {
				error: 'Please provide your name, email, and event details.',
				values: { name, email, organization, eventType, details }
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
