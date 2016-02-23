urlParser.bind({
  provider: 'youku',
  parse: function (url, params) {
    "use strict";
    var match;
    var result = {
      mediaType: 'video',
      params: params
    };

    match = url.match(
      /(?:embed\/|sid\/|v_show\/id_)(\w*)/
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
      var url = 'http://player.youku.com/embed/' + vi.id;

      return url;
    }
  }
});
