import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Dimensions } from "@/components/sections/Dimensions";
import { GameModes } from "@/components/sections/GameModes";
import { Crafting } from "@/components/sections/Crafting";
import { Gallery } from "@/components/sections/Gallery";
import { Jukebox } from "@/components/sections/Jukebox";
import { Footer } from "@/components/sections/Footer";

const TITLE = "Minecraft: Бесконечные Миры — от первого блока до Дракона Края";
const DESC =
  "Атмосферный фан-лендинг о Minecraft: измерения, режимы игры, интерактивный верстак, галерея шейдеров и музыкальный автомат.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Dimensions />
        <GameModes />
        <Crafting />
        <Gallery />
        <Jukebox />
      </main>
      <Footer />
    </>
  );
}
