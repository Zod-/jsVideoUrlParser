import { VideoInfo } from '../urlParser';

export interface AllocineUrlParameters {
    [key: string]: any;
}

export type AllocineMediaTypes = 'video';

export interface AllocineVideoInfo extends VideoInfo<AllocineUrlParameters, AllocineMediaTypes> {
    provider: 'allocine';
}

export type AllocineParseResult = AllocineVideoInfo | undefined;
