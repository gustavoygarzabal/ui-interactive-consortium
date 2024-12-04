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
import AdminCreatePost from "./AdminCreatePost.jsx";
import {useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";


const columns = [
    { id: 'title', label: 'Título', minWidth: 100 },
    { id: 'content', label: 'Contenido', minWidth: 100 },
    { id: 'creationPostDate', label: 'Fecha', minWidth: 100 }
]

function AdminPostManagement(){
    const {consortiumIdState, getAConsortiumByIdConsortium, consortiumName, getAllPostsByIdConsortium, allPosts,
        setAllPosts } = useContext(AdminManageContext)
    const [postTitle, setPostTitle] = useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [idPostUpdate, setIdPostUpdate] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [editTitle, setEditTitle] = useState('')
    const [editContent, setEditContent] = useState('')
    const [idPostCreated, setIdPostCreated] = useState(null)
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [postUpdate, setPostUpdate] = useState(true);
    const [openAlert, setOpenAlert] = useState(false)
    const [postInfo, setPostInfo] = useState({})
    const navigate = useNavigate()

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpenEdit = (idPostToEdit, postTitleEdit, postContentEdit) => {
        setIdPostUpdate(idPostToEdit)
        setEditTitle(postTitleEdit)
        setEditContent(postContentEdit)
        setOpenEdit(true)
    }

    const handleCloseEdit = () => {
        setOpenEdit(false)
        setIdPostUpdate(null)
        setPostInfo({})
    }

    const handleClickOpen = (idPostToDelete) => {
        setIdPostCreated(idPostToDelete)
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false)
        setIdPostCreated(null)
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
            setPostInfo({
                postId: idPostUpdate,
                title: editTitle || "",
                content: editContent || "",
                consortium: {
                    consortiumId: consortiumIdState
                }
            })
        }

    }, [idPostUpdate, editTitle, editContent]);

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setPostInfo(values => ({...values, [name]: value}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Obtener el token de localStorage o de donde lo almacenes
        const token = localStorage.getItem('token');
        if (!token) {
            setText('No estás autorizado. Por favor, inicia sesión.');
            return; // Detiene la ejecución si no hay token
        }

        // Decodificar el token para verificar el rol
        const decodedToken = jwtDecode(token);
        const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');

        if (!isAdmin) {
            alert("No tienes permisos para realizar esta acción.");
            return; // Detenemos la ejecución si no tiene el rol ROLE_ADMIN
        }


        const url = `${import.meta.env.VITE_API_BASE_URL}/posts`;

        try {
            await axios.put(url, postInfo, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
                },
            })

            setText('Se realizó la actualización correctamente');
            setPostUpdate(true);
            handleCloseEdit();

        } catch (exception) {
            setPostUpdate(false);
            switch (exception.response.status) {
                case 404:
                    setText('No se realizó la actualización porque la publicación no existe');
                    break;
                default:
                    setText('No se realizó la actualización debido a un error de datos');
            }
        } finally {
            handleOpenAlert();
            getAllPostsByIdConsortium();
        }
    };

    useEffect(() => {
        if (postTitle === '' ){
            getAllPostsByIdConsortium()
        }
    }, [postTitle]);

    useEffect(() => {
        getAConsortiumByIdConsortium();
    }, [consortiumIdState]);

    const getAllPostsByFilter = async () => {

        const token = localStorage.getItem('token');
        if (!token) {
            setText('No estás autorizado. Por favor, inicia sesión.');
            return; // Detener la ejecución si no hay token
        }

        let decodedToken;
        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            setText('Token inválido');
            return; // Detener la ejecución si el token es inválido
        }

        // Verificar si el rol del usuario incluye "ROLE_ADMIN"
        const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');
        if (!isAdmin) {
            setText('No tienes permisos para realizar esta acción.');
            return; // Detener la ejecución si el rol no es "ROLE_ADMIN"
        }

        const handleEmptyValues = (value) => {
            return value === '' ? null : value;
        };

        const title = handleEmptyValues(postTitle);
        let params = { idConsortium: consortiumIdState };

        if (title !== null) params.title = title;

        if (Object.keys(params).length === 1 && params.idConsortium) {
            getAllPostsByIdConsortium();
        } else {
            const queryParams = new URLSearchParams(params).toString();
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/byTitle?${queryParams}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluir el token en los encabezados
                    },
                });
                const posts = res.data.content;
                setAllPosts(posts.map(post => {
                    return {
                        postId: post.postId,
                        title: post.title,
                        content: post.content,
                        creationPostDate: post.creationPostDate,
                    };
                }));
            } catch (error) {
                setText('Error al obtener los posts');
                console.error('Error al cargar los posts:', error);
            }
        }
    };

    const deletePost = async (idPostToDelete) =>{
        // Obtener el token desde el almacenamiento local o donde lo tengas guardado
        const token = localStorage.getItem('token');
        if (!token) {
            setText('No estás autorizado. Por favor, inicia sesión.');
            return; // Detener la ejecución si no hay token
        }

        let decodedToken;
        try {
            decodedToken = jwtDecode(token);
        } catch (error) {
            setText('Token inválido');
            return; // Detener la ejecución si el token es inválido
        }

        // Verificar si el rol del usuario incluye "ROLE_ADMIN"
        const isAdmin = decodedToken?.role?.includes('ROLE_ADMIN');
        if (!isAdmin) {
            setText('No tienes permisos para realizar esta acción.');
            return; // Detener la ejecución si el rol no es "ROLE_ADMIN"
        }

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/posts/${idPostToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en los encabezados
                },
            });
            // Filtrar el post eliminado de la lista
            setAllPosts(allPosts.filter(post => post.postId !== idPostToDelete));
        } catch (error) {
            setText('Error al eliminar la publicación');
            console.error('Error al eliminar el post:', error);
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
                    Tablón de Anuncios de {consortiumName}
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
                        label="Título"
                        variant="outlined"
                        size="small"
                        type="text"
                        focused
                        value={postTitle}
                        onChange={(e) => {
                            setPostTitle(e.target.value);
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
                        onClick={getAllPostsByFilter}
                    >
                        Buscar
                    </Button>
                    <AdminCreatePost/>
                </Box>
            </Paper>
            <Paper
                elevation={2}
                sx={{
                    padding: 2,
                    margin: 'auto',
                    marginTop: '20px',
                    width: { xs: '95%', sm: '85%', md: '70%', lg: '60%' },
                }}
            >
                <Box display="flex" justifyContent="center" mt={3}>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow sx={{ height: '24px' }}>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth || 150, backgroundColor: '#F5F5DC', color:'#002776',  fontWeight: 'bold', padding: '8px'  }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" style={{ minWidth: 100, backgroundColor: '#F5F5DC', fontWeight: 'bold', padding: '8px' }}>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allPosts
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((post) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={post.postId} sx={{ height: 'auto' }}>
                                                    {columns.map((column) => {
                                                        const value = post[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align} style={{
                                                                padding: '8px', // Un padding mayor para dar más espacio
                                                                minWidth: column.minWidth || 150, // Ancho mínimo para el contenido
                                                                maxWidth: 300, // Ancho máximo para limitar el tamaño
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis', // Agrega puntos suspensivos para contenido largo
                                                                whiteSpace: 'nowrap', // Evita que el texto se divida en varias líneas
                                                            }}>
                                                                {value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell align="center" style={{ padding: '8px',  minWidth: 100 }}>
                                                        <IconButton aria-label="edit" onClick={() =>
                                                            handleClickOpenEdit(
                                                                post.postId,
                                                                post.title,
                                                                post.content)
                                                        } sx={{ padding: '4px' }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton aria-label="delete" onClick={() => handleClickOpen(post.postId)} sx={{ padding: '4px' }}>
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
                            count={allPosts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                        />
                    </Paper>
                </Box>
                <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: '#002776',
                            '&:hover': { backgroundColor: '#001B5E' },
                            marginTop: '20px',
                            fontSize: '16px',
                            color: 'white',
                        }}
                        onClick={() => navigate(`/admin/management/tablon_de_anuncios`)}
                    >
                        Tablón de Anuncios
                    </Button>
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
                    {"Desea eliminar esta publicación?"}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#E5E5E5' }}>
                    <DialogContentText id="alert-dialog-description">
                        Si acepta se eliminara la publicación deseada.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#E5E5E5' }}>
                    <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: '#002776', '&:hover': { backgroundColor: '#001B5E' } }}>Rechazar</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#228B22', '&:hover': { backgroundColor: '#3D9970' } }} onClick={() => {
                        deletePost(idPostCreated)
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
                                <Grid item xs={12} >
                                    <TextField
                                        id="outlined-basic"
                                        label="Título"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="title"
                                        value={postInfo.title !== undefined ? postInfo.title : editTitle || ''}
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
                                <Grid item xs={12} >
                                    <TextField
                                        id="outlined-basic"
                                        label="Contenido"
                                        variant="outlined"
                                        size="small"
                                        type="text"
                                        name="content"
                                        multiline
                                        rows={5} // Ajusta la cantidad de líneas visibles
                                        value={postInfo.content !== undefined ? postInfo.content : editContent || ''}
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
                <Alert onClose={handleCloseAlert} severity={postUpdate ? "success" : "error"} sx={{width: '100%'}}>
                    {text}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default AdminPostManagement