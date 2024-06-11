"use client";
import { useState, useEffect } from "react";
import cx from "clsx";
import { rem, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import classes from "./DndListHandle.module.css";
import Link from "next/link";

interface Note {
  _id: string;
  title: string;
  date: string;
}

interface DndListHandleProps {
  note: Note;
}

export function DndListHandle({ note }: DndListHandleProps) {
  const [data, setData] = useState<Note[]>([]); // Explicit type annotation for data
  const [loading, setLoading] = useState<boolean>(true); // Explicit type annotation for loading
  const [state, handlers] = useListState<Note>([]); // Explicitly providing the generic type Note to useListState
  // console.log(state);

  const token = localStorage.getItem("token");
  // console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

  useEffect(() => {
    // Fetch data from the API

    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/feed/notes", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData.notes);
        handlers.setState(jsonData.notes);
        // console.log(state);
        console.log(jsonData);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    // Perform actions after state update
    const prepend = () => handlers.prepend(note);
    prepend();

    // console.log(note);
    // console.log(state);
  }, [note]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (state.length === 0) {
    return <div>No data found.</div>;
  }

  const items = state.map((item: Note, index) => (
    <Draggable key={item._id} index={index} draggableId={item._id}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </div>
          <Link href={`/${item._id}`}>
            <Text className={classes.symbol}>{item.title}</Text>
          </Link>
          <Link href={`/${item._id}`}>
            <div>
              <Text>{item.title}</Text>
              <Text c="dimmed" size="sm">
                Date: {item.date}
              </Text>
            </div>
          </Link>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index || 0 })
      }
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div
            className={classes.dnd}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
