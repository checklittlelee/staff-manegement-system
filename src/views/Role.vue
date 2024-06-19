<template>
  <div class="role-manage">
    <!-- 上方：输入框 + 查询 + 重置 -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输出角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 下方：创建 + 表格 -->
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table :data="roleList" style="width: 100%" row-key="_id">
        <!-- 循环遍历 列 -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="handlePermission(scope.row)"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        class="pagination"
        @current-change="handlePageChange"
      >
      </el-pagination>
    </div>
    <!-- 对话框-角色新增 -->
    <el-dialog
      title="角色新增"
      v-model="dialogVisibleRole"
      :before-close="handleCloseRole"
    >
      <el-form
        :model="roleForm"
        label-width="120px"
        ref="dialogForm"
        :rules="rules"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input placeholder="请输入角色名称" v-model="roleForm.roleName" />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="roleForm.remark"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseRole">取消</el-button>
          <el-button type="primary" @click="handleSubmitRole">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 对话框-权限设置 -->
    <el-dialog
      title="权限设置"
      v-model="dialogVisiblePermission"
      :before-close="handleClosePermission"
    >
      <el-form label-width="120px">
        <el-form-item prop="roleName" label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item prop="remark" label="选择权限">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="_id"
            :props="{ label: 'menuName' }"
            default-expand-all
            ref="permissionTree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClosePermission">取消</el-button>
          <el-button type="primary" @click="handleSubmitPermission"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue"
import utils from "../utils/utils.js"

const { proxy } = getCurrentInstance()
// 顶部输入框
const queryForm = reactive({
  roleName: "",
})
const roleList = ref([])
const columns = reactive([
  {
    label: "角色名称",
    prop: "roleName",
    width: 180,
  },
  {
    label: "备注",
    prop: "remark",
  },
  {
    label: "权限列表",
    prop: "permissionList",
    formatter: (row, column, value) => {
      let names = []
      let list = value.halfCheckedKeys || []
      console.log(this.actionMap, "actionMap")
      list.map((key) => {
        let name = this.actionMap[key]
        if (key && name) names.push(name)
      })
      return names.join(",")
    },
  },
  {
    label: "创建时间", // 按钮权限的标识
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    },
    width: 180,
  },
  {
    label: "更新时间", // 按钮权限的标识
    prop: "updateTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    },
    width: 180,
  },
])
const pager = reactive({
  total: 0,
  pageSize: 10,
})
const menuList = ref([])

getActionMap(list) {
  let actionMap = {};
  console.log(list, 'list')
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop();
      if (item.children && item.action) {
        actionMap[item._id] = item.menuName;
      }
      if (item.children) {
        deep(item.children);
      }
    }
  };
  deep(JSON.parse(JSON.stringify(list)));
  console.log(actionMap, 'actionMap')
  this.actionMap = actionMap;
},
// 获取角色列表数据
const getRoleList = async () => {
  try {
    const {list, page} = await proxy.$api.roleList({
      ...pager,
      ...queryForm
    })
    roleList.value = list
    pager.total = page.total
  } catch (error) {
    console.error("获取角色列表失败：", error)
  }
}
// 获取菜单列表数据
const getMenuList = async () => {
  const list = await proxy.$api.menuList()
  menuList.value = list
  getActionMap(list)
}
onMounted(() => {
  getRoleList()
  getMenuList()
})

// 点击查询按钮
const handleQuery = () => {
  getRoleList(queryForm)
}
// 点击重置按钮
const handleReset = () => {
  proxy.$refs.form.resetFields()
}
// 点击删除按钮
const handleDelete = async (_id) => {
  const res = await proxy.$api.roleOperate({ _id, action: "delete" })
  if (res) {
    ElMessage({
      message: "删除成功",
      type: "success",
    })
    getRoleList()
  } else {
    ElMessage({
      message: "删除失败",
      type: "warning",
    })
  }
}

// 点击分页器
const handlePageChange = (current) => {
  pager.pageNum = current
  getRoleList()
}

// 对话框相关逻辑
const dialogVisibleRole = ref(false) // 角色新增
const dialogVisiblePermission = ref(false) // 权限设置
const action = ref("")
// 对话框中的表格数据收集
const roleForm = reactive({})
const rules = reactive({
  roleName: [
    {
      required: true,
      message: "请输入角色名称",
      trigger: "blur",
    },
  ],
})
const curRoleName = ref('')
const curRoleId = ref('')
// 点击创建/新增按钮
const handleAdd = () => {
  dialogVisibleRole = true
  action.value = 'create'
}
// 点击编辑按钮
const handleEdit = (row) => {
  dialogVisible.value = true
  action.value = "edit"
  proxy.$nextTick(() => {
    roleForm = {
      _id: row._id,
      remark: row.remark,
      roleName: row.roleName,
    }
  })
}
// 点击设置权限按钮
const handlePermission(row) {
  dialogVisiblePermission.value = true
  curRoleName.value = row.roleName
  curRoleId.value = row._id
  // 第二步 设置节点
  const { checkedKeys } = row.permissionList;
  setTimeout(() => {
        proxy.$refs.permissionTree.setCheckedKeys(checkedKeys);
      })
}
// 点击对话框取消按钮 角色新增
const handleCloseRole = () => {
  dialogVisibleRole.value = false
  proxy.$refs.dialogForm.resetFields()
}
// 点击对话框取消按钮 权限设置
const handleClosePermission = () => {
  dialogVisiblePermission.value = false
}
// 点击对话框确定按钮 角色新增
const handleSubmitRole = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = {...roleForm, action: action.value}
      let res = await proxy.$api.roleOperate(params)
      if (res) {
        dialogVisibleRole.value = false
        ElMessage({
          message: "创建成功",
          type: "success",
        })
        proxy.$refs.dialogForm.resetFields()
        getRoleList()
      }
    }
  })
}
// 点击对话框确定按钮 权限设置
const handleSubmitPermission = async () => {

}
</script>
