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

  grunt.registerTask('default', "", function () {

    var execSync = require('child_process').execSync;
    var fs = require("fs");
    var renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
    var React = require('react')
    var moongoose = require('mongoose')

    execSync("grunt babel");

    var components = fs.readdirSync("./compiled")
      .map(filename => renderToStaticMarkup(React.createElement(require('./compiled/' + filename).default, null)))

    var names = fs.readdirSync("./compiled")
      .map(name => name.substr(0, name.length - 3))

    components = components.map((component, index) =>
      JSON.stringify({ title: names[index], component: component })
    )

    //here add the mongo code

    //code for deleting the compiled file
    for(var filename of fs.readdirSync('compiled')){
      fs.unlinkSync('compiled/'+filename)
    }
    fs.rmdirSync('compiled')

  });

}