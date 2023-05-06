<template>
  <div>
  <div>
    <el-button class="button" type="primary" @click="showForm">新建项目</el-button>
    <el-dialog :visible.sync="dialogVisible" title="新建项目" width="50%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="项目编号">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="项目类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option v-for="type in types" :key="type" :label="type" :value="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目负责人">
          <el-select v-model="form.manager.department" placeholder="请选择部门" @change="onDepartmentChange">
            <el-option v-for="department in departmentsManager" :key="department" :label="department" :value="department"></el-option>
          </el-select>
          <el-select v-model="form.manager.name" placeholder="请选择负责人">
            <el-option v-for="name in managerOptionsManager" :key="name" :label="name" :value="name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目成员">
          <div v-for="(member, index) in form.members" :key="index" class="member-item">
            <el-select v-model="member.department" placeholder="请选择部门" @change="onMemberDepartmentChange(index)">
              <el-option v-for="department in departments" :key="department" :label="department" :value="department"></el-option>
            </el-select>
            <el-select v-model="member.name" placeholder="请选择成员">
              <el-option v-for="name in memberOptions(index)" :key="name" :label="name" :value="name"></el-option>
            </el-select>
            <el-button class="add-button" icon="el-icon-plus" @click="addMember(index)"></el-button>
            <el-button class="delete-button" icon="el-icon-delete" @click="deleteMember(index)" :disabled="form.members.length === 1"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
  <div style="margin-right: 2%;margin-left: 2%;  transform: scale(0.98);">
    <el-table :data="tableData" style="width: 100%;height:1000px">
      <el-table-column label="项目编号" prop="id"></el-table-column>
      <el-table-column label="项目名称" prop="name">
        <template slot-scope="{ row }">
          <el-input v-model="row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="项目负责人" prop="leader"></el-table-column>
      <el-table-column label="项目类型" prop="type">
        <template slot-scope="{ row }">
          <el-select v-model="row.type" placeholder="请选择">
            <el-option label="选项1" value="option1"></el-option>
            <el-option label="选项2" value="option2"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button @click="showMembersDialog(row)"size="small">项目成员</el-button>
          <el-button type="primary" size="small" @click="submit(row)">提交</el-button>
          <el-button type="danger" size="small" @click="deleteRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="membersDialogVisible" title="项目成员" append-to-body>>
      <el-table :data="membersData" style="width: 100%">
        <el-table-column label="部门">
          <template slot-scope="{ row }">
            <el-select v-model="row.department" placeholder="请选择">
              <el-option v-for="department in departments" :key="department" :label="department" :value="department"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="人员">
          <template slot-scope="{ row }">
            <el-select v-model="row.member" placeholder="请选择">
              <el-option v-for="name in getoptions(row)" :key="name" :label="name" :value="name"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="primary" @click="addRow(row)">增加</el-button>
            <el-button type="danger" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: [
                {
          id: '1',
          name: '项目1',
          leader: '负责人1',
          type: 'option1',
          members: [
            { department: '部门1', member: '人员1' },
            { department: '部门2', member: '人员2' }
          ]
        },
        {
          id: '2',
          name: '项目2',
          leader: '负责人2',
          type: 'option2',
          members: [
            { department: '部门3', member: '人员3' },
            { department: '部门4', member: '人员4' }
          ]
        }
      ],
      membersDialogVisible: false,
      membersData: [],
      dialogVisible: false,
      form: {
        id: '',
        name: '',
        type: '',
        manager: {
          department: '',
          name: ''
        },
        members: [{
          department: '',
          name: ''
        }]
      },
      types: ['主要项目', '其他项目'],
      departments: ['部门1', '部门2', '部门3'],
      employees: {
        '部门1': ['员工1-1', '员工1-2', '员工1-3'],
        '部门2': ['员工2-1', '员工2-2', '员工2-3'],
        '部门3': ['员工3-1', '员工3-2', '员工3-3']
      },
      departmentsManager: ['部门1', '部门2', '部门3'],
      employeesManager: {
        '部门1': ['领导1-1', '员工1-2', '员工1-3'],
        '部门2': ['领导2-1', '员工2-2', '员工2-3'],
        '部门3': ['领导3-1', '员工3-2', '员工3-3']
      }
    }
  },
  computed: {
    managerOptionsManager(){
      const department = this.form.manager.department
      return department ? this.employeesManager[department] : []
    }
  },
  mounted() {
    this.$axios.post('/api/getUsersSelections/').then(response=>{
      const json_data = JSON.parse(response.data)
      this.departmentsManager = json_data[1]
      this.employeesManager = json_data[0]
      this.departments =json_data[3]
      this.employees = json_data[2]
      this.tableData = json_data[4]
    })
  },
  methods: {
    getoptions(row){
      // console.log(row.department)
      const department = row.department
      return department ? this.employees[department] : []
    },
    showForm() {
      this.dialogVisible = true
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // console.log(this.form)
          const form = this.form
          const formDate = new FormData()
          formDate.append('id', form.id)
          formDate.append('managers',JSON.stringify(form.manager))
          formDate.append('type',form.type)
          formDate.append('name',form.name)
          formDate.append('members', JSON.stringify(form.members))
          axios.post('/api/createProject/',formDate).then(response=>{
            // console.log(response)
            form.id = '';
            form.name = '';
            form.type = '';
            form.manager.department = '';
            form.manager.name = '';
            form.members = [];
          })

          this.dialogVisible = false
        } else {
          this.$message.error('表单验证失败')
        }
      })
    },
    onDepartmentChange() {
      this.form.manager.name = ''
    },
    onMemberDepartmentChange(index) {
      this.form.members[index].name = ''
    },
    memberOptions(index) {
      const department = this.form.members[index].department
      return department ? this.employees[department] : []
    },
    addMember(index) {
      this.form.members.splice(index + 1, 0, { department: '', name: '' })
    },
    deleteMember(index) {
      this.form.members.splice(index, 1)
    },
    showMembersDialog(row) {
      this.membersData = row.members;
      this.membersDialogVisible = true;
    },
    submit(row) {
      // console.log(row);
      const formDate = new FormData()
      formDate.append('id', row.id)
      formDate.append('managers',row.leader)
      formDate.append('type',row.type)
      formDate.append('name',row.name)
      formDate.append('members', JSON.stringify(row.members))
      this.$axios.post('/api/changeProject/',formDate).then(response=>{
        // console.log(response)
      })
    },
    addRow(row) {
      const index = this.membersData.indexOf(row);
      this.membersData.splice(index + 1, 0, { department: '', member: '' });
    },
    deleteRow(row) {
      const index = this.membersData.indexOf(row);
      this.membersData.splice(index, 1);
    }
  }
}
</script>

<style>
.container {
  padding: 20px;

}
.button {
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: center;
}
.member-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.add-button,
.delete-button {
  margin-left: 10px;
}
</style>
