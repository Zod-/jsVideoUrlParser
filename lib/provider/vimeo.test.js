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
    },
    urls: ['https://vimeo.com/97276391',
      'https://vimeo.com/channels/staffpicks/97276391',
      '//player.vimeo.com/video/97276391',
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