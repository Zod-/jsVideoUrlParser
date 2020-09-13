import { VideoInfo } from '../urlParser';

export interface TiktokUrlParameters {
    [key: string]: any;
}

export type TiktokMediaTypes = 'video';

export interface TiktokVideoInfo extends VideoInfo<TiktokUrlParameters, TiktokMediaTypes> {
    provider: 'tiktok';
    channel: string;
}

export type TiktokParseResult = TiktokVideoInfo | undefined;
