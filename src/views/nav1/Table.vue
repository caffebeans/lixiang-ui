<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.userName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.idCard" placeholder="身份证号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" v-on:click="clearFilter">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getUsersByNameOrId">查询</el-button>
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
      v-loading="listLoading"
      :data="users"
      highlight-current-row
      style="width: 100%"
      @selection-change="selsChange"
    >
      <!-- <el-table-column title="序号" type="selection" width="55"> </el-table-column> -->
      <el-table-column label="序号" type="index" width=""></el-table-column>
      <el-table-column label="登陆名" prop="loginName" sortable width=""></el-table-column>
      <el-table-column label="姓名" prop="username" sortable width=""></el-table-column>
      <el-table-column label="身份证号" prop="idCard" sortable width=""></el-table-column>

      <!-- <el-table-column prop="userName" label="姓名" width="120" sortable> -->

      <el-table-column
        :formatter="formatSex"
        label="性别"
        prop="gender"
        sortable
        width="100"
      >
      </el-table-column>
      <el-table-column label="联系地址" prop="address" sortable width=""></el-table-column>
      <el-table-column label="联系电话" prop="phone" sortable width=""></el-table-column>

      <el-table-column label="最后维护时间" prop="edited" sortable width="">
      </el-table-column>
      <el-table-column :formatter="formatStatus" label="状态" min-width="" prop="status" sortable>
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
        :page-size="100"
        :page-sizes=this.page_sizes

        :total="1000"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >

      </el-pagination>

    </el-col>

    <!--编辑角色界面-->
    <el-dialog
      v-model="editFormVisible"
      :close-on-click-modal="false"
      title="角色分配"
      width="10%"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >

        <el-checkbox-group v-model="role">
          <el-col v-for="(item,index) in roles" :key="index" :span="24">
            <el-checkbox :label="item.name"></el-checkbox>
          </el-col>
        </el-checkbox-group>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleRoleEditVisable">取消</el-button>
        <el-button
          :loading="editLoading"
          type="primary"
          @click.native="editSubmit"
        >提交
        </el-button
        >
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      v-model="addFormVisible"
      :close-on-click-modal="false"
      title="添加用户信息"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <!-----------------------------------------第一行 -------------------------------------->
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录名" prop="loginName">
              <el-input v-model="addForm.loginName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="addForm.username" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-----------------------------------------第二行 -------------------------------------->
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="addForm.idCard" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="addForm.gender" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-----------------------------------------第三行 -------------------------------------->
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" auto-complete="off" type="password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="repassword">
              <el-input v-model="addForm.repassword" auto-complete="off" type="password"></el-input>
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
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="addForm.address" auto-complete="off"></el-input>
            </el-form-item>

          </el-col>
        </el-row>

        <!-----------------------------------------第五行行 -------------------------------------->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button
          :loading="addLoading"
          type="primary"
          @click.native="addSubmit"
        >提交
        </el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
//import NProgress from 'nprogress'
import {
  addUser,
  batchRemoveUser,
  editUserRole,
  getOneUser,
  getRoleListPage,
  getUserListPage,
  removeUser,
  UserBanUser,
} from '../../api/api'

export default {
  data() {
    return {
      filters: {
        userName: '',
        idCard: '',
      },
      users: [],

      listLoading: false,
      sels: [], //列表选中列
      page_sizes: [
        5, 10, 20, 30, 40, 50,
      ],
      currentPageSize: 5,    //默认情况下每页的个显示个数
      currentPage: 1,        //当前第几页
      total: 0,               //总共的数据量
      editFormVisible: false, //编辑界面是否显示
      editRoleFormVisible: false,
      editLoading: false,
      editFormRules: {
        loginName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
      role: [],
      roles: [],
      //编辑界面数据
      editForm: {
        id: 0,
        loginName: '',
        userid: '',
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        loginName: [{ required: true, message: '登陆名不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        gender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],

        phone: [
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          { required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码' },
        ],
         idCard: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { required: true, pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/, message: '请输入正确的身份证号' },
        ],
      },
      //新增界面数据
      addForm: {
        loginName: '',
        username: '',
        idCard: '',
        gender: '',
        password: '',
        repassword: '',
        phone: '',
        address: '',
        status: 1,
      },
    }
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.gender == 1 ? '男' : row.gender == 0 ? '女' : '未知'
    },
    //性别显示转换
    formatStatus: function(row, column) {
      return row.status == 1 ? '正常' : row.status == 0 ? '禁用' : '未知'
    },

    //获取用户列表
    getUsers() {
      let para = {
        page: this.currentPage,
        currentPageSize: this.currentPageSize,
      }
      console.log(para, '///..')
      this.listLoading = true
      //NProgress.start();
      getUserListPage(para).then((res) => {

        console.log(res.data, '----')

        this.total = res.data.total
        //用户信息数组
        this.users = res.data.records
        this.listLoading = false
        //NProgress.done();
      })
    },
    getRoles() {
      let that = this
      getRoleListPage().then((res) => {
        //用户信息数组
        this.roles = res.data.data
        // this.listLoading = false;
        //NProgress.done();
      })

    },
    //删除
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning',
      })
      .then(() => {
        this.listLoading = true
        //NProgress.start();
        let para = { id: row.id }
        removeUser(para).then((res) => {
          this.listLoading = false
          //NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.getUsers()
        })
      })
      .catch(() => {})
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.addFormVisible = true
      // let rowdata=bject.assign({}, row);
      this.addForm = Object.assign({}, row)
      if (this.addForm.gender == 1) {
        this.addForm.gender = '男'
      } else {
        this.addForm.gender = '女'
      }
      console.log(this.addForm, '要修改的用户数据')

    },
    //处理角色
    handleRole: function(index, row) {
      this.editFormVisible = true
      this.getRoles()
      this.editForm = Object.assign({}, row)

    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
      this.addForm = {
        login_name: '',
        username: '',
        idCard: '',
        gender: '',
        password: '',
        repassword: '',
        phone: '',
        address: '',
        status: 1,
      }
    },
    //编辑角色信息
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            //NProgress.start();
            let para = Object.assign({}, this.editForm)
            para.roles = this.roles

            console.log(para.id,"///dddd///");
            para={
              "user":{"id":para.id},
              "roles":this.roles
            }

            console.log(para);

            editUserRole(para).then((res) => {
              this.editLoading = false
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success',
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getUsers()
            })
          })
        }
      })

    },
    // 处理禁用 用户禁止使用
    handleNoUser(index, row) {

      let para = {
        login_name: row.loginName,
      }
      UserBanUser(para).then((res) => {
        if (res.status == 200) {
          this.$message({
            message: '用户禁用成功',
            type: 'success',
          })
          getUsers()
        } else {
          this.$message({
            message: '操作失败',
            type: 'error',
          })
        }

      })
      this.users = this.getUsers()

    },

    handleRoleEditVisable() {
      this.editFormVisible = false
    },

    //添加新的用户信息
    addSubmit: function() {

      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            //NProgress.start();
            let para = Object.assign({}, this.addForm)
            if (para.gender == '男') para.gender = '1'
            if (para.gender == '女') para.gender = '0'

            addUser(para).then((res) => {
              this.addLoading = false
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success',
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    },
    selsChange: function(sels) {
      this.sels = sels
    },

    // 每页数量的改变
    handleSizeChange(val) {
      this.currentPageSize = val
      this.getUsers()
    },

    //页数改变了
    handleCurrentChange(val) {

      this.currentPage = val
      this.getUsers()
    },
    clearFilter() {
      this.filters = {}
      this.getUsers()

    },

    //  查询用户
    getUsersByNameOrId() {

      let para = {
        userName: this.filters.userName,
        idCard: this.filters.idCard,
      }

      getOneUser(para).then(res => {
        if (res.code = 200) {
          this.users = res.data.data
        }
      })

    },

    //批量删除
    batchRemove: function() {
      var ids = this.sels.map((item) => item.id).toString()
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
      })
      .then(() => {
        this.listLoading = true
        //NProgress.start();
        let para = { ids: ids }
        batchRemoveUser(para).then((res) => {
          this.listLoading = false
          //NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.getUsers()
        })
      })
      .catch(() => {})
    },
  },
  mounted() {
    this.getUsers()

  },
}
</script>
