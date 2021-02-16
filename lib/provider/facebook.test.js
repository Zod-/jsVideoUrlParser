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
  expect(newParser().parse('https://facebook.com/watch/?ref=external&v=')).toBe(undefined);
  expect(newParser().parse('https://facebook.com')).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'facebook' } })).toBe(undefined);
  expect(newParser().create({ videoInfo: { provider: 'facebook', mediaType: 'video' } })).toBe(undefined);
});

test('Facebook: video urls', () => {
  testUrls(newParser(), {
    videoInfo: {
      provider: 'facebook',
      id: '123696502806971',
      mediaType: 'video',
    },
    formats: {
      long: 'https://facebook.com/watch/?v=123696502806971',
    },
    urls: [
      'https://facebook.com/some1.something.1/videos/vb.100054998662277/123696502806971/?type=2&theater&notif_t=video_processed&notif_id=1600602220846782',
      'https://facebook.com/100054998662277/videos/123696502806971',
      'https://facebook.com/watch/?ref=external&v=123696502806971',
      'https://facebook.com/Someone/videos/123696502806971/?extid=MMynZplEHDusTCmm',
    ],
  });
});
