import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Status, ISend, IContact } from "@/types/contact";
interface IForm {
  [key: string]: any;
  first_Name?: string;
  last_Name?: string;
  email: string;
  tva?: "Yes" | "No";
  line_1?: string;
  line_2?: string;
  city?: string;
  zip: number | "" | string;
  state?: string;
  country?: string;
  number?: string;
  status: Status;
}
interface IRes {
  message: string | null;
}
export default function Form(props?: { contact?: IContact }) {
  const data = {
    name: [
      "first_Name",
      "last_Name",
      "line_1",
      "line_2",
      "city",
      "state",
      "country",
    ],
    status: [
      "subscribed",
      "unsubcribed",
      "cleaned",
      "pending",
      "transactional",
    ],
  };
  const contact = props?.contact;
  const [formData, setFormData] = useState<IForm>({
    first_Name: contact?.firtsName ? contact.firtsName : "",
    last_Name: contact?.lastName ? contact.lastName : "",
    email: contact?.email.address ? contact.email.address : "",
    tva: contact?.tva?.value ? contact.tva.value : "No",
    line_1: contact?.address?.line1 ? contact.address?.line1 : "",
    line_2: contact?.address?.line2 ? contact.address?.line2 : "",
    city: contact?.address?.city ? contact.address?.city : "",
    zip: contact?.address?.zip ? contact.address?.zip : "",
    state: contact?.address?.state ? contact?.address?.state : "",
    country: contact?.address?.country ? contact.address?.country : "",
    number: contact?.phone?.number ? contact.phone?.number : "",
    status: contact?.status ? contact.status : "subscribed",
  });
  const [res, setRes] = useState<IRes>({ message: null });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.zip?.toString().length <= 4 && formData.zip !== "") {
      setRes((prev) => ({
        ...prev,
        message: "The zip code must be 5 numbers!",
      }));
      return;
    }
    const contact: ISend = {
      email_address: formData.email,
      status: formData.status,
      merge_fields: {
        FNAME: formData.first_Name,
        LNAME: formData.last_Name,
        ADDRESS1: formData.line_1,
        ADDRESS2: formData.line_2,
        PHONE: formData.number,
        TVA: formData.tva,
        CITY: formData.city,
        COUNTRY: formData.country,
        ZIP: formData.zip === "" ? "" : formData.zip,
        STATE: formData.state,
      },
    };
    const options = props?.contact?.email.address
      ? {
          method: "PATCH",
          url: "http://localhost:3000/api/mailchimp",
          data: contact,
          params: { id: props.contact.email.address },
        }
      : {
          method: "POST",
          url: "http://localhost:3000/api/mailchimp",
          data: contact,
        };

    axios
      .request(options)
      .then(function (response) {
        setRes((prev) => ({
          ...prev,
          message: response.data.message,
        }));
      })
      .catch(function (error) {
        setRes((prev) => ({
          ...prev,
          message: error.response.data.message,
        }));
      });
  };
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {" "}
        <div>
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {data.name.map((el) => {
          return (
            <div key={el}>
              <label htmlFor={el} style={{ textTransform: "capitalize" }}>
                {el.replace("_", " ")}
              </label>
              <input
                type="text"
                name={el}
                id={el}
                value={formData[el]}
                onChange={handleChange}
              />
            </div>
          );
        })}
        <div>
          <label htmlFor="Today Visators Attribute">
            Today Visators Attribute
          </label>
          <select
            name="tva"
            id="tva"
            value={formData.tva}
            onChange={handleChange}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div>
          <label htmlFor="Status">Status</label>
          <select name="status" id="status" required>
            {data.status.map((el) => (
              <option
                value={el}
                key={el}
                style={{ textTransform: "capitalize" }}
              >
                {el}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="Phone Number">Phone Number</label>
          <input
            type="tel"
            name="number"
            id="number"
            value={formData.number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="ZIP Code">ZIP Code</label>
          <input
            type="number"
            name="zip"
            id="zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>{res.message}</p>
    </div>
  );
}
