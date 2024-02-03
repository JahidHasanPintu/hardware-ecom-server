const pool = require("../../config/db");
const queries = require("./roleQueries");
const util = require('util');
const { promisify } = require('util');

const getAllRoles = async (req, res) => {
  const { search } = req.query;

  let query = `
    SELECT r.id, r.name AS role, p.id AS permission_id, p.name AS permission_name
    FROM roles AS r
    LEFT JOIN role_permissions AS rp ON r.id = rp.role_id
    LEFT JOIN permissions AS p ON rp.permission_id = p.id
  `;

  const values = [];

  // If search query parameter is provided, add WHERE clause to search by role name
  if (search) {
    query += `
      WHERE r.name LIKE ?        
    `;
    values.push(`%${search}%`);
  }

  query += `
    ORDER BY r.id ASC
  `;

  const totalCountQuery = `
    SELECT COUNT(*) as total_count
    FROM roles
  `;

  try {
    const queryAsync = promisify(pool.query).bind(pool);
    const result = await queryAsync(query, values);

    // Preprocess the roles to group permissions
    const roles = result.reduce((acc, { id, role, permission_id, permission_name }) => {
      const existingRole = acc.find((r) => r.id === id);
      if (existingRole) {
        existingRole.permissions.push({ id: permission_id, name: permission_name });
      } else {
        acc.push({ id, role, permissions: [{ id: permission_id, name: permission_name }] });
      }
      return acc;
    }, []);

    const totalCountResult = await queryAsync(totalCountQuery, values);
    const totalCount = parseInt(totalCountResult[0].total_count, 10);

    res.status(200).json({
      success: true,
      total: roles.length,
      totalItem: totalCount,
      data: roles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




const getRoleByID = async (req, res) => {
  const roleId = req.params.id;

  const query = `
    SELECT r.*, p.name AS permission
    FROM roles AS r
    LEFT JOIN role_permissions AS rp ON r.id = rp.role_id
    LEFT JOIN permissions AS p ON rp.permission_id = p.id
    WHERE r.id = ?
  `;

  try {
    const queryAsync = promisify(pool.query).bind(pool);
    const result = await queryAsync(query, [roleId]);
    const role = result[0];

    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    const { id, name, permission } = role;

    const roleWithPermissions = {
      id,
      name,
      permissions: result.map((row) => row.permission),
    };

    res.status(200).json({
      success: true,
      data: roleWithPermissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const addRole = (req, res) => {
  const { roleName, permissions } = req.body;
  let permissionArray = [];

  if (!Array.isArray(permissions)) {
    permissionArray = permissions.split(',');
  } else {
    permissionArray = permissions;
  }
  const addRoleQuery = `INSERT INTO roles (name) VALUES (?)`;

  pool.query(addRoleQuery, [roleName], async (addError, addResults) => {
    if (addError) {
      throw addError;
    }
    if (addResults) {
      const role_id = addResults.insertId;
      const insertPromises = permissionArray.map(async (permission) => {
        console.log(permission);
        const insertPermissionQuery =
          'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)';
        await pool.query(insertPermissionQuery, [role_id, permission]);
      });

      await Promise.all(insertPromises);

      res.status(200).json({ message: 'Role added successfully' });

    }
  });
};





const removeRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    // First, delete the role from the 'roles' table
    const deleteRoleQuery = 'DELETE FROM roles WHERE id = ?';
    await pool.query(deleteRoleQuery, [roleId]);

    // Next, delete the corresponding role permissions from the 'role_permissions' table
    const deletePermissionsQuery = 'DELETE FROM role_permissions WHERE role_id = ?';
    await pool.query(deletePermissionsQuery, [roleId]);

    res.status(200).json({ message: 'Role and associated permissions deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const updateRole = (req, res) => {
  const { roleId, roleName, permissions, selectedPermissions, removedPermissions } = req.body;
  let permissionArray = [];

  if (!Array.isArray(permissions)) {
    permissionArray = permissions.split(',');
  } else {
    permissionArray = permissions;
  }

  const updateRoleQuery = `UPDATE roles SET name = ? WHERE id = ?`;
  const deleteRolePermissionsQuery = `DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?`;

  pool.query(updateRoleQuery, [roleName, roleId], async (updateError, updateResults) => {
    if (updateError) {
      throw updateError;
    }
    if (updateResults) {
      if(removedPermissions){
        removedPermissions.map(async (permission) => {
          const removePermissionQuery = 'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?';
          await pool.query(removePermissionQuery, [roleId, permission]);
        });
      }
      if(selectedPermissions){
        selectedPermissions.map(async (permission) => {
          const insertPermissionQuery = 'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)';
          await pool.query(insertPermissionQuery, [roleId, permission]);
        });
      }

      res.status(200).json({ message: 'Role updated successfully' });
    }
  });
};




module.exports = {
  getAllRoles,
  getRoleByID,
  addRole,
  removeRole,
  updateRole,
};

