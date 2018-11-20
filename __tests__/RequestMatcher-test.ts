import 'whatwg-fetch'
import { parse as urlParse } from 'url'
import { matchBody, matchQueries, matchUrl } from '../src/RequestMatcher';
import { BodyMatcher, PathMatcher, QueryMatcher } from '../src'

describe('QueryMatcher', () => {
	it('should match simple query strings', () => {
		let urlString = "http://test.com/path?query=string&pippo=pluto";
		let inputUrl = urlParse(urlString, true);

		let matchQuery: QueryMatcher = {};
		matchQuery["pippo"] = "pluto";

		let result = matchQueries(inputUrl, matchQuery);

		expect(result).toEqual(true);
	});

	it('should not match query strings', () => {
		let urlString = "http://test.com/path?query=string&pippo=pluto";
		let inputUrl = urlParse(urlString, true);

		let matchQuery: QueryMatcher = {};
		matchQuery["pippo"] = "pluto";
		matchQuery["mar"] = "io";

		let result = matchQueries(inputUrl, matchQuery);

		expect(result).toEqual(false);
	});

	it('should match query string with duplicate key', () => {
		let urlString = "http://test.com/path?pippo=plu+to&query=string&query=param";
		let inputUrl = urlParse(urlString, true);

		let matchQuery: QueryMatcher = {};
		matchQuery["query"] = "param";
		matchQuery["pippo"] = "plu to";

		let result = matchQueries(inputUrl, matchQuery);

		expect(result).toEqual(true);
	});
});

describe('UrlMatcher', () => {
	it('should match simple url', () => {
		let inputUrl = "http://test.com/simple/path"

		let matchPath: PathMatcher = {
			base: '/simple/path'
		};

		let result = matchUrl(inputUrl, matchPath);

		expect(result).toEqual(true);
	});

	it('should not match url', () => {
		let inputUrl = "http://test.com/simple/path/longer"

		let matchPath: PathMatcher = {
			base: '/simple/path'
		};

		let result = matchUrl(inputUrl, matchPath);

		expect(result).toEqual(false);
	});

	it('should match url ignoring query string', () => {
		let inputUrl = "http://test.com/simple/path?mario=pluto"

		let matchPath: PathMatcher = {
			base: '/simple/path'
		};

		let result = matchUrl(inputUrl, matchPath);

		expect(result).toEqual(true);
	});

	it('should not match url missing query string', () => {
		let inputUrl = "http://test.com/simple/path"

		let matchPath: PathMatcher = {
			base: '/simple/path',
			queries: {
				mario: "pluto"
			}
		};

		let result = matchUrl(inputUrl, matchPath);

		expect(result).toEqual(false);
	});

	it('should match url and query string', () => {
		let inputUrl = "http://test.com/simple/path?mario=pluto"

		let matchPath: PathMatcher = {
			base: '/simple/path',
			queries: {
				mario: "pluto"
			}
		};

		let result = matchUrl(inputUrl, matchPath);

		expect(result).toEqual(true);
	});
});

describe('BodyMatcher', () => {
	it('should match simple body', async () => {
		const baseUrl = 'http://test.com/path';
		const body = {
			mar: "yo",
			id: "580"
		};
		const bodyString = JSON.stringify(body);
		const inputRequest = new Request(baseUrl, { method: 'POST', body: bodyString });

		const bodyMatcher: BodyMatcher = {
			contains: "580"
		};

		const result = await matchBody(inputRequest, bodyMatcher);

		expect(result).toEqual(true);
	});

	it('should match simple body regex', async () => {
		const baseUrl = 'http://test.com/path';
		const body = {
			mar: "yo",
			id: "580"
		};
		const bodyString = JSON.stringify(body);
		const inputRequest = new Request(baseUrl, { method: 'POST', body: bodyString });

		const bodyMatcher: BodyMatcher = {
			matches: "['\"]id['\"]\s*:\s*['\"]580['\"]"
		};

		const result = await matchBody(inputRequest, bodyMatcher);

		expect(result).toEqual(true);
	});

	it('should not match simple body regex and contains', async () => {
		const baseUrl = 'http://test.com/path';
		const body = {
			mar: "yo",
			id: "580"
		};
		const bodyString = JSON.stringify(body);
		const inputRequest = new Request(baseUrl, { method: 'POST', body: bodyString });

		const bodyMatcher: BodyMatcher = {
			contains: "'yo'",
			matches: "['\"]id['\"]\s*:\s*['\"]580['\"]"
		};

		const result = await matchBody(inputRequest, bodyMatcher);

		expect(result).toEqual(false);
	});
});