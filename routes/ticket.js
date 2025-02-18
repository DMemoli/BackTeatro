const express = require('express')

const Ticket = require('../schemas/ticket')
const Show = require('../schemas/show')


const router = express.Router()

router.get('/', getAllTickets)
router.get('/:id', getTicketById)
router.get('/client/:id', getTicketByClient)
router.post('/', createTicket)
router.put('/:id', updateTicket)
router.delete('/:id', deleteTicket)

async function getAllTickets(req, res, next) {
  // console.log('getAllUsers by user ', req.user._id)   //consulta que usuario esta haciendo la consulta
  try {
    const tickets = await Ticket.find()
    res.send(tickets)
  } catch (err) {
    next(err)
  }
}

async function getTicketById(req, res, next) {
  console.log('getTicket with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket || ticket.length == 0) {
      res.status(404).send('Ticket not found')
    }

    res.send(ticket)
  } catch (err) {
    next(err)
  }
}

async function getTicketByClient(req, res, next) {
  console.log('getTickets for client with id: ', req.params.id);

  if (!req.params.id) {
    return res.status(500).send('The param id is not defined');
  }

  try {
    const tickets = await Ticket.find({ cliente: req.params.id });
    
    if (!tickets || tickets.length === 0) {
      return res.status(404).send('Tickets not found');
    }

    res.send(tickets);
  } catch (err) {
    next(err);
  }
}



async function createTicket(req, res, next) {
  console.log('createTicket ', req.body);
  const ticket = req.body;
  try {
    // Crear el ticket
    const ticketCreated = await Ticket.create(ticket);

    // Buscar el show por ID
    const showToUpdate = await Show.findById(ticket.showId);
    if (!showToUpdate) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Actualizar la disponibilidad de los asientos
    showToUpdate.seats.forEach((s) => {
      ticket.seats.forEach((t) => {
        if (s._id.toString() === t.seatId_) {
          s.available = false;
        }
      });
    });

    // Indicar que el array seats fue modificado
    showToUpdate.markModified('seats');

    // Guardar cambios
    await showToUpdate.save();

    console.log('Show updated: ', showToUpdate);
    res.send(ticketCreated);
  } catch (err) {
    next(err);
  }
}



async function updateTicket(req, res, next) {
  console.log('updateTicket with id: ', req.params.id)

  if (!req.params.id) {
    return res.status(404).send('Parameter id not found')
  }

  /*if (!req.isAdmin() && req.params.id != req.user._id) {
    return res.status(403).send('Unauthorized')
  }*/

  // The email can't be updated
  delete req.body.name

  try {
    const showToUpdate = await Ticket.findByPlay(req.params.id)

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

async function deleteTicket(req, res, next) {
  console.log('delete ticket with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
  }

  try {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      res.status(404).send('User not found')
    }

    await Ticket.deleteOne({ _id: req.params.id })

    res.send(`Ticket deleted :  ${req.params.id}`)

      // Buscar el show por ID
  const showToUpdate = await Show.findById(ticket.showId);
  if (!showToUpdate) {
    return res.status(404).json({ message: 'Show not found' });
  }

  // Actualizar la disponibilidad de los asientos
  showToUpdate.seats.forEach((s) => {
    ticket.seats.forEach((t) => {
      if (s._id.toString() === t.seatId_) {
        s.available = true;
      }
    });
  });

  // Indicar que el array seats fue modificado
  showToUpdate.markModified('seats');

  // Guardar cambios
  await showToUpdate.save();

  } catch (err) {
    next(err)
  }


}

module.exports = router
