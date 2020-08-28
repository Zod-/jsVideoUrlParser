import { VideoInfo } from 'urlParser';

export interface TemplateUrlParameters {
    start?: number;
    [key: string]: any;
}

export type TemplateMediaTypes = 'video' | 'playlist';

export interface TemplateVideoInfo extends VideoInfo<TemplateUrlParameters, TemplateMediaTypes> {
    provider: 'template';
}

export type TemplateParseResult = TemplateVideoInfo | undefined;
