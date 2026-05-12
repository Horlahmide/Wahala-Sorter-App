export type ColumnId = 'now' | 'soon' | 'later';

export interface Task {
  id: string;
  title: string;
  status: ColumnId;
  createdAt: number;
}
