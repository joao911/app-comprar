import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

import { styles } from "./styles";
import { filterStatus } from "@/types/filterStatus";
import { StatusIcon } from "../StatusIcon";

interface IFilterProps extends TouchableOpacityProps {
  status: filterStatus;
  isActive: boolean;
}

export const Filter = ({ status, isActive, ...rest }: IFilterProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, { opacity: isActive ? 1 : 0.5 }]}
      {...rest}
      activeOpacity={0.8}
    >
      <StatusIcon status={status} />
      <Text style={styles.title}>
        {status === filterStatus.DONE ? "Comprados" : "Pendentes"}
      </Text>
    </TouchableOpacity>
  );
};
