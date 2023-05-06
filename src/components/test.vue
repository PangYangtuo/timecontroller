<template>
  <div>{{name}}</div>
</template>
​
<script>
export default {
  data(){
    return{
      name:''
    }
  },
  methods:{
    getData () {
      this.$axios
        .get('api/all/')
        .then(response=> {
          this.name=response.data.name
          console.log(response.data)
        })
    },
  },
  mounted(){
    console.log('hello')
    console.log('fuckkkkkkkkkkkkkkkkkkkkkkkkkkk')
  }
}
</script>
