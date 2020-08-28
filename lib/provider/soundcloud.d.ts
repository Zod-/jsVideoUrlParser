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

export type SoundCloudParseResult = SoundCloudVideoInfo | undefined;
