urlParser.bind({
  provider: 'vimeo',
  alternatives: ['vimeopro'],
  parse: function (url) {
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
  defaultFormat: 'long',
  formats:{
    long: function(vi, params){
      "use strict";
      return 'https://vimeo.com/' + vi.id + combineParams({params: params});
    },
    embed: function(vi, params){
      "use strict";
      return '//player.vimeo.com/video/' + vi.id + combineParams({params: params});
    }
  }
});
