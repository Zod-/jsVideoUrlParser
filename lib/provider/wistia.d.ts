import { VideoInfo } from '../urlParser';

export interface WistiaUrlParameters {
    [key: string]: any;
    start?: number;
}

export type WistiaMediaTypes = 'video' | 'embedvideo';

export interface WistiaVideoInfo extends VideoInfo<WistiaUrlParameters, WistiaMediaTypes> {
    provider: 'wistia';
    channel?: string;
}

export type WistiaParseResult = WistiaVideoInfo | undefined;
