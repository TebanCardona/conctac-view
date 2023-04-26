import { IContact } from "@/types/contact";
import { Row } from "@/pages/api/mailchimp/csv/cvsToArray";
export function convertToCSV(conctact: IContact[]) {
  const arr = conctact.map((el) => ({
    "First name": el.firtsName ? el.firtsName : "None",
    "Last/Organization/Group/Household name": el.lastName
      ? el.lastName
      : "None",
    "System record ID": el.systemRecordId ? el.systemRecordId : "None",
    "Date changed": el.dateChanged ? el.dateChanged : "None",
    "Email Addresses\\Email address": el.email.address
      ? el.email.address
      : "None",
    "Email Addresses\\Date changed": el.email.dateChange
      ? el.email.dateChange
      : "None",
    "Todays Visitors Attribute\\Value": el.tva?.value ? el.tva?.value : "No",
    "Todays Visitors Attribute\\Date changed": el.tva?.dateChanged
      ? el.tva?.dateChanged
      : "None",
    "Addresses\\Address line 1": el.address?.line1 ? el.address?.line1 : "None",
    "Addresses\\Address line 2": el.address?.line2 ? el.address?.line2 : "None",
    "Addresses\\City": el.address?.city ? el.address?.city : "None",
    "Addresses\\ZIP": el.address?.zip ? el.address?.zip : "None",
    "Addresses\\State abbreviation": el.address?.state
      ? el.address?.state
      : "None",
    "Addresses\\Country abbreviation": el.address?.country
      ? el.address?.country
      : "None",
    "Phones\\Number": el.phone?.number ? el.phone?.number : "None",
    "Phones\\Date changed": el.phone?.dateChanged
      ? el.phone?.dateChanged
      : "None",
  })) as Row[];
  const header = Object.keys(arr[0]).join(",");
  const rows = arr.map((obj) => Object.values(obj).join(","));
  return `${header}\n${rows.join("\n")}`;
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
