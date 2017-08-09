module.exports = function(grunt){

  grunt.initConfig({
  react: {
    dynamic_mappings: {
      files: [
        {
          expand: true,
          cwd: './stories',
          src: ['**/*.jsx'],
          dest: './compiled',
          ext: '.js'
        }
      ]
    }
  }
})

grunt.loadNpmTasks('grunt-react')

  grunt.registerTask('default', "", function(){

    var execSync = require('child_process').execSync;

    var fs = require("fs");

    execSync("grunt react");

    var components = fs.readdirSync("./compiled")

    for(var filename of components){

      var story = fs.readFileSync('./compiled/'+filename,"utf8")

      //won't be able to use ` on the code

      story = 'var Story=`'+story+'\`;module.exports=Story'

      fs.writeFileSync('./compiled/'+filename,story)

    }

    components = components.map( name => 
      JSON.stringify({title: name.substr(0,name.length-3), component: require('./compiled/'+name)})
    )
  
    //now just clean the code and make then the mongo part
  });
}