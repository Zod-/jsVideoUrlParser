const Template = require('./template');
const UrlParser = require('../urlParser');
const {testUrls} = require('../testUrls');

function newParser() {
  const parser = new UrlParser();
  parser.register(new Template());
  return parser;
}

test('Template urls', () => {
  // Parse urls to test against the videoInfo object
  // Create urls with the videoInfo objects to test against the format urls
  testUrls(newParser(), {
    videoInfo:  {
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
});
