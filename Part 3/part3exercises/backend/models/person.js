const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connection.once('open', () => console.log('Connecting to MongoDB'))
mongoose
  .connect(url)
  .then(console.log('Connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (number) => {
        return /^[0-9]{2,3}-[0-9]{5,}$/.test(number)
      },
      message: (props) =>
        `${props.value} is not valid.  \n
  Numbers must start with 2 to 3 digits, followed by a hyphen (-) and end with at least 5 digits
      `,
    },
  },
})

personSchema.set('toJSON', {
  transform: (docuemnt, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  },
})

const Person = mongoose.model('Person', personSchema, 'persons')

module.exports = mongoose.model('Person', personSchema)
