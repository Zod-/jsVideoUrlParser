A javascript parser to extract information like provider, id, channel, start time from media urls.

# Supported providers
 - [YouTube](https://www.youtube.com/)
 - [Vimeo](https://vimeo.com/)
 - [Twitch](https://www.twitch.tv/)
 - [Dailymotion](https://www.dailymotion.com)
 - [Canal+](https://www.mycanal.fr/)
 - [Youku](https://www.youku.com/)
 - [Coub](https://coub.com/)
 - [Wistia](https://wistia.com/)
 - [SoundCloud](https://soundcloud.com/)
 - [TeacherTube](https://www.teachertube.com)
 - [Ted](https://www.ted.com)
 - [Tiktok](https://www.tiktok.com)
 - [Facebook](https://www.facebook.com/)
 - [Loom](https://www.loom.com/)
 - [Allociné](https://allocine.fr/)


# Building Locally

```
npm install
npm run lint
npm run test
npm run build
```

# npm

```
npm install js-video-url-parser
```

# bower

```shell
bower install js-video-url-parser
```

# Usage

## ES2015+ / Webpack

```
// All plugins
import urlParser from "js-video-url-parser";

// Choose individual plugins
import urlParser from "js-video-url-parser/lib/base";
import "js-video-url-parser/lib/provider/canalplus";
import "js-video-url-parser/lib/provider/coub";
import "js-video-url-parser/lib/provider/dailymotion";
import "js-video-url-parser/lib/provider/twitch";
import "js-video-url-parser/lib/provider/vimeo";
import "js-video-url-parser/lib/provider/wistia";
import "js-video-url-parser/lib/provider/youku";
import "js-video-url-parser/lib/provider/youtube";
import "js-video-url-parser/lib/provider/teachertube";
import "js-video-url-parser/lib/provider/ted";
import "js-video-url-parser/lib/provider/tiktok";
import "js-video-url-parser/lib/provider/loom";
import "js-video-url-parser/lib/provider/facebook";
import "js-video-url-parser/lib/provider/allocine";
```

## Parsing

Parsing a url will return a videoInfo object with all the information

```javascript
> urlParser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA')
{
  mediaType: 'video',
  id: 'HRb7B9fPhfA',
  provider: 'youtube'
}

> urlParser.parse('https://vimeo.com/97276391')
{
  mediaType: 'video',
  id: '97276391',
  provider: 'vimeo'
}
```

Any url parameters expect for ids will be saved in the params object. Some
providers have special parameters for example the start parameter which dictates
at how many seconds the video starts. Special parameters can be found in the
different descriptions for the providers.

```javascript
> urlParser.parse('https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82&t=1m40')
{
  provider: 'youtube',
  id: 'yQaAGmHNn9s',
  list: 'PL46F0A159EC02DF82',
  mediaType: 'video',
  params: {
    start: 100,
    index: '25'
  }
}
```

Parsing an incorrect url or trying to create one with an invalid object will return undefined

```javascript
> urlParser.parse('https://www.youuutube.com/watch?v=97276391')
> urlParser.create({ videoInfo: { provider: 'youtube' })
undefined
```

## Url Creation

The videoInfo objects can be turned back into urls with the `.create` function.
The required parameter for this is the videoInfo object itself. Optional ones are
the format of the url and the url parameters that should be added. Each provider
has it's own default format.

```javascript
> urlParser.create({
    videoInfo: {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video'
    },
    format: 'long',
    params: {
      foo: 'bar'
    }
  })
'https://www.youtube.com/watch?foo=bar&v=HRb7B9fPhfA'
```

Parsing and creating can also be chained together to clean up an url for example.
If you still want to reuse the generated parameters object you can use the keyword
`'internal'` as params.

```javascript
> urlParser.create({
  videoInfo: urlParser.parse('https://youtube.com/watch?foo=bar&v=HRb7B9fPhfA')
})
'https://www.youtube.com/watch?v=HRb7B9fPhfA'

> urlParser.create({
  videoInfo: urlParser.parse('https://youtube.com/watch?foo=bar&v=HRb7B9fPhfA'),
  params: 'internal'
})
'https://www.youtube.com/watch?foo=bar&v=HRb7B9fPhfA'
```

## Typescript

```typescript
// All plugins
import urlParser, { YouTubeParseResult } from 'js-video-url-parser';
const info = urlParser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA') as YouTubeParseResult;

// Choose individual plugins
import urlParser from 'js-video-url-parser/lib/base';
import { YouTubeParseResult } from 'js-video-url-parser/lib/provider/youtube';

const info = urlParser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA') as YouTubeParseResult;

// Parse results can be undefined
const id = info?.id;
```

## Adding a provider

Add a new file in the `lib/provider/` directory with the template found [here](lib/provider/template.js) and also add it to [index.js](lib/index.js).
<br>
Add some tests in `lib/provider/` with the template found
[here](lib/provider/template.test.js).

Run `npm run test` to create the parser and test your plugin.

## Provider information and examples

- [YouTube](https://github.com/Zod-/jsVideoUrlParser/wiki/YouTube)
- [Vimeo](https://github.com/Zod-/jsVideoUrlParser/wiki/Vimeo)
- [Twitch](https://github.com/Zod-/jsVideoUrlParser/wiki/Twitch)
- [Dailymotion](https://github.com/Zod-/jsVideoUrlParser/wiki/Dailymotion)
- [Canal+](https://github.com/Zod-/jsVideoUrlParser/wiki/Canal-)
- [Youku](https://github.com/Zod-/jsVideoUrlParser/wiki/Youku)
- [Coub](https://github.com/Zod-/jsVideoUrlParser/wiki/Coub)
- [Wistia](https://github.com/Zod-/jsVideoUrlParser/wiki/Wistia)
- [SoundCloud](https://github.com/Zod-/jsVideoUrlParser/wiki/SoundCloud)
- [TeacherTube](https://github.com/Zod-/jsVideoUrlParser/wiki/TeacherTube)

# License

[MIT](https://github.com/Zod-/jsVideoUrlParser/blob/master/LICENSE)
