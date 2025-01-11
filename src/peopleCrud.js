export const insertPerson = async (collection, person) => {
    await collection.insertOne(person);
}

export const getAllPerson = async (collection) => {
    return await collection.find().toArray();
}

export const getPerson = async(collection, emailId) => {
    return await collection.find({ email: emailId }).collation({ locale: 'en', strength: 2 }).toArray();
}

export const updatePerson = async (collection, email, person) => {
    await collection.updateMany({ email: email }, { $set: person });
}

export const deletePerson = async (collection, person) => {
    await collection.deleteMany({ email: person.email });
}

