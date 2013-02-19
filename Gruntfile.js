module.exports = function(grunt) {
'use strict';

	var path = require('path');
	var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
	
	var folderMount = function folderMount(connect, point) {
		return connect.static(path.resolve(point));
	};


	grunt.initConfig({
		connect: {
			livereload: {
				options: {
					port: 9001,
					middleware: function(connect, options) {
						return [lrSnippet, folderMount(connect, '.')]
					}
				}
			}
		},
		regarde: {
			markdown: {
				files: 'content/*',
				tasks: ['markdown', 'livereload']
			}
		},

	  markdown: {
	    all: {
	      src: 'content/*',
	      dest: './',
	      ext: 'html',
	      options: {
	      	gfm: true,
	      	highlight: 'manual',
       		template: 'template.html'
	      }
	    }  
	  }
	});
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-livereload');
  
	// Default task(s).
	grunt.registerTask('default', ['livereload-start', 'connect', 'regarde', 'markdown']);
};
