import { useState, type FormEvent, type KeyboardEvent } from 'react';
import type { ListItem, ListCrudConfig } from '../types/list-item';
import { useListCrud } from '../hooks/useListCrud';
import './ListCrud.css';

interface ListCrudProps<T extends ListItem = ListItem> {
  config?: ListCrudConfig<T>;
  initialItems?: T[];
  onItemsChange?: (items: T[]) => void;
}

export function ListCrud<T extends ListItem = ListItem>({ 
  config = {}, 
  initialItems = [],
  onItemsChange 
}: ListCrudProps<T>) {
  const {
    placeholder = 'Add new item...',
    confirmDelete = false,
    allowInlineEdit = true,
    maxLength = 100,
    validate,
    formatItem
  } = config;

  const { items, addItem, updateItem, deleteItem, clearAll, setItems } = useListCrud<T>();
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize items
  useState(() => {
    if (initialItems.length > 0) {
      setItems(initialItems);
    }
  });

  // Notify parent of changes
  useState(() => {
    onItemsChange?.(items);
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (validate) {
      const validationError = validate(inputValue.trim());
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (inputValue.trim().length > maxLength) {
      setError(`Text must be ${maxLength} characters or less`);
      return;
    }

    addItem(inputValue.trim());
    setInputValue('');
    setError(null);
  };

  const handleEdit = (id: string, currentText: string) => {
    if (!allowInlineEdit) return;
    setEditingId(id);
    setEditValue(currentText);
  };

  const handleSaveEdit = (id: string) => {
    if (!editValue.trim()) return;
    
    if (validate) {
      const validationError = validate(editValue.trim());
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (editValue.trim().length > maxLength) {
      setError(`Text must be ${maxLength} characters or less`);
      return;
    }

    updateItem(id, { text: editValue.trim() } as Partial<T>);
    setEditingId(null);
    setEditValue('');
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setError(null);
  };

  const handleDelete = (id: string) => {
    if (confirmDelete) {
      if (window.confirm('Are you sure you want to delete this item?')) {
        deleteItem(id);
      }
    } else {
      deleteItem(id);
    }
  };

  const handleKeyPress = (e: KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape' && editingId) {
      handleCancelEdit();
    }
  };

  const displayText = (item: T) => {
    return formatItem ? formatItem(item) : item.text;
  };

  return (
    <div className="list-crud">
      <form onSubmit={handleSubmit} className="list-crud__form">
        <div className="list-crud__input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="list-crud__input"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="list-crud__add-btn"
          >
            Add
          </button>
        </div>
        {error && <div className="list-crud__error">{error}</div>}
      </form>

      <div className="list-crud__stats">
        {items.length} {items.length === 1 ? 'item' : 'items'}
        {items.length > 0 && (
          <button 
            onClick={clearAll}
            className="list-crud__clear-btn"
          >
            Clear All
          </button>
        )}
      </div>

      <ul className="list-crud__list">
        {items.map((item) => (
          <li key={item.id} className="list-crud__item">
            {editingId === item.id ? (
              <div className="list-crud__edit-group">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(item.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="list-crud__edit-input"
                  autoFocus
                  maxLength={maxLength}
                />
                <button 
                  onClick={() => handleSaveEdit(item.id)}
                  className="list-crud__save-btn"
                >
                  ✓
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="list-crud__cancel-btn"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="list-crud__item-content">
                <span 
                  className="list-crud__text"
                  onDoubleClick={() => handleEdit(item.id, item.text)}
                  title={allowInlineEdit ? 'Double-click to edit' : ''}
                >
                  {displayText(item)}
                </span>
                <div className="list-crud__actions">
                  {allowInlineEdit && (
                    <button
                      onClick={() => handleEdit(item.id, item.text)}
                      className="list-crud__edit-btn"
                      title="Edit item"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="list-crud__delete-btn"
                    title="Delete item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <div className="list-crud__empty">
          No items yet. Add one above to get started.
        </div>
      )}
    </div>
  );
}