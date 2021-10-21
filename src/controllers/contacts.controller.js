const { NotFound } = require('http-errors');

const Contact = require('../models/contacts.model');

async function getContacts() {
  return Contact.find();
}

async function getContactById(contactId) {
  const user = await Contact.findById(contactId);
  if (!user) {
    throw new NotFound('User not found');
  }
  return user;
}

async function createContact(body) {
  return Contact.create(body);
}

async function removeContact(contactId) {
  const user = await Contact.findByIdAndDelete(contactId);
  if (!user) {
    throw new NotFound('User not found');
  }
}

async function updateContact(contactId, body) {
  const user = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!user) {
    throw new NotFound('User not found');
  }
  return user;
}

module.exports = {
  getContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
};
