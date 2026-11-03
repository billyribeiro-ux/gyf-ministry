import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	downloadGuide: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const visionGoal = String(data.get('visionGoal') ?? '').trim();

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to receive the workbook.'
			});
		}

		await recordMinistrySubmission({
			type: 'devotional_guide',
			name,
			email,
			details:
				visionGoal || 'Requested The 7-Day Mustard Seed Restoration Devotional & Vision Workbook'
		});

		return {
			success: true,
			message: `Blessings, ${name}! Your copy of "The 7-Day Mustard Seed Restoration Devotional & Vision Workbook" is ready and you are subscribed to Weekly Friday Encouragement.`
		};
	}
};
