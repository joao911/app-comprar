import { filterStatus } from "@/types/filterStatus";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ITEMS_STORAGE_KEY = "@comprar:items";

export interface ItemData {
  id: string;
  status: filterStatus;
  description: string;
}

export async function getItems(): Promise<ItemData[]> {
  try {
    const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);

    return storage ? JSON.parse(storage) : [];
  } catch (error: any) {
    throw new Error("get items" + error);
  }
}

export async function getByStatus(status: filterStatus): Promise<ItemData[]> {
  const items = await getItems();
  return items.filter((item: ItemData) => item.status === status);
}

export async function saveItems(items: ItemData[]) {
  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error: any) {
    throw new Error("save items" + error);
  }
}

export async function addItem(newItem: ItemData): Promise<ItemData[]> {
  const items = await getItems();
  const updatedItems = [...items, newItem];
  await saveItems(updatedItems);
  return updatedItems;
}

export async function removeItem(id: string): Promise<ItemData[]> {
  const items = await getItems();
  const updatedItems = items.filter((item: ItemData) => item.id !== id);
  await saveItems(updatedItems);

  return updatedItems;
}

export async function toggleItemStatus(id: string): Promise<ItemData[]> {
  const items = await getItems();
  const updatedItems = items.map((item: ItemData) => {
    if (item.id === id) {
      return {
        ...item,
        status:
          item.status === filterStatus.PENDING
            ? filterStatus.DONE
            : filterStatus.PENDING,
      };
    }
    return item;
  });
  await saveItems(updatedItems);

  return updatedItems;
}

export async function removeAllItems() {
  const items = await AsyncStorage.removeItem(ITEMS_STORAGE_KEY);
  return items;
}
