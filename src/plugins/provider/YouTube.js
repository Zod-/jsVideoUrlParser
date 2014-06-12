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