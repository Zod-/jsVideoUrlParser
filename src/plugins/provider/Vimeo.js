urlParser.bind({
  'provider': 'vimeo',
  'alternatives': ['vimeopro'],
  'parse': function(url) {
    "use strict";
    var match,
      videoId;
    match = url.match(/(?:\/(?:channels\/[\w]+|(?:album\/\d+\/)?videos?))?\/(\d+)/i);
    videoId = match ? match[1] : undefined;
    if (!videoId) {
      return undefined;
    }
    return {
      'mediaType': 'video',
      'videoId': videoId
    };
  },
  'create': function(videoInfo) {
    "use strict";
    return 'https://vimeo.com/{0}'.format(op.videoInfo.videoId);
  }
});
