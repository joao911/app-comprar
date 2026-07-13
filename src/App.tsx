import z from "zod";
import { useState } from "react";
import { View, Image, TouchableOpacity, Text, FlatList } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { styles } from "./styles";
import { Item } from "./components/Item";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Filter } from "./components/Filter";

import { filterStatus } from "./types/filterStatus";

interface ItemData {
  id: number;
  status: filterStatus;
  description: string;
}

export default function App() {
  const [filter, setFilter] = useState<filterStatus>(filterStatus.PENDING);
  const [items, setItems] = useState<ItemData[]>([]);

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
  const onSubmit = async (data: FormData) => {
    const newItem: ItemData = {
      id: new Date().getTime(),
      status: filterStatus.PENDING,
      description: data.description,
    };

    try {
      setItems((oldItems) => [...oldItems, newItem]);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (id: number) => {
    console.log(id);
    const filteredItems = items.filter((item) => item.id !== id);
    setItems(filteredItems);
  };

  const handleToggleStatus = (id: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status:
            item.status === filterStatus.DONE
              ? filterStatus.PENDING
              : filterStatus.DONE,
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleFilterStatus = (status: filterStatus) => {
    setFilter(status);
  };

  const FIlTER_STATUS: filterStatus[] = [
    filterStatus.DONE,
    filterStatus.PENDING,
  ];

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
          <TouchableOpacity style={styles.clearButton}>
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
              onToggleStatus={() => handleToggleStatus(item.id)}
              onRemove={() => handleRemove(item.id)}
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
