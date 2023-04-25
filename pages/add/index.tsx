import React, { useEffect, useState } from "react";
import Link from "next/link";

interface IForm {
  [key: string]: any;
  first_Name?: "";
  last_Name?: string;
  email?: string;
  tva?: "Yes" | "No";
  line_1?: string;
  line_2?: string;
  city?: string;
  zip?: number;
  state?: string;
  country?: string;
  number?: number;
}
export default function Add() {
  const data = [
    "first_Name",
    "last_Name",
    "line_1",
    "line_2",
    "city",
    "state",
    "country",
  ];
  const [formData, setFormData] = useState<IForm>({
    first_Name: "",
    last_Name: "",
    email: "",
    tva: "No",
    line_1: "",
    line_2: "",
    city: "",
    zip: 0,
    state: "",
    country: "",
    number: 0,
  });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
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
      <Link href={`/`}>
        <p>Back</p>
      </Link>
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
        {data.map((el) => {
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
    </div>
  );
}
