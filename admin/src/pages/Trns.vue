<template>
  <q-page class="">
    <h5 class="text-center text-accent">TRANSACTION</h5>

    <div style="margin:25px; width: fit-content; overflow: scroll; ">
      <div style="border-right: 5px soild black;">
        <table style="border-right: 1px soild black; position: sticky; width: max-content; overflow: scroll;">
          <h6 class="text-center text-green">Credit</h6>
          <tr>
            <th class="head1">User</th>
            <th class="head1">Points</th>
            <th class="head1">Type</th>
            <th class="head1">Remarks</th>
            <th class="head1">Date</th>
            <th class="head1">OP</th>
          </tr>
          <tr v-for="t in tnx" :key="t.key" v-show="t.type=='credit'">
            <td class="data1">{{t.user}}</td>
            <td class="data1">{{t.points}}</td>
            <td class="data1">{{t.type}}</td>
            <td class="data1">{{t.remarks}}</td>
            <td class="data1">{{t.date}}</td>
            <td class="data1">
              <q-btn color="red" @click="del(t.key)" >Delete</q-btn>
            </td>
          </tr>
        </table>
      </div>
      
      <div style="border-left: 1px soild black;">
        <table style="position: sticky; width: max-content; overflow: scroll;">
          <h6 class="text-center text-red">Debit</h6>
          <tr>
            <th class="head">User</th>
            <th class="head">Points</th>
            <th class="head">Type</th>
            <th class="head">Remarks</th>
            <th class="head">Date</th>
            <th class="head">OP</th>
          </tr>
          <tr v-for="t in tnx" :key="t.key" v-show="t.type=='debit'">
            <td class="data">{{t.user}}</td>
            <td class="data">{{t.points}}</td>
            <td class="data">{{t.type}}</td>
            <td class="data">{{t.remarks}}</td>
            <td class="data">{{t.date}}</td>
            <td class="data">
              <q-btn color="red" @click="del(t.key)" >Delete</q-btn>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </q-page>
</template>

<script>
  import axios from "axios";
  export default {
    name: 'PageIndex',
    data() {
      return {
        tnx: {}
      }
    },
    mounted() {
      axios.get('https://sdi-api.deta.dev/tnx').then(r => {
        console.log(r.data.items);
        this.tnx = r.data.items
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
  url: 'https://sdi-api.deta.dev/trns',
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

        axios.post('https://sdi-api.deta.dev/user-status', { "key": key }).then(r => {
          console.log(r.data.items);
          this.user = r.data.items

        })

      }
    }
  }
</script>

<style scoped>
  .head {
    padding: 5px;
    background-color: #f03232;
    color: white;
    border-radius: 5px;
  }

  .data {
    padding: 5px;
    background-color: #ffb6b6;
    color: rgb(200, 60, 35);
    border-radius: 5px;
  }

  .head1 {
    padding: 5px;
    background-color: #59950a;
    color: white;
    border-radius: 5px;
  }

  .data1 {
    padding: 5px;
    background-color: #aeeea2;
    color: rgb(63, 101, 13);
    border-radius: 5px;
  }
</style>