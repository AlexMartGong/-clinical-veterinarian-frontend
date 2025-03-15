import {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {TextField, Button, Container, Box, Typography, Paper, InputAdornment, IconButton} from '@mui/material';
import {Visibility, VisibilityOff, Pets} from '@mui/icons-material';
import {toast} from 'react-hot-toast';
import {AuthContext} from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('El nombre de usuario es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
});

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (values, {setSubmitting}) => {
        try {
            const result = await login(values.username, values.password);
            if (result.success) {
                toast.success('Inicio de sesión exitoso');
                navigate('/');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Error al iniciar sesión');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{p: 4, width: '100%', borderRadius: 2}}>
                    <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                        <Pets sx={{color: 'primary.main', fontSize: 50}}/>
                    </Box>
                    <Typography component="h1" variant="h5" textAlign="center" gutterBottom>
                        Sistema de Gestión Veterinaria
                    </Typography>
                    <Typography component="h2" variant="subtitle1" textAlign="center" color="text.secondary" mb={4}>
                        Inicia sesión para continuar
                    </Typography>
                    <Formik
                        initialValues={{
                            username: '',
                            password: '',
                        }}
                        validationSchema={LoginSchema}
                        onSubmit={handleSubmit}
                    >
                        {({isSubmitting, touched, errors}) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    margin="normal"
                                    fullWidth
                                    id="username"
                                    label="Nombre de usuario"
                                    name="username"
                                    autoComplete="username"
                                    autoFocus
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={touched.username && errors.username}
                                />
                                <Field
                                    as={TextField}
                                    margin="normal"
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2, py: 1.5}}
                                    disabled={isSubmitting}
                                >
                                    Iniciar Sesión
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;