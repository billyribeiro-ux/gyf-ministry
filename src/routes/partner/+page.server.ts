import { textValue } from '#lib/shared/text';
import { fail } from '@sveltejs/kit';
import {
	ministrySubmissionUnavailable,
	recordMinistrySubmission
} from '#lib/server/submissions.js';
import type { Actions } from './$types';
import { partnershipCommitments } from './commitments.js';

const availableCommitments = new Map(
	partnershipCommitments.flatMap(({ path, options }) =>
		options.map(({ id, amount }) => [id, { path, amount }] as const)
	)
);

export const actions: Actions = {
	submitPartner: async ({ request }) => {
		const data = await request.formData();
		const name = textValue(data.get('name'), '').trim();
		const email = textValue(data.get('email'), '').trim();
		const commitment = textValue(data.get('commitment'), '').trim();
		const chosenCommitment = availableCommitments.get(commitment);
		const details = textValue(data.get('details'), '').trim();
		const values = { name, email, commitment, details };

		if (!name || !email) {
			return fail(400, {
				error: 'Please enter your name and email address to register your partnership.',
				values
			});
		}

		const partnerWay = chosenCommitment?.path ?? textValue(data.get('partnerWay'), '').trim();
		const amount = chosenCommitment?.amount ?? textValue(data.get('amount'), '').trim();
		if (!partnerWay || !amount) {
			return fail(400, { error: 'Please choose a way to partner with us.', values });
		}

		const recorded = await recordMinistrySubmission({
			type: 'partner_pledge',
			name,
			email,
			details: details || `${partnerWay} (${amount})`,
			metadata: { partnerWay, amount }
		});

		if (!recorded) return fail(503, { error: ministrySubmissionUnavailable, values });

		return {
			success: true,
			message: `Thank you, ${name}! Your partnership (${partnerWay} — ${amount}) has been registered. Together we are restoring hope and keeping children warm across Connecticut.`
		};
	}
};
