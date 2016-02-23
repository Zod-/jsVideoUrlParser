urlParser.bind({
  provider: 'canalplus',
  parse: function (url, params) {
    "use strict";
    var match;
    var result = {
      mediaType: 'video',
      params: params
    };

    match = url.match(
      /vid=(\d+)/
    );

    result.id = match ? match[1] : undefined;

    if (!result.id) {
      return undefined;
    }

    return result;
  },
  defaultFormat: 'embed',
  formats: {
    embed: function (vi) {
      "use strict";
      var url = 'http://player.canalplus.fr/embed/?param=cplus&vid=' + vi.id;

      return url;
    }
  }
});
