import { VideoInfo } from '../urlParser';

export interface GoogledriveUrlParameters {
    start?: number;
    [key: string]: any;
}

export type GoogledriveMediaTypes = 'video';

export interface GoogledriveVideoInfo extends VideoInfo<GoogledriveUrlParameters, GoogledriveMediaTypes> {
    provider: 'googledrive';
}

export type GoogledriveParseResult = GoogledriveVideoInfo | undefined;
