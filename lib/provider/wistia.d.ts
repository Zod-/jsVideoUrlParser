import Provider, { FormatHandler } from './base-provider';
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

export default class Wistia extends Provider<'long' | 'embed' | 'embedjsonp', WistiaMediaTypes, WistiaUrlParameters> {
    parseUrl(url: string): string | undefined;
    parseChannel(url: string): string | undefined;
    parseParameters(params: Record<string, any>, result: WistiaVideoInfo): WistiaUrlParameters;
    parseMediaType(result: WistiaUrlParameters): WistiaMediaTypes;
    createUrl(vi: WistiaVideoInfo, params: Record<string, any>, url: string): string | undefined;

    createLongUrl: FormatHandler<WistiaUrlParameters>;
    createEmbedUrl: FormatHandler<WistiaUrlParameters>;
    createEmbedJsonpUrl: FormatHandler<WistiaUrlParameters>;
}
