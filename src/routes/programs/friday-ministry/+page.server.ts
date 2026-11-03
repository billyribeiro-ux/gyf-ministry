import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	requestFridaySession: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const city = String(data.get('city') ?? 'Wolcott / Waterbury, CT').trim();
		const sessionType = String(data.get('sessionType') ?? '1-on-1 Encouragement Call').trim();
		const details = String(data.get('details') ?? '').trim();

		if (!name || !details) {
			return fail(400, {
				error: 'Please enter your name and how we can encourage or serve you this Friday.'
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
