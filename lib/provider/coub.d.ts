import { VideoInfo } from '../urlParser';

export interface CoubUrlParameters {
    [key: string]: any;
}

export type CoubMediaTypes = 'video';

export interface CoubVideoInfo extends VideoInfo<CoubUrlParameters, CoubMediaTypes> {
    provider: 'coub';
}

export type CoubParseResult = CoubVideoInfo | undefined;
