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