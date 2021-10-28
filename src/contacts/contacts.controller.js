const { NotFound } = require('http-errors');

const Contact = require('./contacts.model');

async function getContacts(userId, queryParams) {
  let { favorite, page, limit } = queryParams;
  const query = { owner: userId };

  if (favorite && favorite === ('false' || 'true')) query.favorite = favorite;
  if (isNaN(+limit)) limit = 10;
  if (isNaN(+page)) page = 1;
  if (limit > 50) limit = 50;
  if (limit < 4) limit = 4;

  const result = await Contact.paginate(query, { page, limit });

  const { docs: contacts } = result;
  delete result.docs;

  return { contacts, ...result };
}

async function getContactById(contactAndUserId) {
  const user = await Contact.findOne(contactAndUserId);
  if (!user) {
    throw new NotFound('User not found');
  }

  return user;
}

async function createContact(params) {
  return Contact.create(params);
}

async function removeContact(contactAndUserId) {
  const user = await Contact.findOneAndRemove(contactAndUserId);
  if (!user) {
    throw new NotFound('User not found');
  }
}

async function updateContact(contactAndUserId, body) {
  const user = await Contact.findOneAndUpdate(contactAndUserId, body, {
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
