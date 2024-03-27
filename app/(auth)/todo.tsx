import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  Button,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  Image,
} from "react-native";

import type { Todo } from "@/api/todos";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  uploadImage,
} from "@/api/todos";
import { useAuth } from "@/providers/AuthProvider";

const TodoScreen = () => {
  const [todo, setTodo] = useState<string>("");
  const queryClient = useQueryClient();
  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
  const { token } = useAuth();
  const addTodosMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setTodo("");
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedData: Todo) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[]) =>
        oldData.map((todo) =>
          todo._id === updatedData._id ? updatedData : todo
        )
      );
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      // queryClient.setQueryData(["todos"], (oldData: Todo[]) =>
      //   oldData.filter((todo) => todo._id !== updatedData._id)
      // );
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (updatedData: Todo) => {
      queryClient.setQueryData(["todos"], (oldData: Todo[]) =>
        oldData.map((todo) =>
          todo._id === updatedData._id ? updatedData : todo
        )
      );
    },
  });

  const addTodo = () => {
    addTodosMutation.mutate(todo);
  };
  const toggleDone = (item: Todo) => {
    const newItem = { ...item, status: item.status === 0 ? 1 : 0 };
    updateTodoMutation.mutate(newItem);
  };
  const trashTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const captureImage = async (id: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      uploadImageMutation.mutate({ id, uri, token: token || "" });
    }
  };

  const renderItem: ListRenderItem<Todo> = ({ item }) => (
    <View style={styles.taskCard}>
      {item.img && (
        <Image
          source={{
            uri: item.img,
            headers: { Authorization: `Bearer ${token}` },
          }}
          style={{ height: 80, width: 80 }}
        />
      )}
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={() => toggleDone(item)} style={styles.task}>
          {item.status === 1 ? (
            <Feather name="check-circle" size={24} color="green" />
          ) : (
            <FontAwesome6 name="circle" size={24} color="gray" />
          )}
          <Text>{item.task}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => trashTodo(item._id)}>
          <Feather name="trash-2" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => captureImage(item._id)}>
          <Feather name="camera" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={todo}
          onChangeText={(text) => setTodo(text)}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      {todosQuery.isLoading && <ActivityIndicator />}
      {todosQuery.isError && <Text>Error: {todosQuery.error.message}</Text>}
      {todosQuery.isSuccess && (
        <View>
          <Text>Todos:</Text>
          <FlatList
            data={todosQuery.data}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}
    </View>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  form: {
    flexDirection: "row",
    marginVertical: 20,
    alignItems: "center",
    gap: 12,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#222",
    padding: 10,
    flex: 1,
  },
  taskCard: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  todoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  task: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
