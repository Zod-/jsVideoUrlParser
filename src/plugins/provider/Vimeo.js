urlParser.bind({
    'provider': 'vimeo',
    'parse': function (url) {
        "use strict";
        var match,
            id;
        match = url.match(/(\/((channels\/[\w]+)|(album\/\d+)?\/video))?\/(\d+)/i);
        id = match ? match[5] : undefined;
        if (!id) {
            return undefined;
        }
        return {
            'id': id
        };
    },
    'create': function (videoInfo) {
        "use strict";
        return String.format('http://vimeo.com/{0}', videoInfo.id);
    }
});