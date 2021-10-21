const express = require('express');
const router = express.Router();

const { validate, validateId } = require('../helpers/validate');
const {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require('../schemas/contacts.schema');

const controllerContacts = require('../controllers/contacts.controller');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await controllerContacts.getContacts();
    return res.status(200).send(contacts);
  } catch (err) {
    next(err);
  }
});

router.get('/:contactId', validateId, async (req, res, next) => {
  try {
    const contact = await controllerContacts.getContactById(
      req.params.contactId,
    );
    return res.status(200).send(contact);
  } catch (err) {
    next(err);
  }
});

router.post('/', validate(createContactSchema), async (req, res, next) => {
  try {
    const newContact = await controllerContacts.createContact(req.body);
    return res.status(201).send(newContact);
  } catch (err) {
    next(err);
  }
});

router.delete('/:contactId', validateId, async (req, res, next) => {
  try {
    await controllerContacts.removeContact(req.params.contactId);
    return res.status(200).send({ message: 'contact deleted' });
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/:contactId',
  validate(updateContactSchema),
  validateId,
  async (req, res, next) => {
    try {
      const updatedContact = await controllerContacts.updateContact(
        req.params.contactId,
        req.body,
      );
      return res.status(200).send(updatedContact);
    } catch (err) {
      next(err);
    }
  },
);

router.patch(
  '/:contactId/favorite',
  validate(updateFavoriteSchema),
  validateId,
  async (req, res, next) => {
    try {
      const updatedContact = await controllerContacts.updateContact(
        req.params.contactId,
        req.body,
      );
      return res.status(200).send(updatedContact);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
