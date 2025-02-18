const express = require('express');

const Play = require('../schemas/play');
const Show = require('../schemas/show');
const Theater = require('../schemas/theater');

const router = express.Router();

router.get('/', getAllShows);
router.get('/:id', getShowById);
router.post('/:id', createShow);
router.put('/:id', updateShow);
router.delete('/:id', deleteShow);

// Nuevo endpoint para actualizar la disponibilidad de los asientos de un show
router.patch('/:id/seats', updateShowSeats);

async function getAllShows(req, res, next) {
  try {
    const plays = await Show.find();
    res.send(plays);
  } catch (err) {
    next(err);
  }
}

async function getShowById(req, res, next) {
  console.log('getPlay with id: ', req.params.id);

  if (!req.params.id) {
    return res.status(500).send('The param id is not defined');
  }

  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).send('Show not found');
    }

    res.send(show);
  } catch (err) {
    next(err);
  }
}


async function createShow(req, res, next) {
  console.log('createShow: ', req.body);

  const show = req.body;

  try {
    const showCreated = await Show.create(show);
    try {
      const playToUpdate = await Play.findById(req.params.id);

      if (!playToUpdate) {
        return res.status(404).send('Play not found');
      }
      console.log('Play a actualizar: ', playToUpdate);
      playToUpdate.performances.push(showCreated._id);
      // Actualizamos el play con el nuevo show
      console.log('Play a actualizada: ', playToUpdate);
      await playToUpdate.updateOne(playToUpdate);
      res.send(playToUpdate);
    } catch (err) {
      return next(err);
    }
  } catch (err) {
    next(err);
  }
}

async function updateShow(req, res, next) {
  console.log('updatePlay with id: ', req.params.id);

  if (!req.params.id) {
    return res.status(404).send('Parameter id not found');
  }

  // La propiedad name no puede actualizarse
  delete req.body.name;

  try {
    const showToUpdate = await Show.findById(req.params.id);

    if (!showToUpdate) {
      return res.status(404).send('Show not found');
    }

    // Actualizamos el documento con los datos del body
    await showToUpdate.updateOne(req.body);
    res.send(showToUpdate);
  } catch (err) {
    next(err);
  }
}

async function deleteShow(req, res, next) {
  console.log('delete show with id: ', req.params.id);

  if (!req.params.id) {
    return res.status(500).send('The param id is not defined');
  }

  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).send('Show not found');
    }

    await Show.deleteOne({ _id: show._id });
    res.send(`Show deleted: ${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

/**
 * Endpoint para actualizar la disponibilidad de asientos en un show.
 * Se espera recibir en el body:
 * {
 *    "seats": [
 *       { "seatId_": "65ce5d2d44e36689c0e61970" },
 *       { "seatId_": "..." }
 *    ]
 * }
 */
async function updateShowSeats(req, res, next) {
  const showId = req.params.id;
  const seatsToUpdate = req.body.seats;

  if (!seatsToUpdate || !Array.isArray(seatsToUpdate) || seatsToUpdate.length === 0) {
    return res.status(400).send("No seats provided");
  }

  // Extraemos los IDs de los asientos a actualizar
  const seatIds = seatsToUpdate.map(seat => seat.seatId_);

  try {
    const updatedShow = await Show.findByIdAndUpdate(
      showId, // ID del show a actualizar
      { $set: { "seats.$[elem].available": false } }, // Marcamos el asiento como no disponible
      {
        arrayFilters: [{ "elem._id": { $in: seatIds } }],
        new: true
      }
    );

    if (!updatedShow) {
      return res.status(404).send("Show not found");
    }
    res.send(updatedShow);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
