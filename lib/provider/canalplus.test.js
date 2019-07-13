const CanalPlus = require('./canalplus');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new CanalPlus());
  return parser;
}

test('CanalPlus: undefined', () => {
  expect(newParser().parse('https://canalplus.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'canalplus' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'canalplus', mediaType: 'video' } })).toBe(undefined);
});

test('CanalPlus: urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'canalplus',
      id: '1365175',
      mediaType: 'video',
    },
    formats: {
      embed: 'http://player.canalplus.fr/embed/?vid=1365175',
    },
    urls: [
      'http://player.canalplus.fr/embed/?vid=1365175',
      'http://www.canalplus.fr/humour/pid1784-les-guignols.html?vid=1365175',
    ],
  });
});