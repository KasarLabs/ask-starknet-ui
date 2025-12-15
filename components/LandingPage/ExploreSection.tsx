import React from 'react';
import ExtendedWarWidget from './ExtendedWarWidget';
import YieldWidget from './YieldWidget';

const ExploreSection = () => {
  return (
    <div className="bg-light-secondary dark:bg-dark-secondary rounded-2xl border border-light-200 dark:border-dark-200 h-full flex flex-col">
      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto overflow-hidden-scrollable px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Extended War Widget - Takes double space */}
          <ExtendedWarWidget />
          
          {/* Yield Optimizer Widget - Takes double space */}
          <YieldWidget />
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;

