import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";
export const Input = ({ ...rest }: TextInputProps) => {
  return (
    <TextInput
      {...Input}
      style={styles.container}
      {...rest}
      placeholderTextColor="#74708b"
    />
  );
};
