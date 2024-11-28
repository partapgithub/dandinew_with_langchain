const API_ENDPOINTS = {
  KEYS: '/api/keys',
  KEY: (id) => `/api/keys/${id}`,
};

export const apiKeyService = {
  async fetchKeys() {
    try {
      const response = await fetch(API_ENDPOINTS.KEYS);
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('Invalid API keys data received:', data);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return [];
    }
  },

  async createKey(keyData) {
    try {
      const response = await fetch(API_ENDPOINTS.KEYS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(keyData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create API key');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  },

  async updateKey(id, updateData) {
    try {
      const response = await fetch(API_ENDPOINTS.KEY(id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update key');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating API key:', error);
      throw error;
    }
  },

  async deleteKey(id) {
    try {
      const response = await fetch(API_ENDPOINTS.KEY(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete key');
      }

      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw error;
    }
  }
}; 