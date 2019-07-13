const Dailymotion = require('./dailymotion');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Dailymotion());
  return parser;
}

test('Dailymotion: undefined', () => {
  expect(newParser().parse('https://dailymotion.com')).toBe(undefined);
  expect(newParser().parse('https://dai.ly')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'dailymotion' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'dailymotion', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'dailymotion', mediaType: 'video' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'dailymotion', mediaType: 'video' }, format: 'short' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'dailymotion', mediaType: 'video' }, format: 'image' })).toBe(undefined);
});

test('Dailymotion: urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'dailymotion',
      id: 'x1e2b95',
      mediaType: 'video',
    },
    formats: {
      long: 'https://dailymotion.com/video/x1e2b95',
      short: 'https://dai.ly/x1e2b95',
      embed: 'https://www.dailymotion.com/embed/video/x1e2b95',
      image: 'https://www.dailymotion.com/thumbnail/video/x1e2b95',
    },
    urls: [
      'http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals',
      'http://www.dailymotion.com/video/x1e2b95',
      'http://dai.ly/x1e2b95',
      'http://www.dailymotion.com/embed/video/x1e2b95',
      'https://www.dailymotion.com/thumbnail/video/x1e2b95',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'dailymotion',
      id: 'x1e2b95',
      mediaType: 'video',
      params: {
        start: 10,
      },
    },
    formats: {
      long: 'https://dailymotion.com/video/x1e2b95?start=10',
      short: 'https://dai.ly/x1e2b95?start=10',
      embed: 'https://www.dailymotion.com/embed/video/x1e2b95?start=10',
      image: 'https://www.dailymotion.com/thumbnail/video/x1e2b95',
    },
    urls: ['http://www.dailymotion.com/video/x1e2b95?start=10',
      'http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals?start=10',
      'http://www.dailymotion.com/embed/video/x1e2b95?start=10',
      'https://dai.ly/x1e2b95?start=10',
    ],
  });
});