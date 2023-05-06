<template>
  <div>
    <div style="text-align: center;color: lightseagreen;font-style: italic"><h4>{{account}}用户，如若更改数据，请保存后请重新提交或直接提交</h4></div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column v-for="(item, index) in 7" :key="index" :label="getDate(index)">
        <template slot-scope="scope">
          <el-input :disabled="scope.row.status === '已审核'" type="number" min="0" v-model="scope.row.workingHours[index]" @blur="calcTotal"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="总计"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
    </el-table>
    <div style="float: right;margin-right: 3%">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="success" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>

export default {
  mounted() {
    const account = localStorage.getItem('account')
    this.account = account
    // console.log(account)
    const message = new FormData()
    message.append('account', account)
    this.$axios.post('/api/newIndex/', message).then(response=>{
      this.tableData = JSON.parse(response.data)
      this.calcTotal()
    })
  },
  data() {
    return {
      account:'',
      tableData: [
        { name: '项目A', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目B', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目C', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目D', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目E', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目F', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目G', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目H', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目I', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' },
        { name: '项目J', workingHours: [0, 0, 0, 0, 0, 0, 0], total: 0, status: '未提交' }
      ]
    }
  },
  methods: {
    open1(title, text) {
        const h = this.$createElement;

        this.$notify({
          title: title,
          message: h('i', { style: 'color: teal'}, text)
        });},
    getDate(index) {
      const today = new Date()
      const day = today.getDay() - 1
      today.setDate(today.getDate() - day + index)
      // console.log(today.toLocaleDateString())
      return today.toLocaleDateString()
    },
    calcTotal() {
      for (let i = 0; i < this.tableData.length; i++) {
        let total = 0
        for (let j = 0; j < this.tableData[i].workingHours.length; j++) {
          total += Number(this.tableData[i].workingHours[j])
        }
        this.tableData[i].total = total
      }
    },
    save(){
      const name = []
      const time = []
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].status !== '已审核'){
          this.tableData[i].status = '已保存'
          name.push(this.tableData[i].name)
          time.push(this.tableData[i].workingHours)
        }

      }
      // console.log(name)
      // console.log(time)
      const date = new FormData()
      date.append('test',String(name) )
      date.append('test2',String(time) )
      date.append('account',localStorage.getItem('account'))
      this.$axios.post('/api/newIndexSave/', date).then(response=>{
        this.open1('保存通知','保存工时信息成功！')
      })
    },
    submit() {
      const name = []
      const time = []
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].status!=='已审核'){
          this.tableData[i].status = '未审核'
          name.push(this.tableData[i].name)
          time.push(this.tableData[i].workingHours)
        }

      }
      // console.log(name)
      // console.log(time)
      const date = new FormData()
      date.append('test',String(name) )
      date.append('test2',String(time) )
      date.append('account',localStorage.getItem('account'))
      this.$axios.post('/api/newIndexSubmit/', date).then(response=>{
        this.open1('提交通知','提交工时信息成功！')
      })
    }
  }
}
</script>
