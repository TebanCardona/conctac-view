import md5 from "md5";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { IContact, IMember, ISend, ListOptions } from "../../../types/contact";

mailchimp.setConfig({
  apiKey: process.env.NEXT_PUBLIC_apikey,
  server: process.env.NEXT_PUBLIC_server,
});
const listId = process.env.NEXT_PUBLIC_listid || "";
const organize = (data: { members: [IMember] }) => {
  return data.members.map((el: IMember) => {
    const member: IContact = {
      firtsName: el.merge_fields.FNAME,
      lastName: el.merge_fields.LNAME,
      systemRecordId: el.contact_id,
      dateChanged: el.last_changed,
      status: el.status,
      email: {
        address: el.email_address,
        dateChange: el.merge_fields.EADC,
      },
      tva: {
        value: el.merge_fields.TVA,
        dateChanged: el.merge_fields.TVADC,
      },
      address: {
        line1: el.merge_fields.ADDRESS1,
        line2: el.merge_fields.ADDRESS2,
        city: el.merge_fields.CITY,
        zip: el.merge_fields.ZIP,
        state: el.merge_fields.STATE,
        country: el.merge_fields.COUNTRY,
      },
      phone: {
        number: el.merge_fields.PHONE,
        dateChanged: el.merge_fields.PDC,
      },
    };
    return member;
  });
};
export async function get(id?: string | null, opt?: ListOptions) {
  try {
    if (typeof id === "string") {
      const hashId = md5(id.toLowerCase());
      const res = await mailchimp.lists.getListMember(listId, hashId);
      if ("id" in res) {
        return organize({ members: [res] });
      }
    }
    const res = await mailchimp.lists.getListMembersInfo(listId, opt);
    if ("members" in res) {
      return organize(res);
    }
  } catch (error) {
    throw { message: "Error of Mailchimp", error };
  }
}

export async function post(contact: ISend) {
  try {
    const date = new Date().toDateString();
    contact.merge_fields.EADC = date;
    contact.merge_fields.TVADC = date;
    if (contact.merge_fields.PHONE !== "") contact.merge_fields.PDC = date;
    const res = await mailchimp.lists.addListMember(listId, contact);
    if ("id" in res) {
      return "Success";
    }
    return "Reject";
  } catch (error) {
    throw { message: "Error of Mailchimp", error };
  }
}

export async function patch(contact: ISend) {
  try {
    const date = new Date().toDateString();
    const hash = md5(contact.email_address.toLowerCase());
    const conct = (await get(contact.email_address)) as IContact[];
    conct[0].email.address !== contact.email_address
      ? contact.merge_fields.EADC !== date
      : null;
    conct[0].phone?.number !== contact.merge_fields.PHONE
      ? (contact.merge_fields.PDC = date)
      : null;
    conct[0].tva?.value !== contact.merge_fields.TVA
      ? (contact.merge_fields.TVADC = date)
      : null;
    const res = await mailchimp.lists.updateListMember(listId, hash, contact);
    if ("id" in res) {
      return "Success";
    }
    return "Reject";
  } catch (error) {
    throw { message: "Error of Mailchimp", error };
  }
}
export async function del(id: string) {
  try {
    const hash = md5(id.toLowerCase());
    await mailchimp.lists.deleteListMember(listId, hash);
    return "Success";
  } catch (error) {
    throw { message: "Error of Mailchimp", error };
  }
}

export async function delPermanent(id: string) {
  try {
    const hash = md5(id.toLocaleLowerCase());
    await mailchimp.lists.deleteListMemberPermanent(listId, hash);
    return "Success";
  } catch (error) {
    throw { message: "Error of mailchimp", error };
  }
}
