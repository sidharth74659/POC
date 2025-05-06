/* 
{
    "operationId": "op-001",
    "operationName": "Repair Conveyor Belt",
    "equipment": "Conveyor System A",
    "workOrderNumber": "WO-1234",
    "workOrderId": "wo-1234",
    "resourceId": "res-001",
    "startDate": "2023-07-15T09:00:00Z",
    "endDate": "2023-07-15T11:30:00Z",
    "notes": "Fix mechanical issue with conveyor belt in production line 3"
}
*/
/* 
export interface Operation {
  id: string;
  resourceId: string;
  title: string;
  description: string;
  location: string;
  equipment: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}
*/

export interface Operation {
  operationId: string;
  operationName: string;
  equipment: string;
  workOrderNumber: string;
  workOrderId: string;
  resourceId: string;
  startDate: string;
  endDate: string;
  notes: string;
} 