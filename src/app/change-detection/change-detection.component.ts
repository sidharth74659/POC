// https://claude.ai/public/artifacts/da81598c-3098-417f-90f8-7a270a4a5112
import { Component, Input, OnChanges, DoCheck, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

// Child Component A - Default Change Detection Strategy
@Component({
  selector: 'child-default',
  standalone: true,
  template: `
    <div style="border: 2px solid blue; padding: 15px; margin: 10px; background: #f0f8ff;">
      <h3>Child A - Default Strategy</h3>
      <p><strong>ngOnChanges calls:</strong> {{ onChangesCount }}</p>
      <p><strong>ngDoCheck calls:</strong> {{ doCheckCount }}</p>
      <p><strong>Items ({{ items.length }}):</strong> {{ items.join(', ') }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChildDefaultComponent implements OnChanges, DoCheck {
  @Input() items: string[] = [];
  onChangesCount = 0;
  doCheckCount = 0;

  ngOnChanges(changes: SimpleChanges) {
    this.onChangesCount++;
    console.log('🔵 ChildDefault - ngOnChanges called:', {
      count: this.onChangesCount,
      currentValue: changes['items']?.currentValue,
      previousValue: changes['items']?.previousValue,
      firstChange: changes['items']?.firstChange
    });
  }

  ngDoCheck() {
    this.doCheckCount++;
    console.log('🔵 ChildDefault - ngDoCheck called:', {
      count: this.doCheckCount,
      itemsLength: this.items.length
    });
  }
}

// Child Component B - OnPush Change Detection Strategy
@Component({
  selector: 'child-onpush',
  standalone: true,
  template: `
    <div style="border: 2px solid red; padding: 15px; margin: 10px; background: #fff0f0;">
      <h3>Child B - OnPush Strategy</h3>
      <p><strong>ngOnChanges calls:</strong> {{ onChangesCount }}</p>
      <p><strong>ngDoCheck calls:</strong> {{ doCheckCount }}</p>
      <p><strong>Items ({{ items.length }}):</strong> {{ items.join(', ') }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildOnPushComponent implements OnChanges, DoCheck {
  @Input() items: string[] = [];
  onChangesCount = 0;
  doCheckCount = 0;

  ngOnChanges(changes: SimpleChanges) {
    this.onChangesCount++;
    console.log('🔴 ChildOnPush - ngOnChanges called:', {
      count: this.onChangesCount,
      currentValue: changes['items']?.currentValue,
      previousValue: changes['items']?.previousValue,
      firstChange: changes['items']?.firstChange
    });
  }

  ngDoCheck() {
    this.doCheckCount++;
    console.log('🔴 ChildOnPush - ngDoCheck called:', {
      count: this.doCheckCount,
      itemsLength: this.items.length
    });
  }
}

// Parent Component
@Component({
  selector: 'change-detection',
  standalone: true,
  imports: [ChildDefaultComponent, ChildOnPushComponent],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Angular Change Detection Strategy Demo</h1>
      
      <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
        <h2>Parent Component</h2>
        <p><strong>Current Array:</strong> [{{ items.join(', ') }}] (Length: {{ items.length }})</p>
        
        <div style="margin: 15px 0;">
          <button 
            (click)="mutateArray()" 
            style="padding: 10px 15px; margin: 5px; background: #ff6b6b; color: white; border: none; border-radius: 3px; cursor: pointer;">
            🚫 Mutate Array (push)
          </button>
          
          <button 
            (click)="replaceArray()" 
            style="padding: 10px 15px; margin: 5px; background: #51cf66; color: white; border: none; border-radius: 3px; cursor: pointer;">
            ✅ Replace Array (spread)
          </button>
          
          <button 
            (click)="clearConsole()" 
            style="padding: 10px 15px; margin: 5px; background: #868e96; color: white; border: none; border-radius: 3px; cursor: pointer;">
            🧹 Clear Console
          </button>
        </div>
      </div>

      <!-- Pass the same array to both child components -->
      <child-default [items]="items"></child-default>
      <child-onpush [items]="items"></child-onpush>

      <div style="background: #e8f5e8; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #51cf66;">
        <h3>📝 Instructions:</h3>
        <ol>
          <li>Open your browser's developer console to see the logs</li>
          <li>Click "Mutate Array" - observe which components detect the change</li>
          <li>Click "Replace Array" - observe the difference in behavior</li>
        </ol>
      </div>

      <div style="background: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
        <h3>🔍 What to Observe:</h3>
        <ul>
          <li><strong>Default Strategy (Blue):</strong> Updates on both mutate and replace operations</li>
          <li><strong>OnPush Strategy (Red):</strong> Only updates when array reference changes (replace operation)</li>
          <li><strong>Console Logs:</strong> Track ngOnChanges and ngDoCheck calls for each component</li>
        </ul>
      </div>
    </div>
  `
})
export class ChangeDetectionComponent {
  items: string[] = ['Item 1', 'Item 2'];
  private counter = 3;

  mutateArray() {
    console.log('🚫 MUTATING ARRAY - Same reference, different content');
    // This mutates the existing array - same reference
    this.items.push(`Item ${this.counter++}`);
    console.log('Array after mutation:', this.items);
  }

  replaceArray() {
    console.log('✅ REPLACING ARRAY - New reference, immutable update');
    // This creates a new array - new reference
    this.items = [...this.items, `Item ${this.counter++}`];
    console.log('Array after replacement:', this.items);
  }

  clearConsole() {
    console.clear();
    console.log('🧹 Console cleared - Ready for new observations!');
  }
}

/*
🎯 EXPLANATION OF BEHAVIOR:

1. **ChangeDetectionStrategy.Default (Child A - Blue)**:
   - Runs change detection on EVERY change detection cycle
   - ngDoCheck is called frequently (even on unrelated changes)
   - ngOnChanges is called when input reference changes
   - Updates UI for both mutate and replace operations
   - Less performant but more "forgiving"

2. **ChangeDetectionStrategy.OnPush (Child B - Red)**:
   - Only runs change detection when:
     a) Input reference changes (===)
     b) Event is triggered from within the component
     c) Async observable emits (with async pipe)
     d) Manual change detection trigger
   - ngDoCheck calls are minimized
   - ngOnChanges only called when input reference actually changes
   - Does NOT update UI when array is mutated (same reference)
   - Updates UI when array is replaced (new reference)
   - More performant but requires immutable updates

3. **Why Immutability Matters with OnPush**:
   - OnPush uses reference equality (===) to detect changes
   - Mutating an array/object keeps the same reference
   - Angular doesn't detect the change because arr1 === arr1 (same reference)
   - Replacing with spread/slice creates new reference
   - Angular detects change because oldArr !== newArr (different references)

4. **Performance Impact**:
   - Default: O(n) - checks all components in tree
   - OnPush: O(1) - only checks when reference changes
   - OnPush can significantly improve performance in large applications

5. **Best Practices**:
   - Use OnPush with immutable data patterns
   - Use spread operator, Object.assign, or immutable libraries
   - Avoid direct mutations when using OnPush
   - Consider OnPush for leaf components or performance-critical areas

🔧 Try this in StackBlitz:
1. Create new Angular project
2. Replace main.ts content with this code
3. Open console and interact with buttons
4. Observe the different behaviors!
*/