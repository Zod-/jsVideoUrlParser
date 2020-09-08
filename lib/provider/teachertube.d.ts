import { VideoInfo } from '../urlParser';

export interface TeacherTubeUrlParameters {
    [key: string]: any;
}

export type TeacherTubeMediaTypes = 'video' | 'audio' | 'document' | 'channel' | 'collection' | 'group';

export interface TeacherTubeVideoInfo extends VideoInfo<TeacherTubeUrlParameters, TeacherTubeMediaTypes> {
    provider: 'teachertube';
    list?: string;
}

export type TeacherTubeParseResult = TeacherTubeVideoInfo | undefined;
