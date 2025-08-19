import React, { useState } from 'react';
import { Play, Pause, Settings, Download, Share2, Heart } from 'lucide-react';
import { Button, Card, SkeletonLoader, useToast, ThemeToggle } from '../components';
import './ComponentShowcase.css';

export const ComponentShowcase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showSkeletons, setShowSkeletons] = useState(false);
  const toast = useToast();

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    toast.success('Action completed successfully!');
  };

  const toggleSkeletons = () => {
    setShowSkeletons(!showSkeletons);
    if (!showSkeletons) {
      setTimeout(() => setShowSkeletons(false), 3000);
    }
  };

  return (
    <div className="showcase">
      <header className="showcase__header">
        <div className="showcase__container">
          <h1 className="showcase__title">UI5 Design System</h1>
          <p className="showcase__subtitle">
            A comprehensive design system built with React and UI5 Web Components
          </p>
          <div className="showcase__actions">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="showcase__main">
        <div className="showcase__container">
          
          {/* Buttons Section */}
          <section className="showcase__section">
            <h2 className="showcase__section-title">Buttons</h2>
            <p className="showcase__section-description">
              Interactive button components with multiple variants and sizes
            </p>
            
            <div className="showcase__grid">
              <Card title="Button Variants" variant="outlined">
                <div className="button-grid">
                  <Button variant="primary" onClick={() => toast.success('Primary button clicked!')}>
                    Primary
                  </Button>
                  <Button variant="secondary" onClick={() => toast.info('Secondary button clicked!')}>
                    Secondary
                  </Button>
                  <Button variant="tertiary" onClick={() => toast.info('Tertiary button clicked!')}>
                    Tertiary
                  </Button>
                  <Button variant="danger" onClick={() => toast.error('Danger button clicked!')}>
                    Danger
                  </Button>
                  <Button variant="ghost" onClick={() => toast.info('Ghost button clicked!')}>
                    Ghost
                  </Button>
                </div>
              </Card>

              <Card title="Button Sizes" variant="outlined">
                <div className="button-grid">
                  <Button size="small" icon={<Settings />}>Small</Button>
                  <Button size="medium" icon={<Download />}>Medium</Button>
                  <Button size="large" icon={<Share2 />}>Large</Button>
                </div>
              </Card>

              <Card title="Button States" variant="outlined">
                <div className="button-grid">
                  <Button loading={loading} onClick={handleAsyncAction}>
                    {loading ? 'Loading...' : 'Async Action'}
                  </Button>
                  <Button disabled>Disabled</Button>
                  <Button icon={<Heart />} variant="secondary">
                    With Icon
                  </Button>
                  <Button fullWidth variant="primary">
                    Full Width Button
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Cards Section */}
          <section className="showcase__section">
            <h2 className="showcase__section-title">Cards</h2>
            <p className="showcase__section-description">
              Flexible card containers with different variants and configurations
            </p>
            
            <div className="showcase__grid">
              <Card
                title="Default Card"
                subtitle="Basic card with header and content"
                variant="default"
                headerAction={<Button variant="ghost" size="small">Action</Button>}
                footer={
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="tertiary" size="small">Cancel</Button>
                    <Button variant="primary" size="small">Save</Button>
                  </div>
                }
              >
                This is a default card with a header, content area, and footer actions.
                It demonstrates the basic card structure and styling.
              </Card>

              <Card title="Elevated Card" variant="elevated" clickable>
                <p>This is an elevated card with enhanced shadows and hover effects.</p>
                <p>Click anywhere on this card to see the interaction.</p>
              </Card>

              <Card title="Outlined Card" variant="outlined">
                <p>This card uses a border instead of shadows for definition.</p>
                <p>Perfect for interfaces where you want less visual depth.</p>
              </Card>
            </div>
          </section>

          {/* Skeleton Loaders Section */}
          <section className="showcase__section">
            <h2 className="showcase__section-title">Skeleton Loaders</h2>
            <p className="showcase__section-description">
              Loading placeholders that maintain layout while content is being fetched
            </p>
            
            <div className="showcase__controls">
              <Button onClick={toggleSkeletons} variant="secondary">
                {showSkeletons ? 'Hide' : 'Show'} Skeletons
              </Button>
            </div>

            <div className="showcase__grid">
              <Card title="Text Skeleton" variant="outlined">
                {showSkeletons ? (
                  <SkeletonLoader variant="text" lines={4} />
                ) : (
                  <div>
                    <p>This is actual content that would be loaded.</p>
                    <p>The skeleton loader maintains the layout while content is being fetched.</p>
                    <p>This helps provide better user experience during loading states.</p>
                    <p>Click "Show Skeletons" to see the loading state.</p>
                  </div>
                )}
              </Card>

              <Card title="Card Skeleton" variant="outlined">
                {showSkeletons ? (
                  <SkeletonLoader variant="card" />
                ) : (
                  <div>
                    <h3>Actual Content</h3>
                    <p>This demonstrates how skeleton loaders can represent entire card layouts.</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                      <Button variant="secondary" size="small">Action 1</Button>
                      <Button variant="primary" size="small">Action 2</Button>
                    </div>
                  </div>
                )}
              </Card>

              <Card title="Table Skeleton" variant="outlined" noPadding>
                {showSkeletons ? (
                  <SkeletonLoader variant="table" />
                ) : (
                  <div style={{ padding: '24px' }}>
                    <p>This shows how skeleton loaders work for tabular data.</p>
                    <p>The skeleton maintains the grid structure while data loads.</p>
                  </div>
                )}
              </Card>
            </div>
          </section>

          {/* Toast Notifications Section */}
          <section className="showcase__section">
            <h2 className="showcase__section-title">Toast Notifications</h2>
            <p className="showcase__section-description">
              User feedback through contextual notifications with auto-dismiss
            </p>
            
            <div className="showcase__grid">
              <Card title="Toast Types" variant="outlined">
                <div className="button-grid">
                  <Button 
                    variant="primary" 
                    onClick={() => toast.success('Success! Your action was completed.')}
                  >
                    Success Toast
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => toast.info('Info: Here\'s some helpful information.')}
                  >
                    Info Toast
                  </Button>
                  <Button 
                    variant="tertiary" 
                    onClick={() => toast.warning('Warning: Please check your input.')}
                  >
                    Warning Toast
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => toast.error('Error: Something went wrong.')}
                  >
                    Error Toast
                  </Button>
                </div>
              </Card>

              <Card title="Toast Options" variant="outlined">
                <div className="button-grid">
                  <Button 
                    variant="secondary"
                    onClick={() => toast.success('This toast lasts 10 seconds', { duration: 10000 })}
                  >
                    Long Duration
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => toast.info('This toast cannot be dismissed', { dismissible: false })}
                  >
                    Non-dismissible
                  </Button>
                  <Button 
                    variant="tertiary"
                    onClick={() => {
                      toast.success('Toast 1');
                      toast.info('Toast 2');
                      toast.warning('Toast 3');
                    }}
                  >
                    Multiple Toasts
                  </Button>
                </div>
              </Card>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};