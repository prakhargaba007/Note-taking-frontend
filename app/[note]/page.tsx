import { BadgeCard } from "@/components/BadgeCard";

export default function card({ params }) {
  return <BadgeCard params={params.note} />;
}
