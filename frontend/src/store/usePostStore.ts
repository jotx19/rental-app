import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import { create } from 'zustand';
import { AxiosError } from 'axios';
import axios from 'axios';

interface PostData {
    price: string;
    description: string;
    type: string;
    utilities: string[];
    image: File | null;
    latitude: number | null;
    longitude: number | null;
}

interface PostState {
    isCurrentLocation: boolean;
    isCreatingPost: boolean;
    isFetchingPosts: boolean;
    currentLocation: { latitude: number; longitude: number } | null;
    locationQuery: string;
    searchResults: any[];
    userPosts: any[];
    createPost: (data: PostData) => Promise<any>;
    getCurrentLocation: () => void;
    getNearbyPosts: () => void;
    getLatestPost:() => void;
    getAllPosts: (userId: string) => void;
    searchLocation: (query: string) => void;
    setLocation: (lat: number, lon: number, name: string) => void;
    selectedPost: any | null;
    setSelectedPost: (post: any | null) => void;
    closeModal: () => void;
}

const OPEN_CAGE_API_KEY = 'b4ed2449e7024e8fa1cdb57e4acbef3c';
const OPEN_CAGE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

export const usePostStore = create<PostState>((set, get) => ({
    isCurrentLocation: false,
    isCreatingPost: false,
    isFetchingPosts: false,
    currentLocation: null,
    locationQuery: '',
    searchResults: [],
    userPosts: [],
    selectedPost: null,
    setSelectedPost: (post) => set({ selectedPost: post }),
    closeModal: () => set({ selectedPost: null }),

    createPost: async (data) => {
        set({ isCreatingPost: true }); 
    
        try {
          const res = await axiosInstance.post("/post/create-post", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Post created successfully");
          return res.data;
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          toast.error(axiosError.response?.data?.message || "Failed to create post");
        } finally {
          set({ isCreatingPost: false });
        }
    },
    
    getCurrentLocation: () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    set({
                        currentLocation: { latitude, longitude },
                        isCurrentLocation: true,
                    });
                    toast.success("Location fetched successfully");
                },
                () => {
                    toast.error("Unable to retrieve location. Please try again later.");
                    set({
                        currentLocation: null,
                        isCurrentLocation: false,
                    });
                }
            );
        } else {
            toast.error("Geolocation is not supported by this browser.");
            set({
                currentLocation: null,
                isCurrentLocation: false,
            });
        }
    },

    getNearbyPosts: async () => {
        const currentLocation = get().currentLocation;

        if (!currentLocation) {
            toast.error("Location not available.");
            return [];
        }

        const { latitude, longitude } = currentLocation;

        try {
            const res = await axiosInstance.get("/post/", {
                params: { latitude, longitude },
            });

            if (res.data.posts) {
            }
            return res.data.posts;
        } catch (error: AxiosError | any) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else if (error.request) {
                toast.error("Network error. Please try again later.");
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    },

    searchLocation: async (query: string) => {
        if (query.length < 3) return;
        try {
            const res = await axios.get(OPEN_CAGE_API_URL, {
                params: {
                    q: query,
                    key: OPEN_CAGE_API_KEY,
                    limit: 5,
                    no_annotations: 1,
                },
            });

            set({ searchResults: res.data.results });
            console.log((res.data.results));
        } catch (error) {
            console.error('Error fetching search results', error);
            toast.error("Error fetching search results");
        }
    },

    setLocation: (lat: number, lon: number, name: string) => {
        set({
            currentLocation: { latitude: lat, longitude: lon },
            locationQuery: name,
            searchResults: [],
        });
        get().getNearbyPosts();
    },

    getLatestPost: async () => {
        try {
            const res = await axiosInstance.get("/post/latest-post");
            if (res.data.posts) {
            }
            return res.data.posts;
        } catch (error: AxiosError | any) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else if (error.request) {
                toast.error("Network error. Please try again later.");
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    },

    getAllPosts: async (authUser: any) => {
        set({ isFetchingPosts: true });
      
        try {
          const res = await axiosInstance.get(`/post/${authUser}/posts`); 
      
          if (res.data && res.data.post) {
            set({ userPosts: res.data.post }); 
          }
        } catch (error: AxiosError | any) {
          console.error("Error fetching posts:", error);
      
          if (error.response) {
            toast.error(error.response.data.message);
          } else if (error.request) {
            toast.error("Network error. Please try again later.");
          } else {
            toast.error("An error occurred. Please try again later.");
          }
        } finally {
          set({ isFetchingPosts: false });
        }
      }
      
    
    
}));