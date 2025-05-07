import { 
  getResourcesData, getResourcesDataToolConfig,
  getResourceById, getResourceByIdToolConfig
} from "./resourceTools.js";

import {
  getOperationsData, getOperationsDataToolConfig,
  getOperationById, getOperationByIdToolConfig
} from "./operationTools.js";

// Helper utility for date operations
export function getDateRangeForNextWeek() {
  const today = new Date();
  
  // Calculate start of next week (next Monday)
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + (7 - today.getDay() + 1) % 7 + 1);
  nextWeekStart.setHours(0, 0, 0, 0);
  
  // Calculate end of next week (next Sunday)
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
  nextWeekEnd.setHours(23, 59, 59, 999);
  
  return {
    startDate: nextWeekStart.toISOString().split('T')[0],
    endDate: nextWeekEnd.toISOString().split('T')[0]
  };
}

export const functions = {
  getResourcesData,
  getResourceById,
  getOperationsData,
  getOperationById
};

export const configsArray = [
  getResourcesDataToolConfig,
  getResourceByIdToolConfig,
  getOperationsDataToolConfig,
  getOperationByIdToolConfig
];

export default {
  functions,
  configsArray
};