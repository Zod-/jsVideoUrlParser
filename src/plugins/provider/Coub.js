urlParser.bind({
  provider: 'coub',
  parse: function (url, params) {
    'use strict';
    var match;
    var result = {
      mediaType: 'video',
      params: params
    };

    match = url.match(
      /(?:embed|view)\/([a-zA-Z\d]+)/i
    );
    result.id = match ? match[1] : undefined;

    if (!result.id) {
      return undefined;
    }
    
    return result;
  },
  defaultFormat: 'long',
  formats: {
    long: function (vi, params) {
      'use strict';
      var url = 'https://coub.com/view/' + vi.id;
      url += combineParams({
        params: params
      });
      return url;
    },
    embed: function (vi, params) {
      'use strict';
      var url = '//coub.com/embed/' + vi.id;
      url += combineParams({
        params: params
      });
      return url;
    }
  }
});
