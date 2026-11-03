import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	submitPartner: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const partnerWay = textValue(data.get('partnerWay'), 'Monthly Mustard Seed Partner').trim();
		const amount = textValue(data.get('amount'), '$65/mo').trim();
		const details = textValue(data.get('details'), '').trim();

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to register your partnership.',
				values: { name, email, partnerWay, amount, details }
			});
		}

		await recordMinistrySubmission({
			type: 'partner_pledge',
			name,
			email,
			details: details || `${partnerWay} (${amount})`,
			metadata: { partnerWay, amount }
		});

		return {
			success: true,
			message: `Thank you, ${name}! Your partnership (${partnerWay} — ${amount}) has been registered. Together we are restoring hope and keeping children warm across Connecticut.`
		};
	}
};
