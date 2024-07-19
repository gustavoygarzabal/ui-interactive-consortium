import {
    Box, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TablePagination,
    TextField
} from "@mui/material";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit.js";
import DeleteIcon from "@mui/icons-material/Delete.js";
import axios from "axios";
import Button from "@mui/material/Button";

const columns = [
    { id: 'name', label: 'Nombre', minWidth: 100 },
    { id: 'lastName', label: 'Apellido', minWidth: 100 },
    { id: 'mail', label: 'Correo Electrónico', minWidth: 100 },
    { id: 'dni', label: 'Dni', minWidth: 100 }
];
function SuperAdminManagesAdministrator(){
    // let textFieldRef = React.createRef()
    const [administratorName, setAdministratorName] = useState('')
    const [administratorLastName, setAdministratorLastName] = useState('')
    const [administratorMail, setAdministratorMail] = useState('')
    const [administratorDni, setAdministratorDni] = useState('')
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)
    const [allAdministrator , setAllAdministrator] = useState([])
    const [open, setOpen] = useState(false)
    const [idAdministratorToDelete, setIdAdministratorToDelete] = useState(null)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = (idAdministratorToDelete) => {
        setIdAdministratorToDelete(idAdministratorToDelete)
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
        setIdAdministratorToDelete(null)
    };

    useEffect(() => {
        getAllAdministrator()
    }, [])

    useEffect(() => {
        if (administratorName === '' && administratorLastName === '' && administratorMail === '' && administratorDni === '') {
            getAllAdministrator()
        }
    }, [administratorName, administratorLastName, administratorMail, administratorDni]);
    const getAllAdministrator = async () => {
        const res = await axios.get('http://localhost:8080/InteractiveConsortium/v1/administrators')
        console.log(res.data);
        const administrators = res.data.content;
        setAllAdministrator(administrators.map(administrator =>{
            return {
                administratorId : administrator.administratorId,
                name: administrator.name,
                lastName: administrator.lastName,
                mail: administrator.mail,
                dni: administrator.dni
            }
        }))
    }

    const getAllAdministratorByFilter = async () => {
        const handleEmptyValues = (value) => {
            return value === '' ? null : value;
        };


        const name = handleEmptyValues(administratorName)
        const lastName = handleEmptyValues(administratorLastName)
        const mail = handleEmptyValues(administratorMail)
        const dni = handleEmptyValues(administratorDni)


        let params = {};
        if (name !== null) params.name = name;
        if (lastName !== null) params.lastName = lastName;
        if (mail !== null) params.mail = mail;
        if (dni !== null) params.dni = dni;

        if (Object.keys(params).length === 0) {
            getAllAdministrator();
        } else {
            const queryParams = new URLSearchParams(params).toString();
            const res = await axios.get(`http://localhost:8080/InteractiveConsortium/v1/administrators/filtersBy?${queryParams}`);
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
    };

    const deleteAdministrator = async (idAdministratorToDelete) =>{
        await axios.delete('http://localhost:8080/InteractiveConsortium/v1/administrators/'+ idAdministratorToDelete)
        setAllAdministrator(allAdministrator.filter(administrator => administrator.administratorId !== idAdministratorToDelete))
    }

    return (
        <div>
            <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#ebebeb', marginLeft: '18%', marginRight: '18%'  }}>
            <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-star', alignItems: 'center' }}>
                <Box sx={{ marginLeft: '2%', minWidth: 200 }}>
                    <label>
                        <TextField
                            id="outlined-basic"
                            label="Nombre"
                            variant="outlined"
                            size="small"
                            type="text"
                            focused
                            // inputRef={textFieldRef}
                            value={administratorName}
                            onChange={(e) => {
                                setAdministratorName(e.target.value);
                            }}
                        />
                    </label>
                </Box>
                <Box sx={{ marginLeft: '4%', minWidth: 200 }}>
                    <label>
                        <TextField
                            id="outlined-basic"
                            label="Apellido"
                            variant="outlined"
                            size="small"
                            type="text"
                            focused
                            // inputRef={textFieldRef}
                            value={administratorLastName}
                            onChange={(e) => {
                                setAdministratorLastName(e.target.value);
                            }}
                        />
                    </label>
                </Box>

                <Box sx={{ marginLeft: '4%', minWidth: 200 }}>
                    <label>
                        <TextField
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            size="small"
                            type="text"
                            focused
                            // inputRef={textFieldRef}
                            value={administratorMail}
                            onChange={(e) => {
                                setAdministratorMail(e.target.value);
                            }}
                        />
                    </label>
                </Box>
                <Box sx={{ marginLeft: '4%', minWidth: 200 }}>
                    <label>
                        <TextField
                            id="outlined-basic"
                            label="Dni"
                            variant="outlined"
                            size="small"
                            type="text"
                            focused
                            // inputRef={textFieldRef}
                            value={administratorDni}
                            onChange={(e) => {
                                setAdministratorDni(e.target.value);
                            }}
                        />
                    </label>
                </Box>
            </Box>
                <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-star', alignItems: 'center', marginLeft: '5%', }}>
                    <Button variant="contained" color="primary" onClick={getAllAdministratorByFilter}>
                        Buscar
                    </Button>
                </Box>
            </Paper>
            <Box display="flex" justifyContent="center" mt={3}>
                <Paper sx={{ width: '50%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow sx={{ height: '24px' }}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.id === 'name' || column.id === 'dni' ? '60px' : column.minWidth, // Ajusta el ancho mínimo
                                                backgroundColor: 'lightblue',
                                                fontWeight: 'bold',
                                                padding: '4px'
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell align="center" style={{ minWidth: 60, backgroundColor: 'lightblue', fontWeight: 'bold', padding: '4px' }}>
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
                                                    <IconButton aria-label="edit" sx={{ padding: '2px' }}>
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Desea eliminar este Administrador ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Si acepta se eliminara el administrador deseado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Rechazar</Button>
                    <Button variant="contained" onClick={() => {
                        deleteAdministrator(idAdministratorToDelete)
                        handleClose()
                    }
                    }>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}




export default SuperAdminManagesAdministrator