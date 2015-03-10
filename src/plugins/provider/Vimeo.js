urlParser.bind({
  'provider': 'vimeo',
  'alternatives': ['vimeopro'],
  'parse': function (url) {
    "use strict";
    var match,
      id;
    match = url.match(/(?:\/(?:channels\/[\w]+|(?:album\/\d+\/)?videos?))?\/(\d+)/i);
    id = match ? match[1] : undefined;
    if (!id) {
      return undefined;
    }
    return {
      'mediaType': 'video',
      'id': id
    };
  },
  'create': function (op) {
    "use strict";
    return 'https://vimeo.com/' + op.videoInfo.id;
  }
});
