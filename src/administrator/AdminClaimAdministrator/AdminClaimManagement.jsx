import React, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Select,
    MenuItem,
    Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, TablePagination,
} from '@mui/material';

import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import AdminGallerySidebar from "../AdminGallerySidebar.jsx";
import {AdminManageContext} from "../AdminManageContext.jsx";

import {AccessTime, Assessment, Assignment, Person} from "@mui/icons-material";
import {useSnackbar} from "notistack";


const columns = [
    { id: 'subject', label: 'Título', minWidth: 100 },
    { id: 'issue', label: 'Descripción', minWidth: 100 },
    { id: 'user', label: 'Nombre', minWidth: 100 },
    { id: 'status', label: 'Estado del Reclamo', minWidth: 100 },
    { id: 'createdDate', label: 'Fecha del Reclamo', minWidth: 100 }
]
const AdminClaimManagement = () => {
    const {consortiumName, getAllClaimByConsortium, allClaims , setAllClaims, getAConsortiumByIdConsortium,consortiumIdState,statusMapping  } = useContext(AdminManageContext)
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    useEffect(() => {
        getAConsortiumByIdConsortium();
    }, [consortiumIdState]);


    useEffect(() => {
        getAllClaimByConsortium();
    }, [consortiumIdState]);

    const tableHeadCellStyles = {
        backgroundColor: '#002776',
        color: '#FFFFFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    };

    const tableCellStyles = {
        color: '#002776',
        padding: '8px',
    };
    const statusColors = {
        'Pendiente': '#BCE7FD',
        'En Revisión': '#d79569',
        'Resuelto': '#B0F2C2',
    };
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh', // Ensures that the container takes the full height of the screen
            }}
        >
            <AdminGallerySidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1, // Allows this component to take up the remaining space
                    padding: { xs: '16px', sm: '24px' },
                    marginLeft: { xs: 0, sm: '240px' },
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* Title */}
                    <Typography
                        variant="h6"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: '#003366',
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            marginBottom: '20px',
                        }}
                    >
                        Reclamos del Consorcio {consortiumName}
                    </Typography>

                    {/* Grid for Cards */}
                    <Grid container spacing={3} justifyContent="center" sx={{ marginBottom: '40px' }}>
                        {/* Pending Card */}
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                        5
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <AccessTime color="primary" />
                                        <Typography color="text.secondary" variant="body2">
                                            Pendientes
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* In Review Card */}
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                        0
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <Assignment color="primary" />
                                        <Typography color="text.secondary" variant="body2">
                                            En revisión
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Resolved Card */}
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                        2
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <Assessment color="primary" />
                                        <Typography color="text.secondary" variant="body2">
                                            Resueltos
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Total Card */}
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                        326
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <Typography color="text.secondary" variant="body2">
                                            Total
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Table */}
                    <Box sx={{ width: '100%', maxWidth: '900px', marginBottom: '40px' }}>
                        <TableContainer
                            sx={{
                                maxHeight: 600,
                                overflowX: 'auto',
                                borderRadius: '10px',
                                border: '1px solid #002776',
                            }}
                        >
                            <Table
                                stickyHeader
                                sx={{
                                    borderCollapse: 'separate',
                                    borderSpacing: '0',
                                }}
                            >
                                <TableHead>
                                    <TableRow sx={{ height: '24px' }}>
                                        {columns.map((column, index) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                sx={{
                                                    ...tableHeadCellStyles,
                                                    ...(index === 0 && {
                                                        borderTopLeftRadius: '10px',
                                                    }),
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                        <TableCell
                                            align="center"
                                            sx={{
                                                ...tableHeadCellStyles,
                                                borderTopRightRadius: '10px',
                                            }}
                                        >
                                            Editar
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allClaims
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((claim) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    key={claim.issueReportId}
                                                    sx={{
                                                        backgroundColor: '#FFFFFF',
                                                        '&:hover': { backgroundColor: '#F6EFE5' },
                                                    }}
                                                >
                                                    {columns.map((column) => {
                                                        const value = claim[column.id];
                                                        return (
                                                            <TableCell
                                                                key={column.id}
                                                                align="center"
                                                                sx={{ ...tableCellStyles, textAlign: 'center' }}
                                                            >
                                                                {column.id === 'status' ? (
                                                                    // Show Chip based on the status color
                                                                    <Chip
                                                                        label={statusMapping[claim.status] || claim.status}
                                                                        sx={{
                                                                            backgroundColor: statusColors[claim.status] || '#FFFFFF',
                                                                            color: '#000000',
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    value
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                    <TableCell align="center" sx={tableCellStyles}>
                                                        <IconButton
                                                            aria-label="edit"
                                                            onClick={() => handleClickOpenEdit(claim.status)}
                                                            sx={{ color: '#002776' }}
                                                        >
                                                            <EditIcon fontSize="small" />
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
                            count={allClaims.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminClaimManagement;