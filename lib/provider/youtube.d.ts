import { VideoInfo } from '../urlParser';

export interface YouTubeUrlParameters {
    start?: number;
    [key: string]: any;
}

export type YouTubeMediaTypes = 'video' | 'playlist' | 'share' | 'channel';

export interface YouTubeVideoInfo extends VideoInfo<YouTubeUrlParameters, YouTubeMediaTypes> {
    provider: 'youtube';
    list?: string;
}

export type YouTubeParseResult = YouTubeVideoInfo | undefined;
