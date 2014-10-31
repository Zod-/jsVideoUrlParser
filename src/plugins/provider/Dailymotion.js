urlParser.bind({
    'provider': 'dailymotion',
    'alternatives': ['dai'],
    'parse': function (url) {
        "use strict";
        var match,
            id,
            startTime,
            result = {};

        match = url.match(/(?:\/video|ly)\/([A-Za-z0-9]+)/i);
        id = match ? match[1] : undefined;

        match = url.match(/[#\?&]start=([A-Za-z0-9]+)/i);
        startTime = match ? getTime(match[1]) : undefined;

        if (!id) {
            return undefined;
        }
        result.mediaType = 'video';
        result.id = id;
        if (startTime) {
            result.startTime = startTime;
        }
        return result;
    },
    'create': function (videoInfo) {
        "use strict";
        if (videoInfo.startTime) {
            return 'http://www.dailymotion.com/video/{0}?start={1}'.format(videoInfo.id, videoInfo.startTime);
        }

        return 'http://dai.ly/{0}'.format(videoInfo.id);
    }
});
