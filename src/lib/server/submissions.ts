import { DATABASE_URL } from '$app/env/private';
import { ensureDbReady, isLocalFallbackDbUrl } from './db/index.js';
import { ministrySubmission } from './db/schema.js';
import { logger } from './logger.js';

export const ministrySubmissionUnavailable =
	'We couldn’t save your submission right now. Please try again in a moment.';

export async function recordMinistrySubmission(input: {
	type:
		| 'prayer'
		| 'holiday_assistance'
		| 'friday_session'
		| 'speaker_inquiry'
		| 'partner_pledge'
		| 'devotional_guide';
	name: string;
	email?: string;
	phone?: string;
	city?: string;
	details: string;
	metadata?: Record<string, unknown>;
}) {
	if (process.env.VERCEL === '1' && isLocalFallbackDbUrl(DATABASE_URL)) {
		logger.error({ type: input.type }, 'Durable ministry submission storage is unavailable');
		return false;
	}

	try {
		const db = await ensureDbReady();
		await db.insert(ministrySubmission).values({
			type: input.type,
			name: input.name,
			email: input.email || null,
			phone: input.phone || null,
			city: input.city || 'Wolcott / Waterbury, CT',
			details: input.details,
			metadata: input.metadata ? JSON.stringify(input.metadata) : null
		});
		return true;
	} catch (error) {
		logger.error(
			{ type: input.type, errorName: error instanceof Error ? error.name : 'UnknownError' },
			'Ministry submission could not be stored'
		);
		return false;
	}
}
