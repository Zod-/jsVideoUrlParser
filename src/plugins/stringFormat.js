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