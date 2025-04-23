
import React from 'react';
import { User, UserRole } from '@/types';
import HeroContent from './HeroContent';
import HeroImage from './HeroImage';

const HeroSection = ({ user, hasRole }: { user: User | null, hasRole: (roles: UserRole | UserRole[]) => boolean }) => (
  <section className="bg-[#56070c] text-white py-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center">
        <HeroContent user={user} hasRole={hasRole} />
        <HeroImage />
      </div>
    </div>
  </section>
);

export default HeroSection;
