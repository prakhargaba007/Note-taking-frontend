import React from "react";
import { BadgeCard } from "@/components/BadgeCard";

interface CardProps {
  params: {
    note: string; // Adjust the type according to what `params.note` actually is.
  };
}

const Card: React.FC<CardProps> = ({ params }) => {
  return <BadgeCard params={params.note} />;
};

export default Card;
