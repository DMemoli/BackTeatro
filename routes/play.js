const express = require('express')

const Play = require('../schemas/play')
const Show = require('../schemas/show')

const router = express.Router()

router.get('/', getAllPlays)
router.get('/:id', getPlayById)
router.post('/', createPlay)
router.put('/:id', updatePlay)
router.delete('/:id', deletePlay)

async function getAllPlays(req, res, next) {
 // console.log('getAllUsers by user ', req.user._id)   //consulta que usuario esta haciendo la consulta
  try {
    const plays = await Play.find()
    res.send(plays)
  } catch (err) {
    next(err)
  }
}

async function getPlayById(req, res, next) {
  console.log('getPlay with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const play = await Play.findById(req.params.id).populate('performances')

    if (!play || play.length == 0) {
      res.status(404).send('User not found')
    }
    res.send(play)
  } catch (err) {
    next(err)
  }
}


async function createPlay(req, res, next) {
  console.log('createPlay: ', req.body)
  

  const obra = req.body


  try {
    
    const playCreated = await Play.create(obra)

    res.send(playCreated)
  } catch (err) {
    next(err)
  }
}

async function updatePlay(req, res, next) {
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
    const playToUpdate = await Play.findById(req.params.id)

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
    const user = await Play.findById(req.params.id)

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
