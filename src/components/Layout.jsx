import {useState, useContext} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import {Menu as MenuIcon, Pets, Event, MedicalServices, People, Logout, Dashboard} from '@mui/icons-material';
import {AuthContext} from '../context/AuthContext';

const Layout = () => {
    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        {text: 'Dashboard', icon: <Dashboard/>, onClick: () => navigate('/')},
        {text: 'Mascotas', icon: <Pets/>, onClick: () => navigate('/pets')},
        {text: 'Propietarios', icon: <People/>, onClick: () => navigate('/owners')},
        {text: 'Consultas', icon: <MedicalServices/>, onClick: () => navigate('/consultations')},
        {text: 'Vacunación', icon: <Event/>, onClick: () => navigate('/vaccinations')},
    ];

    return (
        <Box sx={{display: 'flex'}}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer(true)}
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Sistema de Gestión Veterinaria
                    </Typography>
                    {user && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar
                                    sx={{bgcolor: 'secondary.main'}}>{user.username?.charAt(0).toUpperCase()}</Avatar>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Perfil</MenuItem>
                                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{width: 250}}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <Box sx={{p: 2}}>
                        <Typography variant="h6" component="div">
                            Menú
                        </Typography>
                    </Box>
                    <Divider/>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem button key={item.text} onClick={item.onClick}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text}/>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List>
                        <ListItem button onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout/>
                            </ListItemIcon>
                            <ListItemText primary="Cerrar Sesión"/>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3, mt: 8}}>
                <Outlet/>
            </Box>
        </Box>
    );
};

export default Layout;