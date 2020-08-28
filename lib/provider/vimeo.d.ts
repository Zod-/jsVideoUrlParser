import { VideoInfo } from '../urlParser';

export interface VimeoUrlParameters {
    [key: string]: any;
    start?: number;
    imageWidth?: number;
    imageHeight?: number;
    imageExtension?: string;
}

export type VimeoMediaTypes = 'video';

export interface VimeoVideoInfo extends VideoInfo<VimeoUrlParameters, VimeoMediaTypes> {
    provider: 'vimeo';
    channel?: string;
}

export type VimeoParseResult = VimeoVideoInfo | undefined;
