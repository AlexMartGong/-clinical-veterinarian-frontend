import {useState, useEffect} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    CircularProgress
} from '@mui/material';
import {toast} from 'react-hot-toast';
import {saveOwner} from '../api/ownerService';
import * as Yup from 'yup';
import {Formik, Form, Field, ErrorMessage} from 'formik';

// Validation schema
const OwnerSchema = Yup.object().shape({
    fullName: Yup.string()
        .required('El nombre es obligatorio')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    phone: Yup.string()
        .required('El teléfono es obligatorio')
        .max(20, 'El teléfono no puede exceder 20 caracteres'),
    email: Yup.string()
        .email('Email inválido')
        .max(100, 'El email no puede exceder 100 caracteres')
        .nullable(),
    address: Yup.string()
        .max(200, 'La dirección no puede exceder 200 caracteres')
        .nullable(),
    notes: Yup.string()
        .nullable()
});

const OwnerForm = ({open, owner, onClose, onSubmitResult}) => {
    const [loading, setLoading] = useState(false);
    const isEditing = Boolean(owner);

    // Initial form values
    const initialValues = {
        id: owner?.id || null,
        fullName: owner?.fullName || '',
        phone: owner?.phone || '',
        email: owner?.email || '',
        address: owner?.address || '',
        notes: owner?.notes || ''
    };

    // Handle form submission
    const handleSubmit = async (values, {setSubmitting, resetForm}) => {
        try {
            setLoading(true);
            await saveOwner(values);
            toast.success(`Propietario ${isEditing ? 'actualizado' : 'creado'} correctamente`);
            resetForm();
            onSubmitResult(true);
        } catch (error) {
            console.error('Error saving owner:', error);
            toast.error(`Error al ${isEditing ? 'actualizar' : 'crear'} propietario`);
            onSubmitResult(false);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {isEditing ? 'Editar Propietario' : 'Nuevo Propietario'}
            </DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={OwnerSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({errors, touched, isSubmitting}) => (
                    <Form>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="fullName"
                                        label="Nombre Completo *"
                                        fullWidth
                                        variant="outlined"
                                        error={touched.fullName && Boolean(errors.fullName)}
                                        helperText={touched.fullName && errors.fullName}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="phone"
                                        label="Teléfono *"
                                        fullWidth
                                        variant="outlined"
                                        error={touched.phone && Boolean(errors.phone)}
                                        helperText={touched.phone && errors.phone}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="email"
                                        label="Email"
                                        fullWidth
                                        variant="outlined"
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Field
                                        as={TextField}
                                        name="address"
                                        label="Dirección"
                                        fullWidth
                                        variant="outlined"
                                        error={touched.address && Boolean(errors.address)}
                                        helperText={touched.address && errors.address}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="notes"
                                        label="Notas"
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        error={touched.notes && Boolean(errors.notes)}
                                        helperText={touched.notes && errors.notes}
                                    />
                                </Grid>
                            </Grid>
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

export default OwnerForm;