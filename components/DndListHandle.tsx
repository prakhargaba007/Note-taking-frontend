"use client";
import { useState, useEffect } from "react";
import cx from "clsx";
import { rem, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";
import classes from "./DndListHandle.module.css";
import Link from "next/link";

export function DndListHandle({ note }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, handlers] = useListState(data);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:8080/feed/notes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData.notes);
        handlers.setState(jsonData.notes);
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

    console.log(note);
    console.log(state);
  }, [note]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data found.</div>;
  }

  const items = state.map((item, index) => (
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
              <Text>{item.description}</Text>
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
