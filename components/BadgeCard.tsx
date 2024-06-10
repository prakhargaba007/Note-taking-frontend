"use client";
import {
  Card,
  Text,
  Group,
  Badge,
  ActionIcon,
  Menu,
  useMantineTheme,
  rem,
} from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./BadgeCard.module.css";
import { IconDots } from "@tabler/icons-react";
import { UserMenu } from "./UserMenu";

export function BadgeCard({ params }) {
  const theme = useMantineTheme();
  const [data, setData] = useState({ title: "", description: "", date: "" });

  useEffect(() => {
    // Fetch data from the API
    fetch(`http://localhost:8080/feed/note/${params}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data.note);
        console.log(data.note);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [params]);

  function dataHandlers(data: Object) {
    console.log(data);
    setData(data);
  }

  const { title, description, date } = data;

  return (
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
  );
}