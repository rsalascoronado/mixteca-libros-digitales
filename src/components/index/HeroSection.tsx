
import React from 'react';
import { User, UserRole } from '@/types';
import HeroContent from './HeroContent';
import HeroImage from './HeroImage';

interface HeroSectionProps {
  user: User | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const HeroSection = ({ user, hasRole }: HeroSectionProps) => (
  <section className="bg-[#56070c] text-primary-foreground py-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center">
        <HeroContent user={user} hasRole={hasRole} />
        <HeroImage />
      </div>
    </div>
  </section>
);

export default HeroSection;
