"use client";
import { Card, Text, Group, Badge, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./BadgeCard.module.css";
import { UserMenu } from "./UserMenu";

interface BadgeCardProps {
  params: string; // Adjust the type if `params` is not a string
}

interface NoteData {
  title: string;
  description: string;
  date: string;
}

export function BadgeCard({ params }: BadgeCardProps) {
  const theme = useMantineTheme();
  const [data, setData] = useState<NoteData>({
    title: "",
    description: "",
    date: "",
  });

  // Check if localStorage is available before using it
  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    // Only fetch data if token is available
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feed/note/${params}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setData(data.note);
          console.log(data.note);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [params, token]);

  function dataHandlers(data: NoteData) {
    console.log(data);
    setData(data);
  }

  const { title, description, date } = data;

  return (
    <div className={classes.container}>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section} mt="md">
          <Group justify="apart">
            <Text fz="lg" fw={500}>
              {title}
            </Text>
            <Badge size="sm" variant="light">
              {date}
            </Badge>
            <UserMenu dataHandlers={dataHandlers} params={params} />
          </Group>
          <Text fz="sm" mt="xs">
            {description}
          </Text>
        </Card.Section>
      </Card>
    </div>
  );
}
