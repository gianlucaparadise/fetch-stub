import { MockConfig, ExtraConfig } from './types';
export declare class FetchStub {
    static load(config: MockConfig, extraConfigs?: ExtraConfig): void;
    static unload(): boolean;
}
