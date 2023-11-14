const express = require('express')

const Play = require('../schemas/play')
const Show = require('../schemas/show')

const router = express.Router()

router.get('/', getAllShows)
router.get('/:id', getShowById)
router.post('/', createShow)
router.put('/:id', updateShow)
router.delete('/:id', deleteShow)

async function getAllShows(req, res, next) {
 // console.log('getAllUsers by user ', req.user._id)   //consulta que usuario esta haciendo la consulta
  try {
    const plays = await Show.find()
    res.send(plays)
  } catch (err) {
    next(err)
  }
}

async function getShowById(req, res, next) {
  console.log('getPlay with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const show = await Show.findById(req.params.id)

    if (!show || show.length == 0) {
      res.status(404).send('User not found')
    }

    res.send(show)
  } catch (err) {
    next(err)
  }
}


// Por Postman
// {
//   "_id": "000000000000000000000000",
//   "email": "admin@baseapinode.com",
//   "password": "Password1",
//   "firstName": "Admin",
//   "lastName": "BaseApiNode",
//   "role": "admin",
//   "isActive": true
// }
// {
//   "_id": "000000000000000000000001",
//   "email": "client@baseapinode.com",
//   "password": "Password1",
//   "firstName": "Client",
//   "lastName": "BaseApiNode",
//   "role": "client",
//     "governmentId": {
//     "type": "dni",
//     "number": "22222222"
//   },
//   "isActive": true
// }

async function createShow(req, res, next) {
  console.log('createPlay: ', req.body)
  

  const show = req.body


  try {
    
    const playCreated = await Show.create(show)

    res.send(playCreated)
  } catch (err) {
    next(err)
  }
}

async function updateShow(req, res, next) {
  console.log('updatePlay with id: ', req.params.id)

  if (!req.params.id) {
    return res.status(404).send('Parameter id not found')
  }

  /*if (!req.isAdmin() && req.params.id != req.user._id) {
    return res.status(403).send('Unauthorized')
  }*/

  // The email can't be updated
  delete req.body.name

  try {
    const showToUpdate = await Show.findByPlay(req.params.id)

    if (!showToUpdate) {
      req.logger.error('User not found')
      return res.status(404).send('User not found')
    }

    // This will return the previous status
    await showToUpdate.updateOne(req.body)
    res.send(showToUpdate)

    // This return the current status
    // userToUpdate.password = req.body.password
    // userToUpdate.role = req.body.role
    // userToUpdate.firstName = req.body.firstName
    // userToUpdate.lastName = req.body.lastName
    // userToUpdate.phone = req.body.phone
    // userToUpdate.bornDate = req.body.bornDate
    // userToUpdate.isActive = req.body.isActive
    // await userToUpdate.save()
    // res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function deleteShow(req, res, next) {
  console.log('deletePlay with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const user = await Show.findById(req.params.id)

    if (!user) {
      res.status(404).send('User not found')
    }

    await Play.deleteOne({ _id: user._id })

    res.send(`Play deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

module.exports = router
