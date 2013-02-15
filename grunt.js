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
	  },
	  watch: {
  		files: 'content/*',
  		tasks: 'markdown'
		}
	});
	grunt.loadNpmTasks('grunt-markdown');
	grunt.registerTask('default', ['markdown']);
};
