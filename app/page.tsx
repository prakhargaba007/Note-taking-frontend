"use client";
import Date from "@/components/Date";
import { DndListHandle } from "@/components/DndListHandle";

import { useState } from "react";

export default function Home() {
  const [note, setNote] = useState({});
  function dataHandler(data: object) {
    setNote(data);
    // console.log(data);
  }
  return (
    <>
      <Date dataHandler={dataHandler} />
      <DndListHandle note={note} />
    </>
  );
}
