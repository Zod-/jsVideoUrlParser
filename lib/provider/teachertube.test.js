const TeacherTube = require('./teachertube');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new TeacherTube());
  return parser;
}

test('TeacherTube: undefined', () => {
  expect(newParser().parse('https://teachertube.com')).toBe(undefined);
  expect(newParser().parse('https://teachertube.com/asd/123123')).toBe(undefined);
  expect(newParser().parse('https://teachertube.com/video/-')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'video' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'video' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'audio' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'audio' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'channel' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'channel' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'document' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'document' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'group' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'group' }, format: 'embed' })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'collection' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'teachertube', mediaType: 'collection' }, format: 'embed' })).toBe(undefined);
});

test('TeacherTube: video urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'teachertube',
      id: '488055',
      mediaType: 'video',
    },
    formats: {
      long: 'https://www.teachertube.com/video/488055',
      embed: 'https://www.teachertube.com/embed/video/488055',
    },
    urls: [
      'https://www.teachertube.com/video/les-homophones-ces-ses-la-rgle-488055',
      'https://www.teachertube.com/video/488055',
      'https://www.teachertube.com/embed/video/488055',
    ],
  });
});

test('TeacherTube: audio urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'teachertube',
      id: '11814',
      mediaType: 'audio',
    },
    formats: {
      long: 'https://www.teachertube.com/audio/11814',
      embed: 'https://www.teachertube.com/embed/audio/11814',
    },
    urls: [
      'https://www.teachertube.com/audio/11814',
      'https://www.teachertube.com/embed/audio/11814',
    ],
  });
});

test('TeacherTube: channel urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'teachertube',
      id: 'michaelfrancismari',
      mediaType: 'channel',
    },
    formats: {
      long: 'https://www.teachertube.com/user/channel/michaelfrancismari',
      embed: undefined,
    },
    urls: [
      'https://www.teachertube.com/user/channel/michaelfrancismari',
    ],
  });

  testUrls(newParser(), {
    videoInfo: {
      provider: 'teachertube',
      id: 'lmodgling',
      mediaType: 'channel',
      list: '10125',
    },
    formats: {
      long: 'https://www.teachertube.com/user/channel/lmodgling?playlist-id=10125',
      embed: undefined,
    },
    urls: [
      'https://www.teachertube.com/user/channel/lmodgling?playlist-id=10125',
    ],
  });


});

test('TeacherTube: document urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'teachertube',
      id: '36486',
      mediaType: 'document',
    },
    formats: {
      long: 'https://www.teachertube.com/document/36486',
      embed: undefined,
    },
    urls: [
      'https://www.teachertube.com/document/36486',
    ],
  });
});

test('TeacherTube: group urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'teachertube',
      id: 'mathforkids',
      mediaType: 'group',
    },
    formats: {
      long: 'https://www.teachertube.com/group/mathforkids',
      embed: undefined,
    },
    urls: [
      'https://www.teachertube.com/group/mathforkids',
    ],
  });
});

test('TeacherTube: collection urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'teachertube',
      id: '4728',
      mediaType: 'collection',
    },
    formats: {
      long: 'https://www.teachertube.com/collection/4728',
      embed: undefined,
    },
    urls: [
      'https://www.teachertube.com/collection/4728',
    ],
  });
});