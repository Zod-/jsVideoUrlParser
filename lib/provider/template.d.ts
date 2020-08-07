import Provider, { FormatHandler } from './base-provider';
import { VideoInfo } from 'urlParser';

export interface TemplateUrlParameters {
    start?: number;
    [key: string]: any;
}

export type TemplateMediaTypes = 'video' | 'playlist';

export interface TemplateVideoInfo extends VideoInfo<TemplateUrlParameters, TemplateMediaTypes> {
    provider: 'template';
}

export default class Template extends Provider<'short' | 'long', TemplateMediaTypes, TemplateUrlParameters> {
    createLongUrl: FormatHandler<TemplateUrlParameters>;
    createShortUrl: FormatHandler<TemplateUrlParameters>;
}
