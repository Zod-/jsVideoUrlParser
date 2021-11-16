import { VideoInfo } from '../urlParser';

export interface FacebookUrlParameters {
    [key: string]: any;
}

export type FacebookMediaTypes = 'video';

export interface FacebookVideoInfo extends VideoInfo<FacebookUrlParameters, FacebookMediaTypes> {
    provider: 'facebook';
    pageId?: string;
}

export type FacebookParseResult = FacebookVideoInfo | undefined;
