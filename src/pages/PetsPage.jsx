import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    IconButton,
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Chip
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {Add, Edit, Delete, Search, Clear, Visibility, Pets as PetsIcon} from '@mui/icons-material';
import {toast} from 'react-hot-toast';
import {getAllPets, deletePet} from '../api/petService';
import PetForm from '../components/PetForm';

const PetsPage = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openForm, setOpenForm] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);

    // Fetch pets from the API
    const fetchPets = async () => {
        try {
            setLoading(true);
            const data = await getAllPets();
            setPets(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pets:', error);
            toast.error('Error al cargar las mascotas');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    // Handle opening form for creating a new pet
    const handleAddPet = () => {
        setSelectedPet(null);
        setOpenForm(true);
    };

    // Handle opening form for editing an existing pet
    const handleEditPet = (pet) => {
        setSelectedPet(pet);
        setOpenForm(true);
    };

    // Handle confirming pet deletion
    const handleConfirmDelete = (pet) => {
        setPetToDelete(pet);
        setConfirmDelete(true);
    };

    // Handle deleting a pet
    const handleDeletePet = async () => {
        if (!petToDelete) return;

        try {
            await deletePet(petToDelete.id);
            toast.success('Mascota eliminada correctamente');
            fetchPets();
            setConfirmDelete(false);
            setPetToDelete(null);
        } catch (error) {
            console.error('Error deleting pet:', error);
            toast.error('Error al eliminar mascota');
        }
    };

    // Handle form submit result (from child component)
    const handleFormSubmitResult = (success) => {
        if (success) {
            setOpenForm(false);
            fetchPets();
        }
    };

    // Filter pets based on search term
    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pet.owner && pet.owner.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pet.species && pet.species.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pet.breed && pet.breed.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Navigate to pet details
    const handleViewPetDetails = (id) => {
        navigate(`/pets/${id}`);
    };

    // Calculate age from birthdate
    const calculateAge = (birthDate) => {
        if (!birthDate) return 'Desconocida';

        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return `${age} años`;
    };

    // Format gender to display in Spanish
    const formatGender = (gender) => {
        if (!gender) return 'Desconocido';

        const genderMap = {
            'male': 'Macho',
            'female': 'Hembra',
            'unknown': 'Desconocido'
        };

        return genderMap[gender] || gender;
    };

    // DataGrid columns definition
    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {
            field: 'name',
            headerName: 'Nombre',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    {params.row.photoUrl ? (
                        <Box
                            component="img"
                            sx={{
                                height: 40,
                                width: 40,
                                borderRadius: '50%',
                                mr: 1,
                                objectFit: 'cover'
                            }}
                            src={params.row.photoUrl}
                            alt={params.row.name}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/40';
                            }}
                        />
                    ) : (
                        <PetsIcon sx={{mr: 1}}/>
                    )}
                    {params.value}
                </Box>
            )
        },
        {
            field: 'owner',
            headerName: 'Propietario',
            flex: 1,
            minWidth: 180,
            valueGetter: (params) => params.row.owner?.fullName || 'No asignado'
        },
        {
            field: 'species',
            headerName: 'Especie',
            width: 120,
            valueGetter: (params) => params.row.species?.name || 'Desconocida'
        },
        {
            field: 'breed',
            headerName: 'Raza',
            width: 150,
            valueGetter: (params) => params.row.breed?.name || 'Desconocida'
        },
        {
            field: 'gender',
            headerName: 'Género',
            width: 120,
            valueGetter: (params) => formatGender(params.row.gender)
        },
        {
            field: 'age',
            headerName: 'Edad',
            width: 100,
            valueGetter: (params) => calculateAge(params.row.birthDate)
        },
        {
            field: 'microchip',
            headerName: 'Microchip',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Sí' : 'No'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            ),
            valueGetter: (params) => Boolean(params.row.microchip)
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 160,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        color="info"
                        onClick={() => handleViewPetDetails(params.row.id)}
                        size="small"
                        title="Ver detalles"
                    >
                        <Visibility/>
                    </IconButton>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditPet(params.row)}
                        size="small"
                        title="Editar"
                    >
                        <Edit/>
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleConfirmDelete(params.row)}
                        size="small"
                        title="Eliminar"
                    >
                        <Delete/>
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Mascotas
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add/>}
                    onClick={handleAddPet}
                >
                    Nueva Mascota
                </Button>
            </Box>

            <Paper sx={{p: 2, mb: 3}}>
                <TextField
                    fullWidth
                    label="Buscar mascotas"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search/>
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearchTerm('')} edge="end">
                                    <Clear/>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{mb: 2}}
                />

                <div style={{height: 450, width: '100%'}}>
                    <DataGrid
                        rows={filteredPets}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        loading={loading}
                        disableSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none',
                            },
                        }}
                    />
                </div>
            </Paper>

            {/* Pet Form Dialog */}
            <PetForm
                open={openForm}
                pet={selectedPet}
                onClose={() => setOpenForm(false)}
                onSubmitResult={handleFormSubmitResult}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro de eliminar a la mascota "{petToDelete?.name}"? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                    <Button onClick={handleDeletePet} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PetsPage;