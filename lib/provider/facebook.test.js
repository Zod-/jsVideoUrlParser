const Facebook = require('./facebook');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Facebook());
  return parser;
}

test('Facebook: undefined', () => {
  expect(newParser().parse('https://www.facebook.com')).toBe(undefined);
  expect(newParser().parse('https://www.fb.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'facebook' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'facebook', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'facebook', mediaType: 'video' }, format: 'watch' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'facebook', mediaType: 'video' }, format: 'full' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'facebook', mediaType: 'video', pageId: '1213' }, format: 'full' })).toBe(undefined);
});

test('Facebook: watch urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'facebook',
      id: '1234567890',
      mediaType: 'video',
      params: {
        v: '1234567890',
      },
      pageId: undefined,
    },
    formats: {
      watch: 'https://www.facebook.com/watch/?v=1234567890',
    },
    urls: [
      'https://www.facebook.com/watch/?v=1234567890',
      'https://www.facebook.com/video.php?v=1234567890',
    ],
  });
});

test('Facebook: full urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'facebook',
      id: '1234567890',
      mediaType: 'video',
      pageId: '100044368631767',
    },
    formats: {
      full: 'https://www.facebook.com/100044368631767/videos/1234567890',
    },
    urls: [
      'https://www.facebook.com/100044368631767/videos/1234567890',
    ],
  });
});
