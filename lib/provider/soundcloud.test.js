const SoundCloud = require('./soundcloud');
const UrlParser = require('../urlParser');
const {
  testUrls,
} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.bind(new SoundCloud());
  return parser;
}

test('SoundCloud: undefined', () => {
  expect(newParser().parse('https://soundcloud.com')).toBe(undefined);
  expect(newParser().parse('https://soundcloud.com/julian-hangst-rfer/')).toBe(undefined);
});

test('SoundCloud: track urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'soundcloud',
      id: 'odsf0dif92w3j_adfw-edf-1-asdf-1',
      channel: 'julian-hangst-rfer',
      mediaType: 'track',
    },
    formats: {
      long: 'https://soundcloud.com/julian-hangst-rfer/odsf0dif92w3j_adfw-edf-1-asdf-1',
    },
    urls: [
      'https://soundcloud.com/julian-hangst-rfer/odsf0dif92w3j_adfw-edf-1-asdf-1',
    ],
  });
  testUrls(newParser(), {
    videoInfo: {
      provider: 'soundcloud',
      id: 'odsf0dif92w3j_adfw-edf-1-asdf-1',
      channel: 'julian-hangst-rfer',
      mediaType: 'track',
      params: {
        start: 30,
      },
    },
    formats: {
      long: 'https://soundcloud.com/julian-hangst-rfer/odsf0dif92w3j_adfw-edf-1-asdf-1#t=30',
    },
    urls: [
      'https://soundcloud.com/julian-hangst-rfer/odsf0dif92w3j_adfw-edf-1-asdf-1#t=00:30',
    ],
  });
});

test('SoundCloud: playlist urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'soundcloud',
      list: 'dif92w-e_e',
      channel: 'julian-hangst-rfer',
      mediaType: 'playlist',
    },
    formats: {
      long: 'https://soundcloud.com/julian-hangst-rfer/sets/dif92w-e_e',
    },
    urls: [
      'https://soundcloud.com/julian-hangst-rfer/sets/dif92w-e_e',
    ],
  });
});

test('SoundCloud: api track urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'soundcloud',
      id: '388050272',
      mediaType: 'apitrack',
    },
    formats: {
      long: 'https://api.soundcloud.com/tracks/388050272',
      embed: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/388050272',
    },
    urls: [
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/388050272',
      'https://api.soundcloud.com/tracks/388050272',
    ],
  });
});

test('SoundCloud: api playlist urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'soundcloud',
      list: '430366544',
      mediaType: 'apiplaylist',
    },
    formats: {
      long: 'https://api.soundcloud.com/playlists/430366544',
      embed: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/430366544',
    },
    urls: [
      'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/430366544',
      'https://api.soundcloud.com/playlists/430366544',
    ],
  });
});
