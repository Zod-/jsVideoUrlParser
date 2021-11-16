const Loom = require('./loom');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Loom());
  return parser;
}

test('Loom: undefined', () => {
  expect(newParser().parse('https://loom.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'loom' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'loom', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'loom', mediaType: 'video' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'loom', mediaType: 'video' }, format: 'image' })).toBe(undefined);
});

test('Loom: urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'loom',
      id: '9206412c4aba41bcabd05b4d100911ba',
      mediaType: 'video',
    },
    formats: {
      long: 'https://loom.com/share/9206412c4aba41bcabd05b4d100911ba',
      embed: '//loom.com/embed/9206412c4aba41bcabd05b4d100911ba',
    },
    urls: ['https://loom.com/share/9206412c4aba41bcabd05b4d100911ba',
      '//loom.com/embed/9206412c4aba41bcabd05b4d100911ba',
    ],
  });
});