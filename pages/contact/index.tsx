import { useRouter } from "next/router";
import Link from "next/link";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "../context/context";

const Contact = () => {
  const context = useContext(Context);
  const router = useRouter();
  const { id } = router.query;
  const contact = context.state.contact;
  const un = <i>Unknown</i>;
  useEffect(() => {
    if (id) {
      const options = {
        method: "GET",
        url: `http://localhost:3000/api/mailchimp?id=${id}`,
      };
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          context.dispatch({ type: "contact", payload: response.data[0] });
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    return () => {
      context.dispatch({
        type: "contact",
        payload: {
          systemRecordId: "",
          dateChanged: "",
          email: { address: "" },
        },
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Link href={`/`}>Back</Link>
      <p>Contact: {id}</p>
      <p>Firts Name: {contact.firtsName ? contact.firtsName : un}</p>
      <p>Last Name: {contact.lastName ? contact.lastName : un}</p>
      <p>
        System Record Id: {contact.systemRecordId ? contact.systemRecordId : un}
      </p>
      <p>Last Date Changed: {contact.dateChanged.split("T")[0]}</p>
      <p>
        Email Date Changed:{" "}
        {contact.email.dateChange ? contact.email.dateChange.split("T")[0] : un}
      </p>
      <h5>Phone</h5>
      <p>Number: {contact.phone?.number ? contact.phone.number : un}</p>
      <p>
        Phone Date Changed:{" "}
        {contact.phone?.dateChanged ? contact.phone.dateChanged : un}
      </p>
      <h5>Address</h5>
      <p>Country: {contact.address?.country ? contact.address.country : un}</p>
      <p>City: {contact.address?.city ? contact.address.city : un}</p>
      <p>State: {contact.address?.state ? contact.address.state : un}</p>
      <p>Line1: {contact.address?.line1 ? contact.address.line1 : un}</p>
      <p>Line2: {contact.address?.line2 ? contact.address.line2 : un}</p>
      <p>Zip Code: {contact.address?.zip ? contact.address.zip : un}</p>
      <h5>Todays Visitors Attribute</h5>
      <p>TVA: {contact.tva?.value ? contact.tva.value : un}</p>
      <p>
        TVA Date Changed:{" "}
        {contact.tva?.dateChanged ? contact.tva.dateChanged : un}
      </p>
    </>
  );
};

export default Contact;
