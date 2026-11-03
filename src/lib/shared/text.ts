/** Read text without coercing uploaded files or malformed objects to "[object Object]". */
export function textValue(value: unknown, fallback = ''): string {
	if (typeof value === 'string') return value;
	if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
		return String(value);
	}
	return fallback;
}
