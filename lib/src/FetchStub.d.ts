import { MockConfig } from './types';
export declare class FetchStub {
    private static hasLoaded;
    static load(config: MockConfig): void;
    static unload(): void;
}
