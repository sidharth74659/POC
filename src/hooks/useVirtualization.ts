import { useMemo } from 'react';

interface UseVirtualizationProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualizationResult {
  virtualItems: Array<{
    index: number;
    start: number;
    size: number;
    item: any;
  }>;
  totalSize: number;
  scrollToIndex: (index: number) => void;
}

/**
 * Custom hook for virtualizing large lists to improve performance
 * @param items - Array of items to virtualize
 * @param itemHeight - Height of each item in pixels
 * @param containerHeight - Height of the container in pixels
 * @param overscan - Number of items to render outside visible area
 * @returns Virtualization utilities
 */
export function useVirtualization({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: UseVirtualizationProps): VirtualizationResult {
  const virtualItems = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, 0 - overscan);
    const endIndex = Math.min(items.length - 1, visibleCount + overscan);

    const virtualizedItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualizedItems.push({
        index: i,
        start: i * itemHeight,
        size: itemHeight,
        item: items[i]
      });
    }

    return virtualizedItems;
  }, [items, itemHeight, containerHeight, overscan]);

  const totalSize = items.length * itemHeight;

  const scrollToIndex = (index: number) => {
    const element = document.getElementById(`virtual-item-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
    virtualItems,
    totalSize,
    scrollToIndex
  };
} 