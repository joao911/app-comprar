import z from "zod";
import { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, Text, FlatList } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { styles } from "./styles";
import { Item } from "./components/Item";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Filter } from "./components/Filter";

import { filterStatus } from "./types/filterStatus";
import {
  addItem,
  getByStatus,
  getItems,
  ItemData,
  removeAllItems,
  removeItem,
  toggleItemStatus,
} from "./storage/itemsStorage";

export default function App() {
  const [filter, setFilter] = useState<filterStatus>(filterStatus.PENDING);
  const [items, setItems] = useState<ItemData[]>([]);

  console.log("filter", filter);

  const formSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  async function getItemsLocalStorage() {
    try {
      const response = await getByStatus(filter);
      console.log(response);
      setItems(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRemoveItem(id: string) {
    try {
      await removeItem(id);
      await getItemsLocalStorage();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleToggleItemStatus(id: string) {
    try {
      await toggleItemStatus(id);
      await getItemsLocalStorage();
    } catch (error) {
      console.log(error);
    }
  }
  const onSubmit = async (data: FormData) => {
    const newItem: ItemData = {
      id: String(Date.now()),
      status: filterStatus.PENDING,
      description: data.description,
    };

    await addItem(newItem);
    await getItemsLocalStorage();
    reset();
  };

  const handleFilterStatus = (status: filterStatus) => {
    setFilter(status);
  };

  const FIlTER_STATUS: filterStatus[] = [
    filterStatus.DONE,
    filterStatus.PENDING,
  ];

  async function handleRemoveAllItems() {
    try {
      await removeAllItems();
      await getItemsLocalStorage();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getItemsLocalStorage();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <View style={styles.form}>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="O que deseja comprar?"
              onChangeText={onChange}
              value={value}
              // errorMessage={errors.description?.message}
            />
          )}
        />
        <Button title="Adicionar" onPress={handleSubmit(onSubmit)} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {FIlTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              onPress={() => handleFilterStatus(status)}
              isActive={status === filter}
            />
          ))}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleRemoveAllItems}
          >
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Item
              data={item}
              onToggleStatus={() => {
                handleToggleItemStatus(item.id);
              }}
              onRemove={() => {
                handleRemoveItem(item.id);
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Nenhum item cadastrado ainda.
            </Text>
          )}
        />
      </View>
    </View>
  );
}
