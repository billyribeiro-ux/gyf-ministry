import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import {
	ministrySubmissionUnavailable,
	recordMinistrySubmission
} from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	downloadGuide: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const visionGoal = textValue(data.get('visionGoal'), '').trim();
		const values = { name, email, visionGoal };

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address so we can follow up.',
				values
			});
		}

		const recorded = await recordMinistrySubmission({
			type: 'devotional_guide',
			name,
			email,
			details: visionGoal || 'Requested encouragement for the Mustard Seed Reflection Guide'
		});

		if (!recorded) return fail(503, { error: ministrySubmissionUnavailable, values });

		return {
			success: true,
			message: `Blessings, ${name}. We received your request for encouragement.`
		};
	}
};
