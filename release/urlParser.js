var urlParser = (function () {
    "use strict";
    var plugins = {};

    return {
        'parse': function (url) {
            var match = url.match(/(https?:\/\/)?([^\.]+\.)?(\w+)\./i),
                provider = match ? match[3] : undefined,
                result,
                createdUrl;
            if (match && provider && plugins[provider]) {
                result = plugins[provider].parse.call(this, url);
                if (result) {
                    result.provider = plugins[provider].provider;
                    return result;
                }
            }
            return undefined;
        },
        'bind': function (plugin) {
            plugins[plugin.provider] = plugin;
            if (plugin.alternatives) {
                var i;
                for (i = 0; i < plugin.alternatives.length; i += 1) {
                    plugins[plugin.alternatives[i]] = plugin;
                }
            }
        },
        'create': function (videoInfo) {
            if (plugins[videoInfo.provider].create) {
                return plugins[videoInfo.provider].create.call(this, videoInfo);
            }
            return undefined;
        }
    };
}());

//http://joquery.com/2012/string-format-for-javascript
String.format = function (str) {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = str,
        i,
        regEx;

    // start with the second argument (i = 1)
    for (i = 1; i < arguments.length; i += 1) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
};

//parses strings like 1h30m20s to seconds
function getTime(timestring) {
    "use strict";
    var totalSeconds = 0,
        currentValue = 0,
        i,
        timeValues = {
            's': 1,
            'm': 1 * 60,
            'h': 1 * 60 * 60,
            'd': 1 * 60 * 60 * 24,
            'w': 1 * 60 * 60 * 24 * 7
        };

    //is the format 1h30m20s etc
    if (!timestring.match(/^(\d+[smhdw]?)+$/)) {
        return 0;
    }

    for (i = 0; i < timestring.length; i += 1) {
        if (timestring[i] >= '0' && timestring[i] <= '9') {
            //parse the string to decimal
            currentValue = 10 * currentValue + parseInt(timestring[i], 10);
        } else if (timestring[i] in timeValues) {
            //convert to seconds and delete the entry so there can only be one of this element e.g no 20s20s
            totalSeconds += timeValues[timestring[i]] * currentValue;
            delete timeValues[timestring[i]];
            currentValue = 0;
        } else {
            //discard the value if the format doesn't fit the others
            currentValue = 0;
        }
    }
    //if the last string was just numbers and the s tag hasn't been used before then add it as seconds
    if (currentValue !== 0 && 's' in timeValues) {
        totalSeconds += currentValue;
        delete timeValues.s;
    }
    return totalSeconds;
}

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

urlParser.bind({
    'provider': 'youtube',
    'alternatives': ['youtu'],
    'parse': function (url) {
        "use strict";
        var match,
            id,
            playlistId,
            startTime,
            result = {};

        match = url.match(/(((v|be|videos)\/)|(v=))([\w\-]{11})/i);
        id = match ? match[5] : undefined;

        match = url.match(/list=([\w\-]+)/i);
        playlistId = match ? match[1] : undefined;

        match = url.match(/[#\?&](star)?t=([A-Za-z0-9]+)/i);
        startTime = match ? getTime(match[2]) : undefined;


        if (id) {
            result.mediaType = 'video';
            result.id = id;
            if (playlistId) {
                result.playlistId = playlistId;
            }
            if (startTime) {
                result.startTime = startTime;
            }
        } else if (playlistId) {
            result.mediaType = 'playlist';
            result.playlistId = playlistId;
        } else {
            return undefined;
        }

        return result;
    },
    'create': function (videoInfo) {
        "use strict";
        var url;
        if (videoInfo.mediaType === 'video') {
            if (!videoInfo.playlistId) {
                url = String.format('http://youtu.be/{0}', videoInfo.id);
            } else {
                url = String.format('https://www.youtube.com/watch?v={0}&list={1}', videoInfo.id, videoInfo.playlistId);
            }
            if (videoInfo.startTime) {
                url += String.format('#t={0}', videoInfo.startTime);
            }
        } else if (videoInfo.mediaType === 'playlist') {
            url = String.format('https://www.youtube.com/playlist?feature=share&list={0}', videoInfo.playlistId);
        }
        return url;
    }
});