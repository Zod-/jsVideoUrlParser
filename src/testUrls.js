exports.testUrls = (parser, obj) => {
  const {urls, videoInfo, formats} = obj;
  const {parse, create} = parser;
  for (const url of urls) {
    expect(parse(url)).toEqual(videoInfo);
  }
  for (const format of Object.keys(formats)) {
    const createdUrl = create({videoInfo, format, params: videoInfo.params});
    expect(createdUrl).toBe(formats[format]);
  }
};
