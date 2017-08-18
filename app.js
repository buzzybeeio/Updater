const execSync = require('child_process').execSync;
const fs = require("fs");
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
const React = require('react')
let mongoose = require('mongoose')
mongoose.connect(require('./mongosettings'))
//requires and connection to the database

execSync("grunt babel");

let components = fs.readdirSync("./compiled")
  .map(filename => renderToStaticMarkup(React.createElement(require('./compiled/' + filename).default, null)))

let names = fs.readdirSync("./compiled")
  .map(name => name.substr(0, name.length - 3))

components = components.map((component, index) =>
{ return { name: names[index], component: component } })

//deleting the 'compiled' folder
for (let filename of fs.readdirSync('compiled')) {
  fs.unlinkSync('compiled/' + filename)
}
fs.rmdirSync('compiled')
///////////////////////////////

//updating the database
let storySchema = mongoose.Schema({ name: String, component: String })
let storyModel = mongoose.model('stories', storySchema)

  for (let story in components) {

    storyModel.findOne({ name: components[story].name }, function (err, doc) {
      if(err) return console.error( err )

      if (!doc) {
        let Story = new storyModel( components[story] )
        Story.save()
      }
      else {
        storyModel.update( { name: components[story].name }, { $set: { component: components[story].component } } )
      }

      console.log( "done: " + components[story].name )
    })

  }

//////////////////////