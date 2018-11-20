import FetchStub, { MockConfig } from "../src";

//import 'whatwg-fetch'

const config: MockConfig = {
	requests: [
		{
			method: 'GET',
			path: {
				base: '/simple/api'
			},
			responseFile: 'simpleGet'
		}
	]
};

if (!(global as any).fetch) {
	console.log('FROM JEST: Fetch not installed in global.');
}
else {
	console.log("FROM JEST: Fetch in global");
}

if (!window.fetch) {
	console.log('FROM JEST: Fetch not installed in window.');
}
else {
	console.log("FROM JEST: Fetch in window");
}

// TODO: test load/unload stub
// TODO: test if fetch is present

// TODO: check what if I run FetchStub.load twice (it should wrap fetch twice)
FetchStub.load(config);

describe('FetchStub Config tests', () => {
	it('should fail when whatwg-fetch is not loaded', () => {

	});

	it('should load and unload FetchStub', () => {

	});

	it('should fail when FetchStub is loaded twice', () => {

	});

	it('should match simple get request', async () => {
		const inputRequest = new Request('http://example.com/simple/api');
		const response = await fetch(inputRequest);

		expect(response).not.toBeNull();

		const body = await response.json();
		expect(body).toEqual({ file: 'simpleGet' });
	});

	it('should match simple get request with querystring', async () => {
		const inputRequest = new Request('http://example.com/simple/query?gianni=mar+io');
		const response = await fetch(inputRequest);

		expect(response).not.toBeNull();

		const body = await response.json();
		expect(body).toEqual({ file: 'simpleQuery' });
	});

	it('should match simple post request', async () => {
		const bodyInput = {
			mar: "io"
		};
		const bodyString = JSON.stringify(bodyInput);
		const inputRequest = new Request('http://example.com/simple/post', { method: 'POST', body: bodyString });
		const response = await fetch(inputRequest);

		expect(response).not.toBeNull();

		const body = await response.json();
		expect(body).toEqual({ file: 'simplePost' });
	});

	it('should not match simple post request', async () => {
		const bodyInput = {
			mar: "io"
		};
		const bodyString = JSON.stringify(bodyInput);
		const inputRequest = new Request('http://example.com/simple/post/null', { method: 'POST', body: bodyString });

		try {
			// this will throw a 404
			const response = await fetch(inputRequest);
		} catch (error) {
			expect(error).not.toBeNull();
		}
	});
});