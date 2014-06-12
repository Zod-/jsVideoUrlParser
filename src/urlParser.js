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