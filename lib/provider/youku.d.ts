import Provider, { FormatHandler } from './base-provider';
import { VideoInfo } from '../urlParser';

export interface YoukuUrlParameters {
    [key: string]: any;
}

export type YoukuMediaTypes = 'video';

export interface YoukuVideoInfo extends VideoInfo<YoukuUrlParameters, YoukuMediaTypes> {
    provider: 'youku';
}

export default class Youku extends Provider<'long' | 'static' | 'embed' | 'flash', YoukuMediaTypes, YoukuUrlParameters> {
    parseUrl(url: string): string | undefined;
    parseParameters(params: Record<string, any>, result: YoukuVideoInfo): YoukuVideoInfo;
    createUrl(baseUrl: string, vi: YoukuVideoInfo, params: Record<string, any>): string | undefined;

    createStaticUrl: FormatHandler<YoukuUrlParameters>;
    createLongUrl: FormatHandler<YoukuUrlParameters>;
    createEmbedUrl: FormatHandler<YoukuUrlParameters>;
    createFlashUrlUrl: FormatHandler<YoukuUrlParameters>;
}
