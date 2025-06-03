const express = require('express');
const identifyRouter = express.Router();
const knex = require('../db.js');

identifyRouter.post('/', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: 'email or phoneNumber required' });
  }

  const matchingContacts = await knex('contact')
    .where(function () {
      if (email) this.orWhere('email', email);
      if (phoneNumber) this.orWhere('phoneNumber', phoneNumber);
    })
    .andWhere('deletedAt', null);

  let primaryContact = null;

  if (matchingContacts.length > 0) {
    const allLinkedIds = new Set();
    matchingContacts.forEach(c => {
      allLinkedIds.add(c.linkedId || c.id);
    });

    const allRelatedContacts = await knex('contact')
      .whereIn('linkedId', [...allLinkedIds])
      .orWhereIn('id', [...allLinkedIds])
      .andWhere('deletedAt', null);

    primaryContact = allRelatedContacts.reduce((oldest, curr) => {
      return new Date(curr.createdAt) < new Date(oldest.createdAt) ? curr : oldest;
    });

    if (!matchingContacts.some(c => c.email === email && c.phoneNumber === phoneNumber)) {
      await knex('contact').insert({
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: 'secondary'
      });
    }

    const finalContacts = await knex('contact')
      .where(function () {
        this.where('id', primaryContact.id).orWhere('linkedId', primaryContact.id);
      })
      .andWhere('deletedAt', null);

    const response = {
      contact: {
        primaryContatctId: primaryContact.id,
        emails: [...new Set(finalContacts.map(c => c.email).filter(Boolean))],
        phoneNumbers: [...new Set(finalContacts.map(c => c.phoneNumber).filter(Boolean))],
        secondaryContactIds: finalContacts
          .filter(c => c.linkPrecedence === 'secondary')
          .map(c => c.id)
      }
    };

    return res.json(response);
  } else {
    const [newContact] = await knex('contact')
      .insert({
        email,
        phoneNumber,
        linkPrecedence: 'primary'
      })
      .returning('*');

    return res.json({
      contact: {
        primaryContatctId: newContact.id,
        emails: [newContact.email].filter(Boolean),
        phoneNumbers: [newContact.phoneNumber].filter(Boolean),
        secondaryContactIds: []
      }
    });
  }
});

module.exports = identifyRouter;
