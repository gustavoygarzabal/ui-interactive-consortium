import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TablePagination,
    TextField
} from "@mui/material";
import React, {useEffect, useState} from "react";
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

const columns = [
    { id: 'name', label: 'Edificio', minWidth: 100 },
    { id: 'city', label: 'Ciudad', minWidth: 100 },
    { id: 'province', label: 'Provincia', minWidth: 100 },
];


function SuperAdminManagesConsortia(){
    let textFieldRef = React.createRef();
    const [consortiumName, setConsortiumName] = useState('');
    const [allConsortia , setAllConsortia] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = useState(false);
    const [idConsortiumToDelete, setIdConsortiumToDelete] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = (idConsortiumToDelete) => {
        setIdConsortiumToDelete(idConsortiumToDelete)
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
        setIdConsortiumToDelete(null)
    };

    useEffect(() => {
        if(consortiumName.length>3){
            getConsortiumsByFilter(consortiumName)
        } else {
            getAllConsortium();

        }
    }, [consortiumName]);


    const getAllConsortium = async () => {
        const res = await axios.get('http://localhost:8080/InteractiveConsortium/v1/consortiums')
        console.log(res.data);
        const consortiums = res.data.content;
        setAllConsortia(consortiums.map(consortium =>{
                return {
                    consortiumId : consortium.consortiumId,
                    name: consortium.name,
                    city: consortium.city,
                    province: consortium.province
                }
        }))
    }

    const getConsortiumsByFilter = async (consortiumNameNew) => {
        const res = await axios.get('http://localhost:8080/InteractiveConsortium/v1/consortiums/filterBy?name=' + consortiumNameNew)
        const consortiums = res.data.content;
        console.log(res.data.content)
        setAllConsortia(consortiums.map(consortium =>{
            return {
                consortiumId : consortium.consortiumId,
                name: consortium.name,
                city: consortium.city,
                province: consortium.province
            }
        }))
    }

    const deleteConsortium = async (idConsortiumToDelete) =>{
        await axios.delete('http://localhost:8080/InteractiveConsortium/v1/consortiums/'+ idConsortiumToDelete)
        setAllConsortia(allConsortia.filter(consortium => consortium.consortiumId !== idConsortiumToDelete))
    }


    return (
        <div>
            <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Box sx={{ marginRight: '25%', minWidth: 200 }}>
                <label>
                    <TextField
                        id="outlined-basic"
                        label="Consorcio"
                        variant="outlined"
                        // color="primary"
                        size="small"
                        type="text"
                        focused
                        inputRef={textFieldRef}
                        value={consortiumName}
                        onChange={(e) => {
                            setConsortiumName(e.target.value);
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#90caf9', // Cambiar color del borde
                                },
                                '&:hover fieldset': {
                                    borderColor: '#64b5f6', // Cambiar color del borde al pasar el mouse
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2196f3', // Cambiar color del borde cuando está enfocado
                                },
                            },
                        }}
                    />
                </label>
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" mt={3}>
                <Paper sx={{ width: '60%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, backgroundColor: 'lightblue', fontWeight: 'bold'  }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell align="center" style={{ minWidth: 100, backgroundColor: 'lightblue', fontWeight: 'bold' }}>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allConsortia
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((consortium) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={consortium.name}>
                                                {columns.map((column) => {
                                                    const value = consortium[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {value}
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell align="center">
                                                    <IconButton aria-label="edit" >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleClickOpen(consortium.consortiumId)}>
                                                        <DeleteIcon />
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Desea eliminar este Consorcio ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Si acepta se eliminara el consorcio deseado.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Rechazar</Button>
                    <Button variant="contained" onClick={() => {
                        deleteConsortium(idConsortiumToDelete)
                        handleClose()
                    }
                    }>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default SuperAdminManagesConsortia