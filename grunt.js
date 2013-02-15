module.exports = function(grunt) {
	grunt.initConfig({
	  markdown: {
	    all: {
	      files: ['content/*'],
	      dest: './',
	      options: {
	      },
	      template: 'template.html'
	    }  
	  }  
	});
	grunt.loadNpmTasks('grunt-markdown');
	grunt.registerTask('default', ['markdown']);
};
