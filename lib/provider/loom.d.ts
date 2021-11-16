import { VideoInfo } from '../urlParser';

export interface LoomUrlParameters {
    [key: string]: any;
}

export type LoomMediaTypes = 'video';

export interface LoomVideoInfo extends VideoInfo<LoomUrlParameters, LoomMediaTypes> {
    provider: 'loom';
}

export type LoomParseResult = LoomVideoInfo | undefined;
