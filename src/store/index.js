import Vue from 'vue'
import Vuex from 'vuex'
// axios是个异步操作，需要将其写入到actions中
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框的内容
    inputValue: 'aaa',
    // id
    nextId: 5,
    viewKey: 'all'
  },
  mutations: {
    // 创建一个函数为list进行赋值
    initlist(state, list) {
      state.list = list
    },
    // 为store中的value进行赋值
    setInputValue(state, val) {
      state.inputValue = val
    },
    // 向list添加新的数据
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue,
        done: false
      }
      // 内容放入列表中,文本框中的值为空,id值+1
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据id删除对应项的索引
    removeItem(state, id) {
      // 根据Id查找对应项的索引
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引,删除对应的元素
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    // 根据id值修改对应项的选中状态list[i].done
    changeStatus(state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    clearDone(state) {
      state.list = state.list.filter(x => x.done === false)
    },
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    // 调用getList函数,发起请求拿到真实数据data,通过commit调用mutations函数，传递一个list参数，这样就能对state里的list赋值
    getList(context) {
      axios.get('/list.json').then(({ data }) => {
        console.log(data)
        context.commit('initlist', data)
      })
    }
  },
  getters: {
    // 统计未完成的任务条数,filter是过滤器
    unDoneLength(state) {
      return state.list.filter(x => x.done === false).length
    },

    
    // 点击哪个按钮，显示完成的数
    infoList(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x => x.done === false)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done === true)
      }
      return state.list
    }
  }
})
