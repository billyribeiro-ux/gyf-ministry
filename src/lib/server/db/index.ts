import { resolve } from 'node:path';
import migrationSql from '../../../../drizzle/0000_blog_system.sql?raw';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DATABASE_URL } from '$app/env/private';

const PLACEHOLDER_URL = 'postgres://user:password@localhost:5432/db-name';

export function isLocalFallbackDbUrl(url: string | undefined): boolean {
	if (!url || !url.trim()) return true;
	const trimmed = url.trim();
	if (trimmed === PLACEHOLDER_URL) return true;
	if (trimmed.startsWith('file:')) return true;
	if (trimmed.startsWith('pglite:')) return true;
	if (trimmed === ':memory:' || trimmed === 'memory://') return true;
	return false;
}

export type AppDatabase = ReturnType<typeof drizzlePostgres<typeof schema>>;
type DrizzleDb = AppDatabase;

let dbInstance: DrizzleDb | null = null;
let pgliteClient: PGlite | null = null;
let initPromise: Promise<DrizzleDb> | null = null;

const BASELINE_SEED_SQL = `
INSERT INTO authors (
	name,
	slug,
	job_title,
	company,
	short_bio,
	bio,
	website,
	linkedin,
	expertise,
	years_experience,
	is_active
)
SELECT
	'Courtney Ribeiro',
	'courtney-ribeiro',
	'Founder & Lead Minister',
	'Grow Your Faith Ministries',
	'Courtney Ribeiro founded Grow Your Faith Ministries in 2014 to help individuals rebuild shattered dreams through weekly Friday mentorship and Connecticut holiday outreach.',
	'Founded in 2014 in Wolcott and Waterbury, Connecticut, Grow Your Faith Ministries was born from Courtney Ribeiro''s heart to help individuals who had lost all hope rediscover their God-given visions, talents, and purpose through faith the size of a mustard seed (Matthew 17:20).',
	'https://growyourfaithministries.org/about',
	'https://mwcdigitalagency.com/grow-your-faith-ministry/',
	'Christian Life Restoration, Mustard Seed Faith, Weekly Friday Mentorship, Holiday Community Outreach',
	12,
	true
WHERE NOT EXISTS (SELECT 1 FROM authors);

INSERT INTO categories (name, slug, description, meta_title, meta_description, color, sort_order, is_active)
SELECT
	'Faith & Vision Restoration',
	'faith-and-vision-restoration',
	'Biblical encouragement, mustard-seed faith devotionals, and practical coaching to help you rebuild shattered dreams and walk in your God-given calling.',
	'Faith & Vision Restoration Devotionals',
	'Biblical encouragement, mustard-seed faith devotionals, and practical coaching to help you rebuild shattered dreams and walk in your God-given calling.',
	'#D4A843',
	1,
	true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'faith-and-vision-restoration');

INSERT INTO categories (name, slug, description, meta_title, meta_description, color, sort_order, is_active)
SELECT
	'Friday Ministry & Mentorship',
	'friday-ministry-mentorship',
	'Stories, biblical principles, and spiritual encouragement from our weekly Friday commitment to ministering one-on-one in Connecticut and beyond.',
	'Friday Ministry & Christian Mentorship',
	'Stories, biblical principles, and spiritual encouragement from our weekly Friday commitment to ministering one-on-one in Connecticut and beyond.',
	'#0FA4AF',
	2,
	true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'friday-ministry-mentorship');

INSERT INTO categories (name, slug, description, meta_title, meta_description, color, sort_order, is_active)
SELECT
	'Holiday Outreach & Community Care',
	'holiday-outreach-community',
	'Updates and stories from our annual Thanksgiving through January 4 holiday sabbatical serving hot meals and new winter coats to children in Connecticut.',
	'Holiday Outreach & Community Care (CT)',
	'Updates and stories from our annual Thanksgiving through January 4 holiday sabbatical serving hot meals and new winter coats to children in Connecticut.',
	'#22B573',
	3,
	true
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'holiday-outreach-community');

INSERT INTO tags (name, slug, description)
SELECT 'Mustard Seed Faith', 'mustard-seed-faith', 'Biblical teachings on Matthew 17:20 and active mustard-seed faith.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'mustard-seed-faith');

INSERT INTO tags (name, slug, description)
SELECT 'Shattered Dreams', 'shattered-dreams', 'Restoring hope and purpose after painful life seasons and setbacks.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'shattered-dreams');

INSERT INTO tags (name, slug, description)
SELECT 'God-Given Talents', 'god-given-talents', 'Stewarding the gifts, vision, and calling God placed inside you.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'god-given-talents');

INSERT INTO tags (name, slug, description)
SELECT 'Friday Ministry', 'friday-ministry', 'Weekly Friday one-on-one encouragement and spiritual mentorship.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'friday-ministry');

INSERT INTO tags (name, slug, description)
SELECT 'Holiday Coat Drive', 'holiday-coat-drive', 'Annual Thanksgiving through January 4 hot meals and children''s winter coat outreach in Connecticut.'
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE slug = 'holiday-coat-drive');

INSERT INTO posts (
	title,
	slug,
	excerpt,
	content,
	author_id,
	category_id,
	cover_image,
	cover_image_alt,
	cover_image_caption,
	cover_image_width,
	cover_image_height,
	meta_title,
	meta_description,
	og_title,
	og_description,
	og_image,
	focus_keyword,
	secondary_keywords,
	schema_type,
	reading_time,
	word_count,
	table_of_contents,
	faq_items,
	status,
	visibility,
	published,
	featured,
	is_pillar,
	published_at,
	content_updated_at
)
SELECT
	'What "Faith the Size of a Mustard Seed" Really Means When Your World Falls Apart',
	'faith-the-size-of-a-mustard-seed-matthew-17-20',
	'Biblical exposition of Matthew 17:20 and how tiny, obedient steps of mustard seed faith begin moving mountains of grief, financial loss, and discouragement.',
	'<p>When your dreams have been shattered by a sudden loss, a broken relationship, or a career setback, well-meaning people often tell you that you simply need stronger faith. Yet when Jesus spoke to His disciples in <a href="https://www.biblegateway.com/passage/?search=Matthew+17%3A20&amp;version=NIV" target="_blank" rel="noopener noreferrer">Matthew 17:20 on Bible Gateway</a>, He did not demand towering, unshakeable self-confidence. Instead, He promised that if you have <strong>mustard seed faith</strong>, you can speak to the mountain standing in front of you and watch it move.</p><h2 id="why-jesus-chose-the-smallest-seed">Why Jesus Chose the Smallest Seed in the Garden</h2><p>In first-century Galilee, the black mustard seed (<em>Brassica nigra</em>) was proverbial for its tiny size, measuring barely one to two millimeters in diameter. According to botanical research documented by <a href="https://www.britannica.com/plant/mustard" target="_blank" rel="noopener noreferrer">Encyclopaedia Britannica</a>, that microscopic seed germinates rapidly in warm soil and grows into a sturdy shrub reaching eight to ten feet tall, providing shelter for birds of the air.</p><p>Jesus chose the mustard seed deliberately to comfort exhausted, discouraged people. When your heart is broken, you rarely feel capable of giant spiritual leaps. Mustard seed faith means bringing the smallest honest fragment of trust you have left and placing it into the hands of an all-powerful Creator.</p><h2 id="how-shattered-dreams-bury-your-vision">How Shattered Dreams Bury Your God-Given Vision</h2><p>Since founding Grow Your Faith Ministries in 2014 across Wolcott and Waterbury, Connecticut, I have sat across from hundreds of men and women during our <a href="/programs/friday-ministry">Weekly Friday Ministry</a> sessions. Many of them once carried vibrant visions: starting a business, finishing a degree, restoring their family, or serving their community. After one or two painful disappointments, they quietly buried those goals and convinced themselves that God had forgotten them.</p><p>Scripture teaches the exact opposite. The gifts and calling of God are irrevocable (<a href="https://www.biblegateway.com/passage/?search=Romans+11%3A29&amp;version=NIV" target="_blank" rel="noopener noreferrer">Romans 11:29</a>). A buried seed is not a dead seed. In fact, a seed cannot germinate while it sits on a shelf; it only breaks open when it is pressed into the dark soil.</p><h2 id="three-daily-practices-of-mustard-seed-faith">Three Daily Practices of Mustard Seed Faith</h2><p>If you are standing in front of an immovable mountain today, you do not need to figure out the entire ten-year plan before sunset. Start with three small, obedient actions:</p><ul><li><strong>Name the buried dream out loud in prayer:</strong> Stop pretending you no longer care about the vision God placed in your heart. Write it down and bring it honestly before the Lord.</li><li><strong>Plant one twenty-minute action today:</strong> Whether it is making one phone call, sending one resume, or opening your Bible for fifteen minutes, physical obedience waters spiritual seeds.</li><li><strong>Allow community to stand in the gap with you:</strong> Isolation starves hope. Connect with believers who will pray with you and remind you of your worth in Christ when your own strength runs low.</li></ul><p>Whenever we serve hot holiday meals or hand brand-new winter coats to children during our <a href="/programs/holiday-outreach">Thanksgiving and Christmas Outreach</a>, we witness this truth firsthand: small acts of love, multiplied by God''s grace, change entire families. Your story is not over, and the mustard seed inside you is still alive.</p>',
	(SELECT id FROM authors WHERE slug = 'courtney-ribeiro' LIMIT 1),
	(SELECT id FROM categories WHERE slug = 'faith-and-vision-restoration' LIMIT 1),
	'/images/hero-courtney-outreach.webp',
	'Courtney Ribeiro encouraging a community member during Friday ministry outreach in Connecticut',
	'Mustard seed faith starts with one honest step of obedience in the middle of a difficult season.',
	1200,
	675,
	'Mustard Seed Faith: What Matthew 17:20 Really Means',
	'Discover what Jesus meant by mustard seed faith in Matthew 17:20 and how small, obedient steps restore shattered dreams and move mountains of doubt.',
	'Mustard Seed Faith: What Matthew 17:20 Really Means',
	'Discover what Jesus meant by mustard seed faith in Matthew 17:20 and how small, obedient steps restore shattered dreams and move mountains of doubt.',
	'/images/hero-courtney-outreach.webp',
	'mustard seed faith',
	'["Matthew 17:20 meaning","faith the size of a mustard seed","restoring shattered dreams","Christian encouragement"]',
	'BlogPosting',
	4,
	385,
	'[{"id":"why-jesus-chose-the-smallest-seed","text":"Why Jesus Chose the Smallest Seed in the Garden","level":2},{"id":"how-shattered-dreams-bury-your-vision","text":"How Shattered Dreams Bury Your God-Given Vision","level":2},{"id":"three-daily-practices-of-mustard-seed-faith","text":"Three Daily Practices of Mustard Seed Faith","level":2}]',
	'[{"question":"What does mustard seed faith mean in Matthew 17:20?","answer":"In Matthew 17:20, Jesus uses the tiny mustard seed to show that even the smallest genuine trust in God is enough to overcome overwhelming obstacles because the power belongs to God rather than the size of our confidence."},{"question":"How do I practice mustard seed faith when my dreams are shattered?","answer":"Begin by naming your buried vision honestly in prayer, taking one small obedient step today, and inviting trusted Christian mentors to pray and walk alongside you."},{"question":"Can I request a free Friday mentorship session with Grow Your Faith Ministries?","answer":"Yes. Every Friday year-round is dedicated strictly to free one-on-one Christian encouragement, prayer, and life-purpose restoration for individuals in Connecticut and online."}]',
	'published',
	'public',
	true,
	true,
	true,
	TIMESTAMPTZ '2026-10-15T12:00:00Z',
	TIMESTAMPTZ '2026-10-15T12:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'faith-the-size-of-a-mustard-seed-matthew-17-20');

INSERT INTO posts (
	title,
	slug,
	excerpt,
	content,
	author_id,
	category_id,
	cover_image,
	cover_image_alt,
	cover_image_caption,
	cover_image_width,
	cover_image_height,
	meta_title,
	meta_description,
	og_title,
	og_description,
	og_image,
	focus_keyword,
	secondary_keywords,
	schema_type,
	reading_time,
	word_count,
	table_of_contents,
	faq_items,
	status,
	visibility,
	published,
	featured,
	is_pillar,
	published_at,
	content_updated_at
)
SELECT
	'How to Rebuild Your Vision After a Season of Shattered Dreams',
	'how-to-rebuild-your-vision-after-a-shattered-season',
	'A four-step Christian vision restoration framework for letting go of past regret, hearing God''s voice again, and taking courageous action toward your calling.',
	'<p>Every person who walks through life long enough eventually faces a season where a deeply held dream collapses. Whether it was a marriage you prayed over, a business venture that closed, or a health diagnosis that altered your plans, the hardest part of a shattered season is rarely the external loss itself. The deepest wound happens when disappointment convinces you to stop hoping altogether. Learning how to practice <strong>Christian vision restoration</strong> allows you to separate a painful chapter from your permanent identity in Christ.</p><h2 id="separating-your-calling-from-a-closed-door">Separating Your Calling from a Closed Door</h2><p>In Scripture, Joseph, Moses, Ruth, and David all experienced years where the promise God gave them looked completely impossible. When we read <a href="https://www.biblegateway.com/passage/?search=Habakkuk+2%3A2-3&amp;version=NIV" target="_blank" rel="noopener noreferrer">Habakkuk 2:2 to 3 on Bible Gateway</a>, the Lord commands the prophet to write down the vision clearly on tablets so that a herald may run with it, adding that even if it lingers, we should wait for it because it will certainly come.</p><p>A closed door in one season does not mean your God-given talents have expired. Research on human resilience published by the <a href="https://www.apa.org/topics/resilience" target="_blank" rel="noopener noreferrer">American Psychological Association</a> confirms that purpose-driven goal reconstruction and supportive mentorship are primary drivers of recovery after major life setbacks.</p><h2 id="the-four-step-mustard-seed-restoration-framework">The Four-Step Mustard Seed Restoration Framework</h2><p>During our <a href="/restore-your-purpose">Purpose and Vision Restoration</a> sessions in Connecticut, we guide individuals through four practical steps to unearth buried dreams:</p><ul><li><strong>Step 1: Grieve the loss honestly before God.</strong> Faith does not pretend that heartbreak feels good. Bring your lament to the Lord just as the Psalms model.</li><li><strong>Step 2: Inventory the talents that survived the storm.</strong> Disappointment may have taken a position or a timeline, but it did not erase your compassion, your wisdom, your craftsmanship, or your testimony.</li><li><strong>Step 3: Write a 90-day Mustard Seed Vision Plan.</strong> Instead of trying to solve the next decade, write down three concrete, prayer-backed goals for the next ninety days.</li><li><strong>Step 4: Walk in weekly accountability.</strong> Share your plan with a mentor during our <a href="/programs/friday-ministry">Weekly Friday Ministry</a> so you never walk alone when discouragement whispers.</li></ul><p>God specializes in bringing beauty from ashes. When you surrender both your broken plans and your remaining gifts to Him, He builds something stronger, deeper, and more fruitful than what was lost.</p>',
	(SELECT id FROM authors WHERE slug = 'courtney-ribeiro' LIMIT 1),
	(SELECT id FROM categories WHERE slug = 'faith-and-vision-restoration' LIMIT 1),
	'/images/purpose-restoration.webp',
	'Open Bible and journal on a warm wooden table representing Christian vision restoration',
	'Writing down the vision again is the first courageous step out of a season of disappointment.',
	1200,
	675,
	'Christian Vision Restoration After Shattered Dreams',
	'Learn our 4-step Christian vision restoration framework to heal from shattered dreams, rediscover your God-given talents, and rebuild your life purpose.',
	'Christian Vision Restoration After Shattered Dreams',
	'Learn our 4-step Christian vision restoration framework to heal from shattered dreams, rediscover your God-given talents, and rebuild your life purpose.',
	'/images/purpose-restoration.webp',
	'christian vision restoration',
	'["rebuilding shattered dreams","Habakkuk 2:2 vision","finding Gods purpose","Mustard Seed Vision Guide"]',
	'Article',
	4,
	360,
	'[{"id":"separating-your-calling-from-a-closed-door","text":"Separating Your Calling from a Closed Door","level":2},{"id":"the-four-step-mustard-seed-restoration-framework","text":"The Four-Step Mustard Seed Restoration Framework","level":2}]',
	'[{"question":"What is Christian vision restoration?","answer":"Christian vision restoration is a biblically grounded process of healing from past disappointment, rediscovering the spiritual gifts and talents God placed inside you, and rebuilding actionable life goals in alignment with Scripture."},{"question":"Why does Habakkuk 2:2 tell us to write the vision down?","answer":"Writing your God-given vision down brings clarity out of emotional fog, creates a tangible reminder of God''s promises on difficult days, and allows mentors to pray specifically over your next steps."},{"question":"Where can I download the Mustard Seed Vision Guide?","answer":"You can request the free 5-Day Mustard Seed Vision Guide directly on our Restore Your Purpose page or book a free Friday mentorship session."}]',
	'published',
	'public',
	true,
	false,
	true,
	TIMESTAMPTZ '2026-10-22T12:00:00Z',
	TIMESTAMPTZ '2026-10-22T12:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'how-to-rebuild-your-vision-after-a-shattered-season');

INSERT INTO posts (
	title,
	slug,
	excerpt,
	content,
	author_id,
	category_id,
	cover_image,
	cover_image_alt,
	cover_image_caption,
	cover_image_width,
	cover_image_height,
	meta_title,
	meta_description,
	og_title,
	og_description,
	og_image,
	focus_keyword,
	secondary_keywords,
	schema_type,
	reading_time,
	word_count,
	table_of_contents,
	faq_items,
	status,
	visibility,
	published,
	featured,
	is_pillar,
	published_at,
	content_updated_at
)
SELECT
	'Stewarding Your God-Given Talents in Business, Ministry, and Community Care',
	'stewarding-your-god-given-talents-in-business-and-life',
	'Why your professional skills, leadership, and business success are designed to serve a higher Kingdom purpose in your local community.',
	'<p>Many believers live with an artificial wall between their Monday-through-Thursday work and their Sunday worship. They assume that pastors and missionaries do "spiritual work," while business owners, tradespeople, parents, and executives merely pay the bills. Yet when we study the Parable of the Talents in <a href="https://www.biblegateway.com/passage/?search=Matthew+25%3A14-30&amp;version=NIV" target="_blank" rel="noopener noreferrer">Matthew 25:14 to 30 on Bible Gateway</a>, Jesus illustrates Kingdom faithfulness through marketplace stewardship. Practicing <strong>Christian talent stewardship</strong> means recognizing that every skill, client relationship, and resource entrusted to you is designed to advance God''s love in the world.</p><h2 id="why-we-dedicate-every-friday-and-forty-holiday-days">Why We Dedicate Every Friday and Forty Holiday Days to Outreach</h2><p>When Grow Your Faith Ministries began in 2014 alongside our digital agency work, we made a covenant with the Lord: as He blessed the work of our hands, we would never hoard the harvest. God has abundantly blessed our work so that every single Friday year-round is set aside strictly to minister to those in need through our <a href="/programs/friday-ministry">Weekly Friday Ministry</a>.</p><p>Furthermore, from Thanksgiving Day through January 4 each winter, we pause normal business operations for forty days to serve hot holiday meals and purchase brand-new winter coats, hats, mittens, and blankets for children across Wolcott, Waterbury, and New Haven County. According to winter household assistance data from the <a href="https://portal.ct.gov/dss" target="_blank" rel="noopener noreferrer">Connecticut Department of Social Services</a>, thousands of local families face severe heating and winter clothing shortfalls each December.</p><h2 id="how-your-marketplace-calling-fuels-ministry">How Your Marketplace Calling Fuels Direct Community Care</h2><p>You do not have to leave your career to have a life-changing ministry. Here are three ways you can practice intentional Christian talent stewardship right where God has planted you:</p><ul><li><strong>Dedicate a tithe of your weekly calendar:</strong> Set aside a recurring block of time each week to mentor a younger believer, check on a hurting neighbor, or volunteer in local outreach.</li><li><strong>Channel business revenue into tangible compassion:</strong> Through our <a href="/partner">Client and Partner Stewardship Portal</a>, corporate sponsors and monthly Mustard Seed Partners underwrite 100% of our children''s winter coat kits and holiday meal distributions.</li><li><strong>Refuse to bury your one talent out of fear:</strong> The servant in Matthew 25 buried his talent because he was afraid of failure. Step out in faith and put your abilities to work for God''s glory.</li></ul><p>When your professional excellence is anchored in compassion for people, your work becomes an altar of worship and a lifeline of hope for your community.</p>',
	(SELECT id FROM authors WHERE slug = 'courtney-ribeiro' LIMIT 1),
	(SELECT id FROM categories WHERE slug = 'friday-ministry-mentorship' LIMIT 1),
	'/images/friday-ministry.webp',
	'Weekly Friday ministry mentoring session and community outreach preparation in Connecticut',
	'Marketplace excellence and compassionate community outreach work hand in hand.',
	1200,
	675,
	'Christian Talent Stewardship in Business and Ministry',
	'Learn how Christian talent stewardship bridges your professional calling with weekly Friday mentorship and holiday community outreach in Connecticut.',
	'Christian Talent Stewardship in Business and Ministry',
	'Learn how Christian talent stewardship bridges your professional calling with weekly Friday mentorship and holiday community outreach in Connecticut.',
	'/images/friday-ministry.webp',
	'christian talent stewardship',
	'["stewarding God-given talents","Matthew 25 parable of the talents","Christian business philanthropy","Connecticut holiday coat drive"]',
	'BlogPosting',
	4,
	375,
	'[{"id":"why-we-dedicate-every-friday-and-forty-holiday-days","text":"Why We Dedicate Every Friday and Forty Holiday Days to Outreach","level":2},{"id":"how-your-marketplace-calling-fuels-ministry","text":"How Your Marketplace Calling Fuels Direct Community Care","level":2}]',
	'[{"question":"What is Christian talent stewardship?","answer":"Christian talent stewardship is the biblical practice of developing and deploying your God-given abilities, time, and financial resources to glorify God and serve people in need."},{"question":"How does Grow Your Faith Ministries fund its Friday mentorship and holiday drives?","answer":"Our outreach is fueled by corporate stewardship from MWC Digital Agency, client partners, and monthly Mustard Seed Partners, ensuring 100% of outreach contributions go directly to meals and children''s winter gear."},{"question":"How can my business partner with the Thanksgiving and Christmas coat drive?","answer":"Visit our Partner page to sponsor children''s winter coat kits ($50 per child), underwrite a family holiday meal table ($150), or become a corporate outreach partner."}]',
	'published',
	'public',
	true,
	false,
	false,
	TIMESTAMPTZ '2026-10-29T12:00:00Z',
	TIMESTAMPTZ '2026-10-29T12:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE slug = 'stewarding-your-god-given-talents-in-business-and-life');

INSERT INTO post_categories (post_id, category_id)
SELECT p.id, p.category_id FROM posts p WHERE p.category_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p CROSS JOIN tags t
WHERE p.slug = 'faith-the-size-of-a-mustard-seed-matthew-17-20' AND t.slug IN ('mustard-seed-faith', 'shattered-dreams')
ON CONFLICT DO NOTHING;

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p CROSS JOIN tags t
WHERE p.slug = 'how-to-rebuild-your-vision-after-a-shattered-season' AND t.slug IN ('shattered-dreams', 'god-given-talents', 'mustard-seed-faith')
ON CONFLICT DO NOTHING;

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id FROM posts p CROSS JOIN tags t
WHERE p.slug = 'stewarding-your-god-given-talents-in-business-and-life' AND t.slug IN ('god-given-talents', 'friday-ministry', 'holiday-coat-drive')
ON CONFLICT DO NOTHING;
`;

function createSyncInstance(): DrizzleDb {
	if (dbInstance) return dbInstance;

	if (isLocalFallbackDbUrl(DATABASE_URL)) {
		// Under-construction deployments use seeded, per-instance demo data.
		// Vercel's application filesystem is read-only; this data is not persistent.
		const dataDir =
			process.env.VERCEL === '1' || process.env.VITEST || process.env.NODE_ENV === 'test'
				? undefined
				: resolve(process.cwd(), '.local-pgdata');
		pgliteClient = new PGlite(dataDir);
		dbInstance = drizzlePglite(pgliteClient, { schema }) as unknown as DrizzleDb;
	} else {
		const client = postgres(DATABASE_URL);
		dbInstance = drizzlePostgres(client, { schema });
	}

	return dbInstance;
}

export const db: DrizzleDb = createSyncInstance();

export async function ensureDbReady(): Promise<DrizzleDb> {
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const instance = createSyncInstance();
		if (pgliteClient) {
			await pgliteClient.waitReady;
			await pgliteClient.exec(migrationSql);
			await pgliteClient.exec(BASELINE_SEED_SQL);
		}
		return instance;
	})();

	return initPromise;
}
