import { useState, useCallback } from 'react';
import type { ListItem } from '../types/list-item';

export const useListCrud = <T extends ListItem = ListItem>() => {
  const [items, setItems] = useState<T[]>([]);

  const addItem = useCallback((text: string, additionalData?: Partial<T>) => {
    const newItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
      createdAt: new Date(),
      ...additionalData,
    } as T;
    
    setItems(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date() } as T
          : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const findItem = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    clearAll,
    findItem,
    setItems,
  };
};