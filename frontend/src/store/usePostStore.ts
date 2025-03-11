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
    currentLocation: { latitude: number; longitude: number } | null;
    locationQuery: string;
    searchResults: any[];
    createPost: (data: PostData) => Promise<any>;
    getCurrentLocation: () => void;
    getNearbyPosts: () => void;
    searchLocation: (query: string) => void;
    setLocation: (lat: number, lon: number, name: string) => void;
}

const OPEN_CAGE_API_KEY = 'b4ed2449e7024e8fa1cdb57e4acbef3c';
const OPEN_CAGE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

export const usePostStore = create<PostState>((set, get) => ({
    isCurrentLocation: false,
    currentLocation: null,
    locationQuery: '',
    searchResults: [],

    createPost: async (data: PostData) => {
        try {
            if (!data.latitude || !data.longitude) {
                toast.error("Please provide location.");
                return;
            }

            const formData = new FormData();
            formData.append('price', data.price);
            formData.append('description', data.description);
            formData.append('type', data.type);
            formData.append('utilities', JSON.stringify(data.utilities));
            formData.append('latitude', data.latitude.toString());
            formData.append('longitude', data.longitude.toString());
            if (data.image) formData.append('image', data.image);

            const res = await axiosInstance.post("/post/create-post", formData);
            toast.success("Post created successfully");
            return res.data;
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
                toast.success("Nearby posts fetched successfully");
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
}));