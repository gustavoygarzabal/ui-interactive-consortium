import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import {
    Alert,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid, Snackbar,
    TextField
} from "@mui/material";
import {useState} from "react";
import Paper from "@mui/material/Paper";
import axios from "axios";

function SuperAdminCreateAdministrator(){
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('')
    const [errors, setErrors] = useState({
        name: false,
        lastName: false,
        mail: false,
        dni: false
    })
    const [adminInfo, setAdminInfo] = useState({})
    const [adminCreated, setAdminCreated] = useState(true);
    const [openAlert, setOpenAlert] = useState(false)
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
    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleOpenAlert = () => {
        setOpenAlert(true);
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCloseAlert= (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setAdminInfo(values => ({...values, [name]: value}))}

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validateFields()) {
            console.log(adminInfo)
            let url = 'http://localhost:8080/InteractiveConsortium/v1/administrators'
            try {
                await axios.post(url, adminInfo)
                setText('Se realizo la carga correctamente')
                setAdminCreated(true)
                setAdminInfo({})


            } catch (exception) {
                setAdminCreated(false)
                switch (exception.response.status) {
                    case 409:
                        setText('No se realizo la carga porque hay un Administrador con ese mail o dni')
                        break
                    default:
                        setText('No se realizo la carga, error de datos!!')
                }
            } finally {
                handleOpenAlert()
                handleClose()
            }
        }
    }

    return (
        <>
        <Box mt={3} sx={{ display: 'flex', justifyContent: 'flex-Star', alignItems: 'center' }}>
            <Box sx={{ marginLeft: '25%', minWidth: 200,  marginTop: '16px', marginBottom: '16px' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
                Nuevo
            </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ backgroundColor: '#004c4c',  color: 'white', textAlign: 'center' }}>Nuevo Administrador</DialogTitle>
                <DialogContent sx={{ backgroundColor: '#004c4c' }}>
                    <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#DCDCDC' }}>
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
                                        value={adminInfo.name || ""}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.name ? 'red' : '#90caf9',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.name ? 'red' : '#64b5f6',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.name ? 'red' : '#2196f3',
                                                },
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
                                        value={adminInfo.lastName || ""}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.lastName ? 'red' : '#90caf9',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.lastName ? 'red' : '#64b5f6',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.lastName ? 'red' : '#2196f3',
                                                },
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
                                        value={adminInfo.mail || ""}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.mail ? 'red' : '#90caf9',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.mail ? 'red' : '#64b5f6',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.mail ? 'red' : '#2196f3',
                                                },
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
                                        value={adminInfo.dni || ""}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: errors.dni ? 'red' : '#90caf9',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.dni ? 'red' : '#64b5f6',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: errors.dni ? 'red' : '#2196f3',
                                                },
                                            },
                                        }}
                                        error={errors.dni}
                                        helperText={errors.dni ? 'Solo números permitidos' : ''}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#D3D3D3' }}>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button type="submit" color="primary" onClick={handleSubmit} disabled={!validateFields}>
                        Guardar
                    </Button>

                </DialogActions>
            </Dialog>
        </Box>
    <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={adminCreated ? "success" : "error"} sx={{width: '100%'}}>
            {text}
        </Alert>
    </Snackbar>
        </>
    )
}
export default SuperAdminCreateAdministrator