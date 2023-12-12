const express = require('express')

const Theater = require('../schemas/theater')


const router = express.Router()

router.get('/', getAllTheaters)
router.get('/:id', getTheaterById)
router.post('/', createTheater)
router.put('/:id', updateTheater)
router.delete('/:id', deletePlay)

async function getAllTheaters(req, res, next) {
 // console.log('getAllUsers by user ', req.user._id)   //consulta que usuario esta haciendo la consulta
  try {
    const theaters = await Theater.find()
    res.send(theaters)
  } catch (err) {
    next(err)
  }
}

async function getTheaterById(req, res, next) {
  console.log('get Theater with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const user = await Theater.findById(req.params.id)

    if (!user || user.length == 0) {
      res.status(404).send('User not found')
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}


async function createTheater(req, res, next) {
  console.log('create Theater: ', req.body)
  

  const theater = req.body
  

  try {
    
    const theaterCreated = await Theater.create(theater)

    res.send(theaterCreated)
  } catch (err) {
    next(err)
  }
}

async function updateTheater(req, res, next) {
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
    const playToUpdate = await Theater.findById(req.params.id)

    if (!playToUpdate) {
      req.logger.error('User not found')
      return res.status(404).send('User not found')
    }

    // This will return the previous status
    await playToUpdate.updateOne(req.body)
    res.send(playToUpdate)

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

async function deletePlay(req, res, next) {
  console.log('deletePlay with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const user = await Theater.findById(req.params.id)

    if (!user) {
      res.status(404).send('User not found')
    }

    await Theater.deleteOne({ _id: user._id })

    res.send(`Play deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

module.exports = router
