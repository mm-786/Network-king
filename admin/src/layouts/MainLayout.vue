<template>
  <q-layout view="lHh Lpr lFf">
    

    <!-- <q-drawer
    v-if="show"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"

    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
         Pages
        </q-item-label>
      </q-list>
       <q-list>
         <q-btn @click="$router.push('/user')" flat style="margin-left:10px">User</q-btn>
      </q-list>
       <q-list>
         <q-btn @click="$router.push('/trns')" flat style="margin-left:10px">Trasaction</q-btn>
      </q-list>
       <q-list>
         <q-btn @click="$router.push('/product')" flat style="margin-left:10px">Product</q-btn>
      </q-list>
       <q-list>
         <q-btn @click="$router.push('/withdraw')" flat style="margin-left:10px">Withdraw</q-btn>
      </q-list>
       <q-list>
         <q-btn @click="$router.push('/recharge')" flat style="margin-left:10px">Recharge</q-btn>
      </q-list>
      <q-list>
         <q-btn @click="$router.push('/upi')" flat style="margin-left:10px">UPI</q-btn>
      </q-list>
     
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>



export default {
  name: 'MainLayout',
  methods:{
    logout(){
      window.login = false;
      location.reload();
    }
  },
  mounted(){
   
  },
  data () {
    return {
      leftDrawerOpen: false,
      show:true
    }
  }
}
</script>
