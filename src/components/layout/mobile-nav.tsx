import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';

interface MobileNavProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function MobileNav({ title, showBackButton = false, onBackClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsOpen(false);
  };

  const menuItems = [
    {
      label: 'Projects',
      icon: Home,
      onClick: handleHomeClick,
      active: location.pathname === '/'
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="font-semibold text-lg truncate">
              {title || 'DocuTrack'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-64 border-l bg-background p-4 shadow-lg lg:hidden"
            >
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.label}
                      variant={item.active ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={item.onClick}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Header (hidden on mobile) */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden lg:block">
        <div className="container flex h-14 items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold">DocuTrack</span>
          </a>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
} 