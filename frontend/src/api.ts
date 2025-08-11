import axios from 'axios';
import type { QueryRequest, QueryResponse } from './types';

const API_BASE_URL = 'http://localhost:8000';

export const fetchBotResponse = async (
  request: QueryRequest
): Promise<QueryResponse> => {
  try {
    const response = await axios.post<QueryResponse>(
      `${API_BASE_URL}/query`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw new Error('Failed to fetch response from backend.');
  }
};
