/// <reference types="node" />
import { MockConfig, BodyMatcher, QueryMatcher, PathMatcher, RequestDescriptor } from './types';
import { UrlWithParsedQuery } from 'url';
export declare class RequestMatcher {
    config: MockConfig;
    constructor(config: MockConfig);
    getResponse(args: any[]): Promise<Response | null>;
}
export declare function matches(input: Request, match: RequestDescriptor): Promise<boolean>;
export declare function matchUrl(inputUrlString: string, matchPath?: PathMatcher): boolean;
export declare function matchQueries(inputUrl: UrlWithParsedQuery, matchQueries?: QueryMatcher): boolean;
export declare function matchBody(input: any, matchBody?: BodyMatcher): Promise<boolean>;
