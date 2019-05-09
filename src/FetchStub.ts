import { MockConfig, FetchNotInstalledError, MockConfigError, MissingDescriptorError, ExtraConfig, IRequest } from './types'
import { logError } from './Helpers'
import { RequestMatcher } from './RequestMatcher'
import { defaultResponseFileRetriever } from './readers/DefaultFileReader';

const globalAny = (global as any)

export class FetchStub {

	/**
	 * Start mock server with given configuration
	 */
	static load(config: MockConfig, extraConfigs?: ExtraConfig) {
		if (!globalAny.fetch) {
			logError('Fetch not installed in global.');
			throw new FetchNotInstalledError('Fetch not installed in global.');
		}

		if (!config) {
			logError("Config file not found.");
			throw new MockConfigError("Config file not found.");
		}

		if (!globalAny.fetch.isStub) {
			// If I have already wrapped it, I just update the new config file
			wrapFetch();
		}

		const myExtraConfigs = Object.assign({
			responseFileRetriever: defaultResponseFileRetriever
		} as ExtraConfig, extraConfigs);

		const requestMatcher = new RequestMatcher(config, myExtraConfigs);

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
		return async function (...args: any[]) {
			if (globalAny.fetch.isStub && !globalAny.fetch.isStubEnabled) {
				// when stub is disabled, I use the real fetch
				return fetch(...args);
			}

			const requestMatcher: RequestMatcher = globalAny.fetch.requestMatcher;

			const request = wrapRequest(args);
			const stringBody = await requestMatcher.getResponse(request);

			if (stringBody) {
				const response = new Response(stringBody);
				return Promise.resolve(response);
			}

			if (!requestMatcher.config.forward) {
				return Promise.reject(new MissingDescriptorError("404 - Not Found"));
			}

			//#region Forwarding request
			try {
				const responseWeb = await fetch(...args);
				return Promise.resolve(responseWeb);
			}
			catch (e) {
				return Promise.reject(e);
			}
			//#endregion
		};
	})(globalAny.fetch);

	globalAny.fetch.isStub = true;
}

/**
 * This function wraps fetch args to generic IRequest instance
 * @param args Args passed to fetch
 */
function wrapRequest(args: any[]): IRequest | undefined {
	if (args[0] instanceof Request) {
		return args[0];
	}
	
	if (typeof args[0] === "string") {
		return new Request(args[0], args[1]);
	}

	return undefined;
}