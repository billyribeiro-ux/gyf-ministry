import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	submitPartner: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const partnerWay = String(data.get('partnerWay') ?? 'Monthly Mustard Seed Partner').trim();
		const amount = String(data.get('amount') ?? '$65/mo').trim();
		const details = String(data.get('details') ?? '').trim();

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to register your partnership.'
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
