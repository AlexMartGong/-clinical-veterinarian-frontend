import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Divider,
    Grid,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    IconButton,
    Avatar,
    Tab,
    Tabs
} from '@mui/material';
import {
    Pets,
    Person,
    Cake,
    ColorLens,
    Scale,
    Medication,
    Edit,
    ArrowBack,
    NoteAdd,
    Vaccines
} from '@mui/icons-material';
import {toast} from 'react-hot-toast';
import {getPetById} from '../api/petService';
import PetForm from '../components/PetForm';

const TabPanel = (props) => {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`pet-tabpanel-${index}`}
            aria-labelledby={`pet-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{py: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const PetDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Fetch pet details
    const fetchPetDetails = async () => {
        try {
            setLoading(true);
            const data = await getPetById(id);
            setPet(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pet details:', error);
            toast.error('Error al cargar los datos de la mascota');
            setLoading(false);
            navigate('/pets');
        }
    };

    useEffect(() => {
        fetchPetDetails();
    }, [id]);

    // Handle form submit result
    const handleFormSubmitResult = (success) => {
        if (success) {
            setOpenForm(false);
            fetchPetDetails();
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress/>
            </Box>
        );
    }

    if (!pet) {
        return (
            <Box textAlign="center" my={5}>
                <Typography variant="h5">Mascota no encontrada</Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack/>}
                    onClick={() => navigate('/pets')}
                    sx={{mt: 2}}
                >
                    Volver a la lista
                </Button>
            </Box>
        );
    }

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

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';

        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={() => navigate('/pets')} sx={{mr: 1}}>
                    <ArrowBack/>
                </IconButton>
                <Typography variant="h4" component="h1">
                    Ficha de Mascota
                </Typography>
            </Box>

            <Paper sx={{p: 3, mb: 4}}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center">
                        <Avatar
                            src={pet.photoUrl}
                            alt={pet.name}
                            sx={{width: 100, height: 100, mr: 3}}
                        >
                            <Pets sx={{fontSize: 60}}/>
                        </Avatar>
                        <Box>
                            <Typography variant="h4" component="h2">
                                {pet.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {pet.species?.name} - {pet.breed?.name || 'Sin raza definida'}
                            </Typography>
                            <Box display="flex" gap={1} mt={1}>
                                <Chip
                                    label={formatGender(pet.gender)}
                                    color="primary"
                                    size="small"
                                />
                                {pet.microchip && (
                                    <Chip
                                        label="Con microchip"
                                        color="success"
                                        size="small"
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<Edit/>}
                        onClick={() => setOpenForm(true)}
                    >
                        Editar
                    </Button>
                </Box>
                <Divider sx={{my: 2}}/>

                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="pet details tabs">
                        <Tab label="Información General"/>
                        <Tab label="Historial Médico"/>
                        <Tab label="Vacunas"/>
                    </Tabs>
                </Box>

                {/* General Information Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Información Básica
                            </Typography>

                            <Box display="flex" alignItems="center" mb={2}>
                                <Cake sx={{mr: 1, color: 'primary.main'}}/>
                                <Typography variant="subtitle1" component="span" fontWeight="bold">
                                    Fecha de Nacimiento:
                                </Typography>
                                <Typography variant="body1" component="span" sx={{ml: 1}}>
                                    {formatDate(pet.birthDate)} ({calculateAge(pet.birthDate)})
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" mb={2}>
                                <ColorLens sx={{mr: 1, color: 'primary.main'}}/>
                                <Typography variant="subtitle1" component="span" fontWeight="bold">
                                    Color:
                                </Typography>
                                <Typography variant="body1" component="span" sx={{ml: 1}}>
                                    {pet.color || 'No registrado'}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" mb={2}>
                                <Scale sx={{mr: 1, color: 'primary.main'}}/>
                                <Typography variant="subtitle1" component="span" fontWeight="bold">
                                    Peso:
                                </Typography>
                                <Typography variant="body1" component="span" sx={{ml: 1}}>
                                    {pet.weightKg ? `${pet.weightKg} kg` : 'No registrado'}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" mb={2}>
                                <Medication sx={{mr: 1, color: 'primary.main'}}/>
                                <Typography variant="subtitle1" component="span" fontWeight="bold">
                                    Microchip:
                                </Typography>
                                <Typography variant="body1" component="span" sx={{ml: 1}}>
                                    {pet.microchip || 'No tiene'}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" component="h3" gutterBottom>
                                Información del Propietario
                            </Typography>

                            <Box display="flex" alignItems="center" mb={2}>
                                <Person sx={{mr: 1, color: 'primary.main'}}/>
                                <Typography variant="subtitle1" component="span" fontWeight="bold">
                                    Nombre:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        cursor: 'pointer',
                                        '&:hover': {textDecoration: 'underline', color: 'primary.main'}
                                    }}
                                    onClick={() => navigate(`/owners/${pet.owner.id}`)}
                                >
                                    {pet.owner?.fullName || 'No asignado'}
                                </Typography>
                            </Box>

                            {pet.owner && (
                                <>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Typography variant="subtitle1" component="span" fontWeight="bold" sx={{ml: 4}}>
                                            Teléfono:
                                        </Typography>
                                        <Typography variant="body1" component="span" sx={{ml: 1}}>
                                            {pet.owner.phone}
                                        </Typography>
                                    </Box>

                                    {pet.owner.email && (
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Typography variant="subtitle1" component="span" fontWeight="bold"
                                                        sx={{ml: 4}}>
                                                Email:
                                            </Typography>
                                            <Typography variant="body1" component="span" sx={{ml: 1}}>
                                                {pet.owner.email}
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Medical History Tab */}
                <TabPanel value={tabValue} index={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" component="h3">
                            Consultas Médicas
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<NoteAdd/>}
                            onClick={() => navigate(`/consultations/new?petId=${pet.id}`)}
                        >
                            Nueva Consulta
                        </Button>
                    </Box>

                    {pet.consultations && pet.consultations.length > 0 ? (
                        <List>
                            {pet.consultations.map((consultation) => (
                                <ListItem
                                    key={consultation.id}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        mb: 2
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="subtitle1">
                                                    {new Date(consultation.consultationDate).toLocaleString('es-ES')}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Atendido por: {consultation.user?.fullName || 'No registrado'}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    display="block"
                                                >
                                                    Motivo: {consultation.reason}
                                                </Typography>
                                                {consultation.diagnosis && (
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        display="block"
                                                    >
                                                        Diagnóstico: {consultation.diagnosis}
                                                    </Typography>
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box textAlign="center" py={3}>
                            <Typography variant="body1" color="text.secondary">
                                No hay consultas registradas para esta mascota.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<NoteAdd/>}
                                onClick={() => navigate(`/consultations/new?petId=${pet.id}`)}
                                sx={{mt: 2}}
                            >
                                Registrar Consulta
                            </Button>
                        </Box>
                    )}
                </TabPanel>

                {/* Vaccinations Tab */}
                <TabPanel value={tabValue} index={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" component="h3">
                            Registro de Vacunas
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Vaccines/>}
                            onClick={() => navigate(`/vaccinations/new?petId=${pet.id}`)}
                        >
                            Nueva Vacuna
                        </Button>
                    </Box>

                    {pet.vaccinations && pet.vaccinations.length > 0 ? (
                        <List>
                            {pet.vaccinations.map((vaccination) => (
                                <ListItem
                                    key={vaccination.id}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        mb: 2
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box display="flex" justifyContent="space-between">
                                                <Typography variant="subtitle1">
                                                    {vaccination.vaccineCatalog?.name || 'Vacuna no especificada'}
                                                </Typography>
                                                <Chip
                                                    label={vaccination.nextApplicationDate ? 'Próxima dosis programada' : 'Completa'}
                                                    color={vaccination.nextApplicationDate ? 'warning' : 'success'}
                                                    size="small"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                    display="block"
                                                >
                                                    Fecha aplicación: {formatDate(vaccination.applicationDate)}
                                                </Typography>
                                                {vaccination.nextApplicationDate && (
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        display="block"
                                                    >
                                                        Próxima
                                                        aplicación: {formatDate(vaccination.nextApplicationDate)}
                                                    </Typography>
                                                )}
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    display="block"
                                                >
                                                    Aplicada por: {vaccination.user?.fullName || 'No registrado'}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box textAlign="center" py={3}>
                            <Typography variant="body1" color="text.secondary">
                                No hay vacunas registradas para esta mascota.
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Vaccines/>}
                                onClick={() => navigate(`/vaccinations/new?petId=${pet.id}`)}
                                sx={{mt: 2}}
                            >
                                Registrar Vacuna
                            </Button>
                        </Box>
                    )}
                </TabPanel>
            </Paper>

            {/* Pet Form Dialog */}
            <PetForm
                open={openForm}
                pet={pet}
                onClose={() => setOpenForm(false)}
                onSubmitResult={handleFormSubmitResult}
            />
        </Box>
    );
};

export default PetDetailsPage;