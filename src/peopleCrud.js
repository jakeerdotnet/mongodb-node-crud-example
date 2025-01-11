export const insertPerson = async (collection, person) => {
    await collection.insertOne(person);
}

export const getAllPerson = async (collection) => {
    return collection.find().toArray();
}

export async function getPerson(collection, person) {
    return collection.find(person).toArray();
}

export const updatePerson = async (collection, email, person) => {
    await collection.updateMany({ email: email }, { $set: person });
}

export const deletePerson = async (collection, personId) => {
    await collection.deleteMany({ personId });
}

