<template>
  <div>
    <div style="display: flex; justify-content: center; align-items: center;margin-top: 3%">
      <el-select v-model="value1" multiple placeholder="请选择部门">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="testfirst" style="margin-left: 1%">查询</el-button>
      <div style="margin-left: 1%">
      <el-button type="success" @click="showForm" style="float: right;margin-right:5%">➕新增</el-button>
      <el-dialog title="添加人员" :visible.sync="dialogVisible" width="30%">
        <el-form :model="form" ref="form" label-width="100px">
          <el-form-item label="人员部门">
            <el-select v-model="form.department" placeholder="请选择">
              <el-option label="技术部" value="技术部"></el-option>
              <el-option label="市场部" value="市场部"></el-option>
              <el-option label="财务部" value="财务部"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="人员账号">
            <el-input v-model="form.account"></el-input>
          </el-form-item>
          <el-form-item label="人员密码">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="直属领导">
            <el-select v-model="form.leader" placeholder="请选择">
              <el-option v-for="item in people" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </div>
      </el-dialog>
    </div>
    </div>
      <div style="background-color: red;display: flex; justify-content: center;margin-left: 5%;margin-right:5%;margin-top: 3%">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="人员编号" prop="id"></el-table-column>
        <el-table-column label="人员姓名" prop="name"></el-table-column>
        <el-table-column label="人员部门">
          <template slot-scope="scope">
            <el-select v-model="scope.row.department" placeholder="请选择">
              <el-option label="销售部" value="销售部"></el-option>
              <el-option label="技术部" value="技术部"></el-option>
              <el-option label="人事部" value="人事部"></el-option>
              <el-option label="财务部" value="财务部"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="人员账号" prop="account"></el-table-column>
        <el-table-column label="人员密码" prop="password">
          <template slot-scope="scope">
            <el-input v-model="scope.row.password"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="直属领导">
          <template slot-scope="scope">
            <el-select v-model="scope.row.leader" placeholder="请选择">
              <el-option v-for="item in people" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleSave(scope.row)">保存</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "peopleManage",
  data(){
    return {
      dialogVisible: false,
      form: {
        department: '',
        name: '',
        account: '',
        password: '',
        leader: ''
      },
      people:[{
        'label':'zhangsan',
        'value':'zhangsan'
      }],
      tableData: [],
      options: [{
          value: '封测中心',
          label: '封测中心'
        }, {
          value: '智能中心',
          label: '智能中心'
        }, {
          value: '结晶中心',
          label: '结晶中心'
        }, {
          value: '养老中心',
          label: '养老中心'
        }, {
          value: '世源科技中心',
          label: '世源科技中心'
        }],
        value1: [],
        value2: [],
        saveYON:''
    }
  },
  methods:{
     open1(title,message) {
        const h = this.$createElement;
        this.$notify({
          title: title,
          message: h('i', { style: 'color: teal'}, message)
        });
      },
    open2() {
        const h = this.$createElement;
        this.$notify({
          title: '修改失败',
          message: h('i', { style: 'color: teal'}, '修改失败！请检查网络后联系超级管理员')
        });
      },
    showForm() {
      this.dialogVisible = true;
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过，提交数据到后端或进行其他操作
          const newUser = new FormData()
          newUser.append('apartment' , this.form.department)
          newUser.append('name',this.form.name)
          newUser.append('account',this.form.account)
          newUser.append('password',this.form.password)
          newUser.append('leader',this.form.leader)
          newUser.append('number',this.form.account)
          this.$axios.post('/api/createNewUser/', newUser).then(response=>{
            const h = this.$createElement;
            this.$notify({
              title: '新增人员',
              message: h('i', { style: 'color: teal'},this.form.name+'     新增成功！'),
              type:'success'
            });
            this.form = {
              department: '',
              name: '',
              account: '',
              password: '',
              leader: ''
            };
            const newUser = JSON.parse(response.data)
            console.log(response.data)
            this.tableData.push(newUser[0])

          })
          // 关闭悬浮窗
          this.dialogVisible = false;
        } else {
          // 表单验证不通过，提示用户
          this.$message.error('表单填写不完整或格式不正确');
        }
      });
      },
    testfirst(){
      // console.log(this.value1)
      // console.log(this.value1.length)
      const forms = new FormData();
      for (let i = 0; i < this.value1.length; i++) {
        forms.append(i,this.value1[i])
      }
      this.$axios.post('api/userSearchByApartment/',forms)
      .then(response => {
        // console.log(response.data);// 处理后端返回的数据
        const data = JSON.parse(response.data);
        // console.log(data)
        this.tableData = data[0]
        this.people =data[1]
      })
      .catch(error => {
        console.error(error); // 处理错误
      });
    },
    handleSave(row) {
      // console.log('保存', row.name)
      const changeUser = new FormData()
      changeUser.append('id',row.id)
      changeUser.append('name' , row.name)
      changeUser.append('apartment',row.department)
      changeUser.append('password',row.password)
      changeUser.append('leader',row.leader)
      this.$axios.post('/api/changeUser/', changeUser).then(response=>{
          if (response.data === 0){
            this.open1('保存通知',row.name+'修改信息成功！');
          }
          else {
            this.open2()
          }
      })
    },
    handleDelete(row) {
      const index = this.tableData.indexOf(row)
      this.tableData.splice(index, 1)
      // console.log(row)
      const deleteUser = new FormData()
      deleteUser.append('id',row.id)
      deleteUser.append('name' , row.name)
      deleteUser.append('apartment',row.department)
      deleteUser.append('password',row.password)
      deleteUser.append('leader',row.leader)
      this.$axios.post('/api/deleteUser/', deleteUser).then(response=>{
          if (response.data === 0){
            this.open1('删除通知',row.name+'删除信息成功！');
          }
          else {
            this.open2()
          }
      })
    }
  },
  mounted() {
    this.testfirst()
  }
}
</script>

<style scoped>

</style>
