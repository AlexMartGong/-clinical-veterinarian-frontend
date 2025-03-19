import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {Toaster} from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import OwnersPage from "./pages/OwnersPage.jsx";
import OwnerDetailsPage from "./pages/OwnerDetailsPage.jsx";
import PetsPage from "./pages/PetsPage.jsx";
import PetDetailsPage from "./pages/PetDetailsPage.jsx";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {es} from 'date-fns/locale';


const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3', // Azul
        },
        secondary: {
            main: '#ff9800', // Naranja
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <AuthProvider>
                    <BrowserRouter>
                        <Toaster position="top-right"/>
                        <Routes>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Layout/>
                                </ProtectedRoute>
                            }>
                                <Route index element={<DashboardPage/>}/>
                                {/* Rutas de propietarios */}
                                <Route path="owners" element={<OwnersPage/>}/>
                                <Route path="owners/:id" element={<OwnerDetailsPage/>}/>

                                {/* Rutas de mascotas */}
                                <Route path="pets" element={<PetsPage/>}/>
                                <Route path="pets/:id" element={<PetDetailsPage/>}/>

                                {/* Otras rutas protegidas */}
                                <Route path="*" element={<div>Página no encontrada</div>}/>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

export default App;