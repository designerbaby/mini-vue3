<template>
  <h1>x:{{x}}, y: {{ y }}</h1>
  <input type="text" v-model="state.val" @keyup.enter="addTodo"/>
  <ul>
    <li v-for="todo in state.todos" :key="todo.name">{{todo.name}}</li>
  </ul>
  <div>
    total: {{ total }}
  </div>
</template>

<script>
import useMouse from './useMouse'
import useAddTodo from './useAddTodo'

export default {
  setup() {
    const { x, y } = useMouse()
    const { state, total, addTodo } = useAddTodo()
    return { 
      state, total, addTodo,
      x, y
    }
  },
}

</script>
