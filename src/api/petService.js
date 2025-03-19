import axios from 'axios';

// Get all pets
export const getAllPets = async () => {
    try {
        const response = await axios.get('/api/pets');
        return response.data;
    } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
    }
};

// Get pet by ID
export const getPetById = async (id) => {
    try {
        const response = await axios.get(`/api/pets/find/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching pet with ID ${id}:`, error);
        throw error;
    }
};

// Create or update pet
export const savePet = async (petData) => {
    try {
        const response = await axios.post('/api/pets/save', petData);
        return response.data;
    } catch (error) {
        console.error('Error saving pet:', error);
        throw error;
    }
};

// Delete pet
export const deletePet = async (id) => {
    try {
        const response = await axios.delete(`/api/pets/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting pet with ID ${id}:`, error);
        throw error;
    }
};

// Get all species
export const getAllSpecies = async () => {
    try {
        const response = await axios.get('/api/species');
        return response.data;
    } catch (error) {
        console.error('Error fetching species:', error);
        throw error;
    }
};

// Get all breeds
export const getAllBreeds = async () => {
    try {
        const response = await axios.get('/api/breeds');
        return response.data;
    } catch (error) {
        console.error('Error fetching breeds:', error);
        throw error;
    }
};