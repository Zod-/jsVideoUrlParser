var yt1 = 'https://youtube.com';
var yt2 = 'http://www.youtube.com';
var yt3 = 'https://www.youtube.com';
var yt4 = '//youtube.com/embed';
var yt5 = 'https://img.youtube.com';
QUnit.test('Regular YouTube Urls', function (assert) {
  'use strict';
  var vi = {
    provider: 'youtube',
    id: 'HRb7B9fPhfA',
    mediaType: 'video',
    params: {
      start: 30
    }
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: yt1 + '/watch?v=HRb7B9fPhfA#t=30',
      embed: yt4 + '/HRb7B9fPhfA?start=30',
      short: 'https://youtu.be/HRb7B9fPhfA#t=30'
    },
    urls: [yt2 + '/watch?v=HRb7B9fPhfA#t=30s',
      yt2 + '/watch?v=HRb7B9fPhfA&t=30s',
      'https://m.youtube.com/details?v=HRb7B9fPhfA#t=30s',
      'http://youtu.be/HRb7B9fPhfA?t=30s',
      'http://youtu.be/HRb7B9fPhfA#t=30s',
      yt4 + '/HRb7B9fPhfA?start=30',
    ]
  }, {
    videoInfo: cloneObject(vi),
    formats: {
      long: yt1 + '/watch?v=HRb7B9fPhfA',
      embed: yt4 + '/HRb7B9fPhfA',
      short: 'https://youtu.be/HRb7B9fPhfA',
      shortImage: 'https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg',
      longImage: yt5 + '/vi/HRb7B9fPhfA/hqdefault.jpg'
    },
    urls: [yt2 + '/watch?v=HRb7B9fPhfA',
      'http://youtu.be/HRb7B9fPhfA',
      'https://m.youtube.com/details?v=HRb7B9fPhfA'
    ]
  }, {
    videoInfo: cloneObject(vi),
    formats: {
      embed: yt4 + '/HRb7B9fPhfA?loop=1&playlist=HRb7B9fPhfA&start=30'
    },
    urls: [
      yt4 + '/HRb7B9fPhfA?loop=1&list=HRb7B9fPhfA&start=30'
    ]
  }];
  delete tests[1].videoInfo.params;
  tests[2].videoInfo.params.loop = '1';

  assertUrlTest(assert, tests);
});
QUnit.test('Playlist YouTube Urls', function (assert) {
  'use strict';
  var vi = {
    provider: 'youtube',
    id: 'yQaAGmHNn9s',
    list: 'PL46F0A159EC02DF82',
    mediaType: 'video',
    params: {
      start: 100
    }
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: yt1 + '/watch?list=PL46F0A159EC02DF82&v=yQaAGmHNn9s#t=100',
      embed: yt4 + '/yQaAGmHNn9s?list=PL46F0A159EC02DF82&start=100',
    },
    urls: [
      yt2 + '/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40',
      yt2 + '/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82&t=1m40',
      yt4 + '/yQaAGmHNn9s?list=PL46F0A159EC02DF82&start=100'
    ]
  }, {
    videoInfo: cloneObject(vi),
    formats: {
      long: yt1 + '/watch?list=PL46F0A159EC02DF82&v=yQaAGmHNn9s',
      embed: yt4 + '/yQaAGmHNn9s?list=PL46F0A159EC02DF82',
    },
    urls: [
      yt2 + '/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82',
      yt4 + '/yQaAGmHNn9s?list=PL46F0A159EC02DF82'
    ]
  }, {
    videoInfo: cloneObject(vi),
    formats: {
      long: yt1 +
        '/watch?index=25&list=PL46F0A159EC02DF82&v=6xLcSTDeB7A',
      embed: yt4 + '/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82',
    },
    urls: [
      yt3 + '/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25',
      yt3 + '/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82',
      yt4 + '/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82'
    ]
  }, {
    videoInfo: cloneObject(vi),
    formats: {
      long: yt1 +
        '/watch?index=25&list=PL46F0A159EC02DF82&v=6xLcSTDeB7A#t=100',
      embed: yt4 +
        '/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82&start=100',
    },
    urls: [
      yt3 +
      '/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25#t=1m40',
      yt3 +
      '/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25&t=1m40',
      yt3 +
      '/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82&t=1m40',
      yt3 +
      '/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82#t=1m40',
      yt4 + '/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82&start=100'
    ]
  }, {
    videoInfo: {
      provider: 'youtube',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'playlist'
    },
    formats: {
      long: yt1 + '/playlist?feature=share&list=PL46F0A159EC02DF82',
      embed: '//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist',
    },
    urls: [
      yt2 + '/embed/videoseries?list=PL46F0A159EC02DF82',
      yt2 + '/playlist?list=PL46F0A159EC02DF82'
    ]
  }, {
    videoInfo: {
      provider: 'youtube',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'playlist',
      params: {
        listType: 'playlist'
      }
    },
    formats: {
      embed: '//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist',
    },
    urls: [
      '//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist'
    ]
  }];

  delete tests[1].videoInfo.params;
  delete tests[2].videoInfo.params.start;
  tests[2].videoInfo.params.index = tests[3].videoInfo.params.index = '25';
  tests[2].videoInfo.id = tests[3].videoInfo.id = '6xLcSTDeB7A';
  assertUrlTest(assert, tests);
});

QUnit.test('Feed YouTube Urls', function (assert) {
  'use strict';
  var tests = [{
    videoInfo: {
      'provider': 'youtube',
      'id': 'HRb7B9fPhfA',
      'mediaType': 'video'
    },
    formats: {
      long: yt1 + '/watch?v=HRb7B9fPhfA',
      short: 'https://youtu.be/HRb7B9fPhfA',
      embed: yt4 + '/HRb7B9fPhfA',
    },
    urls: [
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA/related',
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA',
      yt3 + '/v/HRb7B9fPhfA'
    ]
  }];
  assertUrlTest(assert, tests);
});

QUnit.test('Image YouTube Urls', function (assert) {
  'use strict';
  var vi = {
    provider: 'youtube',
    id: 'HRb7B9fPhfA',
    mediaType: 'video'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      shortImage: 'https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg',
      longImage: yt5 + '/vi/HRb7B9fPhfA/hqdefault.jpg'
    },
    urls: ['https://i.ytimg.com/vi/HRb7B9fPhfA/0.jpg',
      'https://i.ytimg.com/vi/HRb7B9fPhfA/1.jpg',
      'https://i.ytimg.com/vi/HRb7B9fPhfA/2.jpg',
      'https://i.ytimg.com/vi/HRb7B9fPhfA/3.jpg',
      'https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg',
      'https://i.ytimg.com/vi/HRb7B9fPhfA/mqdefault.jpg',
      'https://i.ytimg.com/vi/HRb7B9fPhfA/sddefault.jpg',
      'https://i.ytimg.com/vi/HRb7B9fPhfA/maxresdefault.jpg',
      'https://img.youtube.com/vi/HRb7B9fPhfA/0.jpg',
      'https://img.youtube.com/vi/HRb7B9fPhfA/1.jpg',
      'https://img.youtube.com/vi/HRb7B9fPhfA/2.jpg',
      'https://img.youtube.com/vi/HRb7B9fPhfA/3.jpg',
      'https://img.youtube.com/vi/HRb7B9fPhfA/hqdefault.jpg',
      'https://img.youtube.com/vi/HRb7B9fPhfA/mqdefault.jpg',
      'https://img.youtube.com/vi/HRb7B9fPhfA/sddefault.jpg',
      'https://img.youtube.com/vi/HRb7B9fPhfA/maxresdefault.jpg',
    ]
  }];

  assertUrlTest(assert, tests);
});

QUnit.test('Share YouTube Urls', function (assert) {
  'use strict';
  var vi = {
    provider: 'youtube',
    id: 'E14kBrDEvYo',
    mediaType: 'share'
  };
  var tests = [{
    videoInfo: cloneObject(vi),
    formats: {
      long: 'https://www.youtube.com/shared?ci=E14kBrDEvYo'
    },
    urls: ['https://www.youtube.com/shared?ci=E14kBrDEvYo']
  }];

  assertUrlTest(assert, tests);
});
