import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const LoginScreen = () => {
  return (
    <View>
      <Text>LoginScreen</Text>
      <Link href={`/signup`}>Signup</Link>
      <Link href={`/todo`}>TODO</Link>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
