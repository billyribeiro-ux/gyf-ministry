import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import {
	ministrySubmissionUnavailable,
	recordMinistrySubmission
} from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	subscribeEncouragement: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const values = { name, email };

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to subscribe.',
				values
			});
		}

		const recorded = await recordMinistrySubmission({
			type: 'devotional_guide',
			name,
			email,
			details: 'Subscribed to Weekly Friday Encouragement & Ministry Impact Updates'
		});

		if (!recorded) return fail(503, { error: ministrySubmissionUnavailable, values });

		return {
			success: true,
			message: `Welcome, ${name}! We received your request for Friday Encouragement emails.`
		};
	}
};
