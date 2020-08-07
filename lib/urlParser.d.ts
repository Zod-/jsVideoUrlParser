import Provider from './provider/base-provider';

export interface Options {
    videoInfo: VideoInfo;
    params?: 'internal' | Record<string, any>;
    format?: string;
}

export interface VideoInfo<UrlParameters = Record<string, any>, MediaTypes = string> {
    provider?: string;
    id: string;
    mediaType?: MediaTypes;
    params?: UrlParameters;
}

export default class UrlParser {
    plugins: Record<string, Provider>;

    parseProvider(url: string): string | undefined;
    parse(url: string): VideoInfo | undefined;
    bind(plugin: Provider): void;
    create(op: Options): string | undefined;
}
