urlParser.bind({
  provider: 'canalplus',
  parse: function (url, params) {
    'use strict';
    var result = {
      mediaType: 'video',
      params: params
    };

    result.id = result.params.vid;
    delete result.params.vid;

    if (!result.id) {
      return undefined;
    }

    return result;
  },
  defaultFormat: 'embed',
  formats: {
    embed: function (vi) {
      'use strict';
      var url = 'http://player.canalplus.fr/embed/?param=cplus&vid=' + vi.id;

      return url;
    }
  }
});
