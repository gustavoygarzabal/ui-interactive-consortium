import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Grid, Snackbar,
    TablePagination,
    TextField
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import {AdminManageContext} from "../AdminManageContext.jsx";
import DeleteIcon from "@mui/icons-material/Delete.js";
import EditIcon from "@mui/icons-material/Edit";
import AdminCreateAmenity from "./AdminCreateAmenity.jsx";
import {jwtDecode} from "jwt-decode";

const columns = [
    { id: 'name', label: 'Espacio Común', minWidth: 100 },
    { id: 'maxBookings', label: 'Reservas Máximas', minWidth: 100 }
]

function AdminAmenitiesManagement(){
    const {consortiumIdState, getAConsortiumByIdConsortium, consortiumName, allAmenities,
        setAllAmenities, getAllAmenitiesByIdConsortium } = useContext(AdminManageContext)
    const [amenityName, setAmenityName] = useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [idAmenityUpdate, setIdAmenityUpdate] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [editName, setEditName] = useState('')
    const [editMaxBooking, setEditMaxBooking] = useState('')
    const [idAmenityCreated, setIdAmenityCreated] = useState(null)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [amenityUpdate, setAmenityUpdate] = useState(true);
    const [openAlert, setOpenAlert] = useState(false)
    const [amenitytInfo, setAmenitytInfo] = useState({})

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpenEdit = (idAmenityToEdit, amenityNameEdit, amenityMaxBookingEdit) => {
        setIdAmenityUpdate(idAmenityToEdit)
        setEditName(amenityNameEdit)
        setEditMaxBooking(amenityMaxBookingEdit)
        setOpenEdit(true)
    }

    const handleCloseEdit = () => {
        setOpenEdit(false)
        setIdAmenityUpdate(null)
        setAmenitytInfo({})
    }

    const handleClickOpen = (idAmenityToDelete) => {
        setIdAmenityCreated(idAmenityToDelete)
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false)
        setIdAmenityCreated(null)
    };

    const handleOpenAlert = () => {
        setOpenAlert(true);
    }

    const handleCloseAlert= (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    useEffect(() => {
        if (openEdit){
            setAmenitytInfo({
                amenityId: idAmenityUpdate,
                name: editName || "",
                maxBookings: editMaxBooking || "",
                consortium: {
                    consortiumId: consortiumIdState
                }
            })
        }

    }, [idAmenityUpdate, editName, editMaxBooking]);

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setAmenitytInfo(values => ({...values, [name]: value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Obtén el token almacenado
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detener la ejecución si no hay token
        }

        // Decodifica el token para verificar el rol
        const decodedToken = jwtDecode(token);
        const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');
        if (!isAdmin) {
            alert("No tienes permisos para realizar esta acción.");
            return; // Detener la ejecución si no es ROLE_ADMIN
        }

        // Si la validación es exitosa, proceder con la solicitud
        const url = `${import.meta.env.VITE_API_BASE_URL}/Amenities`;

        try {
            await axios.put(url, amenitytInfo, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
                },
            });
            setText('Se realizó la actualización correctamente');
            setAmenityUpdate(true);
            handleCloseEdit();
        } catch (exception) {
            setAmenityUpdate(false);

            switch (exception.response?.status) {
                case 404:
                    setText('No se realizó la actualización porque el espacio común o consorcio no existe');
                    break;
                case 409:
                    setText('Ya existe un espacio común con ese nombre en este consorcio');
                    break;
                default:
                    setText('No se realizó la actualización debido a un error de datos');
            }
        } finally {
            handleOpenAlert();
            getAllAmenitiesByIdConsortium();
        }
    };

    useEffect(() => {
        if (amenityName === '' ){
            getAllAmenitiesByIdConsortium()
        }
    }, [amenityName]);

    useEffect(() => {
        getAConsortiumByIdConsortium();
    }, [consortiumIdState]);

    const getAllAmenitiesByFilter = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detenemos la ejecución si no hay token
        }

        // Decodifica el token para verificar el rol
        const decodedToken = jwtDecode(token);
        const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');
        if (!isAdmin) {
            alert("No tienes permisos para realizar esta acción.");
            return; // Detenemos la ejecución si no tiene el rol ROLE_ADMIN
        }

        // Si el usuario tiene permisos, continúa con la ejecución
        const handleEmptyValues = (value) => {
            return value === '' ? null : value;
        };

        const name = handleEmptyValues(amenityName);
        let params = { idConsortium: consortiumIdState };

        if (name !== null) params.name = name;

        if (Object.keys(params).length === 1 && params.idConsortium) {
            getAllAmenitiesByIdConsortium();
        } else {
            const queryParams = new URLSearchParams(params).toString();
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/Amenities/filterBy?${queryParams}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Incluimos el token en los encabezados
                        },
                    }
                );

                const amenities = res.data.content;
                setAllAmenities(
                    amenities.map((amenity) => {
                        return {
                            amenityId: amenity.amenityId,
                            name: amenity.name,
                            maxBookings: amenity.maxBookings,
                        };
                    })
                );
            } catch (error) {
                console.error("Error al filtrar amenities:", error);
                alert("Ocurrió un error al obtener los datos.");
            }
        }
    };

    const deleteAmenity = async (idAmenityToDelete) =>{
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detenemos la ejecución si no hay token
        }

        // Decodifica el token para verificar el rol
        const decodedToken = jwtDecode(token);
        const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');
        if (!isAdmin) {
            alert("No tienes permisos para realizar esta acción.");
            return; // Detenemos la ejecución si no tiene el rol ROLE_ADMIN
        }

        // Continúa con la eliminación si el usuario tiene permisos
        try {
            console.log(idAmenityToDelete);
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/Amenities/${idAmenityToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluimos el token en los encabezados
                },
            });

            // Actualiza el estado local tras eliminar
            setAllAmenities(allAmenities.filter((amenity) => amenity.amenityId !== idAmenityToDelete));
            alert("Amenity eliminado exitosamente.");
        } catch (error) {
            console.error("Error al eliminar el amenity:", error);
            if (error.response?.status === 403) {
                alert("No tienes permiso para realizar esta acción.");
            } else {
                alert("Ocurrió un error al intentar eliminar el amenity.");
            }
        }
    };

    return(
        <div>
            <Box
                sx={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    // Ajustar padding dependiendo del tamaño de la pantalla
                    paddingX: { xs: '10px', sm: '20px', md: '40px' }
                }}
            >
                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#003366',
                        // Ajustar el tamaño de la fuente para diferentes tamaños de pantalla
                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }
                    }}
                >
                    Espacios Comunes de {consortiumName}
                </Typography>
            </Box>
            <Paper
                elevation={2}
                sx={{
                    padding: 2,
                    margin: 'auto',
                    marginTop: '20px',
                    width: { xs: '90%', sm: '80%', md: '40%', lg: '30%' },
                }}
            >
                <Box
                    mt={3}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center', // Cambiado para centrar el input
                        gap: '16px', // Espacio entre los inputs si hay más
                        width: '100%',
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Nombre"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={amenityName}
                        onChange={(e) => {
                            setAmenityName(e.target.value);
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#002776', // Azul Francia oscuro
                                },
                            },
                            '& label.Mui-focused': {
                                color: '#002776', // Cambia el color del label al enfocarse
                            },
                        }}
                    />
                </Box>

                <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#002776',
                            '&:hover': { backgroundColor: '#001B5E' },
                            marginRight: '10px',
                        }}
                        onClick={getAllAmenitiesByFilter}
                    >
                        Buscar
                    </Button>
                    <AdminCreateAmenity/>
                </Box>
            </Paper>
            <Paper
                elevation={2}
                sx={{
                    padding: 2,
                    margin: 'auto',
                    marginTop: '20px',
                    width: { xs: '95%', sm: '85%', md: '45%', lg: '35%' },
                }}
            >
                <Box display="flex" justifyContent="center" mt={3}>
                    <Paper sx={{ width: '90%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow sx={{ height: '24px' }}>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth, backgroundColor: '#F5F5DC', color:'#002776',  fontWeight: 'bold', padding: '4px'  }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" style={{ minWidth: 60, backgroundColor: '#F5F5DC', fontWeight: 'bold', padding: '1px' }}>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allAmenities
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((amenity) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={amenity.name} sx={{ height: '24px' }}>
                                                    {columns.map((column) => {
                                                        const value = amenity[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align} style={{
                                                                padding: '4px',
                                                                minWidth: column.minWidth
                                                            }}>
                                                                {value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell align="center" style={{ padding: '4px',  minWidth: 60 }}>
                                                        <IconButton aria-label="edit" onClick={() =>
                                                            handleClickOpenEdit(
                                                                amenity.amenityId,
                                                                amenity.name,
                                                                amenity.maxBookings)
                                                        } sx={{ padding: '2px' }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" onClick={() => handleClickOpen(amenity.amenityId)} sx={{ padding: '2px' }}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 50]}
                            component="div"
                            count={allAmenities.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                        />
                    </Paper>
                </Box>
            </Paper>
            <Dialog
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleClose();
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: '#E5E5E5',  color: '#002776', textAlign: 'center' }}>
                    {"Desea eliminar este Espacio Comun ?"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#E5E5E5' }}>
                    <DialogContentText id="alert-dialog-description">
                        Si acepta se eliminara el espacio comun deseado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#E5E5E5' }}>
                    <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: '#002776', '&:hover': { backgroundColor: '#001B5E' } }}>Rechazar</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#3D9970' } }} onClick={() => {
                        deleteAmenity(idAmenityCreated)
                        handleClose()
                    }
                    }>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openEdit}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleCloseEdit();
                    }
                }}
            >
                <DialogTitle sx={{ backgroundColor: '#E5E5E5',  color: '#002776', textAlign: 'center' }}>Actualizar Información</DialogTitle>
                <DialogContent sx={{ backgroundColor: '#E5E5E5' }}>
                    <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#EDEDED',  marginTop: '10px'}}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Espacio Común"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="name"
                                        value={amenitytInfo.name !== undefined ? amenitytInfo.name : editName || ''}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Máximas Reservas"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="maxBookings"
                                        value={amenitytInfo.maxBookings !== undefined ? amenitytInfo.maxBookings : editMaxBooking || ''}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#E5E5E5' }}>
                    <Button onClick={handleCloseEdit} variant="contained" sx={{ backgroundColor: '#002776', '&:hover': { backgroundColor: '#001B5E' } }}>
                        Cancelar
                    </Button>
                    <Button type="submit" color="primary" onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#228B22' } }}>
                        Guardar
                    </Button>

                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={amenityUpdate ? "success" : "error"} sx={{width: '100%'}}>
                    {text}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default AdminAmenitiesManagement