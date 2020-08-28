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
