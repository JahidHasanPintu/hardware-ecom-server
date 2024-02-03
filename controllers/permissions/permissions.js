const pool = require("../../config/db");
const queries = require("./permissionqueries");
const { promisify } = require('util');

const getAllPermissions = async (req, res) => {
  
  let query = `
    SELECT *
    FROM permissions
  `;

  try {
    const queryAsync = promisify(pool.query).bind(pool);
    const result = await queryAsync(query);
    const permission = result;
    

    res.status(200).json({
      success: true,
      total: permission.length,
      data: permission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const getPermissionByID = (req, res) => {
  const roleId = req.params.roleId; // Assuming the role ID is passed as a parameter in the request
  
  const query = `
    SELECT p.name AS permission
    FROM permissions AS p
    INNER JOIN role_permissions AS rp ON p.id = rp.permission_id
    WHERE rp.role_id = ?
  `;
  
  pool.query(query, [roleId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    } else {
      const permissions = results.map((row) => row.permission);
      res.status(200).json({ success: true, data: permissions });
    }
  });
};



const addPermission = (req, res) => {

  if (req.file) {
    const filePath = req.file.path.replace("public\\", "");
  }

    const { permissions } = req.body;
    console.log(permissions);
    pool.query(
        queries.addPermission, [permissions],
        (error, results) => {
          if (error) throw error;
          res.status(201).json({ message: "Permission added successfully!" });
        }
      );
    

  


};



const removePermission = async (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getPermissionByID, [id], (error, results) => {
    const noPermissionFound = !results.rows.length;
    if (noPermissionFound) {
      res.send("Permission does not exist");
    }
    pool.query(queries.removePermission, [id], (error, results) => {

      if (error) throw error;
      res.status(200).json({ success: true, message: "Permission deleted sucessdully" });


    });
  });
};

const updatePermission = async (req, res) => {
  const id = parseInt(req.params.id);
  const {permissions } = req.body;
  pool.query(queries.getPermissionByID, [id], (error, results) => {
    const noPermissionFound = !results.rows.length;
    if (noPermissionFound) {
      res.send("Permission does not exist");
    }
    pool.query(queries.updatePermission, [permissions,id], (error, results) => {

      if (error) throw error;

      res.status(200).send("Permission updated sucessfully!");


    });
  });
};



module.exports = {
  getAllPermissions,
  getPermissionByID,
  addPermission,
  removePermission,
  updatePermission,
};

