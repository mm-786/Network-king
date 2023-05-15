<template>
  <q-page class="flex flex-center">
    
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',

  methods:{
    login(){
      if(this.pass==this.truPass){
        alert('p')
        window.login = true;
        setTimeout(() => {
          location.reload();
        }, 2000);
        
      }
    }
  }
}
</script>
