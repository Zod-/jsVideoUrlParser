urlParser.bind({
    'provider': 'twitch',
    'parse': function (url) {
        "use strict";
        var match,
            id,
            channel,
            result = {};

        match = url.match(/twitch\.tv\/(\w+)(\/.\/(\d+))?/i);
        channel = match ? match[1] : undefined;
        id = match ? match[3] : undefined;

        match = url.match(/((\?channel)|(\&utm_content))=(\w+)/i);
        channel = match ? match[1] : channel;

        if (!channel) {
            return undefined;
        }
        if (id) {
            result.mediaType = 'video';
            result.id = id;
        } else {
            result.mediaType = 'stream';
        }
        result.channel = channel;

        return result;
    },
    'create': function (videoInfo) {
        "use strict";
        var url;
        if (videoInfo.mediaType === 'stream') {
            url = String.format('http://twitch.tv/{0}', videoInfo.channel);
        } else if (videoInfo.mediaType === 'video') {
            url = String.format('http://twitch.tv/{0}/c/{1}', videoInfo.channel, videoInfo.id);
        }
        return url;
    }
});