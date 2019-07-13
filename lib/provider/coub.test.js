const Coub = require('./coub');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Coub());
  return parser;
}

test('Coub: undefined', () => {
  expect(newParser().parse('https://coub.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'coub' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'coub', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'coub', mediaType: 'video' }, format: 'embed' })).toBe(undefined);
});

test('Coub: urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      'provider': 'coub',
      'id': 'by7sm',
      'mediaType': 'video',
    },
    formats: {
      embed: '//coub.com/embed/by7sm',
      long: 'https://coub.com/view/by7sm',
    },
    urls: [
      '//coub.com/embed/by7sm',
      'https://coub.com/view/by7sm',
    ],
  });
});