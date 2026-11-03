import { ensureDbReady } from './db/index.js';
import { ministrySubmission } from './db/schema.js';

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
	} catch {
		// Fallback gracefully in read-only serverless environments while keeping form actions operational
	}
}
