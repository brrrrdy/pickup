import { Picker } from "@react-native-picker/picker";
import { Text, View } from "react-native";

import type { DevUser } from "../types/user";

type DevUserPickerProps = {
  users: DevUser[];
  selectedUserId: string;
  onChange: (userId: string) => void;
};

export function DevUserPicker({
  users,
  selectedUserId,
  onChange,
}: DevUserPickerProps) {
  const selectedUser =
    users.find((user) => user.id === selectedUserId) ?? users[0] ?? null;

  return (
    <View className="rounded-2xl border border-border bg-white p-4">
      <Text className="mb-1 text-[14px] font-semibold text-muted">
        Acting as
      </Text>

      <View className="rounded-xl border border-border bg-white">
        <Picker
          selectedValue={selectedUserId}
          onValueChange={(value) => onChange(String(value))}
        >
          {users.map((user) => (
            <Picker.Item
              key={user.id}
              label={user.displayName}
              value={user.id}
            />
          ))}
        </Picker>
      </View>

      {selectedUser ? (
        <Text className="mt-2 text-[13px] text-muted">
          Create and join games as {selectedUser.displayName}.
        </Text>
      ) : null}
    </View>
  );
}
