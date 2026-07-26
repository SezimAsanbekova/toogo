import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { LOCATIONS, difficultyLabel, seasonLabel } from "../../data/locations";
import LocationDetail from "./LocationDetail";

export function generateStaticParams() {
  return LOCATIONS.map((loc) => ({ id: String(loc.id) }));
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const loc = LOCATIONS.find((l) => l.id === Number(id));
  if (!loc) notFound();

  return <LocationDetail loc={loc} />;
}
