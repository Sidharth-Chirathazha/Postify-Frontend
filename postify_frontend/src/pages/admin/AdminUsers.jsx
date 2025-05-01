import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, toggleUserStatus } from '../../redux/slices/adminSlice'; // Adjust path as needed
import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';
import ConfirmDialog from '../../components/ConfirmDialog';
import avatar from '../../assets/avatar.jpg'

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { 
    users, 
    loading, 
    error, 
    totalPages, 
    currentPage: reduxCurrentPage,
    statusUpdating 
  } = useSelector(state => state.admin);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);  


  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchTerm]);


  useEffect(() => {
    fetchUserData();
  }, [currentPage, filterStatus, debouncedSearchTerm]);

  const fetchUserData = () => {

    let isActiveParam = '';
    if (filterStatus === 'active') isActiveParam = true;
    if (filterStatus === 'blocked') isActiveParam = false;
    
    dispatch(fetchUsers({
      page: currentPage,
      search: debouncedSearchTerm,
      isActive: isActiveParam
    }));
  };

  const openConfirmDialog = (user) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };
  

  const handleToggleStatus = async (userId) => {
    try {
      await dispatch(toggleUserStatus(userId)).unwrap();
      showSuccessToast("User status updated successfully!");
    } catch (err) {
      console.error('Error toggling user status:', err);
      showErrorToast("Failed to update user status. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Manage Users</h1>
            <p className="text-primary/70 text-lg">
              View and manage user accounts on your platform
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className="bg-primary text-cream px-4 py-2 rounded-r-lg hover:bg-primary/90 transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="mb-6 flex space-x-2">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'all' 
                ? 'bg-primary text-cream' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Users
          </button>
          <button 
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'active' 
                ? 'bg-primary text-cream' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active Users
          </button>
          <button 
            onClick={() => setFilterStatus('blocked')}
            className={`px-4 py-2 rounded-lg transition ${
              filterStatus === 'blocked' 
                ? 'bg-primary text-cream' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Blocked Users
          </button>
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
                                <img 
                                src={user.profile_pic || avatar} 
                                alt={`${user.first_name || user.username}'s profile`}
                                className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                            </div>
                            </div>
                        </div>
                     </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.date_joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => openConfirmDialog(user)}
                          // disabled={statusUpdating}
                          className={`px-3 py-1 rounded text-white ${
                            user.is_active 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-green-500 hover:bg-green-600'
                          } `}
                        >
                          {user.is_active ? 'Block' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && !error && users.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span> pages
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === page
                            ? 'bg-primary text-white border-primary z-10'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-xl text-gray-500 mb-4">No users found</p>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
            if (selectedUser) {
            handleToggleStatus(selectedUser.id);
            }
        }}
        title={selectedUser?.is_active ? "Block User" : "Unblock User"}
        message={`Are you sure you want to ${selectedUser?.is_active ? "block" : "unblock"} ${selectedUser?.username}?`}
        confirmText={selectedUser?.is_active ? "Block" : "Unblock"}
        confirmButtonColor={selectedUser?.is_active ? "danger" : "success"}
      />
    </div>
  );
};

export default AdminUsers;