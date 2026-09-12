const db = require('../config/database');

const RolePermissionController = {
  // Lấy tất cả phân quyền
  getAllRolePermissions: async (req, res) => {
    try {
      const query = `
        SELECT 
          rdp.roleId,
          rdp.departmentId,
          r.name as roleName,
          d.name as departmentName,
          GROUP_CONCAT(
            DISTINCT JSON_OBJECT(
              'id', p.permissionId,
              'name', p.name
            )
          ) as permissions
        FROM Role_Department_Permission rdp
        INNER JOIN Role r ON rdp.roleId = r.roleId AND r.isDeleted = FALSE
        INNER JOIN Department d ON rdp.departmentId = d.departmentId AND d.isDeleted = FALSE
        INNER JOIN Permission p ON rdp.permissionId = p.permissionId AND p.isDeleted = FALSE
        WHERE rdp.isDeleted = FALSE
        GROUP BY rdp.roleId, rdp.departmentId
        ORDER BY rdp.roleId, rdp.departmentId
      `;

      const [results] = await db.query(query);

      // Format lại dữ liệu
      const formattedResults = results.map(row => {
        let permissions = [];
        try {
          permissions = row.permissions ? JSON.parse(`[${row.permissions}]`) : [];
        } catch (error) {
          console.error('Error parsing permissions:', error);
        }

        return {
          role: {
            id: row.roleId,
            name: row.roleName
          },
          department: {
            id: row.departmentId,
            name: row.departmentName
          },
          permissions: permissions
        };
      });

      res.status(200).json({
        success: true,
        data: formattedResults,
        message: 'Lấy danh sách phân quyền thành công'
      });
    } catch (error) {
      console.error('Error getting role permissions:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách phân quyền',
        error: error.message
      });
    }
  },

  // Lấy phân quyền theo vai trò và phòng ban
  getRolePermissions: async (req, res) => {
    try {
      const { roleId, departmentId } = req.params;
      
      const query = `
        SELECT 
          rdp.roleId,
          rdp.departmentId,
          r.name as roleName,
          d.name as departmentName,
          GROUP_CONCAT(
            DISTINCT JSON_OBJECT(
              'id', p.permissionId,
              'name', p.name
            )
          ) as permissions
        FROM Role_Department_Permission rdp
        INNER JOIN Role r ON rdp.roleId = r.roleId AND r.isDeleted = FALSE
        INNER JOIN Department d ON rdp.departmentId = d.departmentId AND d.isDeleted = FALSE
        INNER JOIN Permission p ON rdp.permissionId = p.permissionId AND p.isDeleted = FALSE
        WHERE rdp.roleId = ? 
          AND rdp.departmentId = ? 
          AND rdp.isDeleted = FALSE
        GROUP BY rdp.roleId, rdp.departmentId
      `;

      const [results] = await db.query(query, [roleId, departmentId]);

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy phân quyền'
        });
      }

      const result = results[0];
      let permissions = [];
      try {
        permissions = result.permissions ? JSON.parse(`[${result.permissions}]`) : [];
      } catch (error) {
        console.error('Error parsing permissions:', error);
      }

      const formattedResult = {
        role: {
          id: result.roleId,
          name: result.roleName
        },
        department: {
          id: result.departmentId,
          name: result.departmentName
        },
        permissions: permissions
      };

      res.status(200).json({
        success: true,
        data: formattedResult,
        message: 'Lấy phân quyền thành công'
      });
    } catch (error) {
      console.error('Error getting role permissions:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy phân quyền',
        error: error.message
      });
    }
  },

  // Cập nhật phân quyền cho vai trò trong phòng ban
  updateRolePermissions: async (req, res) => {
    try {
      const { roleId, departmentId, permissions } = req.body;

      // Bắt đầu transaction
      await db.beginTransaction();

      try {
        // Xóa các quyền cũ (soft delete)
        const deleteQuery = `
          UPDATE Role_Department_Permission
          SET isDeleted = TRUE
          WHERE roleId = ? AND departmentId = ? AND isDeleted = FALSE
        `;
        await db.query(deleteQuery, [roleId, departmentId]);

        // Thêm các quyền mới
        if (permissions && permissions.length > 0) {
          // Kiểm tra các quyền đã tồn tại (bao gồm cả soft deleted)
          const checkQuery = `
            SELECT permissionId, isDeleted 
            FROM Role_Department_Permission
            WHERE roleId = ? 
              AND departmentId = ? 
              AND permissionId IN (?)
          `;
          const [existingPermissions] = await db.query(checkQuery, [roleId, departmentId, permissions]);

          // Tạo map để theo dõi các quyền đã tồn tại
          const existingMap = new Map(
            existingPermissions.map(p => [p.permissionId, p.isDeleted])
          );

          // Tách các quyền thành 2 nhóm: cần update và cần insert
          const toUpdate = [];
          const toInsert = [];

          permissions.forEach(permissionId => {
            if (existingMap.has(permissionId)) {
              // Nếu quyền đã tồn tại (kể cả soft deleted), thêm vào danh sách cần update
              toUpdate.push(permissionId);
            } else {
              toInsert.push(permissionId);
            }
          });

          // Update các quyền đã tồn tại (kể cả soft deleted)
          if (toUpdate.length > 0) {
            const updateQuery = `
              UPDATE Role_Department_Permission
              SET isDeleted = FALSE
              WHERE roleId = ? 
                AND departmentId = ? 
                AND permissionId IN (?)
            `;
            await db.query(updateQuery, [roleId, departmentId, toUpdate]);
          }

          // Insert các quyền mới
          if (toInsert.length > 0) {
            const values = toInsert.map(permissionId => [roleId, departmentId, permissionId]);
            const insertQuery = `
              INSERT INTO Role_Department_Permission (roleId, departmentId, permissionId)
              VALUES ?
            `;
            await db.query(insertQuery, [values]);
          }
        }

        // Commit transaction
        await db.commit();

        res.status(200).json({
          success: true,
          message: 'Cập nhật phân quyền thành công'
        });
      } catch (error) {
        // Rollback nếu có lỗi
        await db.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error updating role permissions:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật phân quyền',
        error: error.message
      });
    }
  },

  // Xóa một permission cụ thể cho role và department (soft delete)
  deletePermission: async (req, res) => {
    try {
      const { roleId, departmentId, permissionId } = req.params;

      // Kiểm tra xem permission có tồn tại không
      const checkQuery = `
        SELECT * FROM Role_Department_Permission
        WHERE roleId = ? 
          AND departmentId = ? 
          AND permissionId = ?
          AND isDeleted = FALSE
      `;
      const [existingPermission] = await db.query(checkQuery, [roleId, departmentId, permissionId]);

      if (existingPermission.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy quyền này trong phân quyền'
        });
      }

      // Xóa permission (soft delete)
      const deleteQuery = `
        UPDATE Role_Department_Permission
        SET isDeleted = TRUE
        WHERE roleId = ? 
          AND departmentId = ? 
          AND permissionId = ?
      `;
      await db.query(deleteQuery, [roleId, departmentId, permissionId]);

      res.status(200).json({
        success: true,
        message: 'Xóa quyền thành công'
      });
    } catch (error) {
      console.error('Error deleting permission:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa quyền',
        error: error.message
      });
    }
  },

  // Thêm một permission cụ thể cho role và department
  addPermission: async (req, res) => {
    try {
      const { roleId, departmentId, permissionId } = req.params;

      // Kiểm tra xem permission đã tồn tại chưa (bao gồm cả soft deleted)
      const checkQuery = `
        SELECT * FROM Role_Department_Permission
        WHERE roleId = ? 
          AND departmentId = ? 
          AND permissionId = ?
      `;
      const [existingPermission] = await db.query(checkQuery, [roleId, departmentId, permissionId]);

      if (existingPermission.length > 0) {
        // Nếu permission đã tồn tại (kể cả soft deleted), cập nhật lại isDeleted = FALSE
        const updateQuery = `
          UPDATE Role_Department_Permission
          SET isDeleted = FALSE
          WHERE roleId = ? 
            AND departmentId = ? 
            AND permissionId = ?
        `;
        await db.query(updateQuery, [roleId, departmentId, permissionId]);
      } else {
        // Thêm permission mới
        const insertQuery = `
          INSERT INTO Role_Department_Permission (roleId, departmentId, permissionId)
          VALUES (?, ?, ?)
        `;
        await db.query(insertQuery, [roleId, departmentId, permissionId]);
      }

      // Lấy thông tin permission vừa thêm/cập nhật
      const getPermissionQuery = `
        SELECT 
          rdp.roleId,
          rdp.departmentId,
          r.name as roleName,
          d.name as departmentName,
          p.permissionId,
          p.name as permissionName
        FROM Role_Department_Permission rdp
        INNER JOIN Role r ON rdp.roleId = r.roleId AND r.isDeleted = FALSE
        INNER JOIN Department d ON rdp.departmentId = d.departmentId AND d.isDeleted = FALSE
        INNER JOIN Permission p ON rdp.permissionId = p.permissionId AND p.isDeleted = FALSE
        WHERE rdp.roleId = ? 
          AND rdp.departmentId = ? 
          AND rdp.permissionId = ?
          AND rdp.isDeleted = FALSE
      `;
      const [permission] = await db.query(getPermissionQuery, [roleId, departmentId, permissionId]);

      res.status(201).json({
        success: true,
        data: {
          role: {
            id: permission[0].roleId,
            name: permission[0].roleName
          },
          department: {
            id: permission[0].departmentId,
            name: permission[0].departmentName
          },
          permission: {
            id: permission[0].permissionId,
            name: permission[0].permissionName
          }
        },
        message: 'Thêm quyền thành công'
      });
    } catch (error) {
      console.error('Error adding permission:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi thêm quyền',
        error: error.message
      });
    }
  }
};

module.exports = RolePermissionController; 