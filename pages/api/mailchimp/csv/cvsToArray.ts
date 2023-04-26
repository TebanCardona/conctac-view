export interface Row {
  "First name": string;
  "Last/Organization/Group/Household name": string;
  "System record ID": string;
  "Date changed": string;
  "Email Addresses\\Email address": string;
  "Email Addresses\\Date changed": string;
  "Todays Visitors Attribute\\Value": "Yes" | "No";
  "Todays Visitors Attribute\\Date changed": string;
  "Addresses\\Address line 1": string;
  "Addresses\\Address line 2": string;
  "Addresses\\City": string;
  "Addresses\\ZIP": string;
  "Addresses\\State abbreviation": string;
  "Addresses\\Country abbreviation": string;
  "Phones\\Number": string;
  "Phones\\Date changed": string;
}
interface Obj {
  [key: string]: string;
}
export async function csvToArray(file: {}) {
  try {
    const csv = Object.keys(file)[0];
    const lines = csv.split("\n");
    const result = [];
    const headers: string[] = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
      const obj: Obj = {};
      const currentline = lines[i].split(",");
      for (let j: number = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  } catch (error) {
    throw { error };
  }
}
