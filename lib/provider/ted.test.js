const Ted = require('./ted');
const UrlParser = require('../urlParser');
const { testUrls } = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Ted());
  return parser;
}

test('Ted: undefined', () => {
  expect(newParser().parse('https://ted.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'ted' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'ted', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'ted', mediaType: 'video' }, format: 'long' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'ted', mediaType: 'playlist' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'ted', mediaType: 'playlist' }, format: 'long' })).toBe(undefined);
});

test('Ted: video urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'ted',
      id: 'shawn_achor_the_happy_secret_to_better_work',
      mediaType: 'video',
    },
    formats: {
      long: 'https://ted.com/talks/shawn_achor_the_happy_secret_to_better_work',
    },
    urls: [
      'https://ted.com/talks/shawn_achor_the_happy_secret_to_better_work',
    ],
  });
});

test('Ted: playlist urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'ted',
      id: 'the_most_popular_talks_of_all',
      list: '171',
      mediaType: 'playlist',
    },
    formats: {
      long: 'https://ted.com/playlists/171/the_most_popular_talks_of_all',
    },
    urls: [
      'https://ted.com/playlists/171/the_most_popular_talks_of_all',
    ],
  });
});
