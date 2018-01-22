const { execSync } = require('child_process');
const fs = require("fs");
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react')
const mongoose = require('mongoose')
mongoose.connect(require('./mongosettings'), {
  useMongoClient: true
})
//requires and connection to the database

execSync('grunt babel')

let components = fs.readdirSync('./compiled')
  .map(filename => {
    const story = require('./compiled/' + filename).default
    story.introducction = renderToStaticMarkup(React.createElement(story.introducction, null))
    story.interview = renderToStaticMarkup(React.createElement(story.interview, null))
    return story
  }
  )

let names = fs.readdirSync("./compiled")
  .map(name => name.substr(0, name.length - 3))

components = components.map((story, index) => {
  return { name: names[index], ...story, date: Date.now() }
})

//deleting the 'compiled' folder
for (let filename of fs.readdirSync('compiled')) {
  fs.unlinkSync('compiled/' + filename)
}
fs.rmdirSync('compiled')
///////////////////////////////

//updating the database
const storySchema = mongoose.Schema({ name: String, introducction: String, interview: String, date: Number })
const storyModel = mongoose.model('stories', storySchema)

const promises = components.map(story => {
  return new Promise((resolve, reject) => {
    storyModel.findOne({ name: story.name }).exec()
      .then(doc => {
        if (!doc) {
          const Story = new storyModel(story)
          Story.save()
            .then(() => {
              console.log(`Done: ${story.name}`)
              resolve(`No errors with ${story.name}`)
            })
            .catch(error => {
              console.log(`Error with ${story.name}`)
              reject(error)
            })
        } else {
          storyModel.findByIdAndUpdate(doc._id, { introducction: story.introducction, interview: story.interview }).exec()
            .then(() => {
              console.log(`Done: ${story.name}`)
              resolve(`No errors with ${story.name}`)
            })
            .catch(error => {
              console.log(`Error with ${story.name}`)
              reject(err)
            })
        }
      })
      .catch(err => {
        console.log(`Error with ${story.name}`)
        reject(err)
      })
  })
})

Promise.all(promises)
  .then(() => {
    console.log('Everything Done')
    process.exit(0)
  })
  .catch(console.error)

//////////////////////