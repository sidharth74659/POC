/* 
{
  "resourceId": "res-001",
  "resourceName": "John Smith",
  "skillSet": "electrical,mechanical,diagnostics",
  "role": "Senior Technician"
}
 */
/* 
export interface Resource {
  id: string;
  name: string;
  role: string;
  skillSet: string[];
  availability: 'available' | 'busy' | 'unavailable';
  location: string;
} 
*/

export interface Resource {
  resourceId: string;
  resourceName: string;
  skillSet: string;
  role: string;
}
