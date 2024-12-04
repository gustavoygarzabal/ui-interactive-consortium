import {
    Alert,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Grid, Snackbar,
    TablePagination,
    TextField
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import SuperAdminCreateConsortium from "./SuperAdminCreateConsortium.jsx";
import MenuItem from "@mui/material/MenuItem";
import {SuperAdminManageConsortiumContext} from "./SuperAdminManageConsortiumContext.jsx";
import SuperAdminCreateAdministrator from "../SuperAdminManageAdmin/SuperAdminCreateAdministrator.jsx";
import Typography from "@mui/material/Typography";
import {jwtDecode} from "jwt-decode";


const columns = [
    { id: 'name', label: 'Edificio', minWidth: 100 },
    { id: 'city', label: 'Ciudad', minWidth: 100 },
    { id: 'province', label: 'Provincia', minWidth: 100 },
    { id: 'fullName', label: 'Administrador', minWidth: 100}
];

function SuperAdminManagesConsortia(){
    const {allConsortia, setAllConsortia, allAdministrator, getAllConsortium,
        getAllAdministrator} = useContext(SuperAdminManageConsortiumContext)
    let textFieldRef = React.createRef();
    const [consortiumName, setConsortiumName] = useState('');
    const [consortiumCity, setConsortiumCity] = useState('')
    const [consortiumProvince, setConsortiumProvince] = useState('')
    const [consortiumNameAdmin, setConsortiumNameAdmin] = useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [idConsortiumToDelete, setIdConsortiumToDelete] = useState(null);
    const [editConsortiumId, setEditConsortiumId] = useState(null)
    const [editConsortiumName, setEditConsortiumName ] = useState('')
    const [editConsortiumAddress, setEditConsortiumAddress] = useState('')
    const [editConsortiumCity, setEditConsortiumCity] = useState('')
    const [editConsortiumProvince, setEditConsortiumProvince ] = useState('')
    const [editConsortiumAdministratorId, setEditConsortiumAdministratorId] = useState(null)
    const [text, setText] = useState('')
    const [errors, setErrors] = useState({
        address: false,
        province: false
    })
    const [consortiumInfo, setConsortiumInfo] = useState({
        consortiumId: null,
        name: "",
        address: "",
        city: "",
        province: "",
        administrator: {
            administratorId: null,
        }})
    const [consortiumCreated, setConsortiumCreated] = useState(true);
    const [openAlert, setOpenAlert] = useState(false)
    // const [allAdministrator , setAllAdministrator] = useState([])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const validateFields = () => {
        const addressRegex = /^[A-Za-z\s]+\s\d+$/;
        const provinceRegex = /^[A-Za-zÀ-ÿ\s]+$/

        setErrors({
            address: !addressRegex.test(consortiumInfo.address),
            province: !provinceRegex.test(consortiumInfo.province)
        })

        return (
            addressRegex.test(consortiumInfo.address)&&
            provinceRegex.test(consortiumInfo.province)
        )
    }

    const handleClickOpen = (idConsortiumToDelete) => {
        setIdConsortiumToDelete(idConsortiumToDelete)
        setOpen(true)
    };
    const handleClickOpenEdit = (idConsortiumToEdit, consortiumNameEdit, consortiumAddressEdit, consortiumCityEdit, consortiumProvinceEdit, administratorIdEdit) => {
        setEditConsortiumId(idConsortiumToEdit)
        setEditConsortiumName(consortiumNameEdit)
        setEditConsortiumAddress(consortiumAddressEdit)
        setEditConsortiumCity(consortiumCityEdit)
        setEditConsortiumProvince(consortiumProvinceEdit)
        setEditConsortiumAdministratorId(administratorIdEdit)
        getAllAdministrator()
        setOpenEdit(true);
    }

    const handleClose = () => {
        setOpen(false)
        setIdConsortiumToDelete(null)
    };
    const handleCloseEdit = () => {
        setOpenEdit(false)
        setErrors({
            address: false,
            province: false
        })
        setConsortiumInfo({
            consortiumId: null,
            name: "",
            address: "",
            city: "",
            province: "",
            administrator: {
                administratorId: null,
            }
        })
    }


    useEffect(() => {
        if (consortiumName === '' && consortiumCity === '' && consortiumProvince === '' && consortiumNameAdmin === '') {
            getAllConsortium()
        }
    }, [consortiumName, consortiumCity, consortiumProvince, consortiumNameAdmin]);


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
        if (openEdit) {
            const consortium = {
                consortiumId: editConsortiumId,
                name: editConsortiumName || "",
                address: editConsortiumAddress || "",
                city: editConsortiumCity || "",
                province: editConsortiumProvince || "",
                administrator: {
                    administratorId: editConsortiumAdministratorId || ""
                }
            };
            setConsortiumInfo(consortium);
        }
    }, [openEdit, editConsortiumId, editConsortiumName, editConsortiumAddress, editConsortiumCity, editConsortiumProvince, editConsortiumAdministratorId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "administratorId") {
            setConsortiumInfo(prevState => ({
                ...prevState,
                administrator: {
                    ...prevState.administrator,
                    administratorId: value
                }
            }));
        } else {
            setConsortiumInfo(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verifica si el usuario tiene permisos
        const token = localStorage.getItem('token'); // Obtiene el token almacenado
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

            // Continúa con la lógica si el usuario está autorizado
            if (validateFields()) {
                console.log(consortiumInfo);
                let url = `${import.meta.env.VITE_API_BASE_URL}/consortiums`;

                try {
                    await axios.put(url, consortiumInfo, {
                        headers: {
                            Authorization: `Bearer ${token}` // Incluye el token en la solicitud
                        }
                    });

                    setText('Se realizó la carga correctamente');
                    setConsortiumCreated(true);
                    handleCloseEdit();
                } catch (exception) {
                    setConsortiumCreated(false);
                    switch (exception.response?.status) {
                        case 404:
                            setText('No se encontró el administrador ingresado');
                            break;
                        default:
                            setText('No se realizó la carga, error de datos!!');
                    }
                } finally {
                    handleOpenAlert();
                    getAllConsortium();
                }
            }
        } catch (error) {
            console.error("Error al validar el usuario o procesar la solicitud:", error);
            alert("Ocurrió un error. Por favor, inténtalo nuevamente.");
        }
    };

    const getAllConsortiumByFilter = async () => {
        const token = localStorage.getItem('token'); // Obtiene el token almacenado

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

            // Lógica principal de la función
            const handleEmptyValues = (value) => {
                return value === '' ? null : value;
            };

            const name = handleEmptyValues(consortiumName);
            const city = handleEmptyValues(consortiumCity);
            const province = handleEmptyValues(consortiumProvince);
            const adminName = handleEmptyValues(consortiumNameAdmin);

            let params = {};
            if (name !== null) params.name = name;
            if (city !== null) params.city = city;
            if (province !== null) params.province = province;
            if (adminName !== null) params.adminName = adminName;

            if (Object.keys(params).length === 0) {
                getAllConsortium();
            } else {
                const queryParams = new URLSearchParams(params).toString();
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/consortiums/filterBy?${queryParams}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}` // Incluye el token en la solicitud
                        }
                    }
                );
                const consortiums = res.data.content;

                setAllConsortia(
                    consortiums.map(consortium => {
                        const administrator = consortium.administrator || {};
                        return {
                            consortiumId: consortium.consortiumId,
                            name: consortium.name,
                            address: consortium.address,
                            city: consortium.city,
                            province: consortium.province,
                            administratorId: administrator.administratorId || '',
                            fullName: administrator.name && administrator.lastName
                                ? `${administrator.name} ${administrator.lastName}`
                                : ''
                        };
                    })
                );
            }
        } catch (error) {
            console.error("Error al validar el usuario o procesar la solicitud:", error);
            alert("Ocurrió un error. Por favor, inténtalo nuevamente.");
        }
    }

    const deleteConsortium = async (idConsortiumToDelete) =>{
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

            // Continúa con la eliminación si el usuario está autorizado
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/consortiums/${idConsortiumToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Incluye el token en la solicitud
                    }
                }
            );

            // Actualiza la lista de consorcios después de eliminar
            setAllConsortia(allConsortia.filter(consortium => consortium.consortiumId !== idConsortiumToDelete));

            alert("Consorcio eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar el consorcio:", error);
            alert("Ocurrió un error al intentar eliminar el consorcio. Por favor, inténtalo nuevamente.");
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
                    Consorcios
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
                                value={consortiumName}
                                onChange={(e) => {
                                    setConsortiumName(e.target.value);
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

                            <TextField
                                id="outlined-basic"
                                label="Ciudad"
                                variant="outlined"
                                size="small"
                                type="text"
                                focused
                                // inputRef={textFieldRef}
                                value={consortiumCity}
                                onChange={(e) => {
                                    setConsortiumCity(e.target.value);
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

                            <TextField
                                id="outlined-basic"
                                label="Provincia"
                                variant="outlined"
                                size="small"
                                type="text"
                                focused
                                // inputRef={textFieldRef}
                                value={consortiumProvince}
                                onChange={(e) => {
                                    setConsortiumProvince(e.target.value);
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
                    <TextField
                        id="outlined-basic"
                        label="Administrador"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={consortiumNameAdmin}
                        onChange={(e) => {
                            setConsortiumNameAdmin(e.target.value);
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
                        onClick={getAllConsortiumByFilter}
                    >
                        Buscar
                    </Button>
                    <SuperAdminCreateConsortium />
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
                                {allConsortia
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((consortium) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={consortium.name} sx={{ height: '24px' }}>
                                                {columns.map((column) => {
                                                    const value = consortium[column.id];
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
                                                    <IconButton aria-label="edit"  onClick={() => {
                                                        handleClickOpenEdit(
                                                            consortium.consortiumId,
                                                            consortium.name,
                                                            consortium.address,
                                                            consortium.city,
                                                            consortium.province,
                                                            consortium.administratorId
                                                        );
                                                    }} sx={{ padding: '2px' }} >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleClickOpen(consortium.consortiumId)} sx={{ padding: '2px' }}>
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
                        count={allConsortia.length}
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
                    {"Desea eliminar este Consorcio ?"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#E5E5E5' }}>
                    <DialogContentText id="alert-dialog-description">
                        Si acepta se eliminara el consorcio deseado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions  sx={{ backgroundColor: '#E5E5E5' }}>
                    <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: '#002776', '&:hover': { backgroundColor: '#001B5E' } }}>Rechazar</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#3D9970' } }} onClick={() => {
                        deleteConsortium(idConsortiumToDelete)
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
                <DialogTitle sx={{ backgroundColor: '#E5E5E5',  color: '#002776', textAlign: 'center' }}>Actualizar Consorcio</DialogTitle>
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
                                        value={consortiumInfo.name !== undefined ? consortiumInfo.name : editConsortiumName || ''}
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
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Dirección"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="address"
                                        value={consortiumInfo.address !== undefined ? consortiumInfo.address : editConsortiumAddress || ''}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.address ? 'red' : '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.address ? 'red' : '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.address ? 'red' : '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: errors.address ? 'red' : '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        error={errors.address}
                                        helperText={errors.address ? 'EL formato de la dirección es: Nombre de la calle + número' : ''}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Ciudad"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="city"
                                        value={consortiumInfo.city !== undefined ? consortiumInfo.city : editConsortiumCity || ''}
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
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Provincia"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="province"
                                        value={consortiumInfo.province !== undefined ? consortiumInfo.province : editConsortiumProvince || ''}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.province ? 'red' : '#002776',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.province ? 'red' : '#002776',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.province ? 'red' : '#002776',
                                                },
                                            },
                                            '& label.Mui-focused': {
                                                color: errors.province ? 'red' : '#002776', // Cambia el color del label al enfocarse
                                            },
                                        }}
                                        error={errors.province}
                                        helperText={errors.province ? 'No se permiten números' : ''}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        label="Seleccione un Administrador"
                                        variant="outlined"
                                        size="small"
                                        name="administratorId"
                                        value={consortiumInfo.administrator?.administratorId || ""}
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
                                        {allAdministrator.map(administrator => (
                                            <MenuItem key={administrator.administratorId} value={administrator.administratorId}>
                                                {administrator.fullName}
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
                    <Button type="submit" color="primary" onClick={handleSubmit} disabled={!validateFields} variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#228B22' } }}>
                        Guardar
                    </Button>

                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={consortiumCreated ? "success" : "error"} sx={{width: '100%'}}>
                    {text}
                </Alert>
            </Snackbar>
        </div>
    );
}
export default SuperAdminManagesConsortia