const UrlParser = require('./urlParser');
const parser = new UrlParser();

parser.bind(require('./provider/canalplus'));
parser.bind(require('./provider/coub'));
parser.bind(require('./provider/dailymotion'));
parser.bind(require('./provider/twitch'));
parser.bind(require('./provider/vimeo'));
parser.bind(require('./provider/wistia'));
parser.bind(require('./provider/youku'));
parser.bind(require('./provider/youtube'));
parser.UrlParser = UrlParser;

module.exports = parser;
