import { 
  Backdrop, 
  CircularProgress, 
  InputLabel, 
  MenuItem, 
  Select, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Pagination
} from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import api from "../../../api";
import { closeBackDrop, openBackDrop } from "../../../redux/action";
import { useSnackbar } from "../../../components/SnackbarContext";
import "./AccountManagement.css";

function AccountManagement() {
  const open = useSelector(state => state.backdropAction);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editUser, setEditUser] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    role: "",
  });

  const itemsPerPage = 5;

  // Fetch danh sách tài khoản
  async function fetchAccounts() {
    try {
      dispatch(openBackDrop());
      const response = await api.get('admin/accounts');
      setAccounts(response.data.accounts);
      setFilteredAccounts(response.data.accounts);
    } catch (error) {
      showSnackbar("Lỗi khi tải danh sách tài khoản");
    }
    dispatch(closeBackDrop());
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Lọc theo role và search
  useEffect(() => {
    let filtered = accounts;
    
    if (roleFilter !== "") {
      filtered = filtered.filter(account => account.role === roleFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(account => 
        account.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.phone.includes(searchTerm)
      );
    }
    
    setFilteredAccounts(filtered);
    setCurrentPage(1);
  }, [roleFilter, searchTerm, accounts]);

  // Tính toán pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, endIndex);

  // Xử lý sửa tài khoản
  function handleEdit(account) {
    setSelectedAccount(account);
    setEditUser({
      fullname: account.fullname,
      phone: account.phone,
      email: account.email,
      address: account.address,
      role: account.role,
    });
    setEditDialogOpen(true);
  }

  // Xử lý xóa tài khoản
  function handleDelete(account) {
    setSelectedAccount(account);
    setDeleteDialogOpen(true);
  }

  // Cập nhật tài khoản
  async function updateAccount() {
    try {
      // Validation cơ bản
      if (!editUser.fullname.trim()) {
        showSnackbar("Vui lòng nhập họ và tên");
        return;
      }
      if (!editUser.email.trim()) {
        showSnackbar("Vui lòng nhập email");
        return;
      }
      if (!editUser.phone.trim()) {
        showSnackbar("Vui lòng nhập số điện thoại");
        return;
      }
      if (!editUser.role) {
        showSnackbar("Vui lòng chọn role");
        return;
      }

      dispatch(openBackDrop());
      
      // Gọi API cập nhật
      await api.put(`admin/accounts/${selectedAccount._id}`, editUser);
      
      showSnackbar("Cập nhật tài khoản thành công");
      setEditDialogOpen(false);
      
      // Reset form
      setEditUser({
        fullname: "",
        phone: "",
        email: "",
        address: "",
        role: "",
      });
      
      // Reload danh sách
      fetchAccounts();
      
    } catch (error) {
      console.error("Update error:", error);
      
      if (error.response?.status === 400) {
        showSnackbar(error.response.data.message || "Email đã được sử dụng");
      } else if (error.response?.status === 404) {
        showSnackbar("Tài khoản không tồn tại");
      } else if (error.response?.status === 403) {
        showSnackbar("Bạn không có quyền thực hiện thao tác này");
      } else {
        showSnackbar("Lỗi khi cập nhật tài khoản");
      }
    } finally {
      dispatch(closeBackDrop());
    }
  }

  // Xóa tài khoản
  async function deleteAccount() {
    try {
      dispatch(openBackDrop());
      
      // Gọi API xóa
      await api.delete(`admin/accounts/${selectedAccount._id}`);
      
      showSnackbar("Xóa tài khoản thành công");
      setDeleteDialogOpen(false);
      
      // Reset selected account
      setSelectedAccount(null);
      
      // Reload danh sách
      fetchAccounts();
      
    } catch (error) {
      console.error("Delete error:", error);
      
      if (error.response?.status === 400) {
        showSnackbar(error.response.data.message || "Không thể xóa tài khoản");
      } else if (error.response?.status === 404) {
        showSnackbar("Tài khoản không tồn tại");
      } else if (error.response?.status === 403) {
        showSnackbar("Bạn không có quyền thực hiện thao tác này");
      } else {
        showSnackbar("Lỗi khi xóa tài khoản");
      }
    } finally {
      dispatch(closeBackDrop());
    }
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFilterChange(e) {
    setRoleFilter(e.target.value);
  }

  function handleSearchChange(e) {
    setSearchTerm(e.target.value);
  }

  function handlePageChange(event, page) {
    setCurrentPage(page);
  }

  function getRoleChip(role) {
    const roleColors = {
      admin: "error",
      staff: "primary", 
      delivery: "success",
      user: "default"
    };
    const roleLabels = {
      admin: "Admin",
      staff: "Staff", 
      delivery: "Delivery",
      user: "User"
    };
    return <Chip label={roleLabels[role] || role} color={roleColors[role] || "default"} size="small" />;
  }

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="container-product-management">
        <div className="title-product-management">Quản lý tài khoản</div>
        
        {/* Filter Section - Fixed Height */}
        <div className="main-form-ui" style={{ minHeight: '140px' }}>
          <div className="grid-2-col box-grid">
            {/* Search */}
            <div className="box-inp">
              <label htmlFor="search-input">Tìm kiếm</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="search-input"
                  className="ui-inp"
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ paddingLeft: '40px' }}
                />
                <Search style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#666',
                  fontSize: '20px'
                }} />
              </div>
            </div>
            
            {/* Filter */}
            <div className="box-inp">
              <InputLabel sx={{ height: '18px', color: "white" }}>
                <Typography fontFamily='Barlow' fontSize='14px' fontWeight='500'>
                  Lọc theo Role
                </Typography>
              </InputLabel>
              <Select
                className="ui-inp"
                sx={{ height: '49.59px' }}
                value={roleFilter}
                onChange={handleFilterChange}
                displayEmpty
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="delivery">Delivery</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </div>
          </div>
          
          {/* Button - Fixed Position */}
          <div style={{ 
            position: 'absolute',
            right: '20px',
            top: '20px'
          }}>
            <button 
              className="save-changes btn-pro"
              onClick={() => {
                // Navigate to add employee page
                window.location.href = '/setting/add-employee';
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px'
              }}
            >
              <Add fontSize="small" />
              Thêm tài khoản
            </button>
          </div>
        </div>

        {/* Bảng danh sách tài khoản - Fixed Position */}
        <div style={{ position: 'relative', minHeight: '500px' }}>
          <TableContainer 
            component={Paper} 
            className="account-table-container" 
            style={{ 
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              marginBottom: '20px'
            }}
          >
            {/* Thông tin tổng quan trong table */}
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#f8f9fa', 
              borderBottom: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="body2" style={{ color: '#666', fontSize: '14px' }}>
                <strong>Tổng: {filteredAccounts.length}</strong> tài khoản
              </Typography>
              <Typography variant="body2" style={{ color: '#666', fontSize: '14px' }}>
                Hiển thị <strong>{startIndex + 1}-{Math.min(endIndex, filteredAccounts.length)}</strong> của <strong>{filteredAccounts.length}</strong> tài khoản
              </Typography>
            </div>
            
            <Table>
              <TableHead>
                <TableRow className="table-header" style={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><Typography className="table-header-text">Họ và tên</Typography></TableCell>
                  <TableCell><Typography className="table-header-text">Email</Typography></TableCell>
                  <TableCell><Typography className="table-header-text">Số điện thoại</Typography></TableCell>
                  <TableCell><Typography className="table-header-text">Địa chỉ</Typography></TableCell>
                  <TableCell><Typography className="table-header-text">Role</Typography></TableCell>
                  <TableCell align="center"><Typography className="table-header-text">Thao tác</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentAccounts.map((account, index) => (
                  <TableRow 
                    key={account._id} 
                    hover
                    style={{ 
                      borderLeft: `4px solid ${index % 2 === 0 ? '#2196F3' : '#4CAF50'}`,
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="medium" variant="body2">{account.fullname}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{account.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{account.phone}</Typography>
                    </TableCell>
                    <TableCell style={{ maxWidth: '200px' }}>
                      <Typography 
                        variant="body2" 
                        style={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={account.address}
                      >
                        {account.address}
                      </Typography>
                    </TableCell>
                    <TableCell>{getRoleChip(account.role)}</TableCell>
                    <TableCell align="center">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <IconButton 
                          onClick={() => handleEdit(account)}
                          size="small"
                          style={{ 
                            color: '#1976d2',
                            '&:hover': { backgroundColor: '#e3f2fd' }
                          }}
                          title="Sửa tài khoản"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(account)}
                          size="small"
                          style={{ 
                            color: '#d32f2f',
                            '&:hover': { backgroundColor: '#ffebee' }
                          }}
                          title="Xóa tài khoản"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        {/* Pagination - Fixed Position */}
        <div style={{ 
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '20px'
        }}>
          {filteredAccounts.length > 0 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          )}
        </div>
        
        {/* Empty State - Fixed Position */}
        {filteredAccounts.length === 0 && (
          <div style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', 
            padding: '40px' 
          }}>
            <Typography>Không có tài khoản nào được tìm thấy</Typography>
          </div>
        )}
        </div>
      </div>

      {/* Dialog sửa tài khoản */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Sửa thông tin tài khoản
          </Typography>
        </DialogTitle>
        <DialogContent>
          <div className="main-form-ui" style={{ marginTop: '16px' }}>
            <div className="box-inp">
              <label htmlFor="edit-name">Họ và tên</label>
              <input
                id="edit-name"
                className="ui-inp"
                onChange={handleEditChange}
                name="fullname"
                type="text"
                value={editUser.fullname}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            
            <div className="box-inp">
              <label htmlFor="edit-address">Địa chỉ</label>
              <input
                id="edit-address"
                className="ui-inp"
                onChange={handleEditChange}
                name="address"
                type="text"
                value={editUser.address}
                placeholder="Nhập địa chỉ"
              />
            </div>
            
            <div className="grid-2-col box-grid">
              <div className="box-inp">
                <label htmlFor="edit-phone">Số điện thoại</label>
                <input
                  id="edit-phone"
                  className="ui-inp"
                  onChange={handleEditChange}
                  name="phone"
                  type="text"
                  value={editUser.phone}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
              
              <div className="box-inp">
                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  className="ui-inp"
                  name="email"
                  onChange={handleEditChange}
                  type="email"
                  value={editUser.email}
                  placeholder="Nhập email"
                  required
                />
              </div>
            </div>
            
            <div className="box-inp">
              <InputLabel sx={{ height: '18px', color: "white" }}>
                <Typography fontFamily='Barlow' fontSize='14px' fontWeight='500'>
                  Role
                </Typography>
              </InputLabel>
              <Select
                className="ui-inp"
                sx={{ height: '49.59px' }}
                name="role"
                value={editUser.role}
                onChange={handleEditChange}
                required
                displayEmpty
              >
                <MenuItem value="">-- Chọn role --</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="delivery">Delivery</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <button 
            type="button"
            className="discard-changes btn-pro"
            onClick={() => {
              setEditDialogOpen(false);
              // Reset form khi hủy
              setEditUser({
                fullname: "",
                phone: "",
                email: "",
                address: "",
                role: "",
              });
            }}
          >
            Hủy bỏ
          </button>
          <button 
            className="save-changes btn-pro" 
            onClick={updateAccount}
          >
            Lưu thay đổi
          </button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold" color="error.main">
            Xác nhận xóa tài khoản
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography style={{ marginTop: '16px', marginBottom: '16px' }}>
            Bạn có chắc chắn muốn xóa tài khoản:
          </Typography>
          
          {selectedAccount && (
            <div style={{ 
              padding: '12px 16px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <Typography variant="body2" style={{ marginBottom: '4px' }}>
                <strong>Họ và tên:</strong> {selectedAccount.fullname}
              </Typography>
              <Typography variant="body2" style={{ marginBottom: '4px' }}>
                <strong>Email:</strong> {selectedAccount.email}
              </Typography>
              <Typography variant="body2">
                <strong>Role:</strong> {selectedAccount.role}
              </Typography>
            </div>
          )}
          
          <Typography variant="body2" color="error.main" style={{ 
            backgroundColor: '#ffebee', 
            padding: '8px 12px', 
            borderRadius: '4px',
            border: '1px solid #ffcdd2'
          }}>
            <strong>Lưu ý:</strong> Tài khoản sẽ bị vô hiệu hóa và không thể đăng nhập.
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <button 
            type="button"
            className="discard-changes btn-pro"
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedAccount(null);
            }}
          >
            Hủy bỏ
          </button>
          <button 
            className="save-changes btn-pro" 
            onClick={deleteAccount}
            style={{ backgroundColor: '#d32f2f', borderColor: '#d32f2f' }}
          >
            Xác nhận xóa
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AccountManagement;