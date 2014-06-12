//not finished
urlParser.bind({
    'provider': 'livestream',
    'parse': function (url) {
        "use strict";
        var match,
            channel;
        match = url.match(/livestream\.com\/(\w+)/i);
        channel = match ? match[1] : undefined;
        if (!channel) {
            return undefined;
        }

        return {
            'mediaType': 'stream',
            'channel': channel
        };
    }
});