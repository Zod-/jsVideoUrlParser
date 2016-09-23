if (typeof w !== 'undefined') {
  w.urlParser = urlParser;
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = urlParser;
}
})(window);
