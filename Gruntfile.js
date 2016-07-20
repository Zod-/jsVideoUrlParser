module.exports = function (grunt) {
  'use strict';

  var srcDir = 'src/';
  var testDir = 'tests/';
  var testSrcDir = testDir + srcDir;
  var providerDir = 'plugins/provider/';
  var outputFile = 'dist/jsVideoUrlParser.js';
  var minOutputFile = 'dist/jsVideoUrlParser.min.js';
  var testOutputFile = testDir + 'test.js';
  var src = [srcDir + 'urlParser.js', srcDir + 'plugins/*.js'];
  var test = [testSrcDir + '*.js', testSrcDir + 'plugins/*.js'];
  var provider = {
    '--dailymotion': ['Dailymotion.js'],
    '--youtube': ['YouTube.js'],
    '--vimeo': ['Vimeo.js'],
    '--twitch': ['Twitch.js'],
    '--canalplus': ['CanalPlus.js'],
    '--youku': ['Youku.js'],
    '--coub': ['Coub.js'],
    '--template': ['Template.js']
  };
  grunt.option.flags().forEach(function (flag) {
    flag = flag.toLowerCase();
    grunt.log.writeln(flag);
    if (provider.hasOwnProperty(flag)) {
      src.push(srcDir + providerDir + provider[flag]);
      test.push(testSrcDir + '' + providerDir + provider[flag]);
    }
  });
  //add all files when no flags were found
  if (src.length === 2) {
    src.push(srcDir + providerDir + '*.js');
    test.push(testSrcDir + providerDir + '*.js');
    //ignore template files
    src.push('!' + srcDir + providerDir + 'Template.js');
    test.push('!' + testSrcDir + providerDir + 'Template.js');
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: src,
        dest: outputFile,
      },
      test: {
        src: test,
        dest: testOutputFile,
      }
    },
    uglify: {
      build: {
        src: outputFile,
        dest: minOutputFile
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      beforeconcat: src.concat(test),
      afterconcat: [outputFile, testOutputFile],
      other: ['Gruntfile.js']
    },
    qunit: {
      all: [testDir + 'index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'jshint', 'qunit', 'uglify']);
  grunt.registerTask('dist', ['concat:dist', 'uglify']);
  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('build', ['concat']);
};
