import { MockConfig, BodyMatcher, QueryMatcher, PathMatcher, RequestDescriptor, MockConfigError, ExtraConfig, IRequest } from './types'
import { logError } from './Helpers';
import { UrlWithParsedQuery, parse as urlParse } from 'url';

/**
 * Helper class to check if input request matches with any MockConfig rule
 */
export class RequestMatcher {
	config: MockConfig;
	extraConfigs: ExtraConfig;

	constructor(config: MockConfig, extraConfigs: ExtraConfig) {
		this.config = config;
		this.extraConfigs = extraConfigs;
	}

	/**
	 * Get local stub response depending on fetch input parameters.
	 * Returns null if not found.
	 * @param input request to be checked
	 * @returns Response body as string. Returns null when there isn't any match
	 */
	async getResponse(input?: IRequest): Promise<string | null> {
		if (!input) {
			return null;
		}

		// Searching for a descriptor that matches
		const descriptors = this.config.requests;

		let d: RequestDescriptor | null = null;
		for (let i = 0; i < descriptors.length; i++) {
			d = descriptors[i];

			if (await matches(input, d)) break;
			else d = null;
		}
		if (!d) return null; // no descriptor matches

		let responseBody: object;
		if (d.responseFile) {
			if (!this.config.mockFolder) {
				throw new MockConfigError("Mock folder not defined");
			}
			if (!this.extraConfigs.responseFileRetriever) {
				throw new MockConfigError("FileRetriever function not defined");
			}

			const responsePath = d.responseFile;
			const retrieveResponseFile = this.extraConfigs.responseFileRetriever;
			responseBody = await retrieveResponseFile(this.config.mockFolder, responsePath);
		}
		else {
			responseBody = d.responseJson;
		}

		const stringBody = JSON.stringify(responseBody);
		return stringBody;
	}
}

/**
 * Check if input Request satisfies `match` rules
 * @param input Request to match
 * @param match Request rules to check
 */
export async function matches(input: IRequest, match: RequestDescriptor): Promise<boolean> {
	if (!match || !input) {
		logError("Missing descriptor or input request");
		return false;
	}

	if (input.method.toUpperCase() != match.method.toString().toUpperCase()) {
		return false;
	}

	const matchesUrl = matchUrl(input.url, match.path);
	if (!matchesUrl) {
		return false;
	}

	const matchesBody = await matchBody(input, match.bodyPatterns);
	if (!matchesBody) {
		return false;
	}

	return true;
}

/**
 * Check if input request url has same path and same query string (if present) specified in matchPath.
 * This does not check host.
 * @param inputUrlString Request to match
 * @param matchPath Url params to check
 */
export function matchUrl(inputUrlString: string, matchPath?: PathMatcher): boolean {
	if (!matchPath) {
		return true; // Nothing to match, so it matches
	}

	let inputUrl: UrlWithParsedQuery; // this can't find URL or Url classes
	try {
		inputUrl = urlParse(inputUrlString, true);
	} catch (error) {
		logError(`Error while parsing input request url: ${inputUrlString}`);
		return false;
	}

	const baseHost = "http://localhost:8081";
	const matchUrl = urlParse(baseHost, true);
	matchUrl.pathname = matchPath.base;

	// todo: should this also check host?
	if (inputUrl.pathname != matchUrl.pathname) {
		return false;
	}

	const matchesQueries = matchQueries(inputUrl, matchPath.queries);
	if (!matchesQueries) return false;

	return true;
}

/**
 * Check if all params in matchQueries are contained in input queries
 * @param inputUrl Full url with
 * @param matchQueries Map with key value search params
 */
export function matchQueries(inputUrl: UrlWithParsedQuery, matchQueries?: QueryMatcher): boolean {
	if (!matchQueries) {
		return true; // Nothing to match, so it matches
	}

	//const inputParams = querystring.parse(inputUrl.query);
	const inputParams = inputUrl.query;
	for (const key in matchQueries) {
		if (matchQueries.hasOwnProperty(key)) {
			const value = matchQueries[key];

			const inputValues = inputParams[key];
			if (!inputValues || inputValues.indexOf(value) == -1)
				return false;
		}
	}

	return true;
}

/**
 * Check if input body satisfies matchBody rules
 * @param input Request to match
 * @param matchBody Body rules to check
 */
export async function matchBody(input: IRequest, matchBody?: BodyMatcher): Promise<boolean> {
	if (!matchBody) {
		return true; // Nothing to match, so it matches
	}

	const inputBody = await input.text();
	if (!inputBody) {
		return false; // I have a BodyMatcher but nothing to match: it doesn't match
	}

	if (matchBody.contains && inputBody.indexOf(matchBody.contains) == -1) {
		return false;
	}

	if (matchBody.matches && !inputBody.match(matchBody.matches)) {
		return false;
	}

	return true;
}