const YouTube = require('./youtube');
const UrlParser = require('../urlParser');
const {testUrls} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new YouTube());
  return parser;
}

test('YouTube regular urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video',
    },
    formats: {
      long: 'https://youtube.com/watch?v=HRb7B9fPhfA',
      embed: '//youtube.com/embed/HRb7B9fPhfA',
      short: 'https://youtu.be/HRb7B9fPhfA',
      shortImage: 'https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg',
      longImage: 'https://img.youtube.com/vi/HRb7B9fPhfA/hqdefault.jpg',
    },
    urls: [
      'http://www.youtube.com/watch?v=HRb7B9fPhfA',
      'http://youtu.be/HRb7B9fPhfA',
      'https://m.youtube.com/details?v=HRb7B9fPhfA',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video',
      params: {
        start: 30,
      },
    },
    formats: {
      long: 'https://youtube.com/watch?v=HRb7B9fPhfA#t=30',
      embed: '//youtube.com/embed/HRb7B9fPhfA?start=30',
      short: 'https://youtu.be/HRb7B9fPhfA#t=30',
    },
    urls: [
      'http://www.youtube.com/watch?v=HRb7B9fPhfA#t=30s',
      'http://www.youtube.com/watch?v=HRb7B9fPhfA&t=30s',
      'https://m.youtube.com/details?v=HRb7B9fPhfA#t=30s',
      'http://youtu.be/HRb7B9fPhfA?t=30s',
      'http://youtu.be/HRb7B9fPhfA#t=30s',
      '//youtube.com/embed/HRb7B9fPhfA?start=30',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video',
      params: {
        start: 30,
        loop: '1',
      },
    },
    formats: {
      embed: '//youtube.com/embed/HRb7B9fPhfA?loop=1&playlist=HRb7B9fPhfA&start=30',
    },
    urls: ['//youtube.com/embed/HRb7B9fPhfA?loop=1&list=HRb7B9fPhfA&start=30'],
  });
});

test('YouTube playlist urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: 'yQaAGmHNn9s',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'video',
      params: {
        start: 100,
      },
    },
    formats: {
      long: 'https://youtube.com/watch?list=PL46F0A159EC02DF82&v=yQaAGmHNn9s#t=100',
      embed: '//youtube.com/embed/yQaAGmHNn9s?list=PL46F0A159EC02DF82&start=100',
    },
    urls: [
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82#t=1m40',
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82&t=1m40',
      '//youtube.com/embed/yQaAGmHNn9s?list=PL46F0A159EC02DF82&start=100',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: 'yQaAGmHNn9s',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'video',
    },
    formats: {
      long: 'https://youtube.com/watch?list=PL46F0A159EC02DF82&v=yQaAGmHNn9s',
      embed: '//youtube.com/embed/yQaAGmHNn9s?list=PL46F0A159EC02DF82',
    },
    urls: [
      'http://www.youtube.com/watch?v=yQaAGmHNn9s&list=PL46F0A159EC02DF82',
      '//youtube.com/embed/yQaAGmHNn9s?list=PL46F0A159EC02DF82',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: '6xLcSTDeB7A',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'video',
      params: {
        index: '25',
      },
    },
    formats: {
      long: 'https://youtube.com/watch?index=25&list=PL46F0A159EC02DF82&v=6xLcSTDeB7A',
      embed: '//youtube.com/embed/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82',
    },
    urls: [
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25',
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82',
      '//youtube.com/embed/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: '6xLcSTDeB7A',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'video',
      params: {
        index: '25',
        start: 100,
      },
    },
    formats: {
      long: 'https://youtube.com/watch?index=25&list=PL46F0A159EC02DF82&v=6xLcSTDeB7A#t=100',
      embed: '//youtube.com/embed/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82&start=100',
    },
    urls: [
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25#t=1m40',
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&list=PL46F0A159EC02DF82&index=25&t=1m40',
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82&t=1m40',
      'https://www.youtube.com/watch?v=6xLcSTDeB7A&index=25&list=PL46F0A159EC02DF82#t=1m40',
      '//youtube.com/embed/6xLcSTDeB7A?index=25&list=PL46F0A159EC02DF82&start=100',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'playlist',
    },
    formats: {
      long: 'https://youtube.com/playlist?feature=share&list=PL46F0A159EC02DF82',
      embed: '//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist',
    },
    urls: [
      'http://www.youtube.com/embed/videoseries?list=PL46F0A159EC02DF82',
      'http://www.youtube.com/playlist?list=PL46F0A159EC02DF82',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      list: 'PL46F0A159EC02DF82',
      mediaType: 'playlist',
      params: {
        listType: 'playlist',
      },
    },
    formats: {
      embed: '//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist',
    },
    urls: ['//youtube.com/embed?list=PL46F0A159EC02DF82&listType=playlist'],
  });
});

test('YouTube feed urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      'provider': 'youtube',
      'id': 'HRb7B9fPhfA',
      'mediaType': 'video',
    },
    formats: {
      long: 'https://youtube.com/watch?v=HRb7B9fPhfA',
      short: 'https://youtu.be/HRb7B9fPhfA',
      embed: '//youtube.com/embed/HRb7B9fPhfA',
    },
    urls: [
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA/related',
      'https://gdata.youtube.com/feeds/api/videos/HRb7B9fPhfA',
      'https://www.youtube.com/v/HRb7B9fPhfA',
    ],
  });
});

test('YouTube image urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: 'HRb7B9fPhfA',
      mediaType: 'video',
    },
    formats: {
      shortImage: 'https://i.ytimg.com/vi/HRb7B9fPhfA/hqdefault.jpg',
      longImage: 'https://img.youtube.com/vi/HRb7B9fPhfA/hqdefault.jpg',
    },
    urls: [
      'https://i.ytimg.com/vi/HRb7B9fPhfA/0.jpg',
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
    ],
  });
});

test('YouTube share urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youtube',
      id: 'E14kBrDEvYo',
      mediaType: 'share',
    },
    formats: {
      long: 'https://www.youtube.com/shared?ci=E14kBrDEvYo',
    },
    urls: ['https://www.youtube.com/shared?ci=E14kBrDEvYo'],
  });
});
