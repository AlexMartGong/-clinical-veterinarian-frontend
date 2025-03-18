import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, Search, Clear, Visibility } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { toast } from 'react-hot-toast';
import { getAllOwners, deleteOwner } from '../api/ownerService';
import OwnerForm from '../components/OwnerForm';

const OwnersPage = () => {
    const navigate = useNavigate();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openForm, setOpenForm] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [ownerToDelete, setOwnerToDelete] = useState(null);

    // Fetch owners from the API
    const fetchOwners = async () => {
        try {
            setLoading(true);
            const data = await getAllOwners();
            setOwners(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching owners:', error);
            toast.error('Error al cargar los propietarios');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

    // Handle opening form for creating a new owner
    const handleAddOwner = () => {
        setSelectedOwner(null);
        setOpenForm(true);
    };

    // Handle opening form for editing an existing owner
    const handleEditOwner = (owner) => {
        setSelectedOwner(owner);
        setOpenForm(true);
    };

    // Handle confirming owner deletion
    const handleConfirmDelete = (owner) => {
        setOwnerToDelete(owner);
        setConfirmDelete(true);
    };

    // Handle deleting an owner
    const handleDeleteOwner = async () => {
        if (!ownerToDelete) return;

        try {
            await deleteOwner(ownerToDelete.id);
            toast.success('Propietario eliminado correctamente');
            fetchOwners();
            setConfirmDelete(false);
            setOwnerToDelete(null);
        } catch (error) {
            console.error('Error deleting owner:', error);
            toast.error('Error al eliminar propietario');
        }
    };

    // Handle form submit result (from child component)
    const handleFormSubmitResult = (success) => {
        if (success) {
            setOpenForm(false);
            fetchOwners();
        }
    };

    // Filter owners based on search term
    const filteredOwners = owners.filter(owner =>
        owner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.email && owner.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        owner.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Navigate to owner details
    const handleViewOwnerDetails = (id) => {
        navigate(`/owners/${id}`);
    };

    // DataGrid columns definition
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'fullName', headerName: 'Nombre Completo', flex: 1, minWidth: 200 },
        { field: 'phone', headerName: 'Teléfono', flex: 0.8, minWidth: 150 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        { field: 'address', headerName: 'Dirección', flex: 1, minWidth: 200 },
        {
            field: 'pets',
            headerName: 'Mascotas',
            width: 100,
            renderCell: (params) => {
                const petCount = params.row.pets?.length || 0;
                return (
                    <Chip
                        label={petCount}
                        color={petCount > 0 ? "primary" : "default"}
                        size="small"
                    />
                );
            }
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
                        onClick={() => handleViewOwnerDetails(params.row.id)}
                        size="small"
                        title="Ver detalles"
                    >
                        <Visibility />
                    </IconButton>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditOwner(params.row)}
                        size="small"
                        title="Editar"
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleConfirmDelete(params.row)}
                        size="small"
                        title="Eliminar"
                    >
                        <Delete />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Propietarios
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddOwner}
                >
                    Nuevo Propietario
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Buscar propietarios"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearchTerm('')} edge="end">
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={{ mb: 2 }}
                />

                <div style={{ height: 450, width: '100%' }}>
                    <DataGrid
                        rows={filteredOwners}
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

            {/* Owner Form Dialog */}
            <OwnerForm
                open={openForm}
                owner={selectedOwner}
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
                        ¿Está seguro de eliminar al propietario "{ownerToDelete?.fullName}"? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteOwner} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OwnersPage;