jsVideoUrlParser [![Build Status](https://travis-ci.org/Zod-/jsVideoUrlParser.svg)](https://travis-ci.org/Zod-/jsVideoUrlParser)
================

A javascript parser to extract informations like provider, video id, start time from video urls

Currently supports
 - YouTube
 - Vimeo
 - Twitch
 - Dailymotion
 - Canal+
 - Youku
 - Coub

#grunt

```shell
$ grunt
$ grunt build
$ grunt test
$ grunt dist

#build and test specific plugins
$ grunt --youtube=1 --vimeo=1
$ grunt build --youtube=1 --vimeo=1
$ grunt test --youtube=1 --vimeo=1
$ grunt dist --youtube=1 --vimeo=1
```
=1 since [gruntjs/grunt#908](https://github.com/gruntjs/grunt/issues/908)

#bower
```shell
bower install js-video-url-parser
```
#npm
```
npm install js-video-url-parser
```

#Usage
##Node
```
urlParser = require('js-video-url-parser');
```
##Parsing

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

> urlParser.parse('http://www.twitch.tv/rains8')
{ mediaType: 'stream',
  channel: 'rains8',
  provider: 'twitch' }

> urlParser.parse('http://www.dailymotion.com/video/x1e2b95')
{ mediaType: 'video',
  id: 'x1e2b95',
  provider: 'dailymotion' }
```

Any url parameters expect for the id will be saved in the params object

```javascript
> urlParser.parse('https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82&t=1m40')
{
  provider: 'youtube',
  id: 'yQaAGmHNn9s',
  list: 'PL46F0A159EC02DF82',
  mediaType: 'video',
  params: {
    start: 100,
    list: 'PL46F0A159EC02DF82',
    index: '25'
  }
}
```

##URL Creation

The VideoInfo objects can be turned back into a `'short'`, `'long'`, `'embed'`, `'shortImage'`, `'longImage'` url where `'long'` is the default.
Embedded links will be protocol relative. Image modes are for generating thumbnail
urls for currently only YouTube videos.

```javascript
> urlParser.create({
    videoInfo: urlParser.parse('http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA'),
    format: 'long'
  })
'long': 'https://www.youtube.com/watch?v=HRb7B9fPhfA'
'short': 'https://youtu.be/HRb7B9fPhfA'
'embed': '//youtube.com/embed/HRb7B9fPhfA'
'shortImage': 'https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg'
'longImage': 'https://img.youtube.com/vi/HRb7B9fPhfA/hqdefault.jpg'

> urlParser.create({
    videoInfo: urlParser.parse('https://vimeo.com/97276391'),
    format: 'long'
  })
'long': 'https://vimeo.com/97276391'
'embed': '//player.vimeo.com/video/97276391'

> urlParser.create({
    videoInfo: urlParser.parse('http://www.twitch.tv/rains8'),
    format: 'long'
  })
'long': 'https://twitch.tv/rains8'
'embed': '//www.twitch.tv/rains8/embed'

> urlParser.create({
    videoInfo: urlParser.parse('http://www.dailymotion.com/video/x1e2b95'),
    format: 'long'
  })
'long': 'https://www.dailymotion.com/video/x1e2b95'
'short': 'https://dai.ly/x1e2b95'
'embed': '//www.dailymotion.com/embed/video/x1e2b95'
```

Url parameters can be added via the params object:
```javascript
> urlParser.create({
  videoInfo: urlParser.parse('http://www.youtube.com/watch?v=yQaAGmHNn9s'),
  params:{
    start: 100,
    list: 'PL46F0A159EC02DF82',
    index: '25',
    foo: 'bar'
  }
})
'https://youtube.com/watch?foo=bar&index=25&list=PL46F0A159EC02DF82&v=yQaAGmHNn9s#t=100'
```

A special paramter for image YouTube urls is the imageQuality. It can be set to one
of `'0', '1', '2', '3', 'default', 'hqdefault', 'mqdefault', 'sddefault', 'maxresdefault'`
with `'hqdefault'` being the default.
```javascript
> urlParser.create({
  videoInfo: urlParser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA'),
  params:{
    imageQuality: 'mqdefault'
  }
})
'https://img.youtube.com/vi/HRb7B9fPhfA/mqdefault.jpg'
```

To reuse the params in the videoInfo object without having to save it in a temp variable use the keyword `'internal'` as params

```javascript
> urlParser.create({
  videoInfo: urlParser.parse('https://youtube.com/watch?foo=bar&index=25&list=PL46F0A159EC02DF82&v=yQaAGmHNn9s#t=100'),
  params: 'internal'
})
'https://youtube.com/watch?foo=bar&index=25&list=PL46F0A159EC02DF82&v=yQaAGmHNn9s#t=100'
> urlParser.create({
  videoInfo: urlParser.parse('https://youtube.com/watch?foo=bar&index=25&list=PL46F0A159EC02DF82&v=yQaAGmHNn9s#t=100'),
  params: 'internal',
  format: 'embed'
})
'//youtube.com/embed/yQaAGmHNn9s?foo=bar&index=25&list=PL46F0A159EC02DF82&start=100'
```

#Plugins

##YouTube

It can extract the id from shortened, mobile, feed and thumbnail urls.
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
```

Also supports the start time parameter and playlist urls.

```javascript
> urlParser.parse('http://www.youtube.com/embed/videoseries?list=PL46F0A159EC02DF82');
> urlParser.parse('http://www.youtube.com/playlist?list=PL46F0A159EC02DF82');
{ mediaType: 'playlist',
  list: 'PL46F0A159EC02DF82',
  provider: 'youtube',
  params: {
    list: 'PL46F0A159EC02DF82'
  }
}

> urlParser.parse('http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82');
{ mediaType: 'video',
  id: 'yQaAGmHNn9s',
  list: 'PL46F0A159EC02DF82',
  provider: 'youtube',
  params: {
    list: 'PL46F0A159EC02DF82'
  }
}

> urlParser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA#t=30s');
> urlParser.parse('http://www.youtube.com/watch?v=HRb7B9fPhfA&t=30s');
> urlParser.parse('http://youtu.be/HRb7B9fPhfA?t=30s');
> urlParser.parse('http://youtu.be/HRb7B9fPhfA#t=30s');
> urlParser.parse('https://m.youtube.com/details?v=HRb7B9fPhfA#t=30s');
{ mediaType: 'video',
  id: 'HRb7B9fPhfA',
  provider: 'youtube'
  params: {
    start: 30
  }
}

> urlParser.parse('http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40');
{ mediaType: 'video',
  id: 'yQaAGmHNn9s',
  list: 'PL46F0A159EC02DF82',
  provider: 'youtube'
  params: {
    start: 100,
    list: 'PL46F0A159EC02DF82',
  }
}
```

##Vimeo
Supports urls from channels, albums, groups and frames.

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
```

##Twitch
Supports embedded, stream and video urls

```javascript
> urlParser.parse('http://www.twitch.tv/rains8');
> urlParser.parse('http://www.twitch.tv/widgets/live_embed_player.swf?channel=rains8');
> urlParser.parse('http://twitch.tv/rains8/chat');
{ mediaType: 'stream',
  channel: 'rains8',
  provider: 'twitch' }

> urlParser.parse('http://www.twitch.tv/rains8/v/75292411');
{ mediaType: 'video',
  id: '75292411',
  idPrefix: 'v',
  channel: 'rains8',
  provider: 'twitch' }
```

##Dailymotion

Supports embedded and shortened urls.
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
