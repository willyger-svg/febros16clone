import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeatureGrid } from '../components/FeatureGrid';
import { CategorySection } from '../components/CategorySection';
import { ResearchWorkflowSection } from '../components/ResearchWorkflowSection';
import { PlatformEcosystemSection } from '../components/PlatformEcosystemSection';
import { StatItem, FeatureCardItem, CategoryItem } from '../types';

interface HomePageProps {
  stats: StatItem[];
  features: FeatureCardItem[];
  categories: CategoryItem[];
  onSearch: (query: string) => void;
  onOpenSearchModal: () => void;
  onSelectFeature: (feature: FeatureCardItem) => void;
  onSelectCategory: (category: CategoryItem) => void;
  onOpenCampaign: (campaignId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  stats,
  features,
  categories,
  onSearch,
  onOpenSearchModal,
  onSelectFeature,
  onSelectCategory,
  onOpenCampaign,
}) => {
  return (
    <div>
      {/* Hero Section with Mountain Sunrise */}
      <HeroSection
        stats={stats}
        onSearch={onSearch}
        onOpenSearchModal={onOpenSearchModal}
      />

      {/* 6 Feature Cards over lower hero */}
      <FeatureGrid
        features={features}
        onSelectFeature={onSelectFeature}
      />

      {/* Explore by Category Section (Clean Light Theme) */}
      <CategorySection
        categories={categories}
        onSelectCategory={onSelectCategory}
      />

      {/* Core Research Workspace & Methodology */}
      <ResearchWorkflowSection />

      {/* Platform Ecosystem & Campaigns (e.g. OO24) */}
      <PlatformEcosystemSection
        onOpenCampaign={onOpenCampaign}
      />
    </div>
  );
};
