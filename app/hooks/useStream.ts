import { useCallback, useState } from "react"
import { ErrorResponse, StreamResponse } from "../types"
import axios from "axios"

interface useStreamResponse {
    streamRepsonse: StreamResponse,
    loading: boolean,
    error: string | null,
    addStream: (url: string) => Promise<boolean>,
    refreshStream: () => Promise<void>
}

export const useStreams = (): useStreamResponse => {
    const [streams, setStreams] = useState<StreamResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStreams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get('/api/streams', {
                withCredentials: true, // same as credentials: 'include'
            });

            setStreams(response.data.streams || []);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to fetch streams');
            } else {
                setError('An unknown error occurred');
            }
            console.error('Error fetching streams:', err);
        } finally {
            setLoading(false);
        }
    }, []);

}
