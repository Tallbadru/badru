import React, { useState, useEffect } from 'react';
import '../App.css'
// The UserForm component for creating and updating users
function UserForm({ onSubmit, userData, setUserData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="user-management__form">
      <div>
        <label htmlFor="username" className="user-management__form-label">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={userData.username}
          onChange={handleChange}
          required
          className="user-management__input"
        />
      </div>

      <div>
        <label htmlFor="password" className="user-management__form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          required
          className="user-management__input"
        />
      </div>

      <button type="submit" className="user-management__button">
        {userData.id ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
}

// The main component handling the user list and CRUD operations
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({ username: '', password: '', role: 'Tenant' });
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');  // For search functionality

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Create or Update a user
  const handleSubmit = async (data) => {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id
      ? `http://127.0.0.1:8000/api/user/${data.id}/`
      : 'http://127.0.0.1:8000/api/user/';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert(`${data.id ? 'User updated' : 'User added'} successfully!`);
        setUserData({ username: '', password: '', role: 'Tenant' });
        setEditingUser(null);
        fetchUsers(); // Reload users
      } else {
        alert('Error saving user: ' + responseData.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Check the console for details.');
    }
  };

  // Delete a user
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user/${id}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('User deleted successfully!');
          fetchUsers(); // Reload users
        } else {
          alert('Error deleting user');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the user. Check the console for details.');
      }
    }
  };

  // Edit a user (populate the form with user data)
  const handleEdit = (user) => {
    setUserData({ ...user });
    setEditingUser(user.id);
  };

  // Search users by username
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  return (
    <div className="user-management__main-content">
      <h2 className="user-management__header">User Management</h2>
      
      {/* Search Bar */}
      <div className="user-management__search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by username"
          className="user-management__search-input"
        />
      </div>

      {/* Form for creating/updating users */}
      <UserForm onSubmit={handleSubmit} userData={userData} setUserData={setUserData} />

      {/* User List */}
      <ul className="user-management__list">
        {filteredUsers.map((user) => (
          <li key={user.id} className="user-management__list-item">
            <span>{user.username}</span>
            <div>
              <button
                className="user-management__button"
                onClick={() => handleEdit(user)}
              >
                Edit
              </button>
              <button
                className="user-management__button"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;
