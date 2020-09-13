import { VideoInfo } from '../urlParser';

export interface TedUrlParameters {
    [key: string]: any;
}

export type TedMediaTypes = 'video' | 'playlist';

export interface TedVideoInfo extends VideoInfo<TedUrlParameters, TedMediaTypes> {
    provider: 'ted';
}

export type TedParseResult = TedVideoInfo | undefined;
