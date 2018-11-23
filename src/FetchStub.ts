import { MockConfig, FetchNotInstalledError, NoConfigError } from './types'
import { logError } from './Helpers'
import { RequestMatcher } from './RequestMatcher'

let globalAny = (global as any)

export class FetchStub {

	/**
	 * Start mock server with given configuration
	 */
	static load(config: MockConfig) {
		if (!globalAny.fetch) {
			logError('Fetch not installed in global.');
			throw new FetchNotInstalledError('Fetch not installed in global.');
		}

		if (!config) {
			logError("Config file not found.");
			throw new NoConfigError("Config file not found.");
		}

		if (!globalAny.fetch.isStub) {
			// If I have already wrapped it, I just update the new config file
			wrapFetch();
		}

		let requestMatcher = new RequestMatcher(config);

		globalAny.fetch.requestMatcher = requestMatcher;
		globalAny.fetch.isStubEnabled = true;
	}

	/**
	 * Disable mock server and start using normal fetch
	 * @returns true if it has unloaded
	 */
	static unload(): boolean {
		if (!globalAny.fetch || !globalAny.fetch.isStub) {
			logError("Stub is not loaded: nothing to unload");
			return false;
		}
		globalAny.fetch.isStubEnabled = false;
		return true;
	}
}

function wrapFetch() {
	globalAny.fetch = (function (fetch) {
		return function (...args: any[]) {
			if (globalAny.fetch.isStub && !globalAny.fetch.isStubEnabled) {
				// when stub is disabled, I use the real fetch
				return fetch(...args);
			}

			return new Promise(async (resolve, reject) => {
				let response = await globalAny.fetch.requestMatcher.getResponse(args);

				if (response) {
					resolve(response);
				}
				else {
					// if forward:
					// 		todo: check if this is necessary before forwarding
					// 		input.bodyUsed = false; 
					//   	return fetch(...args);
					// else:
					reject(new Error("404 - Not Found"));
				}
			});
		};
	})(globalAny.fetch);

	globalAny.fetch.isStub = true;
}