if (typeof window !== 'undefined') {
  window.urlParser = urlParser;
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = urlParser;
}
})();
