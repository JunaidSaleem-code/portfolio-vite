import { Suspense, lazy } from "react";
import Approach from '../components/Approach';
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Grid from "../components/Grid";
import Hero from "../components/Hero";
import RecentProjects from "../components/RecentProjects";
import { navItems } from "../data";
import {FloatingNav} from "../components/ui/floating-navbar";


export default function Home() {
  return (
    <main >
      <div className="overflow-hidden">
        <Suspense fallback={null}>
          <FloatingNav navItems={navItems} />
        </Suspense>
        <Hero />
        <Grid />
         <RecentProjects />
        <Experience />
        <Approach /> 
        <Footer />
      </div>
    </main>
  );
}
