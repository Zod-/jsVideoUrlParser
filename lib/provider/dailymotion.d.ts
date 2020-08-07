import Provider, { FormatHandler } from './base-provider';
import { VideoInfo } from '../urlParser';

export interface DailymotionUrlParameters {
    [key: string]: any;
    start?: number;
}

export type DailymotionMediaTypes = 'video';

export interface DailymotionVideoInfo extends VideoInfo<DailymotionUrlParameters, DailymotionMediaTypes> {
    provider: 'dailymotion';
}

export type DailymotionParseResult = DailymotionVideoInfo | undefined;

export default class Dailymotion extends Provider<'short' | 'long' | 'embed' | 'image', DailymotionMediaTypes, DailymotionUrlParameters> {
    parseParameters(params: Record<string, any>): DailymotionUrlParameters;
    parseTime(params: Record<string, any>): DailymotionUrlParameters;
    parseUrl(url: string): string | undefined;
    createUrl(base: string, vi: DailymotionVideoInfo, params: Record<string, any>): string | undefined;

    createShortUrl: FormatHandler<DailymotionUrlParameters>;
    createLongUrl: FormatHandler<DailymotionUrlParameters>;
    createEmbedUrl: FormatHandler<DailymotionUrlParameters>;
    createImageUrl: FormatHandler<DailymotionUrlParameters>;
}
