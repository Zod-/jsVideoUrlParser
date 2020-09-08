import { VideoInfo } from '../urlParser';

export interface TwitchUrlParameters {
    [key: string]: any;
    start?: number;
}

export type TwitchMediaTypes = 'stream' | 'video' | 'clip';

export interface TwitchVideoInfo extends VideoInfo<TwitchUrlParameters, TwitchMediaTypes> {
    provider: 'twitch';
    channel?: string;
}

export type TwitchParseResult = TwitchVideoInfo | undefined;
