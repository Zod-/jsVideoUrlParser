urlParser.bind({
    'provider': 'vimeo',
    'alternatives': ['vimeopro'],
    'parse': function (url) {
        "use strict";
        var match,
            id;
        match = url.match(/(\/((channels\/[\w]+)|((album\/\d+\/)?videos?)))?\/(\d+)/i);
        id = match ? match[6] : undefined;
        if (!id) {
            return undefined;
        }
        return {
            'mediaType': 'video',
            'id': id
        };
    },
    'create': function (videoInfo) {
        "use strict";
        return 'http://vimeo.com/{0}'.format(videoInfo.id);
    }
});