import Provider, { FormatHandler } from './base-provider';
import { VideoInfo } from '../urlParser';

export interface CanalPlusUrlParameters {
    [key: string]: any;
}

export type CanalPlusMediaTypes = 'video';

export interface CanalPlusVideoInfo extends VideoInfo<CanalPlusUrlParameters, CanalPlusMediaTypes> {
    provider: 'canalplus';
}

export type CanalPlusParseResult = CanalPlusVideoInfo | undefined;

export default class CanalPlus extends Provider<'embed', CanalPlusMediaTypes, CanalPlusUrlParameters> {
    parseParameters(params: Record<string, any>): CanalPlusUrlParameters;

    createEmbedUrl: FormatHandler<CanalPlusUrlParameters>;
}
