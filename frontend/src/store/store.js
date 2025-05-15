import { create } from "zustand";
import axios from "axios";
import { ClerkProvider } from "@clerk/clerk-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const baseUrl = backendUrl + "/api";

const useStore = create((set, get) => ({
  media: [],

  getMediaByUser: async (clerkId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/media/getMediaByUser/${clerkId}`
      );
      if (response.data.success) {
        set({ media: response.data.media });
        return true;
      }
    } catch (error) {}
  },

  // Upload a media file (video/image) for a user
  uploadMedia: async (file, userId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await axios.post(`${baseUrl}/media/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.media) {
        // Append the newly uploaded media to the store
        set((state) => ({
          media: [...state.media, response.data.media],
        }));
        return response.data.media;
      }

      console.error("Upload failed:", response.data);
      return null;
    } catch (error) {
      console.error("Error uploading media:", error);
      return null;
    }
  },

  createUserInDB: async (clerkId, email, firstName, lastName, profileImage) => {
    try {
      const response = await axios.post(`${baseUrl}/user/addUser`, {
        clerkId,
        email,
        firstName,
        lastName,
        profileImage,
      });
      console.log("Create User Response", response);
      return response.data.success;
    } catch (error) {
      console.log("Failed to login: ", error);
      throw new Error(error.message);
    }
  },
}));

export default useStore;
