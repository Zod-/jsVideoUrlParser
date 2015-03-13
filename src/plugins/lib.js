/*jshint unused:false */
function cloneObject(obj) {
  /*jshint unused:true */
  "use strict";
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  var temp = obj.constructor(); // give temp the original obj's constructor
  for (var key in obj) {
    temp[key] = cloneObject(obj[key]);
  }

  return temp;
}

//http://stackoverflow.com/a/1099670
/*jshint unused:false */
function getQueryParams(qs) {
  /*jshint unused:true */
  "use strict";
  qs = qs.split("+").join(" ");

  var params = {},
    tokens,
    re = /[\?#&]([^=]+)=([^&#]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

/*jshint unused:false */
function combineParams(op) {
  /*jshint unused:true */
  "use strict";
  var combined = '',
    i = 0,
    keys = Object.keys(op.params);

  if (keys.length === 0) {
    return '';
  }

  if (!op.hasParams) {
    combined += '?' + keys[0] + '=' + op.params[keys[0]];
    i += 1;
  }

  for (; i < keys.length; i += 1) {
    combined += '&' + keys[i] + '=' + op.params[keys[i]];
  }
  return combined;
}

//parses strings like 1h30m20s to seconds
/*jshint unused:false */
function getTime(timeString) {
  /*jshint unused:true */
  "use strict";
  var totalSeconds = 0,
    timeValues = {
      's': 1,
      'm': 1 * 60,
      'h': 1 * 60 * 60,
      'd': 1 * 60 * 60 * 24,
      'w': 1 * 60 * 60 * 24 * 7
    },
    timePairs;

  //is the format 1h30m20s etc
  if (!timeString.match(/^(\d+[smhdw]?)+$/)) {
    return 0;
  }
  //expand to "1 h 30 m 20 s" and split
  timeString = timeString.replace(/([smhdw])/g, ' $1 ').trim();
  timePairs = timeString.split(' ');

  for (var i = 0; i < timePairs.length; i += 2) {
    totalSeconds += parseInt(timePairs[i], 10) * timeValues[timePairs[i + 1] || 's'];
  }
  return totalSeconds;
}
