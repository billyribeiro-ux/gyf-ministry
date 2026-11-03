import { describe, expect, it } from 'vite-plus/test';
import { textValue } from './text';

describe('textValue', () => {
	it('preserves text and scalar custom field values', () => {
		expect([textValue('hello'), textValue(42), textValue(false), textValue(12n)]).toEqual([
			'hello',
			'42',
			'false',
			'12'
		]);
	});

	it('rejects uploaded files and malformed objects without invoking their string conversion', () => {
		const malformed = {
			toString: () => {
				throw new Error('must not run');
			}
		};
		expect([
			textValue(new File(['payload'], 'name.txt')),
			textValue(malformed),
			textValue(['unexpected']),
			textValue(null, 'default'),
			textValue(undefined, 'default')
		]).toEqual(['', '', '', 'default', 'default']);
	});
});
