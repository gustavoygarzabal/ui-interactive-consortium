import {
    Alert,
    Box, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Grid, Snackbar,
    TablePagination,
    TextField
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete.js";
import axios from "axios";
import Button from "@mui/material/Button";
import SuperAdminCreateAdministrator from "./SuperAdminCreateAdministrator.jsx";
import EditIcon from "@mui/icons-material/Edit";
import {SuperAdminManagesAdministratorContext} from "./SuperAdminManagesAdministratorContext.jsx";
import Typography from "@mui/material/Typography";
import {jwtDecode} from "jwt-decode";


const columns = [
    { id: 'name', label: 'Nombre', minWidth: 100 },
    { id: 'lastName', label: 'Apellido', minWidth: 100 },
    { id: 'mail', label: 'Correo Electrónico', minWidth: 100 },
    { id: 'dni', label: 'Dni', minWidth: 100 }
];


function SuperAdminManagesAdministrator(){
    const {allAdministrator, setAllAdministrator, getAllAdministrator} = useContext(SuperAdminManagesAdministratorContext)
    const [administratorName, setAdministratorName] = useState('')
    const [administratorLastName, setAdministratorLastName] = useState('')
    const [administratorMail, setAdministratorMail] = useState('')
    const [administratorDni, setAdministratorDni] = useState('')
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [idAdministratorCreated, setIdAdministratorCreated] = useState(null)
    const [idAdministratorUpdate, setIdAdministratorUpdate] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [editAdministratorName, setEditAdministratorName] = useState('')
    const [editAdministratorLastName, setEditAdministratorLastName] = useState('')
    const [editAdministratorMail, setEditAdministratorMail] = useState('')
    const [editAdministratorDni, setEditAdministratorDni] = useState('')
    const [adminInfo, setAdminInfo] = useState({})
    const [text, setText] = useState('')
    const [adminUpdate, setAdminUpdate] = useState(true);
    const [errors, setErrors] = useState({
        name: false,
        lastName: false,
        mail: false,
        dni: false
    })
    const validateFields = () => {
        const nameRegex = /^[A-Za-z]+$/
        const mailRegex = /.+@.+\..+/
        const dniRegex = /^[0-9]+$/

        setErrors({
            name: !nameRegex.test(adminInfo.name),
            lastName: !nameRegex.test(adminInfo.lastName),
            mail: !mailRegex.test(adminInfo.mail),
            dni: !dniRegex.test(adminInfo.dni)
        })

        return (
            nameRegex.test(adminInfo.name) &&
            nameRegex.test(adminInfo.lastName) &&
            mailRegex.test(adminInfo.mail) &&
            dniRegex.test(adminInfo.dni)
        )
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = (idAdministratorToDelete) => {
        setIdAdministratorCreated(idAdministratorToDelete)
        setOpen(true)
        console.log(idAdministratorCreated)
    };

    const handleClickOpenEdit = (idAdministratorToEdit, administratorNameEdit, administratorLastNameEdit, administratorMailEdit, administratorDniEdit) => {
        setIdAdministratorUpdate(idAdministratorToEdit)
        setEditAdministratorName(administratorNameEdit)
        setEditAdministratorLastName(administratorLastNameEdit)
        setEditAdministratorMail(administratorMailEdit)
        setEditAdministratorDni(administratorDniEdit)
        setOpenEdit(true);
    }

    const handleClose = () => {
        setOpen(false)
        setIdAdministratorCreated(null)
    };

    const handleCloseEdit = () => {
        setOpenEdit(false)
        setIdAdministratorUpdate(null)
        setErrors({
            name: false,
            lastName: false,
            mail: false,
            dni: false
        })
        setAdminInfo({
            name: '',
            lastName: '',
            mail: '',
            dni: '',
        })
    }
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
            setAdminInfo({
                administratorId: idAdministratorUpdate,
                name: editAdministratorName || "",
                lastName: editAdministratorLastName || "",
                mail: editAdministratorMail || "",
                dni: editAdministratorDni || "",
            });
        }

    }, [idAdministratorUpdate, editAdministratorName, editAdministratorLastName, editAdministratorMail, editAdministratorDni]);
    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setAdminInfo(values => ({...values, [name]: value}))
    }

    useEffect(() => {
        if (administratorName === '' && administratorLastName === '' && administratorMail === '' && administratorDni === '') {
            getAllAdministrator()
        }
    }, [administratorName, administratorLastName, administratorMail, administratorDni]);

    const getAllAdministratorByFilter = async () => {
        const token = localStorage.getItem('token'); // Obtén el token almacenado

        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detiene la ejecución si no hay token
        }

        try {
            // Decodifica el token y verifica si tiene el rol de SuperAdmin
            const decodedToken = jwtDecode(token);
            const isSuperAdmin = decodedToken?.role?.includes('ROLE_ROOT');

            if (!isSuperAdmin) {
                alert("No tienes permisos para realizar esta acción.");
                return; // Detiene la ejecución si no es SuperAdmin
            }

            const handleEmptyValues = (value) => {
                return value === '' ? null : value;
            };

            const name = handleEmptyValues(administratorName);
            const lastName = handleEmptyValues(administratorLastName);
            const mail = handleEmptyValues(administratorMail);
            const dni = handleEmptyValues(administratorDni);

            let params = {};
            if (name !== null) params.name = name;
            if (lastName !== null) params.lastName = lastName;
            if (mail !== null) params.mail = mail;
            if (dni !== null) params.dni = dni;

            if (Object.keys(params).length === 0) {
                getAllAdministrator(); // Si no hay filtros, llama a la función general
            } else {
                const queryParams = new URLSearchParams(params).toString();
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/administrators/filtersBy?${queryParams}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Incluye el token en los encabezados
                        }
                    }
                );

                const administrators = res.data.content;
                setAllAdministrator(administrators.map(administrator => {
                    return {
                        administratorId: administrator.administratorId,
                        name: administrator.name,
                        lastName: administrator.lastName,
                        mail: administrator.mail,
                        dni: administrator.dni
                    };
                }));
            }
        } catch (error) {
            console.error("Error al validar el token o realizar la solicitud:", error);
            alert("Ocurrió un error al intentar realizar la acción. Por favor, inténtalo nuevamente.");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Obtiene el token almacenado en el localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detiene la ejecución si no hay token
        }

        try {
            // Decodifica el token y verifica si tiene el rol de SuperAdmin
            const decodedToken = jwtDecode(token);
            const isSuperAdmin = decodedToken?.role?.includes('ROLE_ROOT');

            if (!isSuperAdmin) {
                alert("No tienes permisos para realizar esta acción.");
                return; // Detiene la ejecución si no es SuperAdmin
            }

            // Si el token es válido y tiene el rol adecuado, continúa con el proceso
            if (validateFields()) {
                console.log(adminInfo);
                let url = `${import.meta.env.VITE_API_BASE_URL}/administrators`;

                try {
                    // Realiza la actualización
                    await axios.put(url, adminInfo, {
                        headers: {
                            Authorization: `Bearer ${token}` // Incluye el token en los encabezados de la solicitud
                        }
                    });
                    setText('Se realizó la actualización correctamente');
                    setAdminUpdate(true);
                    handleCloseEdit();

                } catch (exception) {
                    setAdminUpdate(false);
                    switch (exception.response.status) {
                        case 409:
                            setText('No se realizó la actualización porque hay un Administrador con ese mail o DNI');
                            break;
                        default:
                            setText('No se realizó la actualización, error de datos!!');
                    }
                } finally {
                    handleOpenAlert();
                    getAllAdministrator(); // Obtén nuevamente la lista de administradores después de la actualización
                }
            }
        } catch (error) {
            console.error("Error al validar el token o realizar la solicitud:", error);
            alert("Ocurrió un error al intentar realizar la acción. Por favor, inténtalo nuevamente.");
        }
    };

    const deleteAdministrator = async (idAdministratorToDelete) =>{
        const token = localStorage.getItem('token'); // Obtén el token almacenado

        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // No continúa si no hay token
        }

        try {
            // Decodifica el token y verifica si tiene el rol de SuperAdmin
            const decodedToken = jwtDecode(token);
            const isSuperAdmin = decodedToken?.role?.includes('ROLE_ROOT');

            if (!isSuperAdmin) {
                alert("No tienes permisos para realizar esta acción.");
                return; // No continúa si no es SuperAdmin
            }

            // Si el token es válido y tiene el rol adecuado, continúa con el proceso de eliminación
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/administrators/${idAdministratorToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluye el token en los encabezados de la solicitud
                }
            });

            setAllAdministrator(allAdministrator.filter(administrator => administrator.administratorId !== idAdministratorToDelete));
            alert('Administrador eliminado correctamente.');

        } catch (error) {
            console.error("Error al eliminar el administrador:", error);
            alert("Ocurrió un error al intentar eliminar el administrador. Por favor, inténtelo nuevamente.");
        }
    };

    return (
        <div>
            <Box
                sx={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                    paddingX: { xs: '10px', sm: '20px', md: '40px' }
                }}
            >
                <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#003366',
                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }
                    }}
                >
                    Administradores
                </Typography>
            </Box>
            <Paper
                elevation={2}
                sx={{
                    padding: 3,
                    margin: 'auto',
                    marginTop: '20px',
                    width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
                }}
            >
                {/* Ajustamos el contenedor de los inputs para que se alineen en una fila */}
                <Box
                    mt={3}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'nowrap', // No permite que los elementos se envuelvan
                        gap: '16px' // Espacio entre los inputs
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Nombre"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={administratorName}
                        onChange={(e) => setAdministratorName(e.target.value)}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#002776', // Azul Francia oscuro
                                },
                            },
                            '& label.Mui-focused': {
                                color: '#002776',
                            },
                        }}
                    />

                    <TextField
                        id="outlined-basic"
                        label="Apellido"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={administratorLastName}
                        onChange={(e) => setAdministratorLastName(e.target.value)}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#002776',
                                },
                            },
                            '& label.Mui-focused': {
                                color: '#002776',
                            },
                        }}
                    />

                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={administratorMail}
                        onChange={(e) => setAdministratorMail(e.target.value)}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#002776',
                                },
                            },
                            '& label.Mui-focused': {
                                color: '#002776',
                            },
                        }}
                    />

                    <TextField
                        id="outlined-basic"
                        label="DNI"
                        variant="outlined"
                        size="small"
                        type="number"
                        focused
                        value={administratorDni}
                        onChange={(e) => setAdministratorDni(e.target.value)}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#002776',
                                },
                            },
                            '& label.Mui-focused': {
                                color: '#002776',
                            },
                        }}
                    />
                </Box>

                {/* Botones */}
                <Box mt={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#002776',
                            '&:hover': { backgroundColor: '#001B5E' },
                            marginRight: '10px',
                        }}
                        onClick={getAllAdministratorByFilter}
                    >
                        Buscar
                    </Button>
                    <SuperAdminCreateAdministrator />
                </Box>
            </Paper>

            {/* Tabla responsive */}
            <Paper
                elevation={2}
                sx={{
                    padding: 3,
                    margin: 'auto',
                    marginTop: '20px',
                    width: { xs: '95%', sm: '85%', md: '70%', lg: '60%' },
                }}
            >
                <Box display="flex" justifyContent="center" mt={3}>
                    <Paper sx={{ width: '98%', overflow: 'hidden' }}>
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
                                        <TableCell align="center" style={{ minWidth: 60, backgroundColor: '#F5F5DC', fontWeight: 'bold', padding: '4px' }}>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allAdministrator
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((administrator) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={administrator.name} sx={{ height: '24px' }}>
                                                    {columns.map((column) => {
                                                        const value = administrator[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align} style={{
                                                                padding: '4px',
                                                                minWidth: column.id === 'name' || column.id === 'dni' ? '60px' : column.minWidth
                                                            }}>
                                                                {value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell align="center" style={{ padding: '4px',  minWidth: 60 }}>
                                                        <IconButton aria-label="edit" onClick={() =>
                                                            handleClickOpenEdit(
                                                                administrator.administratorId,
                                                                administrator.name,
                                                                administrator.lastName,
                                                                administrator.mail,
                                                                administrator.dni)
                                                        } sx={{ padding: '2px' }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" onClick={() => handleClickOpen(administrator.administratorId)} sx={{ padding: '2px' }}>
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
                            count={allAdministrator.length}
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
                    {"Desea eliminar este Administrador ?"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#E5E5E5' }}>
                    <DialogContentText id="alert-dialog-description">
                        Si acepta se eliminara el administrador deseado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#E5E5E5' }}>
                    <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: '#002776', '&:hover': { backgroundColor: '#001B5E' } }}>Rechazar</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#3D9970' } }} onClick={() => {
                        deleteAdministrator(idAdministratorCreated)
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
                                        label="Nombre"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="name"
                                        value={adminInfo.name !== undefined ? adminInfo.name : editAdministratorName || ''}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.name ? 'red' : '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.name ? 'red' : '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.name ? 'red' : '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        error={errors.name}
                                        helperText={errors.name ? 'Solo letras permitidas' : ''}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Apellido"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="lastName"
                                        value={adminInfo.lastName !== undefined ? adminInfo.lastName : editAdministratorLastName || ''}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.lastName ? 'red' : '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.lastName ? 'red' : '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.lastName ? 'red' : '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: errors.address ? 'red' : '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        error={errors.lastName}
                                        helperText={errors.lastName ? 'Solo letras permitidas' : ''}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Correo Electrónico"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="mail"
                                        value={adminInfo.mail !== undefined ? adminInfo.mail : editAdministratorMail || ''}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.mail ? 'red' : '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.mail ? 'red' : '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.mail ? 'red' : '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: errors.province ? 'red' : '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        error={errors.mail}
                                        helperText={errors.mail ? 'Correo inválido' : ''}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Dni"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="dni"
                                        value={adminInfo.dni}
                                        // onChange={handleChange}
                                        InputProps={{
                                            readOnly: true,  // Esto hace que el campo sea solo de lectura
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.dni ? 'red' : '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.dni ? 'red' : '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.dni ? 'red' : '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        // error={errors.dni}
                                        // helperText={errors.dni ? 'Solo números permitidos' : ''}
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
                    <Button type="submit" color="primary" onClick={handleSubmit} disabled={!validateFields} variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#228B22' } }}>
                        Guardar
                    </Button>

                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={adminUpdate ? "success" : "error"} sx={{width: '100%'}}>
                    {text}
                </Alert>
            </Snackbar>
        </div>
    )
}




export default SuperAdminManagesAdministrator