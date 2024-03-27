import { AntDesign } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

import { useAuth } from "@/providers/AuthProvider";

const AuthLayout = () => {
  const { onLogout, token } = useAuth();
  return (
    <Stack>
      <Stack.Screen
        name="todo"
        options={{
          title: "Todos",
          headerRight: () => (
            <TouchableOpacity onPress={onLogout}>
              <AntDesign name="logout" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
        redirect={!token}
      />
    </Stack>
  );
};

export default AuthLayout;
