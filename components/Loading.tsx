import React from "react";
import styles from "@/styles/Loader.module.css";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "5rem",
      }}
    >
      <span className={`${styles.loader}`}></span>
    </div>
  );
};

export default Loading;
