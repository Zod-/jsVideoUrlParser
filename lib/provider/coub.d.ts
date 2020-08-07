import Provider, { FormatHandler } from './base-provider';
import { VideoInfo } from '../urlParser';

export interface CoubUrlParameters {
    [key: string]: any;
}

export type CoubMediaTypes = 'video';

export interface CoubVideoInfo extends VideoInfo<CoubUrlParameters, CoubMediaTypes> {
    provider: 'coub';
}

export default class Coub extends Provider<'long' | 'embed', CoubMediaTypes, CoubUrlParameters> {
    parseUrl(url: string): string | undefined;
    createUrl(baseUrl: string, vi: CoubVideoInfo, params: Record<string, any>): string | undefined;

    createLongUrl: FormatHandler<CoubUrlParameters>;
    createEmbedUrl: FormatHandler<CoubUrlParameters>;
}
