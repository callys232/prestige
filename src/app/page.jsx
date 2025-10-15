"use client";

import Hero from "../components/Hero";
import Programs from "../components/Programs";
import FormIntake from "../components/FormIntake";
import NavBar from "../components/Navbar";
import Cta from "../components/Cta";
import Footer from "../components/Footer";
// import ProgramButtons from '../../../../components/ProgramButtons';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300">
      <NavBar />
      <Hero />
      <Programs />
      <Cta />
      <FormIntake />
      <Footer />
    </main>
  );
}
