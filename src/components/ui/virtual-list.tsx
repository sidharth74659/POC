import React, { memo, useMemo, useRef, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (props: { index: number; style: React.CSSProperties; data: T }) => React.ReactNode;
  className?: string;
  overscanCount?: number;
  width?: number | string;
}

/**
 * Virtual list component for rendering large datasets efficiently
 * Only renders visible items to improve performance
 */
function VirtualListComponent<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
  overscanCount = 5,
  width = '100%'
}: VirtualListProps<T>) {
  const listRef = useRef<List>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Memoize the item renderer to prevent unnecessary re-renders
  const ItemRenderer = useMemo(() => {
    return memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
      const item = items[index];
      if (!item) return null;

      return (
        <div style={style}>
          {renderItem({ index, style, data: item })}
        </div>
      );
    });
  }, [items, renderItem]);

  // Handle scroll events for performance monitoring
  const handleScroll = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (listRef.current) {
        listRef.current.scrollTo(0);
      }
    };
  }, []);

  if (items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-muted-foreground">No items to display</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isScrolling && (
        <div className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm rounded px-2 py-1 text-xs text-muted-foreground">
          Scrolling...
        </div>
      )}
      <List
        ref={listRef}
        height={height}
        width={width}
        itemCount={items.length}
        itemSize={itemHeight}
        overscanCount={overscanCount}
        onScroll={handleScroll}
        className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {ItemRenderer}
      </List>
    </div>
  );
}

export const VirtualList = memo(VirtualListComponent) as <T>(
  props: VirtualListProps<T>
) => React.ReactElement; 