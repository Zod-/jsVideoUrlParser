const Googledrive = require('./googledrive');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Googledrive());
  return parser;
}

test('Googledrive: undefined', () => {
  expect(newParser().parse('https://drive.google.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'googledrive' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'googledrive', mediaType: 'video' } })).toBe(undefined);
});

test('Googledrive: urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'googledrive',
      id: '9OPhkjOO8I140ABwWtyY0cG0riyVB89B',
      mediaType: 'video',
    },
    formats: {
      long: 'https://drive.google.com/file/d/9OPhkjOO8I140ABwWtyY0cG0riyVB89B/view',
    },
    urls: [
      'https://drive.google.com/file/d/9OPhkjOO8I140ABwWtyY0cG0riyVB89B/view',
    ],
  });
});
test('Googledrive: timed url', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'googledrive',
      id: '9OPhkjOO8I140ABwWtyY0cG0riyVB89B',
      mediaType: 'video',
      params: {
        start: 100,
      },
    },
    formats: {
      long: 'https://drive.google.com/file/d/9OPhkjOO8I140ABwWtyY0cG0riyVB89B/view?t=100',
    },
    urls: [
      'https://drive.google.com/file/d/9OPhkjOO8I140ABwWtyY0cG0riyVB89B/view?t=100',
    ],
  });
});
