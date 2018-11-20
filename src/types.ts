/**
 * Http method types
 */
export type HttpMethod =
	"DELETE" |
	"GET" |
	"HEAD" |
	"OPTIONS" |
	"POST" |
	"PUT";

/**
 * Map of the query string parameters
 */
export type QueryMatcher = {
	[key: string]: string
}

/**
 * This describes a path to match
 */
export type PathMatcher = {
	/**
	 * Path name of the url
	 */
	base: string,
	/**
	 * Query string params that must be among the input request query
	 */
	queries?: QueryMatcher
}

/**
 * This describe a body to match
 */
export type BodyMatcher = {
	/**
	 * Exact string to search in the request body
	 */
	contains?: string,
	/**
	 * RegEx to test against the request body
	 */
	matches?: string
}

/**
 * This describes a request to match
 */
export type RequestDescriptor = {
	method: HttpMethod,
	path?: PathMatcher,
	bodyPatterns?: BodyMatcher,
	responseFile: string
}

export type MockConfig = {
	/**
	 * true if you want to send request if a local response is not found. If missing is false.
	 */
	forward?: boolean,
	/**
	 * List of request match rules
	 */
	requests: RequestDescriptor[]
}

// EXCEPTIONS

/**
 * This exception is thrown when you try to load FetchStub without a config file
 */
export class NoConfigError extends Error { }

/**
 * This exception is thrown when you try to load FetchStub,
 * but you haven't installed 'whatwg-fetch'.
 * Use: require('whatwg-fetch')
 */
export class FetchNotInstalledError extends Error { }

/**
 * This exception is thrown when you try to load FetchStub twice
 */
export class ReloadError extends Error { }