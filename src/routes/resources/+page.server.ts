import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	subscribeEncouragement: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to subscribe.'
			});
		}

		await recordMinistrySubmission({
			type: 'devotional_guide',
			name,
			email,
			details: 'Subscribed to Weekly Friday Encouragement & Ministry Impact Updates'
		});

		return {
			success: true,
			message: `Welcome, ${name}! You are now subscribed to Courtney Ribeiro's Weekly Friday Encouragement devotionals.`
		};
	}
};
