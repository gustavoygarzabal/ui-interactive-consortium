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
import MenuItem from "@mui/material/MenuItem";
import AdminCreateDepartment from "./AdminCreateDepartment.jsx";
import {jwtDecode} from "jwt-decode";


const columns = [
    { id: 'code', label: 'Identificación', minWidth: 100 },
    { id: 'fullNameP', label: 'Propietario', minWidth: 100 },
    { id: 'fullNameR', label: 'Residente', minWidth: 100 }
];

function AdminDepartmentManagement(){
    const {consortiumIdState, setConsortiumIdState, allPersons, setAllPersons,allDepartments, setAllDepartments, getAllDepartmentsByConsortium,
        getAllPersons, getAConsortiumByIdConsortium, consortiumName} = useContext(AdminManageContext)
    // const [allDepartments, setAllDepartments] = useState([])
    // const [consortiumName, setConsortiumName] = useState(""); // Nuevo estado para el nombre del consorcio
    const [departmentCode, setDepartmentCode] = useState('')
    const [proprietor, setProprietor] = useState('')
    const [resident, setResident] = useState('')
    const [personDni, setPersonDni] = useState('')
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [idDepartmentUpdate, setIdDepartmentUpdate] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [editCode, setEditCode] = useState('')
    const [editPropietaryId, setEditPropietaryId] = useState('')
    const [editResidentId, setEditResidentId] = useState('')
    const [idPersonCreated, setIdPersonCreated] = useState(null)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [departmentUpdate, setDepartmentUpdate] = useState(true);
    const [openAlert, setOpenAlert] = useState(false)
    const [departmentInfo, setDepartmentInfo] = useState({
        departmentId: null,
        code: "",
        consortium: {
            consortiumId: null
        },
        propietary: {
            personId: null,
        },
        resident:{
            personId: null
        }
    })


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpenEdit = (idDepartmentToEdit, departmentCodeEdit, departmentPropietaryIdEdit, departmentResidentIdEdit) => {
        setIdDepartmentUpdate(idDepartmentToEdit)
        setEditCode(departmentCodeEdit)
        setEditPropietaryId(departmentPropietaryIdEdit)
        setEditResidentId(departmentResidentIdEdit)
        setOpenEdit(true)
        getAllPersons()
    }

    const handleCloseEdit = () => {
        setOpenEdit(false)
        setIdDepartmentUpdate(null)
        setDepartmentInfo({
            departmentId: null,
            code: "",
            consortium: {
                consortiumId: null
            },
            propietary: {
                personId: null,
            },
            resident:{
                personId: null
            }
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
        if (departmentCode === '' && proprietor === '' && resident === '') {
            getAllDepartmentsByConsortium(consortiumIdState)
        }
    }, [departmentCode, proprietor, resident])

    useEffect(() => {
        if (openEdit){
            setDepartmentInfo({
                departmentId: idDepartmentUpdate,
                code: editCode || "",
                consortium: {
                    consortiumId: consortiumIdState
                },
                propietary: {
                    personId: editPropietaryId
                },
                resident:{
                    personId: editResidentId
                }
            });
        }

    }, [idDepartmentUpdate, editCode, editPropietaryId, editResidentId]);


    // Efecto para cargar los datos del consorcio al montar el componente
    useEffect(() => {
        getAConsortiumByIdConsortium();
    }, [consortiumIdState]);


    const handleChange = (event) => {
        const name = event.target.name; // Obtiene el nombre del campo
        const value = event.target.value; // Obtiene el nuevo valor del campo

        setDepartmentInfo((values) => {
            // Crea una copia del objeto actual
            const updatedValues = { ...values };

            // Maneja los cambios en campos anidados
            switch (name) {
                case 'departmentId':
                    updatedValues.departmentId = value; // Actualiza departmentId directamente
                    break;
                case 'code':
                    updatedValues.code = value; // Actualiza code directamente
                    break;
                case 'consortiumId':
                    updatedValues.consortium = {
                        ...updatedValues.consortium,
                        consortiumId: value // Actualiza el consortiumId dentro del objeto consortium
                    };
                    break;
                case 'propietaryId':
                    updatedValues.propietary = {
                        ...updatedValues.propietary,
                        personId: value // Actualiza el propietaryId dentro del objeto propietary
                    };
                    break;
                case 'residentId':
                    updatedValues.resident = {
                        ...updatedValues.resident,
                        personId: value // Actualiza el residentId dentro del objeto resident
                    };
                    break;
                default:
                    break;
            }
            return updatedValues; // Retorna el objeto actualizado
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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

            // Si el usuario tiene el rol adecuado, realiza la solicitud PUT
            const url = `${import.meta.env.VITE_API_BASE_URL}/departments`;

            await axios.put(url, departmentInfo, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluye el token en los encabezados
                }
            });

            setText('Se realizó la actualización correctamente');
            setDepartmentUpdate(true);
            handleCloseEdit();

        } catch (exception) {
            setDepartmentUpdate(false);

            // Manejo de errores más detallado
            if (exception.response) {
                switch (exception.response.status) {
                    case 404:
                        if (exception.response.data.message.includes('No existe ese departamento')) {
                            setText('No se pudo encontrar el departamento que intenta actualizar.');
                        } else if (exception.response.data.message.includes('Consorcio no encontrado')) {
                            setText('El consorcio especificado no se encontró.');
                        } else if (exception.response.data.message.includes('Propietario no encontrado')) {
                            setText('El propietario especificado no se encontró.');
                        } else if (exception.response.data.message.includes('Residente no encontrado')) {
                            setText('El residente especificado no se encontró.');
                        } else {
                            setText('El departamento no existe o los datos proporcionados son incorrectos.');
                        }
                        break;
                    case 409:
                        setText('Ya existe un departamento en ese piso con ese identificador.');
                        break;
                    default:
                        setText('No se realizó la carga, error de datos!!');
                }
            }
        } finally {
            handleOpenAlert();
            getAllDepartmentsByConsortium(consortiumIdState);
        }
    };

    const getAllDepartmentsByFilter = async () => {
        const handleEmptyValues = (value) => {
            return value === '' ? null : value;
        };

        // Obtención del token
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detener ejecución si no hay token
        }

        try {
            // Decodificación del token para obtener el rol
            const decodedToken = jwtDecode(token);
            const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');

            // Verificar si el usuario tiene el rol ROLE_ADMIN
            if (!isAdmin) {
                alert("No tienes permisos para realizar esta acción.");
                return; // Detener ejecución si no es ROLE_ADMIN
            }

            // Si el usuario tiene el rol adecuado, continuar con la solicitud
            const code = handleEmptyValues(departmentCode);
            const proprietorName = handleEmptyValues(proprietor);
            const residentName = handleEmptyValues(resident);

            let params = {};
            params.idConsortium = consortiumIdState;
            if (code !== null) params.code = code;
            if (proprietorName !== null) params.ownerNameOrLastName = proprietorName;
            if (residentName !== null) params.residentNameOrLastName = residentName;

            if (Object.keys(params).length === 0) {
                getAllDepartmentsByConsortium(consortiumIdState);
            } else {
                const queryParams = new URLSearchParams(params).toString();
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departments/filterBy?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Incluye el token en los encabezados
                    }
                });
                const departments = res.data.content;
                setAllDepartments(departments.map(department => {
                    return {
                        departmentId: department.departmentId,
                        code: department.code,
                        personIdP: department.propietary.personId,
                        fullNameP: department.propietary.name && department.propietary.lastName
                            ? `${department.propietary.name} ${department.propietary.lastName}`
                            : '',
                        personIdR: department.resident.personId,
                        fullNameR: department.resident.name && department.resident.lastName
                            ? `${department.resident.name} ${department.resident.lastName}`
                            : ''
                    };
                }));
            }
        } catch (error) {
            console.error("Error al verificar el rol o realizar la solicitud", error);
        }
    };


    const deleteDepartment = async (idDepartmentToDelete) =>{
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No estás autorizado. Por favor, inicia sesión.");
            return; // Detener ejecución si no hay token
        }

        try {
            // Decodificar el token para obtener el rol
            const decodedToken = jwtDecode(token);
            const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');

            // Verificar si el usuario tiene el rol ROLE_ADMIN
            if (!isAdmin) {
                alert("No tienes permisos para realizar esta acción.");
                return; // Detener ejecución si no es ROLE_ADMIN
            }

            // Si el usuario tiene permisos, proceder con la eliminación
            console.log(idDepartmentToDelete);
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/departments/${idDepartmentToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Incluir el token en el encabezado
                }
            });

            // Actualizar el estado con los departamentos restantes
            setAllDepartments(allDepartments.filter(department => department.departmentId !== idDepartmentToDelete));
            alert("Departamento eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar el departamento", error);
            alert("Ocurrió un error al intentar eliminar el departamento.");
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
                    Departamentos del Consorcio {consortiumName} {/* Aquí mostramos el nombre del consorcio */}
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
                        label="Identificación"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={departmentCode}
                        onChange={(e) => setDepartmentCode(e.target.value)}
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
                        label="Propietario"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={proprietor}
                        onChange={(e) => setProprietor(e.target.value)}
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
                        label="Residente"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={resident}
                        onChange={(e) => setResident(e.target.value)}
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
                        onClick={getAllDepartmentsByFilter}
                    >
                        Buscar
                    </Button>
                    <AdminCreateDepartment/>
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
                                    {allDepartments
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((department) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={department.departmentId} sx={{ height: '24px' }}>
                                                    {columns.map((column) => {
                                                        const value = department[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align} style={{
                                                                padding: '4px',
                                                                minWidth: column.id === 'fullNameP' || column.id === 'fullNameR' ? '60px' : column.minWidth
                                                            }}>
                                                                {value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell align="center" style={{ padding: '4px',  minWidth: 60 }}>
                                                        <IconButton aria-label="edit" onClick={() =>
                                                            handleClickOpenEdit(
                                                                department.departmentId,
                                                                department.code,
                                                                department.personIdP,
                                                                department.personIdR)
                                                        } sx={{ padding: '2px' }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" onClick={() => handleClickOpen(department.departmentId)} sx={{ padding: '2px' }}>
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
                            count={allDepartments.length}
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
                    {"Desea eliminar este Departamento ?"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#E5E5E5' }}>
                    <DialogContentText id="alert-dialog-description">
                        Si acepta se eliminara el usuario deseado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#E5E5E5' }}>
                    <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: '#002776', '&:hover': { backgroundColor: '#001B5E' } }}>Rechazar</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#3D9970' } }} onClick={() => {
                        deleteDepartment(idPersonCreated)
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
                                        label="Identificación"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="code"
                                        value={departmentInfo.code !== undefined ? departmentInfo.code : editCode || ''}
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
                                        // error={errors.name}
                                        // helperText={errors.name ? 'Solo letras permitidas' : ''}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Selecciones un Propietario"
                                        variant="outlined"
                                        size="small"
                                        name="propietaryId"
                                        value={departmentInfo.propietary?.personId || ""}
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
                                        >
                                        {allPersons.map(person => (
                                            <MenuItem key={person.personId} value={person.personId}>
                                                {person.fullName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        label="Seleccione un Residente"
                                        variant="outlined"
                                        size="small"
                                        name="residentId"
                                        value={departmentInfo.resident?.personId || ""}
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
                                    >
                                        {allPersons.map(person => (
                                            <MenuItem key={person.personId} value={person.personId}>
                                                {person.fullName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
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
                <Alert onClose={handleCloseAlert} severity={departmentUpdate ? "success" : "error"} sx={{width: '100%'}}>
                    {text}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default AdminDepartmentManagement
