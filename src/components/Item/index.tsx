import { View, Text, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";

import { styles } from "./styles";
import { filterStatus } from "@/types/filterStatus";
import { StatusIcon } from "../StatusIcon";
type ItemData = {
  status: filterStatus;
  description: string;
};

type Props = {
  data: ItemData;
  onRemove: () => void;
  onToggleStatus: () => void;
};

export const Item = ({ data, onRemove, onToggleStatus }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={onToggleStatus}>
        <StatusIcon status={data.status} />
      </TouchableOpacity>
      <Text style={styles.description}>{data.description}</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={onRemove}>
        <Trash2 size={18} color="#828282" />
      </TouchableOpacity>
    </View>
  );
};
