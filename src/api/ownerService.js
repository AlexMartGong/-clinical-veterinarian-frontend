import axios from 'axios';

// Get all owners
export const getAllOwners = async () => {
    try {
        const response = await axios.get('/api/owners');
        return response.data;
    } catch (error) {
        console.error('Error fetching owners:', error);
        throw error;
    }
};

// Get owner by ID
export const getOwnerById = async (id) => {
    try {
        const response = await axios.get(`/api/owners/find/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching owner with ID ${id}:`, error);
        throw error;
    }
};

// Create or update owner
export const saveOwner = async (ownerData) => {
    try {
        const response = await axios.post('/api/owners/save', ownerData);
        return response.data;
    } catch (error) {
        console.error('Error saving owner:', error);
        throw error;
    }
};

// Delete owner
export const deleteOwner = async (id) => {
    try {
        const response = await axios.delete(`/api/owners/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting owner with ID ${id}:`, error);
        throw error;
    }
};