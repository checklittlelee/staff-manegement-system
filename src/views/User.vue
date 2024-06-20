<template>
  <!-- 上方：输入框 + 查询 + 重置 -->
  <div class="query-form">
    <el-form :model="user" :inline="true" ref="queryForm">
      <el-form-item label="用户名ID" prop="userId">
        <el-input v-model="user.userId" placeholder="请输入用户ID" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="user.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="用户状态" prop="state">
        <el-select v-model="user.state" style="width: 180px">
          <el-option :value="0" label="所有"></el-option>
          <el-option :value="1" label="在职"></el-option>
          <el-option :value="2" label="离职"></el-option>
          <el-option :value="3" label="试用期"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 下方：新增批量删除 + 表格 + 分页器 -->
  <div class="base-table">
    <!-- 新增批量删除 -->
    <div class="action">
      <el-button type="primary" @click="handleCreate" v-has="'user-add'"
        >新增</el-button
      >
      <el-button
        type="danger"
        @click="handlePatchDelete"
        v-has="'user-patch-delete'"
        >批量删除</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <!-- 循环遍历 列 -->
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :formatter="item.formatter"
      />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            v-has="'user-edit'"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="handelDelete(scope.row)"
            v-has="'user-delete'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pager.total"
      :page-size="pager.pageSize"
      class="pagination"
      :current-page="pager.pageNum"
      @current-change="handlePageChange"
    />
  </div>
  <!-- 对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="action === 'add' ? '用户新增' : '编辑用户'"
    :before-close="handleClose"
  >
    <el-form
      :model="userForm"
      label-width="120px"
      ref="dialogForm"
      :rules="rules"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          placeholder="请输入用户名称"
          v-model="userForm.userName"
          :disabled="action == 'edit'"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input
          placeholder="请输入用户邮箱"
          v-model="userForm.userEmail"
          :disabled="action == 'edit'"
        >
          <template #append> @jason.com </template>
        </el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input placeholder="请输入手机号" v-model="userForm.mobile" />
      </el-form-item>
      <el-form-item label="岗位" prop="job">
        <el-input placeholder="请输入岗位" v-model="userForm.job" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="userForm.state">
          <el-option :value="1" label="在职"></el-option>
          <el-option :value="2" label="离职"></el-option>
          <el-option :value="3" label="试用期"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统角色" prop="roleList">
        <el-select
          v-model="userForm.roleList"
          placeholder="请选择用户角色"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="role in roleList"
            :key="role._id"
            :label="role.roleName"
            :value="role._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="deptId">
        <el-cascader
          v-model="userForm.deptId"
          placeholder="请选择所属部门"
          :options="deptList"
          :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, toRaw } from "vue"
import utils from "../utils/utils.js"

const { proxy } = getCurrentInstance()
// 顶部输入框
const user = reactive({
  state: 0,
})
const pager = reactive({
  pageNum: 1,
  total: 10,
  pageSize: 10,
})
const userList = ref([])
const columns = reactive([
  {
    label: "用户ID",
    prop: "userId",
  },
  {
    label: "用户名",
    prop: "userName",
  },
  {
    label: "用户邮箱",
    prop: "userEmail",
  },
  {
    label: "用户角色",
    prop: "role",
    formatter(row, column, value) {
      return {
        0: "管理员",
        1: "普通用户",
      }[value]
    },
  },
  {
    label: "用户状态",
    prop: "state",
    formatter(row, column, value) {
      return {
        1: "在职",
        2: "离职",
        3: "试用期",
      }[value]
    },
  },
  {
    label: "注册时间",
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    },
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    },
  },
])

// 获取用户列表数据
const getUserList = async () => {
  let params = { ...user, ...pager }
  try {
    const { page, list } = await proxy.$api.userList(params)
    userList.value = list
    pager.total = page.total
  } catch (error) {
    console.error("获取用户列表失败：", error)
  }
}

onMounted(() => {
  getUserList()
  getDeptList()
  getRoleList()
})

// 点击查询按钮
const handleQuery = () => {
  getUserList()
}
// 点击重置按钮
const handleReset = () => {
  proxy.$refs.queryForm.resetFields()
  getUserList()
}

// 点击批量删除按钮相关逻辑
const checkedUserIds = ref([])
const handleSelectionChange = (list) => {
  // list是个Object类型
  let arr = []
  list.map((item) => {
    arr.push(item.userId)
  })
  checkedUserIds.value = arr
}
const handlePatchDelete = async () => {
  if (checkedUserIds.value.length == 0) {
    ElMessage({
      message: "请选择要删除的用户",
      type: "warning",
    })
    return
  }
  const res = await proxy.$api.userDelete({
    userIds: checkedUserIds.value,
  })
  if (res.modifiedCount > 0) {
    ElMessage({
      message: "删除成功",
      type: "success",
    })
    getUserList()
  } else {
    ElMessage({
      message: "删除失败",
      type: "warning",
    })
  }
}
// 点击删除按钮
const handelDelete = async (row) => {
  const res = await proxy.$api.userDelete({
    userIds: [row.userId],
  })
  if (res.modifiedCount > 0) {
    ElMessage({
      message: "删除成功",
      type: "success",
    })
    getUserList()
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
  getUserList()
}

// 对话框相关逻辑
const dialogVisible = ref(false)
const action = ref("add")
const userForm = reactive({ state: 1 })
const deptList = ref([])
const roleList = ref([])
const rules = reactive({
  userName: [
    {
      required: true,
      message: "请输入用户名称",
      trigger: "blur",
    },
  ],
  userEmail: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
  ],
  deptId: [
    {
      required: true,
      message: "请选择部门",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /1[3-9]\d{9}/,
      message: "请输入正确的手机号格式",
      trigger: "blur",
    },
  ],
})
const getDeptList = async () => {
  const list = await proxy.$api.getDeptList()
  deptList.value = list
}
const getRoleList = async () => {
  const list = await proxy.$api.getRoleList()
  roleList.value = list
}
// 点击新增按钮
const handleCreate = () => {
  action.value = "add"
  dialogVisible.value = true
}
// 点击编辑按钮
const handleEdit = (row) => {
  action.value = "edit"
  dialogVisible.value = true
  proxy.$nextTick(() => {
    row.state = Number(row.state)
    Object.assign(userForm, row)
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
      let params = toRaw(userForm)
      params.userEmail += "@jason.com"
      params.action = action.value
      let res = await proxy.$api.userSubmit(params)
      if (res) {
        ElMessage({
          message: "操作成功",
          type: "success",
        })
        handleClose()
        getUserList()
      }
    }
  })
}
</script>
