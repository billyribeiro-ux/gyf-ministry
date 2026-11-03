import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	sponsorHoliday: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const tier = textValue(data.get('tier'), '$65').trim();
		const city = textValue(data.get('city'), 'Wolcott / Waterbury, CT').trim();
		const details = textValue(data.get('details'), 'Holiday Outreach Sponsorship').trim();

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to complete your sponsorship pledge.',
				values: { name, email, tier, city, details: textValue(data.get('details'), '').trim() }
			});
		}

		await recordMinistrySubmission({
			type: 'partner_pledge',
			name,
			email,
			city,
			details,
			metadata: { tier, campaign: '2026 Holiday Outreach (Nov 26 - Jan 4)' }
		});

		return {
			success: true,
			message: `Thank you, ${name}! Your ${tier} Holiday Outreach sponsorship pledge has been recorded. 100% goes toward hot holiday meals and children's winter coats, hats, mittens, and blankets.`
		};
	}
};
