import axios from "axios";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
import * as FileSystem from "expo-file-system";

export interface Todo {
  _id: string;
  task: string;
  status: number;
  img?: string;
}

export const getTodos = async (): Promise<Todo[]> => {
  const result = await axios.get(`${API_URL}/todos/me`);
  return result.data;
};

export const createTodo = async (task: string) => {
  const todo = { task, desc: "", status: 0, private: true };
  const result = await axios.post(`${API_URL}/todos`, todo);
  return result.data;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const result = await axios.put(`${API_URL}/todos/${todo._id}`, todo);
  return result.data;
};

export const deleteTodo = async (id: string): Promise<any> => {
  const result = await axios.delete(`${API_URL}/todos/${id}`);
  return result.data;
};

export const uploadImage = async ({
  id,
  uri,
  token,
}: {
  id: string;
  uri: string;
  token: string;
}) => {
  const result = await FileSystem.uploadAsync(
    `${API_URL}/todos/${id}/image`,
    uri,
    {
      httpMethod: "POST",
      headers: { Authorization: `Bearer ${token}` },
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
    }
  );
  return JSON.parse(result.body);
};
