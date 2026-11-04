import { Hero } from "@/components/Hero";
import { SignalBand } from "@/components/SignalBand";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import Layout from "@/components/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <SignalBand />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </Layout>
  );
}
