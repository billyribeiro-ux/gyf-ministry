import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import {
	ministrySubmissionUnavailable,
	recordMinistrySubmission
} from '#lib/server/submissions.js';
import type { Actions } from './$types';
import { sponsorshipTiers } from './sponsorship.js';

export const actions: Actions = {
	sponsorHoliday: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const tier = textValue(data.get('tier'), '$65').trim();
		const city = textValue(data.get('city'), 'Wolcott / Waterbury, CT').trim();
		const details = textValue(data.get('details'), '').trim();
		const values = { name, email, tier, city, details };

		if (!sponsorshipTiers.some((option) => option.amount === tier)) {
			return fail(400, {
				error: 'Please select a listed sponsorship amount.',
				values: { name, email, tier: '$65', city, details }
			});
		}

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to complete your sponsorship pledge.',
				values
			});
		}

		const recorded = await recordMinistrySubmission({
			type: 'partner_pledge',
			name,
			email,
			city,
			details: details || 'Holiday Outreach Sponsorship',
			metadata: { tier, campaign: '2026 Holiday Outreach (Nov 26 - Jan 4)' }
		});

		if (!recorded) return fail(503, { error: ministrySubmissionUnavailable, values });

		return {
			success: true,
			message: `Thank you, ${name}! Your ${tier} Holiday Outreach sponsorship pledge has been recorded. 100% goes toward hot holiday meals and children's winter coats, hats, mittens, and blankets.`
		};
	}
};
