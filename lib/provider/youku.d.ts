import { VideoInfo } from '../urlParser';

export interface YoukuUrlParameters {
    [key: string]: any;
}

export type YoukuMediaTypes = 'video';

export interface YoukuVideoInfo extends VideoInfo<YoukuUrlParameters, YoukuMediaTypes> {
    provider: 'youku';
}

export type YoukuParseResult = YoukuVideoInfo | undefined;
