QUnit.test("Dailymotion URLs", function (assert) {
    var expected1 = {
        'provider': 'dailymotion',
        'id': 'x1e2b95',
        'mediaType': 'video'
    },
        expected2 = {
            'provider': 'dailymotion',
            'id': 'x1e2b95',
            'mediaType': 'video',
            startTime: 10
        },
        testPairs = {
            'http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals': expected1,
            'http://www.dailymotion.com/video/x1e2b95_bruce-lee-nin-kayip-kedisi_animals?start=10': expected2,
            'http://www.dailymotion.com/video/x1e2b95': expected1,
            'http://www.dailymotion.com/video/x1e2b95?start=10': expected2,
            'http://dai.ly/x1e2b95': expected1,
            'http://www.dailymotion.com/embed/video/x1e2b95': expected1,
            'http://www.dailymotion.com/embed/video/x1e2b95?start=10': expected2
        };

    assertURLTestPairs(assert, testPairs);
});