import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";

interface IButtonProps extends TouchableOpacityProps {
  title: string;
}
export const Button = ({ title, ...rest }: IButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} {...rest}>
      <Text style={styles.title}> {title}</Text>
    </TouchableOpacity>
  );
};
