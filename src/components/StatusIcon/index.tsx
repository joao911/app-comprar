import { CircleCheck, CircleDashed } from "lucide-react-native";
import { filterStatus } from "@/types/filterStatus";

export const StatusIcon = ({ status }: { status: filterStatus }) => {
  return status === filterStatus.DONE ? (
    <CircleCheck size={20} color="#2c46b1" />
  ) : (
    <CircleDashed size={20} color="#000" />
  );
};
