"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout, { DashboardTabId } from './dashboard/DashboardLayout';
import OverviewTab from './dashboard/OverviewTab';
import LearnTab from './dashboard/LearnTab';
import ProgressTab from './dashboard/ProgressTab';
import QuickHelpTab from './dashboard/QuickHelpTab';
import CheckinTab from './dashboard/CheckinTab';
import LibraryTab from './dashboard/LibraryTab';
import ResearchTab from './dashboard/ResearchTab';

interface DashboardPageProps {
  onNavigateHome: () => void;
  onNavigateAssessment?: () => void;
  initialTab?: DashboardTabId;
  onTabChange?: (tab: DashboardTabId) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateHome,
  onNavigateAssessment,
  initialTab = 'dashboard',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTabId>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleNavigateTab = (tab: DashboardTabId) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <DashboardLayout
      currentTab={activeTab}
      onNavigateTab={handleNavigateTab}
      onNavigateHome={onNavigateHome}
      onNavigateAssessment={onNavigateAssessment}
    >
      {activeTab === 'dashboard' && <OverviewTab onNavigateTab={handleNavigateTab} />}
      {activeTab === 'learn' && <LearnTab onNavigateTab={handleNavigateTab} />}
      {activeTab === 'progress' && <ProgressTab onNavigateTab={handleNavigateTab} />}
      {activeTab === 'quick-help' && <QuickHelpTab onNavigateTab={handleNavigateTab} />}
      {activeTab === 'checkin' && <CheckinTab onNavigateTab={handleNavigateTab} />}
      {activeTab === 'library' && <LibraryTab onNavigateTab={handleNavigateTab} />}
      {activeTab === 'research' && <ResearchTab onNavigateTab={handleNavigateTab} />}
    </DashboardLayout>
  );
};

export default DashboardPage;
