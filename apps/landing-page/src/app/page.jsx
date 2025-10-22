import Menu from '@/components/Menu/menu';
import AnimatedTextSection from '@/components/AnimatedTextSection/AnimatedTextSection';
import Footer from '@/components/Footer/Footer';
import CardAnimation from '@/components/HeroCards/CardAnimation';
import AnimationSequence from '@/components/AnimationSequence';
import Navbar from '@/components/Navbar';
import SkillStrips from '@/components/SkillStrips';

export default function Home() {
  return (
    // The style here is the critical fix for the horizontal scrollbar.
    <main style={{ overflowX: 'hidden' }}>
      <Menu />
      <Navbar />
      {/* A placeholder section before the animated text */}
      <SkillStrips/>
    
      {/* The two animated sections are placed one after the other.
          GSAP will handle the transition between them perfectly now. */}
          <AnimationSequence />
      
      <Footer />
    </main>
  );
}
