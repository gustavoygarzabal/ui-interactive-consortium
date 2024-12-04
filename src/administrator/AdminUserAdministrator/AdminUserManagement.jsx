import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, {useContext, useEffect, useState} from "react";
import {AdminManageContext} from "../AdminManageContext.jsx";
import axios from "axios";
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
import Button from "@mui/material/Button";
import SuperAdminCreateAdministrator from "../../superAdmin/SuperAdminManageAdmin/SuperAdminCreateAdministrator.jsx";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit.js";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminCreatePerson from "./AdminCreatePerson.jsx";
import {jwtDecode} from "jwt-decode";

const columns = [
    { id: 'name', label: 'Nombre', minWidth: 100 },
    { id: 'lastName', label: 'Apellido', minWidth: 100 },
    { id: 'mail', label: 'Correo Electrónico', minWidth: 100 },
    { id: 'dni', label: 'Dni', minWidth: 100 },
    { id: 'phoneNumber', label: 'Teléfono', minWidth: 100 },
];

function AdminUserManagement(){
    const {consortiumIdState, setConsortiumIdState, allPersons, setAllPersons, getAllPersons, getAConsortiumByIdConsortium, consortiumName,
        setConsortiumName} = useContext(AdminManageContext)
    const [personName, setPersonName] = useState('')
    const [personLastName, setPersonLastName] = useState('')
    const [personMail, setPersonMail] = useState('')
    const [personDni, setPersonDni] = useState('')
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [idPersonUpdate, setIdPersonUpdate] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [editPersonName, setEditPersonName] = useState('')
    const [editPersonLastName, setEditPersonLastName] = useState('')
    const [editPersonMail, setEditPersonMail] = useState('')
    const [editPersonDni, setEditPersonDni] = useState('')
    const [editPersonPhoneNumber, setEditPersonPhoneNumber] = useState('')
    const [personInfo, setPersonInfo] = useState({})
    const [idPersonCreated, setIdPersonCreated] = useState(null)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [personUpdate, setPersonUpdate] = useState(true);
    const [openAlert, setOpenAlert] = useState(false)
    const [errors, setErrors] = useState({
        name: false,
        lastName: false,
        mail: false,
        dni: false,
        phoneNumber: false
    })
    const validateFields = () => {
        const nameRegex = /^[A-Za-z]+$/
        const mailRegex = /.+@.+\..+/
        const dniRegex = /^[0-9]+$/

        setErrors({
            name: !nameRegex.test(personInfo.name),
            lastName: !nameRegex.test(personInfo.lastName),
            mail: !mailRegex.test(personInfo.mail),
            dni: !dniRegex.test(personInfo.dni),
            phoneNumber: !dniRegex.test(personInfo.dni),
        })

        return (
            nameRegex.test(personInfo.name) &&
            nameRegex.test(personInfo.lastName) &&
            mailRegex.test(personInfo.mail) &&
            dniRegex.test(personInfo.dni) &&
            dniRegex.test(personInfo.phoneNumber)
        )
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpenEdit = (idPersonToEdit, PersonNameEdit, PersonLastNameEdit, PersonMailEdit, PersonDniEdit, PersonPhoneNumberEdit) => {
        setIdPersonUpdate(idPersonToEdit)
        setEditPersonName(PersonNameEdit)
        setEditPersonLastName(PersonLastNameEdit)
        setEditPersonMail(PersonMailEdit)
        setEditPersonDni(PersonDniEdit)
        setEditPersonPhoneNumber(PersonPhoneNumberEdit)
        setOpenEdit(true);
    }

    const handleCloseEdit = () => {
        setOpenEdit(false)
        setIdPersonUpdate(null)
        setErrors({
            name: false,
            lastName: false,
            mail: false,
            dni: false,
            phoneNumber: false
        })
        setPersonInfo({
            name: '',
            lastName: '',
            mail: '',
            dni: '',
            phoneNumber: ''
        })
    }

    const handleClickOpen = (idPersonToDelete) => {
        setIdPersonCreated(idPersonToDelete)
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false)
        setIdPersonCreated(null)
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
        if (personName === '' && personLastName === '' && personMail === '' && personDni === '') {
            getAllPersons()
        }
    }, [personName, personLastName, personMail, personDni]);

    useEffect(() => {
        if (openEdit){
            setPersonInfo({
                personId: idPersonUpdate,
                name: editPersonName || "",
                lastName: editPersonLastName || "",
                mail: editPersonMail || "",
                dni: editPersonDni || "",
                phoneNumber: editPersonPhoneNumber || "",
            });
        }

    }, [idPersonUpdate, editPersonName, editPersonLastName, editPersonMail, editPersonDni, editPersonPhoneNumber]);



    // Efecto para cargar los datos del consorcio al montar el componente
    useEffect(() => {
        getAConsortiumByIdConsortium();
    }, [consortiumIdState]);

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setPersonInfo(values => ({...values, [name]: value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Obtén el token almacenado
        const token = localStorage.getItem('token');

        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detiene la ejecución si no hay token
        }

        try {
            // Decodifica el token y verifica el rol
            const decodedToken = jwtDecode(token);
            const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');

            if (!isAdmin) {
                alert("No tienes permisos para realizar esta acción.");
                return; // Detiene la ejecución si no es ROLE_ADMIN
            }

            // Verifica los campos del formulario
            if (validateFields()) {
                const url = `${import.meta.env.VITE_API_BASE_URL}/persons`;

                try {
                    // Realiza la solicitud para actualizar la información
                    await axios.put(url, personInfo, {
                        headers: {
                            Authorization: `Bearer ${token}` // Incluye el token en los encabezados
                        }
                    });

                    setText('Se realizó la actualización correctamente.');
                    setPersonUpdate(true);
                    handleCloseEdit();

                } catch (exception) {
                    setPersonUpdate(false);
                    switch (exception.response?.status) {
                        case 409:
                            setText('No se realizó la actualización porque hay un usuario con ese mail o DNI.');
                            break;
                        default:
                            setText('No se realizó la actualización, error de datos.');
                    }
                } finally {
                    handleOpenAlert();
                    getAllPersons();
                }
            }
        } catch (error) {
            console.error("Error al validar el token o realizar la solicitud:", error);
            alert("Ocurrió un error. Por favor, verifica tu conexión o intenta nuevamente.");
        }
    }

    const getAllPersonsByFilter = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detiene la ejecución si no hay token
        }

        try {
            // Decodifica el token y verifica el rol
            const decodedToken = jwtDecode(token);
            const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');

            if (!isAdmin) {
                alert("No tienes permisos para realizar esta acción.");
                return; // Detiene la ejecución si no es ROLE_ADMIN
            }

            const handleEmptyValues = (value) => {
                return value === '' ? null : value;
            };

            const name = handleEmptyValues(personName);
            const lastName = handleEmptyValues(personLastName);
            const mail = handleEmptyValues(personMail);
            const dni = handleEmptyValues(personDni);

            let params = {};
            if (name !== null) params.name = name;
            if (lastName !== null) params.lastName = lastName;
            if (mail !== null) params.mail = mail;
            if (dni !== null) params.dni = dni;

            if (Object.keys(params).length === 0) {
                getAllPersons(); // Llama a la función para obtener todos si no hay filtros
            } else {
                const queryParams = new URLSearchParams(params).toString();
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/persons/filtersBy?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Incluye el token en los encabezados
                    }
                });

                const persons = res.data.content;
                setAllPersons(persons.map(person => {
                    return {
                        personId: person.personId,
                        name: person.name,
                        lastName: person.lastName,
                        mail: person.mail,
                        dni: person.dni,
                        phoneNumber: person.phoneNumber
                    };
                }));
            }
        } catch (error) {
            console.error("Error al verificar el token o realizar la solicitud:", error);
            alert("Ocurrió un error. Por favor, verifica tu conexión o intenta nuevamente.");
        }
    };


    const deletePerson = async (idPersonToDelete) =>{
        // Obtén el token almacenado
        const token = localStorage.getItem('token');

        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detener la ejecución si no hay token
        }

        try {
            // Decodifica el token para verificar el rol
            const decodedToken = jwtDecode(token);
            const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');

            if (!isAdmin) {
                alert("No tienes permisos para realizar esta acción.");
                return; // Detener la ejecución si no es ROLE_ADMIN
            }

            // Realizar la solicitud DELETE
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/consortiums/${consortiumIdState}/persons/${idPersonToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Incluye el token en los encabezados
                    }
                }
            );

            // Actualizar la lista de personas después de eliminar
            setAllPersons(allPersons.filter(person => person.personId !== idPersonToDelete));
            alert("Persona eliminada exitosamente.");
        } catch (error) {
            console.error("Error al eliminar la persona:", error);
            alert("Hubo un problema al eliminar la persona. Por favor, intenta nuevamente.");
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
                    Usuarios del Consorcio {consortiumName} {/* Aquí mostramos el nombre del consorcio */}
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
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
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
                        value={personLastName}
                        onChange={(e) => setPersonLastName(e.target.value)}
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
                        value={personMail}
                        onChange={(e) => setPersonMail(e.target.value)}
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
                        value={personDni}
                        onChange={(e) => setPersonDni(e.target.value)}
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
                        onClick={getAllPersonsByFilter}
                    >
                        Buscar
                    </Button>
                    <AdminCreatePerson/>
                </Box>
            </Paper>

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
                                    {allPersons
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((person) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={person.name} sx={{ height: '24px' }}>
                                                    {columns.map((column) => {
                                                        const value = person[column.id];
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
                                                                person.personId,
                                                                person.name,
                                                                person.lastName,
                                                                person.mail,
                                                                person.dni,
                                                                person.phoneNumber)
                                                        } sx={{ padding: '2px' }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" onClick={() => handleClickOpen(person.personId)} sx={{ padding: '2px' }}>
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
                            count={allPersons.length}
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
                        Si acepta se eliminara el usuario deseado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#E5E5E5' }}>
                    <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: '#002776', '&:hover': { backgroundColor: '#001B5E' } }}>Rechazar</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#3D9970' } }} onClick={() => {
                        deletePerson(idPersonCreated)
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
                                        value={personInfo.name !== undefined ? personInfo.name : editPersonName || ''}
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
                                        value={personInfo.lastName !== undefined ? personInfo.lastName : editPersonLastName || ''}
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
                                        value={personInfo.mail !== undefined ? personInfo.mail : editPersonMail || ''}
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
                                        value={personInfo.dni !== undefined ? personInfo.dni : editPersonDni || ''}
                                        onChange={handleChange}
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
                                        error={errors.dni}
                                        helperText={errors.dni ? 'Solo números permitidos' : ''}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Número de Teléfono"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="phoneNumber"
                                        value={personInfo.phoneNumber !== undefined ? personInfo.phoneNumber : editPersonPhoneNumber || ''}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.phoneNumber ? 'red' : '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.phoneNumber ? 'red' : '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.phoneNumber ? 'red' : '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        error={errors.phoneNumber}
                                        helperText={errors.phoneNumber ? 'Solo números permitidos' : ''}
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
                <Alert onClose={handleCloseAlert} severity={personUpdate ? "success" : "error"} sx={{width: '100%'}}>
                    {text}
                </Alert>
            </Snackbar>
        </div>
    );
}
export default AdminUserManagement