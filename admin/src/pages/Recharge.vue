<template>
  <q-page class="">
  
    <h5 class="text-center text-accent">RECHARGE</h5>

   <div style="margin:25px; width: fit-content; overflow: scroll;">
      <table style="width: max-content; overflow: scroll;">
        <tr>
           <th class="head">Date</th>
          <th class="head">User</th>
          <th class="head">Point</th>
       
          <th class="head">UPI</th>
          <th class="head">Ref ID</th>
          <th class="head">Status</th>
             <th class="head">Operation</th>
        </tr>
        <tr v-for="u in user" :key="u.key">
           <td class="data">{{u.date}}</td>
          <td class="data">{{u.user}}</td>
           <td class="data">{{u.points}}</td>
            <td class="data">{{u.upi}}</td>
             <td class="data">{{u.refid}}</td>
              
           
          <td class="data">
            <span v-if="u.status==1">Approved</span>
            <q-btn color="green" @click="chngStatus(u.key)" v-if="u.status==0">Approve</q-btn>
          </td>
          <td class="data">
            <q-btn color="red" @click="del(u.key)" >Delete</q-btn>
          </td>

         
          
        </tr>
      </table>
    </div>
  </q-page>
</template>

<script>
  import axios from "axios";
  export default {
    name: 'PageIndex',
    data() {
      return {
        user: {}
      }
    },
    mounted() {
      axios.get('https://sdi-api.deta.dev/rr').then(r => {
        console.log(r.data.items);
        this.user = r.data.items
      })
    },
    methods: {
      del(key){
        
var data = JSON.stringify({
  "key": key
});

var config = {
  method: 'delete',
maxBodyLength: Infinity,
  url: 'https://sdi-api.deta.dev/rr',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  location.reload()
})
.catch(function (error) {
  console.log(error);
});


      },
      chngStatus(key) {

         axios.post('https://sdi-api.deta.dev/recharge-req-acc', {"key":key}).then(r => {
         console.log(r.data.items);
         axios.get('https://sdi-api.deta.dev/rr').then(r => {
        console.log(r.data.items);
        this.user = r.data.items
      })
       
      })

      }
    }
  }
</script>

<style scoped>
  .head {
    padding: 5px;
    background-color: #1976D2;
    color: white;
    border-radius: 5px;
  }

  .data {
    padding: 5px;
    background-color: #99c4f0;
    color: blue;
    border-radius: 5px;
  }
</style>