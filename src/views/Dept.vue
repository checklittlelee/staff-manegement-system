<template>
  <div class="dept-manage">
    <!-- 上方：输入框 + 查询 + 重置 -->
    <div class="query-form">
      <el-form inline :model="dept" ref="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="dept.deptName" placeholder="请输出部门名称" />
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
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table
        :data="deptList"
        stripe
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <!-- 循环遍历 列 -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          v-bind="item"
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
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="action === 'create' ? '创建部门' : '编辑部门'"
      :before-close="handleClose"
    >
      <el-form
        :model="deptForm"
        label-width="120px"
        ref="dialogForm"
        :rules="rules"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            placeholder="请选择上级部门"
            v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            :options="deptList"
            :show-all-levels="true"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="deptForm.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userName">
          <el-select
            placeholder="请选择部门负责人"
            v-model="deptForm.userName"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="deptForm.userEmail" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
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
const dept = reactive({
  deptName: "",
})
const deptList = ref([])
const columns = reactive([
  {
    label: "部门名称",
    prop: "deptName",
  },
  {
    label: "负责人",
    prop: "userName",
  },
  {
    label: "更新时间",
    prop: "updateTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    },
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    },
  },
])
const userList = ref([])
const deptForm = reactive({
  parentId: [null],
})

// 获取角色列表数据
const getDeptList = async () => {
  try {
    const list = await proxy.$api.getDeptList(dept)
    deptList.value = list
  } catch (error) {
    console.error("获取部门列表失败：", error)
  }
}
// 获取用户列表数据
const getAllUserList = async () => {
  const list = await proxy.$api.userAllList()
  userList.value = list
}
onMounted(() => {
  getDeptList()
  getAllUserList()
})

// 点击查询按钮
const handleQuery = () => {
  getDeptList()
}
// 点击重置按钮
const handleReset = () => {
  proxy.$refs.queryForm.resetFields()
  getDeptList()
}
// 点击删除按钮
const handleDelete = async (_id) => {
  const res = await proxy.$api.deptOperate({ _id, action: "delete" })
  if (res) {
    ElMessage({
      message: "删除成功",
      type: "success",
    })
    getDeptList()
  } else {
    ElMessage({
      message: "删除失败",
      type: "warning",
    })
  }
}

// 对话框相关逻辑
let dialogVisible = ref(false)
let action = ref("")
const rules = reactive({
  parentId: [
    {
      required: true,
      message: "请选择上级部门",
      trigger: "blur",
    },
  ],
  deptName: [
    {
      required: true,
      message: "请输入部门名称",
      trigger: "blur",
    },
  ],
  userName: [
    {
      required: true,
      message: "请选择负责人",
      trigger: "blur",
    },
  ],
})
// 点击创建/新增按钮
const handleAdd = () => {
  dialogVisible.value = true
  action.value = "create"
}
// 选择部门负责人
const handleUser = (val) => {
  const [userId, userName, userEmail] = val.split("/")
  Object.assign(deptForm, { userId, userName, userEmail })
}
// 点击编辑按钮
const handleEdit = (row) => {
  dialogVisible.value = true
  action.value = "edit"
  proxy.$nextTick(() => {
    Object.assign(deptForm, row)
  })
}

// 点击对话框取消按钮
const handleClose = () => {
  dialogVisible.value = false
  proxy.$refs.dialogForm.resetFields()
}

// 点击对话框确定按钮
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...deptForm, action: action.value }
      delete params.userEmail
      let res = await proxy.$api.deptOperate(params)
      if (res) {
        ElMessage({
          message: "操作成功",
          type: "success",
        })
        handleClose()
        getDeptList()
      }
    }
  })
}
</script>
