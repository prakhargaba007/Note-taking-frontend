"use client";
import Date from "@/components/Date";
import { DndListHandle } from "@/components/DndListHandle";
import LoginOrSignUpPage from "@/components/LoginOrSignUpPage";
import classes from "./page.module.css";

import { useEffect, useState } from "react";

const displayMessage = (message, duration = 60000) => {
  // alert(message);
  // setTimeout(() => {
  //   alert("Thank you for waiting!");
  // }, duration);
};

// Display a message when the component mounts
displayMessage("Kindly wait for one minute, gathering information....");

export default function Home() {
  const [note, setNote] = useState({});
  const isLoggedIn =
    typeof window !== "undefined" &&
    !!localStorage.getItem("userId") &&
    !!localStorage.getItem("token");

  function dataHandler(data) {
    setNote(data);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/feed/")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          // Process fetched data if needed
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  return (
    <div className={classes.container}>
      {isLoggedIn ? (
        <>
          <Date dataHandler={dataHandler} />
          <DndListHandle note={note} />
        </>
      ) : (
        <LoginOrSignUpPage />
      )}
    </div>
  );
}
