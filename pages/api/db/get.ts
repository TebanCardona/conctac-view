import { run } from ".";

export async function get(id?: number) {
  try {
    const myColl = await run();
    if (id) {
      const contact = await myColl.findOne({ id });
      return contact;
    }
    const contacts = await myColl.find();
    return contacts;
  } catch (error) {
    throw `Error ${error}`;
  }
}
