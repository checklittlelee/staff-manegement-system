<template>
  <div class="menu-manage">
    <!-- 上方：输入框 + 查询 + 重置 -->
    <div class="query-form">
      <el-form inline :model="menu" ref="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menu.menuName" placeholder="请输出菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="menu.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
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
      <el-table :data="menuList" style="width: 100%" row-key="_id">
        <!-- 循环遍历 列 -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleAdd(2, scope.row)"
              >新增</el-button
            >
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
      title="菜单新增"
      v-model="dialogVisible"
      :before-close="handleClose"
    >
      <el-form
        :model="menuForm"
        label-width="120px"
        ref="dialogForm"
        :rules="rules"
      >
        <el-form-item prop="parentId" label="父级菜单">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span>不选则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item prop="menuType" label="菜单类型">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :value="1">菜单</el-radio>
            <el-radio :value="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="menuName" label="菜单名称">
          <el-input placeholder="请输入菜单名称" v-model="menuForm.menuName" />
        </el-form-item>
        <el-form-item
          prop="icon"
          label="菜单图标"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入菜单图标" v-model="menuForm.icon" />
        </el-form-item>
        <el-form-item
          prop="path"
          label="路由地址"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入路由地址" v-model="menuForm.path" />
        </el-form-item>
        <el-form-item
          prop="menuCode"
          label="权限标识"
          v-show="menuForm.menuType == 2"
        >
          <el-input placeholder="请输入权限标识" v-model="menuForm.menuCode" />
        </el-form-item>
        <el-form-item
          prop="component"
          label="组件路径"
          v-show="menuForm.menuType == 1"
        >
          <el-input placeholder="请输入组件路径" v-model="menuForm.component" />
        </el-form-item>
        <el-form-item
          prop="menuState"
          label="菜单状态"
          v-show="menuForm.menuType == 1"
        >
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="2">停用</el-radio>
          </el-radio-group>
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
const menu = reactive({
  menuState: 1,
})
// 菜单列表数据，请求回来后在表格里展示
const menuList = ref([])
// 当 el-table 元素中注入 data 对象数组后，在 el-table-column 中用 prop 属性来对应对象中的键名即可填入数据，用 label 属性来定义表格的列名。
// formatter函数：通过对象的键来访问其对应的值
const columns = reactive([
  {
    label: "菜单名称",
    prop: "menuName",
    width: 180,
  },
  {
    label: "图标",
    prop: "icon",
  },
  {
    label: "权限标识", // 按钮权限的标识
    prop: "menuCode",
  },
  {
    label: "路由地址", // 按钮权限的标识
    prop: "path",
  },
  {
    label: "组件路径", // 按钮权限的标识
    prop: "component",
  },
  {
    label: "菜单状态", // 按钮权限的标识
    prop: "menuState",
    formatter(row, column, value) {
      return {
        1: "正常",
        2: "停用",
      }[value]
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
])

// 获取菜单列表数据
const getMenuList = async () => {
  try {
    const res = await proxy.$api.menuList()
    menuList.value = res
  } catch (error) {
    console.error("获取菜单列表失败：", error)
  }
}
onMounted(() => {
  getMenuList()
})

// 点击查询按钮
const handleQuery = () => {
  getMenuList(menu)
}
// 点击重置按钮
const handleReset = () => {
  proxy.$refs.queryForm.resetFields()
}
// 点击删除按钮
const handleDelete = async (_id) => {
  const res = await proxy.$api.menuSubmit({ _id, action: "delete" })
  if (res) {
    ElMessage({
      message: "删除成功",
      type: "success",
    })
    getMenuList()
  } else {
    ElMessage({
      message: "删除失败",
      type: "warning",
    })
  }
}

// 对话框相关逻辑
const dialogVisible = ref(false)
// "action", create: 创建 edit:编辑 delete:删除
const action = ref("add")
// 对话框中的表格数据收集
const menuForm = reactive({
  // 菜单1 按钮2
  menuState: 1,
  menuType: 1,
  parentId: [null],
})
const rules = reactive({
  menuName: [
    {
      required: true,
      message: "请输入菜单名称",
      trigger: "blur",
    },
    {
      min: 2,
      max: 10,
      message: "长度在2-8个字符",
      trigger: "blur",
    },
  ],
})
// 点击创建/新增按钮
const handleAdd = (type, row) => {
  dialogVisible.value = true
  action.value = "add"
  if (type == 2) {
    menuForm.parentId = [...row.parentId, row._id].filter((item) => item)
  }
}
// 点击编辑按钮
const handleEdit = (row) => {
  dialogVisible.value = true
  action.value = "edit"
  proxy.$nextTick(() => {
    Object.assign(menuForm, row)
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
      let params = { ...menuForm, action: action.value }
      let res = await proxy.$api.menuSubmit(params)
      if (res) {
        ElMessage({
          message: "操作成功",
          type: "success",
        })
        handleClose()
        getMenuList()
      }
    }
  })
}
</script>
