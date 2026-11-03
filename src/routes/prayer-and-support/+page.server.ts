import { fail } from '@sveltejs/kit';
import { recordMinistrySubmission } from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	submitPrayer: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const fridayCall = data.get('fridayCall') === 'yes';
		const prayerNeed = String(data.get('prayerNeed') ?? '').trim();

		if (!name || !prayerNeed) {
			return fail(400, {
				error: 'Please enter your name and your prayer request.'
			});
		}

		await recordMinistrySubmission({
			type: 'prayer',
			name,
			email,
			phone,
			details: prayerNeed,
			metadata: { fridayFollowUpCall: fridayCall }
		});

		return {
			success: true,
			tab: 'prayer',
			message: `We are standing in faith with you, ${name}. Your prayer request has been received${fridayCall ? ' and scheduled for a Friday encouragement follow-up' : ''}.`
		};
	},

	nominateFamily: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const phone = String(data.get('phone') ?? '').trim();
		const city = String(data.get('city') ?? 'Waterbury / Wolcott, CT').trim();
		const familySize = String(data.get('familySize') ?? '4').trim();
		const coatSizes = String(data.get('coatSizes') ?? '').trim();
		const details = String(data.get('details') ?? '').trim();

		if (!name || !phone || !coatSizes) {
			return fail(400, {
				error: 'Please provide contact details and children coat sizes for holiday outreach.'
			});
		}

		await recordMinistrySubmission({
			type: 'holiday_assistance',
			name,
			email,
			phone,
			city,
			details: details || 'Holiday Meal & Children Winter Coat Nomination',
			metadata: { familySize, coatSizes }
		});

		return {
			success: true,
			tab: 'holiday',
			message: `Thank you, ${name}. This family registration for Thanksgiving/Christmas meals and children's winter coats (${coatSizes}) has been received by our Connecticut outreach team.`
		};
	}
};
