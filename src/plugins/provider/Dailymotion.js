urlParser.bind({
    'provider': 'dailymotion',
    'alternatives': ['dai'],
    'parse': function (url) {
        "use strict";
        var match,
            id;
        match = url.match(/((\/video)|(ly))\/([^_]+)/i);
        id = match ? match[4] : undefined;
        if (!id) {
            return undefined;
        }
        return {
            'id': id
        };
    },
    'create': function (videoInfo) {
        "use strict";
        return String.format('http://dai.ly/{0}', videoInfo.id);
    }
});