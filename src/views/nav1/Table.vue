<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.username" placeholder="姓名"></el-input>
        </el-form-item>
          <el-form-item>
          <el-input v-model="filters.idCard" placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsers">查询</el-button>
        </el-form-item>
        <el-form-item>
          
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%"
    >
      <!-- <el-table-column title="序号" type="selection" width="55"> </el-table-column> -->
      <el-table-column label="序号" type="index" width=""> </el-table-column>
      <el-table-column prop="loginName" label="登陆名" width="" sortable></el-table-column>
      <el-table-column prop="username" label="姓名" width="" sortable></el-table-column>
      <el-table-column prop="idCard" label="身份证号" width="" sortable></el-table-column>
        
      <!-- <el-table-column prop="userName" label="姓名" width="120" sortable> -->
      
      <el-table-column
        prop="gender"
        label="性别"
        width="100"
        :formatter="formatSex"
        sortable
      >
      </el-table-column>
      <el-table-column prop="address" label="联系地址" width="" sortable></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="" sortable></el-table-column>
           
      <el-table-column prop="edited" label="最后维护时间" width="" sortable>
      </el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus" min-width="" sortable>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" type="danger" @click="handleNoUser(scope.$index, scope.row)">禁用</el-button>
          <el-button size="small" @click="handleRole(scope.$index, scope.row)">角色分配</el-button>

          <!-- <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!-- <el-button
        type="danger"
        @click="batchRemove"
        :disabled="this.sels.length === 0"
        >批量删除</el-button
      > -->

   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  
      :page-sizes=this.page_sizes
      :page-size="100"
      layout="sizes, prev, pager, next"
      :total="1000">
 
</el-pagination>
    
    </el-col>

    <!--编辑角色界面-->
    <el-dialog
      title="角色分配"
      v-model="editFormVisible"
      :close-on-click-modal="false"
       width="10%"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="editForm"
      >

    <el-checkbox-group v-model="role">
      <el-col :span="24" v-for="(item,index) in roles" :key="index">
        <el-checkbox :label="item.name"></el-checkbox>
      </el-col>
    </el-checkbox-group>

      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleRoleEditVisable">取消</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>


    <!--新增界面-->
    <el-dialog
      title="添加用户信息"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addForm"
      >
      <!-----------------------------------------第一行 -------------------------------------->
       <el-row>
         <el-col :span="12">
             <el-form-item  label="登录名" prop="login_name">
                 <el-input v-model="addForm.loginName" auto-complete="off"></el-input>
             </el-form-item>
         </el-col>
         <el-col :span="12">
             <el-form-item  label="姓名" prop="usename">
                 <el-input v-model="addForm.username" auto-complete="off"></el-input>
              </el-form-item>
         </el-col>
       </el-row>

        <!-----------------------------------------第二行 -------------------------------------->
      <el-row>
         <el-col :span="12">
             <el-form-item  label="身份证号" prop="idCard">
                 <el-input v-model="addForm.idCard" auto-complete="off"></el-input>
             </el-form-item>
         </el-col>
             <el-col :span="12">
             <el-form-item   label="性别" prop="gender">
                 <el-input   v-model="addForm.gender" auto-complete="off"></el-input>
        </el-form-item>
         </el-col>
       </el-row>
        <!-----------------------------------------第三行 -------------------------------------->
      <el-row>
         <el-col :span="12">
             <el-form-item label="密码" prop="password">
                 <el-input type="password"  v-model="addForm.password" auto-complete="off"></el-input>
             </el-form-item>
         </el-col>
             <el-col :span="12">
             <el-form-item  label="确认密码" prop="repassword">
                 <el-input type="password"  v-model="addForm.repassword" auto-complete="off"></el-input>
        </el-form-item>
         </el-col>
       </el-row>
        <!-----------------------------------------第四行 -------------------------------------->
              <el-row>
         <el-col :span="12">
             <el-form-item label="联系电话" prop="phone">
                 <el-input v-model="addForm.phone" auto-complete="off"></el-input>
             </el-form-item>
         </el-col>
             <el-col :span="12">
             <el-form-item  label="联系地址" prop="address">
                 <el-input v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>

         </el-col>
       </el-row>

        <!-----------------------------------------第五行行 -------------------------------------->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit"
          :loading="addLoading"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
//import NProgress from 'nprogress'
import {
  getRoleListPage,
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUserRole,
  addUser,
  UserBanUser
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        username: "",
        idCard:""
      },
      users: [],
     
      listLoading: false,
      sels: [], //列表选中列
       page_sizes:[
        5,10,20,30,40,50
       ],
       currentPageSize:10,    //默认情况下每页的个显示个数
       currentPage: 1,        //当前第几页
       total:0,               //总共的数据量
      editFormVisible: false, //编辑界面是否显示
      editRoleFormVisible:false,
      editLoading: false,
      editFormRules: {
        // name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },


role:[],
roles:[],
      //编辑界面数据
      editForm: {
        id:0,
        loginName:"",
        userid:""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
        loginName: "",
        username:"",
        idCard:"",
        gender:'',
        password:"",
        repassword:"",
        phone:"",
        address:"",
        status:1
      },
      
    };
  },
  methods: {
    //性别显示转换
    formatSex: function (row, column) {
      return row.gender == 1 ? "男" : row.gender == 0 ? "女" : "未知";
    },
     //性别显示转换
    formatStatus: function (row, column) {
      return row.status == 1 ? "正常" : row.status == 0 ? "禁用" : "未知";
    },

    //获取用户列表
    getUsers() {
      let para = {
        page: this.currentPage,
        currentPageSize:this.currentPageSize
      };
       console.log(para,"///..")
      this.listLoading = true;
      //NProgress.start();
      getUserListPage(para).then((res) => {

        console.log(res.data,"----");

        this.total = res.data.total;
        //用户信息数组
        this.users = res.data.records;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    getRoles(){
        let that = this;
        getRoleListPage().then((res) => {
        //用户信息数组
        this.roles = res.data.data;
        // this.listLoading = false;
        //NProgress.done();
      });
     
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          removeUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.addFormVisible = true;
      // let rowdata=bject.assign({}, row);
      this.addForm = Object.assign({}, row);
      if(this.addForm.gender==1) this.addForm.gender='男'
      else this.addForm.gender='女'
      console.log(this.addForm,"要修改的用户数据")
  
    },
      //处理角色
    handleRole: function (index, row) {
      this.editFormVisible = true;
      this.getRoles();
      this.editForm = Object.assign({}, row);
       
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
      this.addForm = {
       login_name: "",
        username:"",
        idCard:"",
        gender:'',
        password:"",
        repassword:"",
        phone:"",
        address:"",
        status:1
      };
    },
    //编辑角色信息
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
             para.roles=this.roles;
                  
             editUserRole(para).then((res) => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
 
    },
    // 处理禁用 用户禁止使用
    handleNoUser(index,row){

         let para={
           login_name:row.loginName
         }
         UserBanUser(para).then((res)=>{
            if(res.status==200){
               this.$message({
                 message:"用户禁用成功",
                 type:"success"
               });  
               getUsers(); 
            }else{
                this.$message({
                 message:"操作失败",
                 type:"error"
               }); 
            }

         });
         this.users=this.getUsers();

    },


    handleRoleEditVisable(){
        this.editFormVisible = false;
    },

    //添加新的用户信息
    addSubmit: function () {
    
      this.$refs.addForm.validate((valid) => {       
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            if(para.gender=='男') para.gender='1'
             if(para.gender=='女') para.gender='0'


            addUser(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },

    // 每页数量的改变
    handleSizeChange(val){
      this.currentPageSize=val;
        this.getUsers();
    },

    //页数改变了
    handleCurrentChange(val) {
    
      this.page = val;
      this.getUsers();
    },
    
    //批量删除
    batchRemove: function () {
      var ids = this.sels.map((item) => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.getUsers();
   
  },
};
</script>
