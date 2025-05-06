export interface ApiResponse<T> {
  Response: {
    items: T[] | null;
    totalCount: number;
  }
  Success: boolean;
  ErrorMessage: string | null;
}
