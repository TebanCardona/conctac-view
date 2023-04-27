import React from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
export default function Dele(props: { email: string }) {
  const router = useRouter();
  const [state, setState] = React.useState({
    del: false,
    deleted: false,
    message: "",
  });
  const togglePopup = () => {
    setState((prev) => ({
      ...prev,
      del: !state.del,
    }));
  };
  const handleDelete = () => {
    togglePopup();
  };
  const confirmDelete = () => {
    const options = {
      method: "DELETE",
      url: "http://localhost:3000/api/mailchimp",
      params: { id: props.email },
    };

    axios
      .request(options)
      .then(function (response) {
        setState((prev) => ({
          ...prev,
          del: false,
          deleted: true,
          message: response.data.message,
        }));
      })
      .catch(function (error) {
        setState((prev) => ({
          ...prev,
          del: false,
          deleted: true,
          message: error.response.data.message,
        }));
      });
  };
  const permanDelete = () => {
    const options = {
      method: "POST",
      url: "http://localhost:3000/api/mailchimp/delete",
      params: { id: props.email },
    };

    axios
      .request(options)
      .then(function (response) {
        setState((prev) => ({
          ...prev,
          del: false,
          deleted: true,
          message: response.data.message,
        }));
      })
      .catch(function (error) {
        setState((prev) => ({
          ...prev,
          del: false,
          deleted: true,
          message: error.response.data.message,
        }));
      });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        position: "relative",
        zIndex: "0",
      }}
    >
      <button onClick={handleDelete}>
        <span>Delete</span>
      </button>
      <div style={{ position: "absolute", zIndex: "1" }}>
        {state.del && (
          <div>
            <p style={{ fontSize: "x-large", color: "#e0e1dd" }}>
              Are you sure you want to delete this contact?
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button onClick={togglePopup}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
              <button onClick={permanDelete}>Remove Permanent</button>
            </div>
          </div>
        )}
        {state.deleted && (
          <div>
            <p
              style={{
                fontSize: "x-large",
                color: "#e0e1dd",
                textAlign: "center",
              }}
            >
              {state.message}
            </p>
            <button
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  message: "",
                  deleted: false,
                }));
                router.push("/");
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
      <Link href={`/contact/edit?id=${props.email}`}>
        <button>Edit</button>
      </Link>
    </div>
  );
}
