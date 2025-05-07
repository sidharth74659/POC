import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Project, Tile, Issue, SubTask } from '../types';
import { mockData } from '../mockData';

// State type
type AppState = {
  projects: Project[];
  tiles: Tile[];
  issues: Issue[];
  subtasks: SubTask[];
};

// Action types
type Action =
  | { type: 'ADD_ISSUE'; payload: Issue }
  | { type: 'UPDATE_ISSUE'; payload: Issue }
  | { type: 'ADD_SUBTASK'; payload: SubTask }
  | { type: 'UPDATE_SUBTASK'; payload: SubTask }
  | { type: 'UPDATE_TILE'; payload: Tile };

// Context type
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

// Initial state
const initialState: AppState = {
  projects: mockData.projects,
  tiles: mockData.tiles,
  issues: mockData.issues,
  subtasks: mockData.subtasks,
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer function
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_ISSUE':
      return {
        ...state,
        issues: [...state.issues, action.payload],
      };
    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue.id === action.payload.id ? action.payload : issue
        ),
      };
    case 'ADD_SUBTASK':
      return {
        ...state,
        subtasks: [...state.subtasks, action.payload],
      };
    case 'UPDATE_SUBTASK':
      return {
        ...state,
        subtasks: state.subtasks.map((subtask) =>
          subtask.id === action.payload.id ? action.payload : subtask
        ),
      };
    case 'UPDATE_TILE':
      return {
        ...state,
        tiles: state.tiles.map((tile) =>
          tile.id === action.payload.id ? action.payload : tile
        ),
      };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 