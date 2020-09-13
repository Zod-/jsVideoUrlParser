import { VideoInfo } from '../urlParser';

export interface VimeoUrlParameters {
    [key: string]: any;
    start?: number;
}

export type VimeoMediaTypes = 'video';

export interface VimeoVideoInfo extends VideoInfo<VimeoUrlParameters, VimeoMediaTypes> {
    provider: 'vimeo';
}

export type VimeoParseResult = VimeoVideoInfo | undefined;
