import UrlParser, { VideoInfo } from "urlParser";

export interface TestObj {
    videoInfo: VideoInfo;
    formats: Record<string, string>;
    urls: string[];
}

export function testUrls(parser: UrlParser, obj: TestObj): void;
