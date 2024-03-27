import {
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Link } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import { useAuth } from "@/providers/AuthProvider";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { onRegister } = useAuth();
  const handleSignup = useCallback(async () => {
    if (!onRegister) return;
    try {
      const newUser = await onRegister(email, password);
    } catch (error: any) {
      alert(error.message);
    }
  }, [setIsLoading, onRegister, email, password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Spinner visible={isLoading} textContent={"Loading..."} />
          <Image
            style={styles.logo}
            source={{
              uri: "https://img.freepik.com/premium-vector/free-vector-beautiful-flying-hummingbird-design-element-banners-posters-leaflets-brochur_1009653-1.jpg",
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Button title="Signup" onPress={handleSignup} disabled={isLoading} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  logo: {
    height: 80,
    width: 80,
    alignSelf: "center",
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#222",
    padding: 10,
  },
});
