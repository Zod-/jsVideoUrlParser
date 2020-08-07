import Provider, { FormatHandler } from './base-provider';
import { VideoInfo } from '../urlParser';

export interface TeacherTubeUrlParameters {
    [key: string]: any;
}

export type TeacherTubeMediaTypes = 'video' | 'audio' | 'document' | 'channel' | 'collection' | 'group';

export interface TeacherTubeVideoInfo extends VideoInfo<TeacherTubeUrlParameters, TeacherTubeMediaTypes> {
    provider: 'teachertube';
    list?: string;
}

export default class TeacherTube extends Provider<'long' | 'embed', TeacherTubeMediaTypes, TeacherTubeUrlParameters> {
    parseMediaType(result: string): TeacherTubeMediaTypes;
    parsePlaylist(params: Record<string, any>): string | undefined;

    createLongUrl: FormatHandler<TeacherTubeUrlParameters>;
    createEmbedUrl: FormatHandler<TeacherTubeUrlParameters>;
}
