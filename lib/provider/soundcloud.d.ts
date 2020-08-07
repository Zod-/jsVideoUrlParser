import Provider, { FormatHandler } from './base-provider';
import { VideoInfo } from '../urlParser';

export interface SoundCloudUrlParameters {
    [key: string]: any;
    start?: number;
}

export type SoundCloudMediaTypes = 'track' | 'playlist' | 'apitrack' | 'apiplaylist';

export interface SoundCloudVideoInfo extends VideoInfo<SoundCloudUrlParameters, SoundCloudMediaTypes> {
    provider: 'soundcloud';
    list?: string;
    channel?: string;
}

export default class SoundCloud extends Provider<'long' | 'embed', SoundCloudMediaTypes, SoundCloudUrlParameters> {
    parseUrl(url: string, result: SoundCloudVideoInfo): SoundCloudVideoInfo;
    parseParameters(params: Record<string, any>): SoundCloudUrlParameters;
    parseMediaType(result: SoundCloudVideoInfo): SoundCloudVideoInfo;

    createLongUrl: FormatHandler<SoundCloudUrlParameters>;
    createEmbedUrl: FormatHandler<SoundCloudUrlParameters>;
}
