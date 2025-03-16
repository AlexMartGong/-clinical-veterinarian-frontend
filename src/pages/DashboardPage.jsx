import {useContext} from 'react';
import {Typography, Grid2, Paper, Box} from '@mui/material';
import {Pets, People, EventNote, MedicalServices} from '@mui/icons-material';
import {AuthContext} from '../context/AuthContext';

const StatCard = ({icon, title, value, color}) => {
    return (
        <Paper elevation={3} sx={{p: 3, borderRadius: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <Box sx={{
                    mr: 2,
                    bgcolor: `${color}.light`,
                    color: `${color}.main`,
                    borderRadius: 2,
                    p: 1,
                    display: 'flex'
                }}>
                    {icon}
                </Box>
                <Typography variant="h6" component="h2">
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4" component="div" sx={{fontWeight: 'bold'}}>
                {value}
            </Typography>
        </Paper>
    );
};

const DashboardPage = () => {
    const {user} = useContext(AuthContext);

    return (
        <Box>
            <Typography variant="h4" component="h1" sx={{mb: 2}}>
                Bienvenido, {user?.sub || 'Usuario'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 2}}>
                Resumen general del sistema de gestión veterinaria
            </Typography>

            <Grid2 container spacing={3} sx={{mt: 2}}>
                <Grid2 item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<Pets/>}
                        title="Mascotas Registradas"
                        value="152"
                        color="primary"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<People/>}
                        title="Propietarios"
                        value="87"
                        color="secondary"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<MedicalServices/>}
                        title="Consultas del Mes"
                        value="34"
                        color="success"
                    />
                </Grid2>
                <Grid2 item xs={12} sm={6} md={3}>
                    <StatCard
                        icon={<EventNote/>}
                        title="Vacunas Pendientes"
                        value="12"
                        color="warning"
                    />
                </Grid2>
            </Grid2>

            <Box sx={{mt: 4}}>
                <Typography variant="h5" component="h2" sx={{mb: 2}}>
                    Actividad Reciente
                </Typography>
                <Paper elevation={2} sx={{p: 3, borderRadius: 2}}>
                    <Typography variant="body1">
                        Próximas funcionalidades y actividades del sistema se mostrarán aquí.
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default DashboardPage;