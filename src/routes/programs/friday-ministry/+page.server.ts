import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	requestFridaySession: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const phone = textValue(data.get('phone'), '').trim();
		const city = textValue(data.get('city'), 'Wolcott / Waterbury, CT').trim();
		const sessionType = textValue(data.get('sessionType'), '1-on-1 Encouragement Call').trim();
		const details = textValue(data.get('details'), '').trim();

		if (!name || !details) {
			return fail(400, {
				error: 'Please enter your name and how we can encourage or serve you this Friday.',
				values: { name, email, phone, city, sessionType, details }
			});
		}

		await recordMinistrySubmission({
			type: 'friday_session',
			name,
			email,
			phone,
			city,
			details,
			metadata: { sessionType }
		});

		return {
			success: true,
			message: `Blessings, ${name}. Your Friday Ministry request (${sessionType}) has been logged for upcoming Friday outreach.`
		};
	}
};
