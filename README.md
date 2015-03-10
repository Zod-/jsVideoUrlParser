jsVideoUrlParser [![Build Status](https://travis-ci.org/Zod-/jsVideoUrlParser.svg)](https://travis-ci.org/Zod-/jsVideoUrlParser)
================

A javascript parser to extract informations like provider, video id, start time from video urls

Currently supports
 - YouTube
 - Vimeo
 - Twitch
 - Dailymotion

#grunt

```
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

#Usage
##Parsing

Parsing a url will return a VideoInfo object with all the information

```js
> urlParser.parse('http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA')
{ mediaType: 'video',
  id: 'HRb7B9fPhfA',
  provider: 'youtube' }

> urlParser.parse('https://vimeo.com/97276391')
{ mediaType: 'video',
  id: '97276391',
  provider: 'vimeo' }

> urlParser.parse('http://www.twitch.tv/tsm_wildturtle')
{ mediaType: 'stream',
  channel: 'tsm_wildturtle',
  provider: 'twitch' }

> urlParser.parse('http://www.dailymotion.com/video/x1e2b95')
{ mediaType: 'video',
  id: 'x1e2b95',
  provider: 'dailymotion' }
```
##URL Creation

The VideoInfo objects can be turned back into a url. If possible it uses a short version.

```js
> urlParser.create({
    videoInfo: urlParser.parse('http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA'),
    format: 'short'
  })
> urlParser.create({
    videoInfo: urlParser.parse('http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA')
  })
'https://youtu.be/HRb7B9fPhfA'
> urlParser.create({
    videoInfo: urlParser.parse('http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA'),
    format: 'long'
  })
'https://www.youtube.com/watch?v=HRb7B9fPhfA'


> urlParser.create({
    videoInfo: urlParser.parse('https://vimeo.com/97276391')
  })
'https://vimeo.com/97276391'

> urlParser.create({
    videoInfo: urlParser.parse('http://www.twitch.tv/tsm_wildturtle')
  })
'https://twitch.tv/tsm_wildturtle'

> urlParser.create({
    videoInfo: urlParser.parse('http://www.dailymotion.com/video/x1e2b95'),
    format: 'short'
  })
> urlParser.create({
    videoInfo: urlParser.parse('http://www.dailymotion.com/video/x1e2b95')
  })
'https://dai.ly/x1e2b95'
> urlParser.create({
    videoInfo: urlParser.parse('http://www.dailymotion.com/video/x1e2b95'),
    format: 'long'
  })
'https://www.dailymotion.com/video/x1e2b95'
```

#Plugins

##YouTube

It can extract the id from shortened, mobile and feed urls.
```js
> urlParser.parse('http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA');
> urlParser.parse('http://youtu.be/HRb7B9fPhfA');
> urlParser.parse('https://m.youtube.com/details?v=HRb7B9fPhfA');
> urlParser.parse('https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA/related?v=2');
{ mediaType: 'video',
  id: 'HRb7B9fPhfA',
  provider: 'youtube' }
```

Also supports the start time parameter and playlist urls.

```js
> urlParser.parse('http://www.youtube.com/embed/videoseries?list=PL46F0A159EC02DF82');
> urlParser.parse('http://www.youtube.com/playlist?list=PL46F0A159EC02DF82');
{ mediaType: 'playlist',
  playlistId: 'PL46F0A159EC02DF82',
  provider: 'youtube' }

> urlParser.parse('http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82');
{ mediaType: 'video',
  id: 'yQaAGmHNn9s',
  playlistId: 'PL46F0A159EC02DF82',
  provider: 'youtube' }

> urlParser.parse('http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA#t=30s');
> urlParser.parse('http://www.youtube.com/watch?feature=player_embedded&v=HRb7B9fPhfA&t=30s');
> urlParser.parse('http://youtu.be/HRb7B9fPhfA?t=30s');
> urlParser.parse('http://youtu.be/HRb7B9fPhfA#t=30s');
> urlParser.parse('https://m.youtube.com/details?v=HRb7B9fPhfA#t=30s');
{ mediaType: 'video',
  id: 'HRb7B9fPhfA',
  startTime: 30,
  provider: 'youtube' }

> urlParser.parse('http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40');
{ mediaType: 'video',
  id: 'yQaAGmHNn9s',
  playlistId: 'PL46F0A159EC02DF82',
  startTime: 100,
  provider: 'youtube' }
```

##Vimeo
Supports urls from channels, albums, groups and frames.

```js
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

```js
> urlParser.parse('http://www.twitch.tv/tsm_wildturtle');
> urlParser.parse('http://www.twitch.tv/widgets/live_embed_player.swf?channel=tsm_wildturtle');
> urlParser.parse('http://twitch.tv/tsm_wildturtle/chat?popout=');
{ mediaType: 'stream',
  channel: 'tsm_wildturtle',
  provider: 'twitch' }

> urlParser.parse('http://www.twitch.tv/tsm_wildturtle/c/2724914');
{ mediaType: 'video',
  id: '2724914',
  idPrefix: 'c',
  channel: 'tsm_wildturtle',
  provider: 'twitch' }
```

##Dailymotion

Supports embedded and shortened urls. Can also extract the start time parameter
```js
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
  startTime: 10,
  provider: 'dailymotion' }
```
