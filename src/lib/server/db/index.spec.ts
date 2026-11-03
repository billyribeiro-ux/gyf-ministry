import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { resolve } from 'node:path';

const mocks = vi.hoisted(() => ({
	createPglite: vi.fn(),
	env: { DATABASE_URL: 'file:local.db' }
}));

vi.mock('$app/env/private', () => mocks.env);
vi.mock('@electric-sql/pglite', async (importOriginal) => {
	const { PGlite } = await importOriginal<typeof import('@electric-sql/pglite')>();
	return {
		PGlite: class extends PGlite {
			constructor(dataDir?: string) {
				// Observe the selected directory without writing any test data to disk.
				mocks.createPglite(dataDir);
				super();
			}
		}
	};
});

let database: Awaited<ReturnType<(typeof import('./index'))['ensureDbReady']>> | undefined;

beforeEach(() => {
	vi.resetModules();
	mocks.createPglite.mockClear();
	mocks.env.DATABASE_URL = 'file:local.db';
	vi.stubEnv('VERCEL', '1');
	vi.stubEnv('VITEST', '');
	vi.stubEnv('NODE_ENV', 'production');
});

afterEach(async () => {
	if (database) {
		await (database.$client as unknown as import('@electric-sql/pglite').PGlite).close();
		database = undefined;
	}
	vi.unstubAllEnvs();
});

describe('database fallback', () => {
	it('uses an in-memory seeded database on Vercel without an external database', async () => {
		const { ensureDbReady } = await import('./index');
		const [first, second] = await Promise.all([ensureDbReady(), ensureDbReady()]);
		database = first;

		expect(mocks.createPglite).toHaveBeenCalledExactlyOnceWith(undefined);
		expect(second).toBe(first);
		expect((await first.query.authors.findMany()).length).toBeGreaterThan(0);
		expect((await first.query.posts.findMany()).length).toBeGreaterThan(0);
		await ensureDbReady();
		expect(mocks.createPglite).toHaveBeenCalledTimes(1);
	});

	it('keeps the local disk database outside Vercel', async () => {
		vi.stubEnv('VERCEL', '');
		vi.stubEnv('NODE_ENV', 'development');
		const { ensureDbReady } = await import('./index');
		database = await ensureDbReady();

		expect(mocks.createPglite).toHaveBeenCalledExactlyOnceWith(
			resolve(process.cwd(), '.local-pgdata')
		);
	});

	it('keeps external PostgreSQL configured on Vercel without creating demo data', async () => {
		mocks.env.DATABASE_URL = 'postgres://localhost/demo';
		const { db, ensureDbReady } = await import('./index');

		expect(await ensureDbReady()).toBe(db);
		expect(mocks.createPglite).not.toHaveBeenCalled();
		await db.$client.end();
	});

	it('keeps tests in memory outside Vercel', async () => {
		vi.stubEnv('VERCEL', '');
		vi.stubEnv('VITEST', 'true');
		const { ensureDbReady } = await import('./index');
		database = await ensureDbReady();

		expect(mocks.createPglite).toHaveBeenCalledExactlyOnceWith(undefined);
	});
});
