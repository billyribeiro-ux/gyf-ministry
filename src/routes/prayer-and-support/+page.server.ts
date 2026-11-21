import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import {
	ministrySubmissionUnavailable,
	recordMinistrySubmission
} from '#lib/server/submissions.js';
import type { Actions } from './$types';

export const actions: Actions = {
	submitPrayer: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const phone = textValue(data.get('phone'), '').trim();
		const fridayCall = data.get('fridayCall') === 'yes';
		const prayerNeed = textValue(data.get('prayerNeed'), '').trim();
		const values = { name, email, phone, fridayCall: fridayCall ? 'yes' : 'no', prayerNeed };

		if (!name || !prayerNeed) {
			return fail(400, {
				tab: 'prayer' as const,
				error: 'Please enter your name and your prayer request.',
				values
			});
		}

		if (fridayCall && !email && !phone) {
			return fail(400, {
				tab: 'prayer' as const,
				error: 'Please add an email address or phone number so we can follow up.',
				values
			});
		}

		const recorded = await recordMinistrySubmission({
			type: 'prayer',
			name,
			email,
			phone,
			details: prayerNeed,
			metadata: { fridayFollowUpCall: fridayCall }
		});

		if (!recorded) {
			return fail(503, { tab: 'prayer' as const, error: ministrySubmissionUnavailable, values });
		}

		return {
			success: true,
			tab: 'prayer',
			message: `We are standing in faith with you, ${name}. We received your prayer request${fridayCall ? ' and your request for a Friday follow-up' : ''}.`
		};
	},

	nominateFamily: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const phone = textValue(data.get('phone'), '').trim();
		const city = textValue(data.get('city'), 'Waterbury / Wolcott, CT').trim();
		const familySize = textValue(data.get('familySize'), '4').trim();
		const coatSizes = textValue(data.get('coatSizes'), '').trim();
		const details = textValue(data.get('details'), '').trim();
		const values = { name, email, phone, city, familySize, coatSizes, details };

		if (!name || !phone || !coatSizes) {
			return fail(400, {
				tab: 'holiday' as const,
				error: 'Please provide contact details and children coat sizes for holiday outreach.',
				values
			});
		}

		const recorded = await recordMinistrySubmission({
			type: 'holiday_assistance',
			name,
			email,
			phone,
			city,
			details: details || 'Holiday Meal & Children Winter Coat Nomination',
			metadata: { familySize, coatSizes }
		});

		if (!recorded) {
			return fail(503, { tab: 'holiday' as const, error: ministrySubmissionUnavailable, values });
		}

		return {
			success: true,
			tab: 'holiday',
			message: `Thank you, ${name}. This family registration for Thanksgiving/Christmas meals and children's winter coats (${coatSizes}) has been received by our Connecticut outreach team.`
		};
	}
};
