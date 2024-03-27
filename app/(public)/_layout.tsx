import { Stack } from "expo-router";
import React from "react";

const PublicLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerTitle: "My TODO",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Signup",
          headerTitle: "Create Account",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
};

export default PublicLayout;
