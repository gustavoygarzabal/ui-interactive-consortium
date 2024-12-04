import React, {useContext, useState} from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel, TextField, Dialog, DialogTitle, DialogContent, Grid, DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {AdminManageContext} from "../AdminManageContext.jsx";

const mockClaims = [
    {
        claimId: 1,
        title: "Ruido excesivo",
        description: "Los vecinos hacen mucho ruido después de las 11 pm.",
        creationDate: "2024-11-20",
        status: "Pendiente",
        personName: "Juan Pérez",
    },
    {
        claimId: 2,
        title: "Fallo en el ascensor",
        description: "El ascensor no funciona desde hace dos días.",
        creationDate: "2024-11-22",
        status: "En revisión",
        personName: "María López",
    },
    {
        claimId: 3,
        title: "Iluminación defectuosa",
        description: "Las luces del pasillo del tercer piso están apagadas.",
        creationDate: "2024-11-25",
        status: "Resuelto",
        personName: "Carlos Gómez",
    },
];

// Definición de columnas
const columns = [
    { id: "title", label: "Título", minWidth: 150 },
    { id: "description", label: "Descripción", minWidth: 200 },
    { id: "status", label: "Estado", minWidth: 100 },
    { id: "personName", label: "Nombre", minWidth: 150 },
    { id: "creationDate", label: "Fecha", minWidth: 100 },
];


function AdminClaimManagement() {
    const {consortiumName} = useContext(AdminManageContext)
    const [claims, setClaims] = useState(mockClaims);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenEdit = (claim) => {
        setSelectedClaim(claim);
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setSelectedClaim(null);
    };

    const handleStatusChange = (event) => {
        setSelectedClaim({ ...selectedClaim, status: event.target.value });
    };

    const handleSave = () => {
        setClaims((prevClaims) =>
            prevClaims.map((claim) =>
                claim.claimId === selectedClaim.claimId
                    ? { ...claim, status: selectedClaim.status }
                    : claim
            )
        );
        handleCloseEdit();
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    // Filtro por título
    const filteredClaims = claims.filter((claim) =>
        claim.title.toLowerCase().includes(search.toLowerCase())
    );


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
                    Reclamos del Consorcio {consortiumName}
                </Typography>
            </Box>
            {/* Filtro de búsqueda */}
            <Paper
                elevation={2}
                sx={{
                    padding: 2,
                    margin: "auto",
                    marginTop: "20px",
                    width: { xs: "90%", sm: "80%", md: "50%", lg: "40%" },
                }}
            >
                <Box
                    mt={3}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <TextField
                        label="Buscar por Título"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        fullWidth
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                    borderColor: "#002776",
                                },
                            },
                            "& label.Mui-focused": {
                                color: "#002776",
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#003366",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#002776",
                            },
                        }}
                    >
                        Buscar
                    </Button>
                </Box>
            </Paper>

            {/* Tabla */}
            <Paper
                elevation={2}
                sx={{
                    padding: 2,
                    margin: "auto",
                    marginTop: "20px",
                    width: { xs: "95%", sm: "85%", md: "70%", lg: "60%" },
                }}
            >
                <Box display="flex" justifyContent="center" mt={3}>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align="left"
                                                style={{
                                                    minWidth: column.minWidth,
                                                    backgroundColor: "#F5F5DC",
                                                    color: "#002776",
                                                    fontWeight: "bold",
                                                    padding: "8px",
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell
                                            align="center"
                                            style={{
                                                minWidth: 100,
                                                backgroundColor: "#F5F5DC",
                                                fontWeight: "bold",
                                                padding: "8px",
                                            }}
                                        >
                                            Acciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {claims
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((claim) => (
                                            <TableRow key={claim.claimId} hover>
                                                {columns.map((column) => {
                                                    const value = claim[column.id];
                                                    return (
                                                        <TableCell
                                                            key={column.id}
                                                            align="left"
                                                            style={{
                                                                padding: "8px",
                                                                maxWidth: 300,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {value}
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell align="center" style={{ padding: "8px" }}>
                                                    <IconButton
                                                        sx={{ padding: "4px" }}
                                                        onClick={() => handleOpenEdit(claim)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 50]}
                            component="div"
                            count={claims.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                        />
                    </Paper>
                </Box>
            </Paper>

            {/* Diálogo para editar estado */}
            <Dialog
                open={openEdit}
                onClose={(event, reason) => {
                    if (reason !== "backdropClick") {
                        handleCloseEdit();
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: "#E5E5E5",
                        color: "#002776",
                        textAlign: "center",
                    }}
                >
                    Actualizar Estado
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: "#E5E5E5" }}>
                    {selectedClaim && (
                        <Box>
                            <Typography variant="body1">
                                <strong>Título:</strong> {selectedClaim.title}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Descripción:</strong> {selectedClaim.description}
                            </Typography>
                            <TextField
                                select
                                label="Estado"
                                value={selectedClaim.status}
                                onChange={handleStatusChange}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                <MenuItem value="Pendiente">Pendiente</MenuItem>
                                <MenuItem value="En revisión">En revisión</MenuItem>
                                <MenuItem value="Resuelto">Resuelto</MenuItem>
                            </TextField>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: "#E5E5E5" }}>
                    <Button
                        onClick={handleCloseEdit}
                        variant="contained"
                        sx={{
                            backgroundColor: "#002776",
                            "&:hover": { backgroundColor: "#001B5E" },
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{
                            backgroundColor: "#228B22",
                            "&:hover": { backgroundColor: "#006400" },
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}



export default AdminClaimManagement;