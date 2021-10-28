const express = require('express');
const router = express.Router();

const { validate, validateId } = require('../helpers/validate');
const {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require('./contacts.schema');

const { authorize } = require('../users/authorize.middleware');

const controllerContacts = require('./contacts.controller');

router.get('/', authorize, async (req, res, next) => {
  try {
    const contacts = await controllerContacts.getContacts(
      req.user._id,
      req.query,
    );
    return res.status(200).send(contacts);
  } catch (err) {
    next(err);
  }
});

router.get('/:contactId', authorize, validateId, async (req, res, next) => {
  try {
    const _id = req.params.contactId;
    const owner = req.user._id;
    const contact = await controllerContacts.getContactById({ _id, owner });
    return res.status(200).send(contact);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  authorize,
  validate(createContactSchema),
  async (req, res, next) => {
    try {
      const { user, body } = req;
      const newContact = await controllerContacts.createContact({
        ...body,
        owner: user._id,
      });
      return res.status(201).send(newContact);
    } catch (err) {
      next(err);
    }
  },
);

router.delete('/:contactId', authorize, validateId, async (req, res, next) => {
  try {
    const _id = req.params.contactId;
    const owner = req.user._id;
    await controllerContacts.removeContact({ _id, owner });
    return res.status(200).send({ message: 'contact deleted' });
  } catch (err) {
    next(err);
  }
});

router.patch(
  '/:contactId',
  authorize,
  validate(updateContactSchema),
  validateId,
  async (req, res, next) => {
    try {
      const _id = req.params.contactId;
      const owner = req.user._id;
      const updatedContact = await controllerContacts.updateContact(
        { _id, owner },
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
