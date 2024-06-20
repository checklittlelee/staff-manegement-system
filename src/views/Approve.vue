<template>
  <div class="approve-manage">
    <!-- 上方：输入框 + 查询 + 重置 -->
    <div class="query-form">
      <el-form inline :model="approve" ref="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="approve.applyState" style="width: 240px">
            <el-option :value="''" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
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
      <el-table :data="applyList" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <!-- 循环遍历 列 -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleDetail(scope.row)"
              v-if="
                scope.row.curAuditUserName == userInfo.userName &&
                [1, 2].includes(scope.row.applyState)
              "
              >审核</el-button
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
    <!-- 对话框-申请休假详情 -->
    <el-dialog
      title="审核"
      width="50%"
      v-model="dialogVisible"
      :before-close="handleClose"
    >
      <el-form
        label-width="120px"
        label-suffix=":"
        :model="auditForm"
        ref="dialogForm"
        :rules="rules"
      >
        <el-form-item label="申请人">
          <div>
            {{ detail.applyUser.userName }}
          </div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>
            {{ detail.applyTypeName }}
          </div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>
            {{ detail.time }}
          </div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>
            {{ detail.leaveTime }}
          </div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>
            {{ detail.reasons }}
          </div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>
            {{ detail.applyStateName }}
          </div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>
            {{ detail.curAuditUserName }}
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注"
            v-model="auditForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleApprove('pass')"
            >审核通过</el-button
          >
          <el-button @click="handleApprove('refuse')">驳回</el-button>
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
const approve = reactive({
  applyState: 1,
})
const userInfo = proxy.$store.state.userInfo
// 申请列表
const applyList = ref([])
const columns = reactive([
  {
    label: "单号",
    prop: "orderNo",
    width: 150,
  },
  {
    label: "休假时间",
    prop: "",
    width: 200,
    formatter(row) {
      return (
        utils.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
        "到" +
        utils.formateDate(new Date(row.endTime), "yyyy-MM-dd")
      )
    },
  },
  {
    label: "休假时长",
    prop: "leaveTime",
    width: 100,
  },
  {
    label: "休假类型",
    prop: "applyType",
    width: 100,
    formatter(row, column, value) {
      return {
        1: "事假",
        2: "调休",
        3: "年假",
      }[value]
    },
  },
  {
    label: "休假原因",
    prop: "reasons",
  },
  {
    label: "申请时间",
    prop: "createTime",
    width: 200,
    formatter(row, column, value) {
      return utils.formateDate(new Date(value))
    },
  },
  {
    label: "审批人",
    prop: "auditUsers",
    width: 100,
  },
  {
    label: "当前审批人",
    prop: "curAuditUserName",
    width: 100,
  },
  {
    label: "审批状态",
    prop: "applyState",
    width: 100,
    formatter(row, column, value) {
      return {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[value]
    },
  },
])
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 10,
})

// 获取审批列表数据
const getApplyList = async () => {
  let params = { ...approve, ...pager, type: "approve" }
  try {
    const { list, page } = await proxy.$api.getApplyList(params)
    applyList.value = list
    pager.total = page.total
  } catch (error) {
    console.error("获取审批列表失败：", error)
  }
}

onMounted(() => {
  getApplyList()
})

// 点击查询按钮
const handleQuery = () => {
  getApplyList()
}
// 点击重置按钮
const handleReset = () => {
  proxy.$refs.queryForm.resetFields()
  getApplyList()
}
// 点击分页器
const handlePageChange = (current) => {
  pager.pageNum = current
  getApplyList()
}

// 对话框相关逻辑
let dialogVisible = ref(false)
const auditForm = reactive({
  parentId: [null],
})
let detail = ref({})
const rules = reactive({
  remark: [
    {
      required: true,
      message: "请输入审核备注",
      trigger: ["change", "blur"],
    },
  ],
})

// 点击查看按钮
const handleDetail = (row) => {
  let data = { ...row }
  data.applyTypeName = {
    1: "事假",
    2: "调休",
    3: "年假",
  }[data.applyType]
  data.time =
    utils.formateDate(new Date(data.startTime), "yyyy-MM-dd") +
    "到" +
    utils.formateDate(new Date(data.endTime), "yyyy-MM-dd")

  data.applyStateName = {
    1: "待审批",
    2: "审批中",
    3: "审批拒绝",
    4: "审批通过",
    5: "作废",
  }[data.applyState]
  detail.value = data
  dialogVisible.value = true
}

// 点击对话框取消按钮
const handleClose = () => {
  dialogVisible.value = false
  proxy.$refs.dialogForm.resetFields()
}

// 点击对话框审核通过/驳回按钮
const handleApprove = (action) => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = {
        action,
        remark: auditForm.remark,
        _id: detail.value._id,
      }
      let res = await proxy.$api.leaveApprove(params)
      ElMessage({
        message: "处理成功",
        type: "success",
      })
      handleClose()
      getApplyList()
      await proxy.$store.dispatch("noticeCountGet")
    }
  })
}
</script>
