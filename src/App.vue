<template>
  <div id="app">
    <a-input placeholder="请输入任务" class='my_ipt'
    :value="inputValue" @change="handleInputChange"/>
    <a-button type="primary" @click="addItemToList">添加事项</a-button>
    <!-- 使用ant-design-vue  :dataSource动态加载数据-->
    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <!-- :checked相当于v-bind:checked,为元素绑定状态 -->
        <!-- 只要复选框的状态发生变化,就会触发change执行函数，只要change被触发，箭头函数就会立即执行，肯定会调用箭头函数里的函数 -->
        <a-checkbox :checked="item.done" @change="(e) => {cbStatusChange(e,item.id)}">{{item.info}}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="removeById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{unDoneLength}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <!-- 高亮显示是因为primary属性 ，其他type='default'-->
        <a-button :type="viewKey === 'all'?'primary':'default'" @click="changeList('all')">全部</a-button>
          <a-button :type="viewKey === 'undone'?'primary':'default'" @click="changeList('undone')">未完成</a-button>
          <a-button :type="viewKey === 'done'?'primary':'default'" @click="changeList('done')">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="clean()">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'app',
  data() {
    return {}
  },
  // 生命周期函数
  created() {
    // 触发actions里的函数
    this.$store.dispatch('getList')
  },
  // 将全局数据，映射为当前组件的计算属性
  computed: {
    // 删除list,用infoList进行数据的包装
    ...mapState(['inputValue', 'viewKey']),
    ...mapGetters(['unDoneLength', 'infoList'])
  },
  methods: {
    // 监听文本框内容变化
    handleInputChange(e) {
      this.$store.commit('setInputValue', e.target.value)
    },
    // 添加事件按钮
    addItemToList() {
      // 首先判断文本框不为空
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('文本框内容不能为空！')
      }
      this.$store.commit('addItem')
    },
    // 根据id删除所对应的事项
    removeById(id) {
      this.$store.commit('removeItem', id)
    },
    // 监听复选框选中状态的事件,事件对象e
    cbStatusChange(e, id) {
      // 通过e.target.checked获取复选框的状态
      const param = {
        id: id,
        status: e.target.checked
      }
      this.$store.commit('changeStatus', param)
    },
    clean() {
      this.$store.commit('clearDone')
    },
    // 高亮切换
    changeList(key) {
      this.$store.commit('changeViewKey', key)
    }
  }
}
</script>

<style scoped>
#app {
  padding: 10px;
}
.my_ipt{
  width: 500px;
  margin-right: 10px;
}
.dt_list{
  width: 500px;
  margin-top: 10px;
}
.footer{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
