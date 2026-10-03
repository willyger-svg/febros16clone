import React, { useState, useEffect } from 'react';
import { Navbar, PageId } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { LearnPage } from './pages/LearnPage';
import { ResearchPage } from './pages/ResearchPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { DetailModal } from './components/DetailModal';
import { StatItem, FeatureCardItem, CategoryItem, SearchResult } from './types';
import { HERO_STATS, FEATURE_CARDS, CATEGORIES } from './data/mockData';
import { apiService } from './services/api';

export default function App() {
  // Sync page state with URL hash (e.g. #discover, #knowledge, #research)
  const getInitialPage = (): PageId => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'home',
        'discover',
        'knowledge',
        'learn',
        'research',
        'resources',
        'opportunities',
        'campaigns',
      ];
      if (validPages.includes(hash)) {
        return hash;
      }
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [stats, setStats] = useState<StatItem[]>(HERO_STATS);
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedFeature, setSelectedFeature] = useState<FeatureCardItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);

  // Synchronize on browser Back / Forward history buttons
  useEffect(() => {
    const handleHashChange = () => {
      const page = getInitialPage();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch dynamic stats and categories on mount
  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        const [loadedStats, loadedCategories] = await Promise.all([
          apiService.getHeroStats(),
          apiService.getCategories(),
        ]);
        if (!isCancelled) {
          if (loadedStats && loadedStats.length > 0) setStats(loadedStats);
          if (loadedCategories && loadedCategories.length > 0) setCategories(loadedCategories);
        }
      } catch {
        // Fallback maintained
      }
    };

    loadData();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Global keyboard shortcut for Search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToPage = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = page === 'home' ? '' : page;
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setSearchModalOpen(true);
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectFeature = (feature: FeatureCardItem) => {
    // When clicking a feature card, navigate directly to that dedicated page!
    const pageMap: Record<string, PageId> = {
      discover: 'discover',
      learn: 'learn',
      research: 'research',
      resources: 'resources',
      opportunities: 'opportunities',
      campaigns: 'campaigns',
    };
    if (pageMap[feature.id]) {
      navigateToPage(pageMap[feature.id]);
    } else {
      setSelectedFeature(feature);
    }
  };

  const handleOpenCampaign = (campaignId: string) => {
    navigateToPage('campaigns');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Primary Navigation Bar */}
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        currentPage={currentPage}
        onNavigatePage={navigateToPage}
      />

      {/* Main Content: Dedicated Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            stats={stats}
            features={FEATURE_CARDS}
            categories={categories}
            onSearch={handleHeroSearch}
            onOpenSearchModal={() => setSearchModalOpen(true)}
            onSelectFeature={handleSelectFeature}
            onSelectCategory={(category) => setSelectedCategory(category)}
            onOpenCampaign={handleOpenCampaign}
          />
        )}

        {currentPage === 'discover' && (
          <DiscoverPage
            onSelectItem={(item) => setSelectedSearchResult(item)}
            onOpenSearch={() => setSearchModalOpen(true)}
          />
        )}

        {currentPage === 'knowledge' && (
          <KnowledgePage
            onSelectItem={(item) => setSelectedSearchResult(item)}
            onOpenSearch={() => setSearchModalOpen(true)}
          />
        )}

        {currentPage === 'learn' && (
          <LearnPage />
        )}

        {currentPage === 'research' && (
          <ResearchPage />
        )}

        {currentPage === 'resources' && (
          <ResourcesPage />
        )}

        {currentPage === 'opportunities' && (
          <OpportunitiesPage />
        )}

        {currentPage === 'campaigns' && (
          <CampaignsPage />
        )}
      </main>

      {/* Multi-Column Footer with Page Navigation */}
      <Footer
        onNavigatePage={navigateToPage}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Interactive Live Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        initialQuery={searchQuery}
        onSelectResult={(result) => setSelectedSearchResult(result)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Structured Item Detail Modal */}
      <DetailModal
        isOpen={!!selectedFeature || !!selectedCategory || !!selectedSearchResult}
        onClose={() => {
          setSelectedFeature(null);
          setSelectedCategory(null);
          setSelectedSearchResult(null);
        }}
        feature={selectedFeature}
        category={selectedCategory}
        searchResult={selectedSearchResult}
        onExploreTopic={(topic) => {
          setSelectedFeature(null);
          setSelectedCategory(null);
          setSelectedSearchResult(null);
          handleHeroSearch(topic);
        }}
      />
    </div>
  );
}
