import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {Toaster} from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
                            {/* Aquí irían rutas adicionales protegidas */}
                            <Route path="*" element={<div>Página no encontrada</div>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;