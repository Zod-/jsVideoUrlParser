const UrlParser = require('./urlParser');
const parser = new UrlParser();

parser.register(
  require('./provider/canalplus'),
  require('./provider/coub'),
  require('./provider/dailymotion'),
  require('./provider/twitch'),
  require('./provider/vimeo'),
  require('./provider/wistia'),
  require('./provider/youku'),
  require('./provider/youtube')
);

module.exports = parser;
