const { NotFound } = require('http-errors');

const Contact = require('./contacts.model');

async function getContacts(userId, queryParams) {
  let { favorite, page = 1, limit = 4 } = queryParams;
  const query = { owner: userId };

  if (favorite) query.favorite = favorite;

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
