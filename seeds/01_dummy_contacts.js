
exports.seed = async function(knex) {
  await knex('contact').del();

  // Step 1: Insert primary contacts
  const primaryContacts = [];
  for (let i = 0; i < 10; i++) {
    primaryContacts.push({
      phoneNumber: `90000000${i}`,
      email: `primary${i}@example.com`,
      linkedId: null,
      linkPrecedence: 'primary',
      createdAt: new Date(Date.now() - (i + 1) * 86400000), // i days ago
      updatedAt: new Date(),
      deletedAt: null
    });
  }
  const primaryIds = await knex('contact').insert(primaryContacts).returning('id');

  // Step 2: Insert secondary contacts linked to primary contacts
  const secondaryContacts = [];
  for (let i = 0; i < 40; i++) {
    const primaryIndex = Math.floor(i / 4); // 4 secondary per primary
    secondaryContacts.push({
      phoneNumber: `80000000${i}`,
      email: `secondary${i}@example.com`,
      linkedId: primaryIds[primaryIndex].id || primaryIds[primaryIndex],
      linkPrecedence: 'secondary',
      createdAt: new Date(Date.now() - (i + 11) * 86400000), // i+11 days ago
      updatedAt: new Date(),
      deletedAt: null
    });
  }
  await knex('contact').insert(secondaryContacts);
};
