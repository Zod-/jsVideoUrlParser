jsVideoUrlParser [![Build Status](https://travis-ci.org/Zod-/jsVideoUrlParser.svg)](https://travis-ci.org/Zod-/jsVideoUrlParser) [![Gitter](https://badges.gitter.im/Zod-/jsVideoUrlParser.svg)](https://gitter.im/Zod-/jsVideoUrlParser?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
================

A javascript parser to extract informations like provider, id, channel, start time from media urls.

Currently supports
 - YouTube
 - Vimeo
 - Twitch
 - Dailymotion
 - Canal+
 - Youku
 - Coub
 - Wistia
 - SoundCloud

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
import "js-video-url-parser/lib/provider/canalplus';
import "js-video-url-parser/lib/provider/coub';
import "js-video-url-parser/lib/provider/dailymotion';
import "js-video-url-parser/lib/provider/twitch';
import "js-video-url-parser/lib/provider/vimeo';
import "js-video-url-parser/lib/provider/wistia';
import "js-video-url-parser/lib/provider/youku';
import "js-video-url-parser/lib/provider/youtube';

```
## Parsing

Parsing a url will return a videoInfo object with all the information

```javascript
> urlParser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA')
{ mediaType: 'video',
  id: 'HRb7B9fPhfA',
  provider: 'youtube' }

> urlParser.parse('https://vimeo.com/97276391')
{ mediaType: 'video',
  id: '97276391',
  provider: 'vimeo' }
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

Parsing an incorrect url will return undefined
```javascript
> urlParser.parse('https://www.youuutube.com/watch?v=97276391')
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

## Adding a provider

Add a new file in the `lib/provider/` directory with the template found [here](lib/provider/template.js) and also add it to [index.js](lib/index.js).
<br>
Add some tests in `lib/provider/` with the template found
[here](lib/provider/template.test.js).

Run `npm run test` to create the parser and test your plugin.

# Plugins

## YouTube

#### Supported media types:
* `'video'`: Regular videos which can also be livestreams.
* `'playlist'`: YouTube playlist.
* `'share'`: Shared YouTube videos that link to a special website and are not actual videos themselves.
* `'channel'`: YouTube channels, which are the same as users.

#### Supported url formats:
* `'short'`: Shortened urls.
* `'long'`(default): Regular urls.
* `'embed'`: Embedded urls.
* `'shortImage'`: Shortened thumbnail urls.
* `'longImage'`: Regular thumbnail urls.

#### Creating urls with different media types:

| mediaType/formats| short | long | embed | shortImage | longImage |
| ------------- | :--: | :--: | :--: | :--: | :--: |
| **video**    | ✓  | ✓  | ✓  | ✓  | ✓  |
| **playlist** | X  | ✓  | ✓  | X  | X  |
| **share**    | X  | ✓  | X  | X  | X  |
| **channel**    | X  | ✓  | X  | X  | X  |

#### Special parameters:
* `'name'`: Sometimes you get the name of a channel instead of the `'id'`.
* `'params.start'`: The number where the video should begin in seconds.
* `'params.imageQuality'`: Custom parameter for generating different qualities of thumbnail urls.
  * `'0', '1', '2', '3', 'default', 'hqdefault'(default), 'mqdefault', 'sddefault', 'maxresdefault'`

#### Parsing Examples:
```javascript
> urlParser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA');
> urlParser.parse('http://youtu.be/HRb7B9fPhfA');
> urlParser.parse('https://m.youtube.com/details?v=HRb7B9fPhfA');
> urlParser.parse('https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA/related');
> urlParser.parse('https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg');
> urlParser.parse('https://img.youtube.com/vi/HRb7B9fPhfA/hqdefault.jpg');
{ mediaType: 'video',
  id: 'HRb7B9fPhfA',
  provider: 'youtube' }

> urlParser.parse('http://www.youtube.com/embed/videoseries?list=PL46F0A159EC02DF82');
> urlParser.parse('http://www.youtube.com/playlist?list=PL46F0A159EC02DF82');
{ mediaType: 'playlist',
    list: 'PL46F0A159EC02DF82',
    provider: 'youtube'}

> urlParser.parse('http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82');
{ mediaType: 'video',
  id: 'yQaAGmHNn9s',
  list: 'PL46F0A159EC02DF82',
  provider: 'youtube'
}

> urlParser.parse('http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40');
{ mediaType: 'video',
  id: 'yQaAGmHNn9s',
  list: 'PL46F0A159EC02DF82',
  provider: 'youtube'
  params: {
    start: 100
  }
}

> urlParser.parse('https://www.youtube.com/channel/UCzQUP1qoWDoEbmsQxvdjxgQ');
{ mediaType: 'channel',
  id: 'UCzQUP1qoWDoEbmsQxvdjxgQ',
  provider: 'youtube'
}

> urlParser.parse('https://www.youtube.com/user/PowerfulJRE');
> urlParser.parse('https://www.youtube.com/c/PowerfulJRE');
{ mediaType: 'channel',
  name: 'PowerfulJRE',
  provider: 'youtube'
}
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video'
    },
    format: <format>
  })
'long': 'https://www.youtube.com/watch?v=HRb7B9fPhfA'
'short': 'https://youtu.be/HRb7B9fPhfA'
'embed': 'https://www.youtube.com/embed/HRb7B9fPhfA'
'shortImage': 'https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg'
'longImage': 'https://img.youtube.com/vi/HRb7B9fPhfA/hqdefault.jpg'

> urlParser.create({
    videoInfo: {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video'
    },
    params: {
      start: 90
    },
    format: <format>
  })
'long': 'https://www.youtube.com/watch?v=HRb7B9fPhfA#t=90'
'short': 'https://youtu.be/HRb7B9fPhfA#t=90'
'embed': 'https://www.youtube.com/embed/HRb7B9fPhfA?start=90'

> urlParser.create({
    videoInfo: {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'video'
    },
    format: <format>
  })
'long': 'https://www.youtube.com/watch?list=PL46F0A159EC02DF82&v=HRb7B9fPhfA'
'embed': 'https://www.youtube.com/embed/HRb7B9fPhfA?list=PL46F0A159EC02DF82'

> urlParser.create({
    videoInfo: {
      provider: 'youtube',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'playlist'
    },
    format: <format>
  })
'long': 'https://www.youtube.com/playlist?feature=share&list=PL46F0A159EC02DF82'
'embed': 'https://www.youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist'

> urlParser.create({
    videoInfo:  {
      provider: 'youtube',
      id: 'UCzQUP1qoWDoEbmsQxvdjxgQ',
      mediaType: 'channel'
    },
    format: 'long'
  })
'long': 'https://www.youtube.com/channel/UCzQUP1qoWDoEbmsQxvdjxgQ'

> urlParser.create({
    videoInfo:  {
      provider: 'youtube',
      name: 'PowerfulJRE',
      mediaType: 'channel'
    },
    format: 'long'
  })
'long': 'https://www.youtube.com/c/PowerfulJRE'

> urlParser.create({
    videoInfo:  {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video'
    },
    params:{
      imageQuality: <quality>
    },
    format: 'shortImage'
  })
'0': 'https://i.ytimg.com/vi/HRb7B9fPhfA/0.jpg'
'1': 'https://i.ytimg.com/vi/HRb7B9fPhfA/1.jpg'
'2': 'https://i.ytimg.com/vi/HRb7B9fPhfA/2.jpg'
'3': 'https://i.ytimg.com/vi/HRb7B9fPhfA/3.jpg'
'hqdefault': 'https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg'
'sddefault': 'https://i.ytimg.com/vi/HRb7B9fPhfA/sddefault.jpg'
'mqdefault': 'https://i.ytimg.com/vi/HRb7B9fPhfA/mqdefault.jpg'
'maxresdefault': 'https://i.ytimg.com/vi/HRb7B9fPhfA/maxresdefault.jpg'

> urlParser.create({
    videoInfo:  {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video'
    },
    params:{
      imageQuality: <quality>
    },
    format: 'longImage'
  })
'0': 'https://img.youtube.com/vi/HRb7B9fPhfA/0.jpg'
'1': 'https://img.youtube.com/vi/HRb7B9fPhfA/1.jpg'
'2': 'https://img.youtube.com/vi/HRb7B9fPhfA/2.jpg'
'3': 'https://img.youtube.com/vi/HRb7B9fPhfA/3.jpg'
'hqdefault': 'https://img.youtube.com/vi/HRb7B9fPhfA/hqdefault.jpg'
'sddefault': 'https://img.youtube.com/vi/HRb7B9fPhfA/sddefault.jpg'
'mqdefault': 'https://img.youtube.com/vi/HRb7B9fPhfA/mqdefault.jpg'
'maxresdefault': 'https://img.youtube.com/vi/HRb7B9fPhfA/maxresdefault.jpg'
```

## Vimeo

#### Supported media types:
* `'video'`: Regular videos

#### Supported url formats:
* `'long'`(default): Regular urls.
* `'embed'`: Embedded urls.

#### Creating urls with different media types:

| mediaType/formats| long | embed |
| ------------- | :--: | :--: |
| **video**    | ✓  | ✓  |

#### Special parameters:
* `'params.start'`: The number where the video should begin in seconds.

#### Parsing Examples:
```javascript
> urlParser.parse('https://vimeo.com/97276391');
> urlParser.parse('https://vimeo.com/channels/staffpicks/97276391');
{ id: '97276391',
  mediaType: 'video',
  provider: 'vimeo' }

> urlParser.parse('https://vimeo.com/album/2903155/video/96186586');
{ id: '96186586',
  mediaType: 'video',
  provider: 'vimeo' }

> urlParser.parse('https://vimeo.com/groups/shortfilms/videos/97688625');
{ id: '97688625',
  mediaType: 'video',
  provider: 'vimeo' }

> urlParser.parse('http://vimeopro.com/staff/frame/video/24069938');
{ id: '24069938',
  mediaType: 'video',
  provider: 'vimeo' }

> urlParser.parse('https://vimeo.com/97276391#t=1m30s');
{ id: '97276391',
  mediaType: 'video',
  provider: 'vimeo',
  params: {
    start: 90
  }
}
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video'
    },
    format: <format>
  })
'long': 'https://vimeo.com/97276391'
'embed': '//player.vimeo.com/video/97276391'

> urlParser.create({
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video',
      params: {
        start: 90
      }
    },
    format: <format>
  })
'long': 'https://vimeo.com/97276391#t=90'
'embed': '//player.vimeo.com/video/97276391#t=90'
```

## Twitch

#### Supported media types:
* `'stream'`: Streams which are just a direct url to a channel.
* `'video'`: Part of streams or history of a full stream.
* `'clip'`: Short video clips that can be created by anyone on a stream.

#### Supported url formats:
* `'long'`(default): Regular urls.
* `'embed'`: Embedded urls.

#### Creating urls with different media types:

| mediaType/formats| long | embed |
| ------------- | :--: | :--: |
| **stream** | ✓  | ✓  |
| **video** | ✓  | ✓  |
| **clip** | ✓  | ✓  |

#### Special parameters:
* `'params.start'`: The number where the video should begin in seconds.

```javascript
> urlParser.parse('http://www.twitch.tv/rains8');
> urlParser.parse('http://www.twitch.tv/widgets/live_embed_player.swf?channel=rains8');
> urlParser.parse('http://twitch.tv/rains8/chat');
{ mediaType: 'stream',
  channel: 'rains8',
  provider: 'twitch' }

> urlParser.parse('http://www.twitch.tv/75292411');
{ mediaType: 'video',
  id: 'v75292411',
  provider: 'twitch' }

> urlParser.parse('http://www.twitch.tv/75292411?t=1m30s');
{ mediaType: 'video',
  id: 'v75292411',
  provider: 'twitch',
  params: {
    start: 90
  }
}

> urlParser.parse('https://clips.twitch.tv/SuspiciousImpartialLarkItsBoshyTime');
> urlParser.parse('https://clips.twitch.tv/embed?clip=SuspiciousImpartialLarkItsBoshyTime');
{ mediaType: 'clip',
  id: 'SuspiciousImpartialLarkItsBoshyTime',
  provider: 'twitch' }
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'twitch',
      channel: 'rains8',
      mediaType: 'stream'
    },
    format: <format>
  })
'long': 'https://twitch.tv/rains8'
'embed': 'https://player.twitch.tv/?channel=rains8'

> urlParser.create({
    videoInfo: {
      provider: 'twitch',
      id: 'v75292411',
      mediaType: 'video'
    },
    format: <format>
  })
'long': 'https://twitch.tv/75292411'
'embed': 'https://player.twitch.tv/?video=v75292411'

> urlParser.create({
    videoInfo: {
      provider: 'twitch',
      id: 'v75292411',
      mediaType: 'video',
      params: {
        start: 90
      }
    },
    format: <format>
  })
'long': 'https://twitch.tv/75292411?t=90s'
'embed': 'https://player.twitch.tv/?video=v75292411?=90s'

> urlParser.create({
    videoInfo: {
      provider: 'twitch',
      id: 'SuspiciousImpartialLarkItsBoshyTime',
      mediaType: 'clip'
    },
    format: <format>
  })
'long': 'https://clips.twitch.tv/SuspiciousImpartialLarkItsBoshyTime'
'embed': 'https://clips.twitch.tv/embed?clip=SuspiciousImpartialLarkItsBoshyTime'
```

## Dailymotion

#### Supported media types:
* `'video'`: Regular videos.

#### Supported url formats:
* `'short'`: Shortened urls.
* `'long'`(default): Regular urls.
* `'embed'`: Embedded urls.

#### Creating urls with different media types:

| mediaType/formats| short | long | embed |
| ------------- | :--: | :--: | :--: |
| **video** | ✓  | ✓  | ✓ |

#### Special parameters:
* `'params.start'`: The number where the video should begin in seconds.

#### Parsing Examples:
```javascript
> urlParser.parse('http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals');
> urlParser.parse('http://www.dailymotion.com/video/x1e2b95');
> urlParser.parse('http://dai.ly/x1e2b95');
> urlParser.parse('http://www.dailymotion.com/embed/video/x1e2b95');
{ mediaType: 'video',
  id: 'x1e2b95',
  provider: 'dailymotion' }

> urlParser.parse('http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals?start=10');
> urlParser.parse('http://www.dailymotion.com/embed/video/x1e2b95?start=10');
> urlParser.parse('http://www.dailymotion.com/video/x1e2b95?start=10');
{ mediaType: 'video',
  id: 'x1e2b95',
  provider: 'dailymotion',
  params: {
    start: 10
  }
}
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'dailymotion',
      id: 'x1e2b95',
      mediaType: 'video'
    },
    format: <format>
  })
'long': 'https://www.dailymotion.com/video/x1e2b95'
'short': 'https://dai.ly/x1e2b95'
'embed': '//www.dailymotion.com/embed/video/x1e2b95'

> urlParser.create({
    videoInfo: {
      provider: 'dailymotion',
      id: 'x1e2b95',
      mediaType: 'video',
      params: {
        start: 10
      }
    },
    format: <format>
  })
'long': 'https://www.dailymotion.com/video/x1e2b95?start=10'
'short': 'https://dai.ly/x1e2b95?start=10'
'embed': '//www.dailymotion.com/embed/video/x1e2b95?start=10'
```

## Coub

#### Supported media types:
* `'video'`: Regular videos.

#### Supported url formats:
* `'long'`(default): Regular urls.
* `'embed'`: Embedded urls.

#### Creating urls with different media types:

| mediaType/formats| long | embed |
| ------------- | :--: | :--: |
| **video** | ✓  | ✓  |

#### Parsing Examples:
```javascript
> urlParser.parse('https://coub.com/view/by7sm');
> urlParser.parse('//coub.com/embed/by7sm');
{ mediaType: 'video',
  id: 'by7sm',
  provider: 'coub' }
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'coub',
      id: 'by7sm',
      mediaType: 'video'
    },
    format: <format>
  })
'long': 'https://coub.com/view/by7sm'
'embed': '//coub.com/embed/by7sm'
```

## Youku

#### Supported media types:
* `'video'`: Regular videos.

#### Supported url formats:
* `'long'`(default): Regular urls.
* `'static'`: Video player that fills out the whole website.
* `'embed'`: Embedded urls.
* `'flash'`: Flash embedded urls.

#### Creating urls with different media types:

| mediaType/formats| long | static | embed | flash |
| ------------- | :--: | :--: | :--: | :--: |
| **video** | ✓  | ✓  | ✓  | ✓  |

#### Parsing Examples:
```javascript
> urlParser.parse('http://player.youku.com/embed/XMTQ3OTM4MzMxMg');
> urlParser.parse('http://player.youku.com/player.php/sid/XMTQ3OTM4MzMxMg/v.swf');
> urlParser.parse('http://v.youku.com/v_show/id_XMTQ3OTM4MzMxMg');
> urlParser.parse('http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=XMTQ3OTM4MzMxMg');
{ mediaType: 'video',
  id: 'XMTQ3OTM4MzMxMg',
  provider: 'youku' }
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'youku',
      id: 'XMTQ3OTM4MzMxMg',
      mediaType: 'video'
    },
    format: <format>
  })
'embed': 'http://player.youku.com/embed/XMTQ3OTM4MzMxMg',
'long': 'http://v.youku.com/v_show/id_XMTQ3OTM4MzMxMg',
'flash': 'http://player.youku.com/player.php/sid/XMTQ3OTM4MzMxMg/v.swf',
'static': 'http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=XMTQ3OTM4MzMxMg'
```

## Canal+

#### Supported media types:
* `'video'`: Regular videos.

#### Supported url formats:
* `'embed'`(default): Embedded urls.

#### Creating urls with different media types:

| mediaType/formats| embed |
| ------------- | :--: |
| **video** | ✓  |

#### Parsing Examples:
```javascript
> urlParser.parse('http://player.canalplus.fr/embed/?param=cplus&vid=1365175');
> urlParser.parse('http://www.canalplus.fr/humour/pid1784-les-guignols.html?vid=1365175');
{ mediaType: 'video',
  id: '1365175',
  provider: 'canalplus' }
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'canalplus',
      id: '1365175',
      mediaType: 'video'
    },
    format: <format>
  })
'embed': 'http://player.canalplus.fr/embed/?param=cplus&vid=1365175',
```

## Wistia

#### Supported media types:
* `'video'`: Regular videos.
* `'embedvideo'`: Any links that do not include the channel name are embedded links.

#### Supported url formats:
* `'long'`(default): Regular urls.
* `'embed'`: Regular embedded urls using iframe.
* `'embedjsonp'`: jsonp specific embedded urls.

#### Creating urls with different media types:

| mediaType/formats| long | embed | embedjsonp |
| ------------- | :--: | :--: | :--: |
| **video**    | ✓  | ✓  | ✓  |
| **embedvideo** | X  | ✓  | ✓  |

#### Special parameters:
* `'params.start'`: The number where the video should begin in seconds.

#### Parsing Examples:
```javascript
> urlParser.parse('https://appboss.wistia.com/medias/lpu6bgplle');
{ mediaType: 'video',
  channel: 'appboss',
  id: 'lpu6bgplle',
  provider: 'wistia'
}

> urlParser.parse('https://fast.wistia.com/embed/iframe/lpu6bgplle');
> urlParser.parse('https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp');
> urlParser.parse('https://content.wistia.com/customer-stories/bizzabo?wvideo=lpu6bgplle');
> urlParser.parse('https://wistia.com/blog/soapbox-videos-for-the-holidays?wvideo=lpu6bgplle');
> urlParser.parse('https://wistia.com/library/how-to-look-good-on-a-webcam?wvideo=lpu6bgplle');
> urlParser.parse('https://wistia.com/solutions/sales?wvideo=lpu6bgplle');
{ mediaType: 'embedvideo',
  id: 'lpu6bgplle',
  provider: 'wistia'
}

> urlParser.parse('https://appboss.wistia.com/medias/lpu6bgplle?wtime=1m30s');
{ mediaType: 'video',
  channel: 'appboss',
  id: 'lpu6bgplle',
  provider: 'wistia'
  params: {
    start: 90
  }
}

> urlParser.parse('https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=30');
{ mediaType: 'embedvideo',
  id: 'lpu6bgplle',
  provider: 'wistia'
  params: {
    start: 90
  }
}
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'wistia',
      channel: 'appboss',
      id: 'lpu6bgplle',
      mediaType: 'video'
    },
    format: <format>
  })
'long': 'https://appboss.wistia.com/medias/lpu6bgplle'
'embed': 'https://fast.wistia.com/embed/iframe/lpu6bgplle'
'embedjsonp': 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp'

> urlParser.create({
    videoInfo: {
      provider: 'wistia',
      channel: 'appboss',
      id: 'lpu6bgplle',
      mediaType: 'video'
    },
    params: {
      start: 90
    },
    format: <format>
  })
'long': 'https://appboss.wistia.com/medias/lpu6bgplle?wtime=90'
'embed': 'https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=90'
'embedjsonp': 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp'

> urlParser.create({
    videoInfo: {
      provider: 'wistia',
      id: 'lpu6bgplle',
      mediaType: 'embedvideo'
    },
    format: <format>
  })
'embed': 'https://fast.wistia.com/embed/iframe/lpu6bgplle'
'embedjsonp': 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp'

> urlParser.create({
    videoInfo: {
      provider: 'wistia',
      id: 'lpu6bgplle',
      mediaType: 'embedvideo'
    },
    params: {
      start: 90
    },
    format: <format>
  })
'embed': 'https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=90'
'embedjsonp': 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp'
```

## SoundCloud

#### Supported media types:
* `'track'`: Regular tracks.
* `'playlist'`: Lists of tracks, including albums, singles, EPs, playlists.
* `'apitrack'`: SoundCloud uses integer based ids for their api. Track can be resolved to apitrack using their `/resolve` endpoint
* `'apiplaylist'`: Same reason as apitrack.

#### Supported url formats:
* `'long'`(default): Regular urls.
* `'embed'`: Embedded urls using iframe.

#### Creating urls with different media types:

| mediaType/formats| long | embed |
| ------------- | :--: | :--: |
| **track**    | ✓  | X  |
| **playlist** | ✓  | X  |
| **apitrack** | ✓  | ✓  |
| **apiplaylist** | ✓  | ✓  |

#### Special parameters:
* `'list'`: On playlist types the list property will be set with the list id.
* `'channel'`: The channel containing the track or playlist. Will not be set with api types.
* `'params.start'`: The number where the video should begin in seconds.

#### Parsing Examples:
```javascript
> urlParser.parse('https://soundcloud.com/julian-hangst-rfer/odsf0dif92w3j_adfw-edf-1-asdf-1');
{ mediaType: 'track',
  channel: 'julian-hangst-rfer',
  id: 'odsf0dif92w3j_adfw-edf-1-asdf-1',
  provider: 'soundcloud'
}

> urlParser.parse('https://soundcloud.com/julian-hangst-rfer/sets/dif92w-e_e');
{ mediaType: 'playlist',
  channel: 'julian-hangst-rfer',
  list: 'dif92w-e_e',
  provider: 'soundcloud'
}

> urlParser.parse('https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/388050272');
> urlParser.parse('https://api.soundcloud.com/tracks/388050272');
{ mediaType: 'apitrack',
  id: '388050272',
  provider: 'soundcloud'
}

> urlParser.parse('https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/430366544');
> urlParser.parse('https://api.soundcloud.com/playlists/430366544');
{ mediaType: 'apiplaylist',
  list: '430366544',
  provider: 'soundcloud'
}

> urlParser.parse('https://soundcloud.com/julian-hangst-rfer/odsf0dif92w3j_adfw-edf-1-asdf-1#t=0:30');
{ mediaType: 'track',
  channel: 'julian-hangst-rfer',
  id: 'odsf0dif92w3j_adfw-edf-1-asdf-1',
  provider: 'soundcloud',
  params: {
    start: 30
  }
}
```

#### Creation Examples:
```javascript
> urlParser.create({
    videoInfo: {
      provider: 'soundcloud',
      channel: 'julian-hangst-rfer',
      id: 'odsf0dif92w3j_adfw-edf-1-asdf-1',
      mediaType: 'track'
    },
    format: <format>
  })
'long': 'https://soundcloud.com/julian-hangst-rfer/odsf0dif92w3j_adfw-edf-1-asdf-1'

> urlParser.create({
    videoInfo: {
      provider: 'soundcloud',
      channel: 'julian-hangst-rfer',
      list: 'dif92w-e_e',
      mediaType: 'playlist'
    },
    format: <format>
  })
'long': 'https://soundcloud.com/julian-hangst-rfer/sets/dif92w-e_e'

> urlParser.create({
    videoInfo: {
      provider: 'soundcloud',
      id: '388050272',
      mediaType: 'apitrack'
    },
    format: <format>
  })
'long': 'https://api.soundcloud.com/tracks/388050272'
'embed': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/388050272'

> urlParser.create({
    videoInfo: {
      provider: 'soundcloud',
      list: '430366544',
      mediaType: 'apiplaylist'
    },
    format: <format>
  })
'long': 'https://api.soundcloud.com/playlist/430366544'
'embed': 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlist/430366544'
```
