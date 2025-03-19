import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Grid2,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    CircularProgress,
    IconButton
} from '@mui/material';
import {
    Person,
    Phone,
    Email,
    LocationOn,
    Notes,
    Pets,
    Edit,
    ArrowBack
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { getOwnerById } from '../api/ownerService';
import OwnerForm from '../components/OwnerForm';

const OwnerDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);

    // Fetch owner details
    const fetchOwnerDetails = async () => {
        try {
            setLoading(true);
            const data = await getOwnerById(id);
            setOwner(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching owner details:', error);
            toast.error('Error al cargar los datos del propietario');
            setLoading(false);
            navigate('/owners');
        }
    };

    useEffect(() => {
        fetchOwnerDetails();
    }, [id]);

    // Handle form submit result
    const handleFormSubmitResult = (success) => {
        if (success) {
            setOpenForm(false);
            fetchOwnerDetails();
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!owner) {
        return (
            <Box textAlign="center" my={5}>
                <Typography variant="h5">Propietario no encontrado</Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/owners')}
                    sx={{ mt: 2 }}
                >
                    Volver a la lista
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={() => navigate('/owners')} sx={{ mr: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Detalles del Propietario
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" component="h2">
                        Información Personal
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => setOpenForm(true)}
                    >
                        Editar
                    </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid2 container spacing={3}>
                    <Grid2 item xs={12} md={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Person sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                                Nombre Completo:
                            </Typography>
                            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                                {owner.fullName}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <Phone sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                                Teléfono:
                            </Typography>
                            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                                {owner.phone}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <Email sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                                Email:
                            </Typography>
                            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                                {owner.email || 'No disponible'}
                            </Typography>
                        </Box>
                    </Grid2>

                    <Grid2 item xs={12} md={6}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                                Dirección:
                            </Typography>
                            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
                                {owner.address || 'No disponible'}
                            </Typography>
                        </Box>

                        {owner.notes && (
                            <Box display="flex" alignItems="flex-start" mb={2}>
                                <Notes sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                                <Box>
                                    <Typography variant="subtitle1" component="span" fontWeight="bold">
                                        Notas:
                                    </Typography>
                                    <Typography variant="body1" component="p" sx={{ mt: 0.5 }}>
                                        {owner.notes}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Grid2>
                </Grid2>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" component="h2">
                        Mascotas
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/pets/new?ownerId=${owner.id}`)}
                    >
                        Agregar Mascota
                    </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {owner.pets && owner.pets.length > 0 ? (
                    <List>
                        {owner.pets.map((pet) => (
                            <ListItem
                                key={pet.id}
                                button
                                onClick={() => navigate(`/pets/${pet.id}`)}
                                sx={{
                                    mb: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={pet.photoUrl || ''} alt={pet.name}>
                                        <Pets />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={pet.name}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                {`${pet.species?.name || ''} - ${pet.breed?.name || ''}`}
                                            </Typography>
                                            {` — ${pet.gender}, ${pet.birthDate ? calculateAge(pet.birthDate) : 'Edad desconocida'}`}
                                        </>
                                    }
                                />
                                <Chip
                                    label={pet.microchip ? 'Con microchip' : 'Sin microchip'}
                                    size="small"
                                    color={pet.microchip ? 'success' : 'default'}
                                    sx={{ ml: 1 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Box textAlign="center" py={3}>
                        <Typography variant="body1" color="text.secondary">
                            Este propietario no tiene mascotas registradas.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Pets />}
                            onClick={() => navigate(`/pets/new?ownerId=${owner.id}`)}
                            sx={{ mt: 2 }}
                        >
                            Registrar Mascota
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Owner Form Dialog */}
            <OwnerForm
                open={openForm}
                owner={owner}
                onClose={() => setOpenForm(false)}
                onSubmitResult={handleFormSubmitResult}
            />
        </Box>
    );
};

// Helper function to calculate age from birthdate
const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return `${age} años`;
};

export default OwnerDetailsPage;