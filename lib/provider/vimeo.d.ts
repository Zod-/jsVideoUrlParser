import Provider, { FormatHandler } from './base-provider';
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

export default class Vimeo extends Provider<'long' | 'embed' | 'image', VimeoMediaTypes, VimeoUrlParameters> {
    parseUrl(url: string, result: VimeoVideoInfo): VimeoVideoInfo;
    parseParameters(params: Record<string, any>): VimeoUrlParameters;
    parseTime(params: Record<string, any>): VimeoUrlParameters;
    createUrl(baseUrl: string, vi: VimeoVideoInfo, params: Record<string, any>): string | undefined;

    createLongUrl: FormatHandler<VimeoUrlParameters>;
    createEmbedUrl: FormatHandler<VimeoUrlParameters>;
    createImageUrl: FormatHandler<VimeoUrlParameters>;
}
