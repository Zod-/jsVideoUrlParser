const Template = require('./template');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Template());
  return parser;
}

test('Template: undefined', () => {
  expect(newParser().parse('https://template.com')).toBe(undefined);
  expect(newParser().parse('https://temp.com')).toBe(undefined);
});

test('Template: video urls', () => {
  // Parse urls to test against the videoInfo object
  // Create urls with the videoInfo objects to test against the format urls
  testUrls(newParser(), {
    videoInfo: {
      provider: 'template',
      id: 'abcde',
      mediaType: 'video',
    },
    formats: {
      long: 'https://template.com/example/id/abcde',
      short: 'https://temp.com/abcde',
    },
    urls: [
      'https://template.com/example/id/abcde',
      'https://temp.com/abcde',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'template',
      id: 'abcde',
      mediaType: 'video',
      params: {
        start: 30,
      },
    },
    formats: {
      long: 'https://template.com/example/id/abcde?start=30',
      short: 'https://temp.com/abcde?start=30',
    },
    urls: [
      'https://template.com/example/id/abcde?start=30',
      'https://temp.com/abcde?start=30',
    ],
  });
});

test('Template: empty urls', () => {
  var parser = newParser();
  var videoInfo = {
    provider: 'template',
    id: 'abcde',
    mediaType: 'playlist',
  };
  var resultLong = parser.create({
    videoInfo: videoInfo,
  });
  var resultShort = parser.create({
    videoInfo: videoInfo,
    format: 'short',
  });
  expect(resultLong).toBe('');
  expect(resultShort).toBe('');
});