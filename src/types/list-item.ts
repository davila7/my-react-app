export interface ListItem {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ListCrudConfig<T extends ListItem = ListItem> {
  placeholder?: string;
  confirmDelete?: boolean;
  allowInlineEdit?: boolean;
  maxLength?: number;
  validate?: (text: string) => string | null;
  formatItem?: (item: T) => string;
}