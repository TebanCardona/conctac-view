import { ISend } from "@/types/contact";
import { post } from "../exports";

export interface Row {
  "First name": string;
  "Last/Organization/Group/Household name": string;
  "System record ID": string;
  "Date changed": string;
  "Email Addresses\\Email address": string;
  "Email Addresses\\Date changed": string;
  "Todays Visitors Attribute\\Value": "Yes" | "No" | string;
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
async function csvToArray(file: {}) {
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
      const contact: ISend = {
        email_address: obj["Email Addresses\\Email address"]
          ? obj["Email Addresses\\Email address"]
          : "Email not found",
        status: "subscribed",
        merge_fields: {
          ADDRESS1: obj["Addresses\\Address line 1"],
          ADDRESS2: obj["Addresses\\Address line 2"],
          CITY: obj["Addresses\\City"],
          COUNTRY: obj["Addresses\\Country abbreviation"],
          STATE: obj["Addresses\\State abbreviation"],
          ZIP: obj["Addresses\\ZIP"].length < 5 ? obj["Addresses\\ZIP"] : "",
          EADC: obj["Email Addresses\\Date changed"],
          FNAME: obj["First name"],
          LNAME: obj["Last/Organization/Group/Household name"],
          PDC: obj["Phones\\Date changed"],
          PHONE: obj["Phones\\Number"],
          TVADC: obj["Todays Visitors Attribute\\Date changed"],
          TVA: obj["Todays Visitors Attribute\\Value"],
        },
      };
      result.push(contact);
    }
    return result;
  } catch (error) {
    return { message: "File Not read", error };
  }
}

export const sendToMailchimp = async (file: string) => {
  const data = (await csvToArray(file)) as ISend[] | { message: string };
  if (Array.isArray(data)) {
    const dataError: { email: string }[] = [];
    const totalContacts = data.length;
    let uploadedContacts = 0;
    let i = 0;
    while (data.length > i) {
      const info = data.shift() as ISend;
      try {
        await post(info);
        ++uploadedContacts;
      } catch (error) {
        dataError.push({ email: info.email_address });
      } finally {
      }
    }

    return {
      message: `Uploaded ${uploadedContacts} of ${totalContacts}`,
      dataError,
    };
  }
  return data;
};
