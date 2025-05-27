import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface MobileMasterDetailProps {
  master: React.ReactNode;
  detail: React.ReactNode;
  masterTitle?: string;
  detailTitle?: string;
  selectedItem?: string | null;
  onItemSelect?: (item: string | null) => void;
  className?: string;
}

export function MobileMasterDetail({
  master,
  detail,
  masterTitle = 'Items',
  detailTitle = 'Details',
  selectedItem,
  onItemSelect,
  className
}: MobileMasterDetailProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (selectedItem && isMobile) {
      setShowDetail(true);
    } else if (!selectedItem) {
      setShowDetail(false);
    }
  }, [selectedItem, isMobile]);

  const handleBackToMaster = () => {
    setShowDetail(false);
    onItemSelect?.(null);
  };

  if (!isMobile) {
    // Desktop layout: side-by-side
    return (
      <div className={cn('flex h-full', className)}>
        <div className="w-1/3 border-r bg-muted/30">
          <div className="p-4 border-b">
            <h3 className="font-semibold">{masterTitle}</h3>
          </div>
          <div className="overflow-auto">
            {master}
          </div>
        </div>
        <div className="flex-1">
          {selectedItem ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-semibold">{detailTitle}</h3>
              </div>
              <div className="overflow-auto">
                {detail}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select an item to view details</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile layout: stacked with navigation
  return (
    <div className={cn('relative h-full', className)}>
      <AnimatePresence mode="wait">
        {!showDetail ? (
          // Master view
          <motion.div
            key="master"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="h-full"
          >
            <div className="p-4 border-b bg-background">
              <h3 className="font-semibold">{masterTitle}</h3>
            </div>
            <div className="overflow-auto">
              {master}
            </div>
          </motion.div>
        ) : (
          // Detail view
          <motion.div
            key="detail"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="h-full"
          >
            <div className="p-4 border-b bg-background flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMaster}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">{detailTitle}</h3>
            </div>
            <div className="overflow-auto">
              {detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MobileTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function MobileTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className 
}: MobileTabsProps) {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Tab Navigation */}
      <div className="flex border-b bg-background">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors',
                'border-b-2 border-transparent',
                activeTab === tab.id
                  ? 'text-primary border-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 