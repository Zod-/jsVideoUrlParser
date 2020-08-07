import Provider, { FormatHandler } from './base-provider';
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

export default class YouTube extends Provider<'short' | 'long' | 'embed' | 'shortImage' | 'longImage', YouTubeMediaTypes, YouTubeUrlParameters> {
    imageQualities: Record<string, string>;
    defaultImageQuality: string;

    parseVideoUrl(url: string): string | undefined;
    parseChannelUrl(url: string): string | undefined;
    parseParameters(params: Record<string, any>, result: YouTubeVideoInfo): YouTubeUrlParameters;
    parseMediaType(result: YouTubeVideoInfo): YouTubeVideoInfo;

    createShortUrl: FormatHandler<YouTubeUrlParameters>;
    createLongUrl: FormatHandler<YouTubeUrlParameters>;
    createEmbedUrl: FormatHandler<YouTubeUrlParameters>;
    createImageUrl(baseUrl: string, vi: YouTubeVideoInfo, params: Record<string, any>): string | undefined;
    createShortImageUrl: FormatHandler<YouTubeUrlParameters>;
    createLongImageUrl: FormatHandler<YouTubeUrlParameters>;
}
