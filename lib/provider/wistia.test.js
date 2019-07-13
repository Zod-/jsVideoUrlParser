const Wistia = require('./wistia');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Wistia());
  return parser;
}

test('Wistia: undefined', () => {
  expect(newParser().parse('https://wistia.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'wistia' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'wistia', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'wistia', mediaType: 'video' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'wistia', mediaType: 'video' }, format: 'embedjsonp' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'wistia', mediaType: 'embedvideo' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'wistia', mediaType: 'embedvideo' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'wistia', mediaType: 'embedvideo' }, format: 'embedjsonp' })).toBe(undefined);
});

test('Wistia: long urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'wistia',
      id: 'lpu6bgplle',
      mediaType: 'video',
      channel: 'appboss',
    },
    formats: {
      long: 'https://appboss.wistia.com/medias/lpu6bgplle',
      embed: 'https://fast.wistia.com/embed/iframe/lpu6bgplle',
      embedjsonp: 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp',
    },
    urls: [
      'https://appboss.wistia.com/medias/lpu6bgplle',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'wistia',
      id: 'lpu6bgplle',
      mediaType: 'video',
      channel: 'appboss',
      params: {
        start: 30,
      },
    },
    formats: {
      long: 'https://appboss.wistia.com/medias/lpu6bgplle?wtime=30',
      embed: 'https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=30',
      embedjsonp: 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp',
    },
    urls: [
      'https://appboss.wistia.com/medias/lpu6bgplle?wtime=30s',
    ],
  });
});

test('Wistia: embed urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'wistia',
      id: 'lpu6bgplle',
      mediaType: 'embedvideo',
    },
    formats: {
      long: undefined,
      embed: 'https://fast.wistia.com/embed/iframe/lpu6bgplle',
      embedjsonp: 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp',
    },
    urls: [
      'https://fast.wistia.com/embed/iframe/lpu6bgplle',
      'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp',
      'https://content.wistia.com/customer-stories/bizzabo?wvideo=lpu6bgplle',
      'https://wistia.com/blog/soapbox-videos-for-the-holidays?wvideo=lpu6bgplle',
      'https://wistia.com/library/how-to-look-good-on-a-webcam?wvideo=lpu6bgplle',
      'https://wistia.com/solutions/sales?wvideo=lpu6bgplle',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'wistia',
      id: 'lpu6bgplle',
      mediaType: 'embedvideo',
      params: {
        start: 30,
      },
    },
    formats: {
      long: undefined,
      embed: 'https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=30',
      embedjsonp: 'https://fast.wistia.com/embed/medias/lpu6bgplle.jsonp',
    },
    urls: [
      'https://fast.wistia.com/embed/iframe/lpu6bgplle?wtime=30',
    ],
  });
});