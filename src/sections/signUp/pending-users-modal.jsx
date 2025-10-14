import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../configs/axiosInstance';

const roles = ['Super Admin', 'Admin', 'Accounts', 'Store', 'Production', 'Quantity'];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const PendingUsersModal = ({ open, onClose }) => {
  const [usersData, setUsersData] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPendingUsers();
    }
  }, [open]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const result = await axiosInstance.get('/get-pending-users');
      if (result.data.success) {
        const users = result.data.usersData || [];
        setUsersData(users);

        // Initialize role selection state from fetched users
        const initialRoles = users.reduce((acc, user) => ({ ...acc, [user.id]: user.role || '' }), {});
        setUserRoles(initialRoles);
      } else {
        toast.error('Failed to load pending users');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUserRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleAction = async (userId, actionType) => {
    const selectedRole = userRoles[userId];
    console.log(`User ID: ${userId} | Action: ${actionType} | Selected Role: ${selectedRole}`);
  
    try {
      const response = await axiosInstance.post('/verify-user', {
        userId,
        role: selectedRole,
        action: actionType,
      });
  
      if (response.data.success) {
        toast.success(`User ${actionType}d successfully`);
  
        // Remove user from the list
        setUsersData((prev) => prev.filter((user) => user._id !== userId));
  
        // Optionally, remove their role from userRoles state
        setUserRoles((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      } else {
        toast.error(response.data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Action error:', error);
      toast.error('Something went wrong while processing the action');
    }
  };
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} className="overflow-auto max-h-[90vh]">
        <Typography variant="h6" mb={3}>
          User Access Requests
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {usersData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No pending users.
                    </TableCell>
                  </TableRow>
                ) : (
                  usersData.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={userRoles[user._id] || ''}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          fullWidth
                          size="small"
                        >
                          {roles.map((role) => (
                            <MenuItem key={role} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleAction(user._id, 'approve')}
                            disabled={!userRoles[user._id]}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleAction(user._id, 'decline')}
                          >
                            Decline
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Modal>
  );
};

export default PendingUsersModal;
