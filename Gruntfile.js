module.exports = function (grunt) {

  grunt.initConfig({
    babel: {
      options: {
        presets: ['es2015', 'react']
      },
      build: {
        files: [{
          expand: true,
          cwd: 'stories',
          src: ['**/*.jsx'],
          dest: 'compiled',
          ext: '.js'
        }]
      }
    }
  })

  grunt.loadNpmTasks('grunt-babel')

}