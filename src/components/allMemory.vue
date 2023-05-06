<template xmlns="">
  <div style="margin-right: 3%;margin-left: 3%;">
    <div style="text-align: center;margin-top: 1%;margin-bottom: 2%"><h3>今日超期审核数为：<span style="display: inline;color: red">{{total}}</span></h3></div>
<el-table :data="tableData">
  <el-table-column prop="submitter" label="提交人"></el-table-column>
  <el-table-column prop="department" label="部门"></el-table-column>
  <el-table-column prop="projectName" label="项目名"></el-table-column>
  <el-table-column prop="projectType" label="项目类型"></el-table-column>
  <el-table-column prop="submitHours" label="提交工时"></el-table-column>
  <el-table-column prop="auditor" label="审核人"></el-table-column>
  <el-table-column prop="submitTime" label="项目提交时间"></el-table-column>
  <el-table-column prop="overdueTime" label="项目超期时间" ></el-table-column>
  <el-table-column  prop="isOverdue" label="是否超期" :formatter="formatIsOverdue"></el-table-column>
  <el-table-column label="提示">
    <template slot-scope="scope">
      <i v-if="scope.row.isOverdue" class="el-icon-warning" style="color: red;"></i>
      <i v-else class="el-icon-success" style="color: green;"></i>
    </template>
  </el-table-column>
</el-table>
  </div>
</template>

<script>
export default {
  name: "allMemory",
  data() {
  return {
    total : 0,
    tableData: [
      {
        submitter: '张三',
        department: '研发部',
        projectName: '项目A',
        projectType: 'Web应用',
        submitHours: 80,
        auditor: '李四',
        submitTime: '2023-07-01',
        overdueTime: '',
        isOverdue: false
      },
      {
        submitter: '王五',
        department: '市场部',
        projectName: '项目B',
        projectType: 'APP',
        submitHours: 120,
        auditor: '赵六',
        submitTime: '2021-07-02',
        overdueTime: '',
        isOverdue: false
      }
    ]
  }
},
mounted() {
  this.$axios.post('/api/allMemory/').then(response=>{
    this.tableData = JSON.parse(response.data)
      this.tableData.forEach(item => {
    // 计算超期时间
    item.overdueTime = this.getOverdueTime(item.submitTime)
    // 判断是否超期
    item.isOverdue = this.checkIsOverdue(item.overdueTime)
    if (item.isOverdue === true){
      this.total = this.total+1
    }
  })
  })

},
methods: {
  // 计算超期时间
  getOverdueTime(submitTime) {
    const date = new Date(submitTime)
    date.setDate(date.getDate() + 3)
    // console.log(date)
    return this.formatDate(date)
  },
  // 判断是否超期
  checkIsOverdue(overdueTime) {
    const now = new Date()
    const overdue = new Date(overdueTime)
    return now > overdue
  },
  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear()
    const month = this.formatNumber(date.getMonth() + 1)
    const day = this.formatNumber(date.getDate())
    return `${year}-${month}-${day}`
  },
  // 格式化数字，补0
  formatNumber(num) {
    return num < 10 ? '0' + num : num
  },
  // 格式化是否超期，显示文字
  formatIsOverdue(row) {
    return row.isOverdue ? '是' : '否'
  }
}
}
</script>

<style scoped>

</style>
