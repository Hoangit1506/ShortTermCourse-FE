import { useState, useEffect } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TablePagination, Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../../api/axios';

export default function AdminCategories() {
    const [cats, setCats] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ id: '', name: '' });
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const fetch = () => {
        api.get(`/api/categories`, {
            params: {
                page,
                size: rowsPerPage,
                search: search || undefined, // Gửi tham số tìm kiếm nếu có
            },
        }).then(r => {
            setCats(r.data.data.content);
            setTotalItems(r.data.data.totalElements);
        });
    };

    useEffect(fetch, [page, rowsPerPage, search]);

    const handleSave = async () => {
        if (form.id) await api.put(`/api/categories/update/${form.id}`, form);
        else await api.post('/api/categories/create', form);
        setOpen(false);
        fetch();
    };

    const handleDelete = async (id) => {
        await api.delete(`/api/categories/delete/${id}`);
        fetch();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset về trang đầu tiên
    };

    return (
        <Box>
            {/* Tiêu đề trang */}
            <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
                Quản lý danh mục chuyên ngành
            </Typography>

            {/* Thanh tìm kiếm */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="contained" onClick={() => { setForm({}); setOpen(true); }}>
                    Tạo mới
                </Button>
            </Box>

            {/* Bảng danh mục */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Tên chuyên ngành</TableCell>
                        <TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cats.map((c, index) => (
                        <TableRow key={c.id}>
                            {/* Số thứ tự */}
                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{c.name}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => { setForm(c); setOpen(true); }}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(c.id)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Phân trang */}
            <TablePagination
                component="div"
                count={totalItems}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />

            {/* Dialog thêm/sửa danh mục */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{form.id ? 'Cập nhật' : 'Tạo mới'} Danh mục</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tên chuyên ngành"
                        fullWidth
                        margin="dense"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Hủy</Button>
                    <Button onClick={handleSave}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}