<template>
  <div class="leave-manage">
    <!-- 上方：输入框 + 查询 + 重置 -->
    <div class="query-form">
      <el-form inline :model="leave" ref="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="leave.applyState" style="width: 240px">
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
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
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
              >查看</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              v-if="[1, 2].includes(scope.row.applyState)"
              >作废</el-button
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
    <!-- 对话框-申请休假 -->
    <el-dialog
      title="申请休假"
      v-model="dialogVisibleApply"
      width="70%"
      :before-close="handleCloseApply"
    >
      <el-form
        :model="leaveForm"
        label-width="120px"
        ref="dialogForm"
        :rules="rules"
      >
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假日期" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="date"
                  placeholder="选择开始日期"
                  @change="(val) => handleDateChange('startTime', val)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="2"> - </el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="date"
                  placeholder="选择结束日期"
                  @change="(val) => handleDateChange('endTime', val)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" required prop="leaveTime">
          {{ leaveForm.leaveTime || "0天" }}
        </el-form-item>
        <el-form-item label="休假原因" required prop="reasons">
          <el-input
            type="textarea"
            :row="3"
            placeholder="请输入休假的原因"
            v-model="leaveForm.reasons"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseApply">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 对话框-申请休假详情 -->
    <el-dialog
      title="申请休假详情"
      width="50%"
      v-model="dialogVisibleDetail"
      :before-close="handleCloseDetail"
    >
      <el-steps
        :active="detail.applyState > 2 ? 3 : 1"
        :process-status="detail.applyState == 2 ? 'finish' : 'process'"
        :finish-status="getstatus(detail.applyState)"
      >
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
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
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue"
import utils from "../utils/utils.js"

const { proxy } = getCurrentInstance()
// 顶部输入框
const leave = reactive({
  applyState: "",
})
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
    width: 250,
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
    width: 180,
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

// 获取休假列表数据
const getApplyList = async () => {
  let params = { ...leave, ...pager }
  try {
    const { list, page } = await proxy.$api.getApplyList(params)
    applyList.value = list
    pager.total = page.total
  } catch (error) {
    console.error("获取申请列表失败：", error)
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
// 点击作废按钮
const handleDelete = async (_id) => {
  let params = { _id, action: "delete" }
  await proxy.$api.leaveOperate(params)
}
// 点击分页器
const handlePageChange = (current) => {
  pager.pageNum = current
  getApplyList()
}

// 对话框相关逻辑
let dialogVisibleApply = ref(false)
let dialogVisibleDetail = ref(false)
const leaveForm = reactive({
  parentId: [null],
})
let action = ref("")
let detail = ref({})
const rules = reactive({
  startTime: [
    {
      type: "date",
      required: true,
      message: "请输入开始时间",
      trigger: "change",
    },
  ],
  endTime: [
    {
      type: "date",
      required: true,
      message: "请输入结束时间",
      trigger: "change",
    },
  ],
  reasons: [
    {
      required: true,
      message: "请输入休假原因",
      trigger: ["change", "blur"],
    },
  ],
})
// 点击创建/新增按钮
const handleApply = () => {
  dialogVisibleApply.value = true
  action.value = "create"
}

// 点击查看按钮
const handleDetail = (row) => {
  dialogVisibleDetail.value = true
  let data = { ...row }
  console.log("row", row)
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
}

// 日期
const handleDateChange = (key, val) => {
  let { startTime, endTime } = leaveForm
  if (!startTime || !endTime) return
  if (startTime > endTime) {
    ElMessage({
      message: "开始日期不能晚于结束日期",
      type: "warning",
    })
    leaveForm.leaveTime = "0天"
    setTimeout(() => {
      leaveForm[key] = ""
    }, 0)
  } else {
    leaveForm.leaveTime =
      (endTime - startTime) / (24 * 60 * 60 * 1000) + 1 + "天"
  }
}
const getstatus = (status) => {
  switch (status) {
    case 4:
      return "success"
    case 5:
      return "error"
    case 3:
      return "error"
    case 1:
      return "finish"
    case 2:
      return "success"
  }
}

// 点击对话框取消按钮 申请休假
const handleCloseApply = () => {
  dialogVisibleApply.value = false
  proxy.$refs.dialogForm.resetFields()
}
// 点击对话框取消按钮 申请休假详情
const handleCloseDetail = () => {
  dialogVisibleDetail.value = false
}

// 点击对话框确定按钮
const handleSubmit = () => {
  proxy.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...leaveForm, action: action.value }
      await proxy.$api.leaveOperate(params)
      ElMessage({
        message: "创建成功",
        type: "success",
      })
      handleCloseApply()
      getApplyList()
      await proxy.$store.dispatch("noticeCountGet")
    }
  })
}
</script>
