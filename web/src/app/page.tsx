import { EventRecord, ProductRecord } from "@/lib/types";
import { events as mockEvents, products as mockProducts } from "@/lib/mock-data";
import HomePageClient from "@/components/home-page-client";

const featuredCelebs = [
  {
    name: "Aria Vel",
    bio: "Silver-screen energy, sold-out headline shows, and intentional collector drops.",
    eventsHref: "/events?celebrity=aria-vel",
    merchHref: "/fan-cards?celebrity=aria-vel",
  },
  {
    name: "Nova Rae",
    bio: "A cinematic performer with immersive fan-first experiences and early access perks.",
    eventsHref: "/events?celebrity=nova-rae",
    merchHref: "/fan-cards?celebrity=nova-rae",
  },
];

function selectFeaturedEvents(events: EventRecord[]) {
  return [...events]
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt))
    .slice(0, 6);
}

function selectFeaturedFanCards(products: ProductRecord[]) {
  return products.slice(0, 4);
}

export default function Home() {
  const featuredEvents = selectFeaturedEvents(mockEvents);
  const featuredFanCards = selectFeaturedFanCards(mockProducts);

  return <HomePageClient events={featuredEvents} fanCards={featuredFanCards} />;
}
