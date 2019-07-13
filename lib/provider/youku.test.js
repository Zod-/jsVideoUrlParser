const Youku = require('./youku');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Youku());
  return parser;
}

test('Youku: undefined', () => {
  expect(newParser().parse('https://youku.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'youku' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'youku', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'youku', mediaType: 'video' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'youku', mediaType: 'video' }, format: 'flash' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'youku', mediaType: 'video' }, format: 'static' })).toBe(undefined);
});

test('Youku: urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'youku',
      id: 'XMTQ3OTM4MzMxMg',
      mediaType: 'video',
    },
    formats: {
      embed: 'http://player.youku.com/embed/XMTQ3OTM4MzMxMg',
      long: 'http://v.youku.com/v_show/id_XMTQ3OTM4MzMxMg',
      flash: 'http://player.youku.com/player.php/sid/XMTQ3OTM4MzMxMg/v.swf',
      static: 'http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=XMTQ3OTM4MzMxMg',
    },
    urls: [
      'http://player.youku.com/embed/XMTQ3OTM4MzMxMg',
      'http://player.youku.com/player.php/sid/XMTQ3OTM4MzMxMg==/v.swf',
      'http://v.youku.com/v_show/id_XMTQ3OTM4MzMxMg',
      'http://static.youku.com/v1.0.0638/v/swf/loader.swf?VideoIDS=XMTQ3OTM4MzMxMg%3D%3D',
    ],
  });
});