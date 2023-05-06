<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
<!--      <el-tab-pane label="每周打卡" name="first" >-->
<!--        <div  style="float: left">-->
<!--          <el-calendar v-model="value">-->
<!--            <template-->
<!--             slot="dateCell"-->
<!--             slot-scope="{data}">-->
<!--              &lt;!&ndash;自定义内容&ndash;&gt;-->
<!--                <div>-->
<!--                   <div class="calendar-day" >{{ data.day.split('-').slice(2).join('-') }}</div>-->
<!--                </div>-->
<!--            </template>-->
<!--          </el-calendar>-->
<!--        </div>-->
<!--        <div class="hello" style="width:50%;float:right;height:800px;margin-right: 5%">-->
<!--          <hr/>-->
<!--          <div id="waringByClick" style="text-align: center;color:purple">{{waring}}</div>-->
<!--          <div><p class="textTime">本周已经分配时长为：{{total}} 小时</p></div>-->
<!--          <el-divider></el-divider>-->
<!--          <div style="display: flex">-->
<!--            <el-input placeholder="请输入额外项目备注" v-model="text" :rules="inputRules"></el-input>-->
<!--            <el-input style="margin-left: 1%;" placeholder="请输入时长" type="number" controls min=0 max=1000 v-model="timeMore"></el-input>-->
<!--            <el-button style="margin-left: 1%" class="submit-row" :disabled="isDisabled" @click="getExtraMessage">提交</el-button>-->
<!--          </div>-->
<!--            <div>-->
<!--              <el-divider width="300px">已分配项目时长</el-divider>-->
<!--            </div>-->

<!--            <div>-->
<!--              <el-table :data="tableData" style="width: 100%">-->
<!--                <el-table-column prop="name" label="项目名称" >-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="duration" label="分配时长">-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-input-number size="small" v-model="scope.row.duration" :min="0" :disabled="scope.row.status==='已审核'"></el-input-number>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="type" label="类型"width="60%">-->

<!--                </el-table-column>-->
<!--                <el-table-column prop="status" label="打卡状态" width="80%"></el-table-column>-->
<!--                <el-table-column label="操作">-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-button id="submit" type="primary" size="small" @click="submit(scope.row)" :disabled="scope.row.status === '已审核'">提交</el-button>-->
<!--                    <el-button id="delete" type="primary" size="small" @click="deletethis(scope.row)" :disabled="scope.row.type === '主要项目' || scope.row.status==='已审核'" class="el-button&#45;&#45;danger">删除</el-button>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--              </el-table>-->
<!--            </div>-->
<!--          </div>-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="打卡审批" name="first">
        <projectReview></projectReview>
      </el-tab-pane>
<!--      <el-tab-pane label="项目管理" name="second" >-->
<!--        <project-manage></project-manage>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="人员管理" name="third">-->
<!--        <people-manage></people-manage>-->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="审核管理" name="forth">-->
<!--        <all-memory></all-memory>-->
<!--      </el-tab-pane>-->
    </el-tabs>

  </div>
</template>
<script>
import ProjectManage from "./projectManage.vue";
import PeopleManage from "./peopleManage.vue";
import projectReview from "./projectReview.vue";
import AllMemory from "./allMemory.vue";

export default {
    components: {AllMemory, PeopleManage, ProjectManage,projectReview},
    data() {
      return {
        likewise:'false',
        userAccount:'',
        total:0,
        text:'',
        timeMore:0,
        waring:'本周还未打卡',
        isDisabled:false,
        activeName: 'first',
        value:new Date(),
        weekByToday:'',
        clickTime:'',
        tableData: [],
        inputRules: [ // 定义 inputRules 规则
        { required: true, message: '输入不能为空', trigger: 'blur' }]
      };
    },
    watch:{
      value: function() {
                const year = this.value.getFullYear();
                let month = this.value.getMonth() + 1;
                let date = this.value.getDate();
                if (date >= 1 && date <= 9) {//日如果小于10就补个0
                    date = "0" + date;
                }
                if (month >= 1 && month <= 9) {//月如果小于10就补个0
                    month = "0" + month;
                }
                date = year + '-' + month + '-' + date // 打印出日历选中了哪年哪月
                // console.log(date)
                this.clickWhatWeek(date)
            }
    },
    methods: {
       open1(title,message,type) {
        this.$notify({
          title: title,
          message: message,
          type: type
        })
       },
      getSummary(){
        this.tableData.forEach(item =>{
          this.total = this.total +item.duration
          // console.log(item.duration)
        })
      },
      getExtraMessage(){
        // console.log(this.text)
        // console.log(this.timeMore)
        if (this.text !== '') {
          const moreMessage = {
            'name': this.text,
            'duration': this.timeMore,
            'status': '未审核',
            'type':'其他项目',
            'account':this.userAccount
          }
          this.tableData.push(moreMessage)
          this.total = this.total+parseInt(this.timeMore)
          this.$axios.post('/api/newMemory/', moreMessage).then(response=>{
            // console.log(response)
                this.open1('提交结果','额外项目打卡信息提交成功','success')
          })
        // console.log(this.tableData)
        }
        this.total = 0
        // this.getSummary()
        this.tableData.forEach(item =>{
          this.total = this.total + parseInt(item.duration)
          // console.log(item.duration)
        })
        this.text=''
        this.timeMore =''
      },
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      clickWhatWeek(date) {
        this.$axios.post('/api/getWeekToday', date).then(response => {
          // console.log(response)
          this.clickTime = response.data
          // console.log(this.clickTime)
          // console.log(this.weekByToday)
          if (this.clickTime !== this.weekByToday) {
            this.isDisabled = true
            this.waring = '仅可操作本周打卡'
            document.getElementById('waringByClick').style.color = 'red'
          } else {
            this.isDisabled = false
            this.waring = '本周打卡情况'
            document.getElementById('waringByClick').style.color = 'purple'
          }
          this.clickToGetNewTableByClender()

        })
      },
      clickToGetNewTableByClender(){
        const forms = new FormData();
        forms.append('account', this.userAccount);
        forms.append('data', this.clickTime)
        this.$axios.post('/api/getMemeoryTableByClickCandler/', forms).then(response=>{
          console.log( this.clickTime)
          console.log('nice to meet you ')
          this.tableData = JSON.parse(response.data)
          this.total = 0
          this.getSummary()
        })
      },
      submit(row) {
        console.log('row is ',row)
        row.account = this.userAccount
        this.$axios.post('/api/changeMemory/',row).then(response=>{
          console.log(response)
          this.open1('提交结果','提交打卡信息成功','success')
        })
        // 提交该行数据
        this.total=0
        this.getSummary()

      },
      deletethis(row){
        row.account = this.userAccount
        this.$axios.post('/api/deleteMemory/', row).then(response=>{
          // console.log(response)
          this.open1('删除结果','删除打卡信息成功','success')
        })
        this.total = 0
        const index = this.tableData.indexOf(row)
        // console.log(index)
        if (index !== -1) {
          this.tableData.splice(index, 1);
        }
        this.getSummary()
      }
    },
    mounted() {
       this.userAccount = localStorage.getItem('account')
      // console.log(this.userAccount+' is enter')
      if (localStorage.getItem('account') === null){
        alert('请先登录')
        this.$router.push('/login')
      }
      const date = new Date();
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      // console.log(dateString); // 输出当前日期的字符串形式，例如：21-07-14
      this.$axios.post('/api/getWeekToday', dateString).then(response=>{
        // console.log(response)
        this.weekByToday = response.data
        // console.log('this.weekByToday is '+this.weekByToday)
      })
      const sentMessage = {
        'account':this.userAccount
      }
      this.$axios.post('/api/getMemoryByAccount/', sentMessage).then(response=>{
        // console.log('this si data '+data)
        this.tableData = JSON.parse(response.data)
        this.tableData.forEach(item=>{
          this.total = this.total + item.duration
        })
      })
      // console.log('end1')
      // console.log('this si '+this.tableData)
      // console.log('end')
    }
  };
</script>
<style>
.textTime{
  text-align: center;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.indexTable td,
.indexTable th{
  font-size: 13px;
}
/* 更改 el-calendar 的宽度 */
.el-calendar {
  width: 600px;
  display: inline-block;
  margin-left:30px;
}

/* 更改 el-calendar 的高度 */
.el-calendar {
  height: 700px;
}

/* 更改 el-calendar 内部日期表格的字体大小 */
.el-calendar-table td {
  font-size: 10px;
}

.calendarCss{
  background-color: red;
  display: inline-block;
}

.el-tab-pane {
  font-size: 16px; /* 设置字体大小为16像素 */
}
</style>
