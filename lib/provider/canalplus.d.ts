import { VideoInfo } from '../urlParser';

export interface CanalPlusUrlParameters {
    [key: string]: any;
}

export type CanalPlusMediaTypes = 'video';

export interface CanalPlusVideoInfo extends VideoInfo<CanalPlusUrlParameters, CanalPlusMediaTypes> {
    provider: 'canalplus';
}

export type CanalPlusParseResult = CanalPlusVideoInfo | undefined;
