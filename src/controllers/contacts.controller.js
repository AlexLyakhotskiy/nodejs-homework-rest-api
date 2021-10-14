const { NotFound } = require('http-errors');

const modelContacts = require('../models/contacts.model');

async function getContacts() {
  const result = await modelContacts.listContacts();
  return result;
}

async function getContactById(contactId) {
  const user = await modelContacts.getContactById(contactId);
  if (!user) {
    throw new NotFound('User not found');
  }
  return user;
}

async function createContact(body) {
  const result = await modelContacts.addContact(body);
  return result;
}

async function removeContact(contactId) {
  const user = await modelContacts.getContactById(contactId);
  if (!user) {
    throw new NotFound('User not found');
  }
  await modelContacts.removeContact(contactId);
}

async function updateContact(contactId, body) {
  const user = await modelContacts.getContactById(contactId);
  if (!user) {
    throw new NotFound('User not found');
  }
  const updatedContact = await modelContacts.updateContact(contactId, body);
  return updatedContact;
}

module.exports = {
  getContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
};
