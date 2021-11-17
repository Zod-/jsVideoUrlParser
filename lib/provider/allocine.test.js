const Allocine = require('./allocine');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new Allocine());
  return parser;
}

test('Allocine: undefined', () => {
  expect(newParser().parse('https://allocine.fr')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'allocine' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'allocine', mediaType: 'video' } })).toBe(undefined);
});

test('Alocine: urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'allocine',
      id: '19548515',
      mediaType: 'video',
    },
    formats: {
      embed: 'https://player.allocine.fr/19548515.html',
    },
    urls: [
      'https://www.allocine.fr/video/player_gen_cmedia=19548515&cfilm=114782.html',
    ],
  });
});
