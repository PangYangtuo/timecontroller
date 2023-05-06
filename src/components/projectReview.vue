<template>
  <div style="margin-left: 3%;margin-right: 3%">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="submitter" label="提交人"></el-table-column>
      <el-table-column prop="apartment" label="部门"></el-table-column>
      <el-table-column prop="submitTime" label="提交时间"></el-table-column>
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="projectType" label="项目类型"></el-table-column>
      <el-table-column prop="applyDuration" label="申报时长(小时)"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handlePass(scope.row)">通过</el-button>
          <el-button type="danger" size="mini" @click="handleReject(scope.row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    open(title,text,type){
      this.$notify({
        title: title,
        message: text,
        type: type
      })
    },
    handlePass(row) {
      // 通过操作
      const message = new FormData()
      // console.log(row)
      message.append('id',row.userId)
      message.append('projectName',row.projectName)
      this.$axios.post('/api/passReview/',message).then(response=>{
        const index = this.tableData.indexOf(row)
        this.tableData.splice(index, 1)
        this.open('通过成功','通过申请成功','success')
      })
    },
    handleReject(row) {
      // 驳回操作
      const message = new FormData()
      // console.log(row)
      message.append('id',row.userId)
      message.append('projectName',row.projectName)
      this.$axios.post('/api/backReview/',message).then(response=>{
        const index = this.tableData.indexOf(row)
        this.tableData.splice(index, 1)
        this.open('驳回成功','驳回申请成功','success')
      })
    }
  },
  mounted() {
    const account = localStorage.getItem('account')
    const date = new FormData()
    date.append('account', account)
    this.$axios.post('/api/reviewCreated/', date).then(response=>{
        this.tableData = JSON.parse( response.data)
    })
  }
};
</script>
