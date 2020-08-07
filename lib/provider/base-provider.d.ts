import { VideoInfo } from '../urlParser';

export type FormatHandler<UrlParameters> = (vi: VideoInfo<UrlParameters>, params: Record<string, string>) => string;

export default class Provider<FormatKeys extends string | number | symbol = string, MediaTypes = 'video', UrlParameters = Record<string, any>> {
    provider: string;
    alternatives: string[];
    defaultFormat: FormatKeys;
    formats: Record<FormatKeys, FormatHandler<UrlParameters>>;
    mediaTypes: Record<string, MediaTypes>;

    parse(url: string, params: Record<string, any>): VideoInfo<UrlParameters> | undefined;
}
