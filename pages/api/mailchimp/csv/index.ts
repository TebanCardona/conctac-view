import { ISend } from "@/types/contact";
import type { NextApiRequest, NextApiResponse } from "next";
import { Row, csvToArray } from "./cvsToArray";
import { post } from "../exports";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const dataError = [];
      const data = (await csvToArray(req.body)) as unknown as Row[];
      const totalContacts = data.length;
      let uploadedContacts = 0;
      let i = 0;
      while (data.length > i) {
        try {
          const info = data.shift() as Row;
          const contact: ISend = {
            email_address: info["Email Addresses\\Email address"],
            status: "subscribed",
            merge_fields: {
              ADDRESS1: info["Addresses\\Address line 1"],
              ADDRESS2: info["Addresses\\Address line 2"],
              CITY: info["Addresses\\City"],
              COUNTRY: info["Addresses\\Country abbreviation"],
              STATE: info["Addresses\\State abbreviation"],
              ZIP: info["Addresses\\ZIP"],
              EADC: info["Email Addresses\\Date changed"],
              FNAME: info["First name"],
              LNAME: info["Last/Organization/Group/Household name"],
              PDC: info["Phones\\Date changed"],
              PHONE: info["Phones\\Number"],
              TVADC: info["Todays Visitors Attribute\\Date changed"],
              TVA: info["Todays Visitors Attribute\\Value"],
            },
          };
          await post(contact);
          i++;
          uploadedContacts++;
        } catch (error) {
          if (data.length > 0) {
            dataError.push({
              email: data[i]["Email Addresses\\Email address"]
                ? data[i]["Email Addresses\\Email address"]
                : "Email Not Found",
            });
          }
          i++;
        }
      }
      res.json({
        message: `Uploaded ${uploadedContacts} of ${totalContacts}`,
        dataError,
      });
    } catch (error) {
      return res.status(500).json({ message: "File Not read", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
