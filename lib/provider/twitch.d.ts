import Provider, { FormatHandler } from './base-provider';
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

export interface IdParts {
    pre: string;
    id: string;
}

export default class Twitch extends Provider<'long' | 'embed', TwitchMediaTypes, TwitchUrlParameters> {
    seperateId(id: string): IdParts;
    parseChannel: FormatHandler<TwitchUrlParameters>;
    parseUrl(url: string, result: TwitchVideoInfo, params: TwitchUrlParameters): TwitchVideoInfo;
    parseMediaType(result: TwitchVideoInfo): TwitchMediaTypes;
    parseParameters(params: Record<string, any>): TwitchUrlParameters;

    createLongUrl: FormatHandler<TwitchUrlParameters>;
    createEmbedUrl: FormatHandler<TwitchUrlParameters>;
}
