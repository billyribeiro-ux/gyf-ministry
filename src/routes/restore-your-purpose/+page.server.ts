import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	downloadGuide: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const visionGoal = textValue(data.get('visionGoal'), '').trim();

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to receive the workbook.',
				values: { name, email, visionGoal }
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
