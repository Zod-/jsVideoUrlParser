const Vimeo = require('./vimeo');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Vimeo());
  return parser;
}

test('Vimeo: undefined', () => {
  expect(newParser().parse('https://vimeo.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'vimeo' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'vimeo', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'vimeo', mediaType: 'video' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'vimeo', mediaType: 'video' }, format: 'image' })).toBe(undefined);
});

test('Vimeo: urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video',
    },
    formats: {
      long: 'https://vimeo.com/97276391',
      embed: '//player.vimeo.com/video/97276391',
      image: 'https://i.vimeocdn.com/video/97276391.webp',
    },
    urls: ['https://vimeo.com/97276391',
      'https://vimeo.com/channels/staffpicks/97276391',
      '//player.vimeo.com/video/97276391',
      'https://i.vimeocdn.com/video/97276391',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '96186586',
      mediaType: 'video',
    },
    formats: {
      long: 'https://vimeo.com/96186586',
      embed: '//player.vimeo.com/video/96186586',
      image: 'https://i.vimeocdn.com/video/96186586.webp',
    },
    urls: ['https://vimeo.com/album/2903155/video/96186586',
      '//player.vimeo.com/video/96186586',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '97688625',
      mediaType: 'video',
    },
    formats: {
      long: 'https://vimeo.com/97688625',
      embed: '//player.vimeo.com/video/97688625',
      image: 'https://i.vimeocdn.com/video/97688625.webp',
    },
    urls: ['https://vimeo.com/groups/shortfilms/videos/97688625',
      '//player.vimeo.com/video/97688625',
      'https://vimeo.com/groups/1minute/videos/97688625',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '24069938',
      mediaType: 'video',
    },
    formats: {
      long: 'https://vimeo.com/24069938',
      embed: '//player.vimeo.com/video/24069938',
      image: 'https://i.vimeocdn.com/video/24069938.webp',
    },
    urls: ['http://vimeopro.com/staff/frame/video/24069938',
      '//player.vimeo.com/video/24069938',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '36881035',
      mediaType: 'video',
      params: {
        start: 208,
      },
    },
    formats: {
      long: 'https://vimeo.com/36881035#t=208',
      embed: '//player.vimeo.com/video/36881035#t=208',
    },
    urls: ['https://vimeo.com/36881035#t=3m28s',
      '//player.vimeo.com/video/36881035#t=3m28s',
    ],
  });
});

test('Vimeo: image urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video',
      imageWidth: 500,
      imageHeight: 123,
    },
    formats: {
      long: 'https://vimeo.com/97276391',
      embed: '//player.vimeo.com/video/97276391',
      image: 'https://i.vimeocdn.com/video/97276391_500x123.webp',
    },
    urls: ['https://i.vimeocdn.com/video/97276391_500x123'],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video',
      imageWidth: 500,
      imageHeight: 123,
      imageExtension: '.webp',
    },
    formats: {
      long: 'https://vimeo.com/97276391',
      embed: '//player.vimeo.com/video/97276391',
      image: 'https://i.vimeocdn.com/video/97276391_500x123.webp',
    },
    urls: ['https://i.vimeocdn.com/video/97276391_500x123.webp'],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video',
      imageWidth: 500,
    },
    formats: {
      long: 'https://vimeo.com/97276391',
      embed: '//player.vimeo.com/video/97276391',
      image: 'https://i.vimeocdn.com/video/97276391_500.webp',
    },
    urls: ['https://i.vimeocdn.com/video/97276391_500'],
  });

  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video',
      imageExtension: '.png',
    },
    formats: {
      long: 'https://vimeo.com/97276391',
      embed: '//player.vimeo.com/video/97276391',
      image: 'https://i.vimeocdn.com/video/97276391.png',
    },
    urls: ['https://i.vimeocdn.com/video/97276391.png'],
  });

  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video',
      imageExtension: '.jpg',
    },
    formats: {
      long: 'https://vimeo.com/97276391',
      embed: '//player.vimeo.com/video/97276391',
      image: 'https://i.vimeocdn.com/video/97276391.jpg',
    },
    urls: ['https://i.vimeocdn.com/video/97276391.jpg'],
  });

  testUrls(newParser(), {
    videoInfo: {
      provider: 'vimeo',
      id: '97276391',
      mediaType: 'video',
      imageExtension: '',
    },
    formats: {
      long: 'https://vimeo.com/97276391',
      embed: '//player.vimeo.com/video/97276391',
      image: 'https://i.vimeocdn.com/video/97276391',
    },
    urls: [],
  });
});