<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input @change="searchByRoleCode" :v-model="filters.roleCode" placeholder="角色code"></el-input>
        </el-form-item>
          <el-form-item>
          <el-input @change="searchByName" :v-model="filters.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getRolesByNameOrCode">查询</el-button>
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
      :data="roles"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%"
    >
      <!-- <el-table-column title="序号" type="selection" width="55"> </el-table-column> -->
      <el-table-column label="序号" type="index" width=""> </el-table-column>
      <el-table-column prop="roleCode" label="角色code" width="" sortable></el-table-column>
      <el-table-column prop="name" label="角色名称" width="" sortable></el-table-column>
  
  
      <el-table-column prop="edited" label="最后维护时间" width="" sortable>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--编辑界面-->
    <el-dialog
      title="编辑"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
        ref="editForm"
      >
        <el-form-item label="角色code" prop="角色code">
          <el-input v-model="editForm.roleCode" auto-complete="off"></el-input>
        </el-form-item>
          <el-form-item label="角色名称" prop="角色名称">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
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
      title="添加角色信息"
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
    
             <el-form-item   label-width="100px" label="角色code" prop="角色code">
                 <el-input  v-model="addForm.roleCode" auto-complete="off"></el-input>
             </el-form-item>
        
           
             <el-form-item label-width="100px" label="角色名称" prop="角色名称">
                 <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>

    
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
  batchRemoveUser,
  editRole,
  getRoleListPage,
  addRole,
  removeRole
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        username: "",
        idCard:""
      },
      roles:[],
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        roleCode:""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      //新增界面数据
      addForm: {
        roleCode:"",
        name:""
      },
    };
  },
  methods: {
  
    handleCurrentChange(val) {
      this.page = val;
      this.getRoles();
    },
       //获取角色列表
    getRoles() {
      let para = {
        page: this.page,
        name: this.filters.name,
      };
      this.listLoading = true;
      //NProgress.start();
      let that=this;
      getRoleListPage(para).then((res) => {
        that.roles=res.data.data
        //用户信息数组
        that.listLoading = false;
        //NProgress.done();
      });
    },
    //删除
    handleDel: function (index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id,name:row.name,roleCode:row.roleCode};
          removeRole(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getRoles();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function () {
      this.addFormVisible = true;
      this.addForm = {
        roleCode: "",
        name:"",
      };
    },
    //编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
        
            editRole(para).then((res) => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getRoles();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.birth =
              !para.birth || para.birth == ""
                ? ""
                : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd");
            addRole(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: "提交成功",
                type: "success",
              });
              this.$refs["addForm"].resetFields();
              this.addFormVisible = false;
              this.getRoles();
            });
          });
        }
      });
    },
    selsChange: function (sels) {
      this.sels = sels;
    },

    //根据条件进行查询
    getRolesByNameOrCode: function(){

           search(para).then((res) => {
             alert(res);
           });
    },

   searchByRoleCode(x){
       
    
       
   },

   searchByName(x){
       
        this.roles.filter(e=>{
          return e.roleCode==x
        })
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
            this.getRoles();
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
  
    this.getRoles();
  },
};
</script>
