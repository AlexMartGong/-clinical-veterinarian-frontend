import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid2,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Typography,
    InputAdornment,
    Box,
    Avatar
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {es} from 'date-fns/locale';
import {toast} from 'react-hot-toast';
import {savePet, getAllSpecies, getAllBreeds} from '../api/petService';
import {getAllOwners} from '../api/ownerService';
import * as Yup from 'yup';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {Pets, Upload} from '@mui/icons-material';

// Validation schema
const PetSchema = Yup.object().shape({
    name: Yup.string()
        .required('El nombre es obligatorio')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    ownerId: Yup.number()
        .required('El propietario es obligatorio'),
    speciesId: Yup.number()
        .required('La especie es obligatoria'),
    breedId: Yup.number()
        .nullable(),
    birthDate: Yup.date()
        .nullable()
        .max(new Date(), 'La fecha de nacimiento no puede ser futura'),
    gender: Yup.string()
        .required('El género es obligatorio'),
    color: Yup.string()
        .max(50, 'El color no puede exceder 50 caracteres')
        .nullable(),
    weightKg: Yup.number()
        .positive('El peso debe ser positivo')
        .max(999.99, 'El peso no puede exceder 999.99 kg')
        .nullable(),
    microchip: Yup.string()
        .max(50, 'El número de microchip no puede exceder 50 caracteres')
        .nullable(),
    photoUrl: Yup.string()
        .max(255, 'La URL de la foto no puede exceder 255 caracteres')
        .nullable()
});

const PetForm = ({open, pet, onClose, onSubmitResult}) => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [owners, setOwners] = useState([]);
    const [species, setSpecies] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [filteredBreeds, setFilteredBreeds] = useState([]);
    const isEditing = Boolean(pet);

    // Fetch owners, species and breeds
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ownersData, speciesData, breedsData] = await Promise.all([
                    getAllOwners(),
                    getAllSpecies(),
                    getAllBreeds()
                ]);
                setOwners(ownersData);
                setSpecies(speciesData);
                setBreeds(breedsData);
            } catch (error) {
                console.error('Error fetching form data:', error);
                toast.error('Error al cargar los datos del formulario');
            }
        };

        fetchData();
    }, []);

    // Filter breeds based on selected species
    const filterBreedsBySpecies = (speciesId) => {
        if (!speciesId) {
            setFilteredBreeds([]);
            return;
        }

        const filtered = breeds.filter(breed => breed.species.id === speciesId);
        setFilteredBreeds(filtered);
    };

    // Initial form values
    const getInitialValues = () => {
        // If editing an existing pet
        if (isEditing) {
            return {
                id: pet?.id || null,
                name: pet?.name || '',
                ownerId: pet?.owner?.id || '',
                speciesId: pet?.species?.id || '',
                breedId: pet?.breed?.id || '',
                birthDate: pet?.birthDate ? new Date(pet.birthDate) : null,
                gender: pet?.gender || '',
                color: pet?.color || '',
                weightKg: pet?.weightKg || '',
                microchip: pet?.microchip || '',
                photoUrl: pet?.photoUrl || ''
            };
        }

        // For new pet, check if ownerId is provided in URL
        const ownerIdFromUrl = searchParams.get('ownerId');

        return {
            id: null,
            name: '',
            ownerId: ownerIdFromUrl || '',
            speciesId: '',
            breedId: '',
            birthDate: null,
            gender: '',
            color: '',
            weightKg: '',
            microchip: '',
            photoUrl: ''
        };
    };

    // Handle form submission
    const handleSubmit = async (values, {setSubmitting, resetForm}) => {
        try {
            setLoading(true);

            // Convert values to match backend structure
            const petData = {
                ...values,
                owner: {id: values.ownerId},
                species: {id: values.speciesId},
                breed: values.breedId ? {id: values.breedId} : null,
            };

            await savePet(petData);
            toast.success(`Mascota ${isEditing ? 'actualizada' : 'creada'} correctamente`);
            resetForm();
            onSubmitResult(true);
        } catch (error) {
            console.error('Error saving pet:', error);
            toast.error(`Error al ${isEditing ? 'actualizar' : 'crear'} mascota`);
            onSubmitResult(false);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    // Handle species change to filter breeds
    const handleSpeciesChange = (event, setFieldValue) => {
        const speciesId = event.target.value;
        setFieldValue('speciesId', speciesId);
        setFieldValue('breedId', ''); // Reset breed when species changes
        filterBreedsBySpecies(speciesId);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {isEditing ? 'Editar Mascota' : 'Nueva Mascota'}
            </DialogTitle>
            <Formik
                initialValues={getInitialValues()}
                validationSchema={PetSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({errors, touched, isSubmitting, values, setFieldValue}) => (
                    <Form>
                        <DialogContent>
                            {/* Preview image if photoUrl exists */}
                            {values.photoUrl && (
                                <Box display="flex" justifyContent="center" mb={3}>
                                    <Avatar
                                        src={values.photoUrl}
                                        alt={values.name}
                                        sx={{width: 150, height: 150}}
                                    >
                                        <Pets sx={{fontSize: 80}}/>
                                    </Avatar>
                                </Box>
                            )}

                            <Grid2 container spacing={2}>
                                <Grid2 item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="name"
                                        label="Nombre *"
                                        fullWidth
                                        variant="outlined"
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </Grid2>

                                <Grid2 item xs={12} md={6}>
                                    <FormControl
                                        fullWidth
                                        error={touched.ownerId && Boolean(errors.ownerId)}
                                    >
                                        <InputLabel id="owner-label">Propietario *</InputLabel>
                                        <Field
                                            as={Select}
                                            labelId="owner-label"
                                            name="ownerId"
                                            label="Propietario *"
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione un propietario</em>
                                            </MenuItem>
                                            {owners.map((owner) => (
                                                <MenuItem key={owner.id} value={owner.id}>
                                                    {owner.fullName}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                        {touched.ownerId && errors.ownerId && (
                                            <FormHelperText>{errors.ownerId}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid2>

                                <Grid2 item xs={12} md={6}>
                                    <FormControl
                                        fullWidth
                                        error={touched.speciesId && Boolean(errors.speciesId)}
                                    >
                                        <InputLabel id="species-label">Especie *</InputLabel>
                                        <Select
                                            labelId="species-label"
                                            name="speciesId"
                                            label="Especie *"
                                            value={values.speciesId}
                                            onChange={(e) => handleSpeciesChange(e, setFieldValue)}
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione una especie</em>
                                            </MenuItem>
                                            {species.map((species) => (
                                                <MenuItem key={species.id} value={species.id}>
                                                    {species.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.speciesId && errors.speciesId && (
                                            <FormHelperText>{errors.speciesId}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid2>

                                <Grid2 item xs={12} md={6}>
                                    <FormControl
                                        fullWidth
                                        error={touched.breedId && Boolean(errors.breedId)}
                                        disabled={!values.speciesId}
                                    >
                                        <InputLabel id="breed-label">Raza</InputLabel>
                                        <Field
                                            as={Select}
                                            labelId="breed-label"
                                            name="breedId"
                                            label="Raza"
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione una raza</em>
                                            </MenuItem>
                                            {filteredBreeds.map((breed) => (
                                                <MenuItem key={breed.id} value={breed.id}>
                                                    {breed.name}
                                                </MenuItem>
                                            ))}
                                        </Field>
                                        {touched.breedId && errors.breedId && (
                                            <FormHelperText>{errors.breedId}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid2>

                                <Grid2 item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DatePicker
                                            label="Fecha de Nacimiento"
                                            value={values.birthDate}
                                            onChange={(date) => setFieldValue('birthDate', date)}
                                            maxDate={new Date()}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    variant: 'outlined',
                                                    error: touched.birthDate && Boolean(errors.birthDate),
                                                    helperText: touched.birthDate && errors.birthDate
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid2>

                                <Grid2 item xs={12} md={6}>
                                    <FormControl
                                        fullWidth
                                        error={touched.gender && Boolean(errors.gender)}
                                    >
                                        <InputLabel id="gender-label">Género *</InputLabel>
                                        <Field
                                            as={Select}
                                            labelId="gender-label"
                                            name="gender"
                                            label="Género *"
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione un género</em>
                                            </MenuItem>
                                            <MenuItem value="male">Macho</MenuItem>
                                            <MenuItem value="female">Hembra</MenuItem>
                                            <MenuItem value="unknown">Desconocido</MenuItem>
                                        </Field>
                                        {touched.gender && errors.gender && (
                                            <FormHelperText>{errors.gender}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid2>

                                <Grid2 item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="color"
                                        label="Color"
                                        fullWidth
                                        variant="outlined"
                                        error={touched.color && Boolean(errors.color)}
                                        helperText={touched.color && errors.color}
                                    />
                                </Grid2>

                                <Grid2 item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="weightKg"
                                        label="Peso (kg)"
                                        fullWidth
                                        variant="outlined"
                                        type="number"
                                        InputProps={{
                                            inputProps: {min: 0, step: 0.01},
                                            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                        }}
                                        error={touched.weightKg && Boolean(errors.weightKg)}
                                        helperText={touched.weightKg && errors.weightKg}
                                    />
                                </Grid2>

                                <Grid2 item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="microchip"
                                        label="Microchip"
                                        fullWidth
                                        variant="outlined"
                                        error={touched.microchip && Boolean(errors.microchip)}
                                        helperText={touched.microchip && errors.microchip}
                                    />
                                </Grid2>

                                <Grid2 item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="photoUrl"
                                        label="URL de la foto"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Upload/>
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={touched.photoUrl && Boolean(errors.photoUrl)}
                                        helperText={touched.photoUrl && errors.photoUrl}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Ingrese la URL de una imagen de la mascota
                                    </Typography>
                                </Grid2>
                            </Grid2>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || isSubmitting}
                            >
                                {loading ? <CircularProgress size={24}/> : 'Guardar'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default PetForm;