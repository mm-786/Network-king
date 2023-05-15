<template>
  <q-page class="">

    <h5 class="text-center text-accent">PRODUCT</h5>
    <div v-if="imgUp" style="display:flex; justify-content: space-between;">
      <div v-if="imgUp" style="margin-left:25px; width:40%">

      <h6 class="text-center text-red">ADD PRODUCT IMG</h6>
       <q-file outlined v-model="files">
     
      </q-file>
      <span class="text-red">click save after new image is visible</span><br>
         <q-btn @click="imgsave()" color="blue">UPLOAD</q-btn> &nbsp;&nbsp;&nbsp;
            <q-btn @click="editadd=false; imgUp=false; add(); isEdit=false;" color="green">SAVE</q-btn> &nbsp;&nbsp;&nbsp;
      <q-btn @click="editadd=false; imgUp=false;  clr(); isEdit=false;" color="red">CANCEl</q-btn>
      
      </div>
       <div style="margin-right:25px; width:40%">

        <q-img :src="img"/>
      </div>
      </div>

    <div v-if="editadd">

      <h6 class="text-center text-red">ADD PRODUCT</h6>
      <div style="display:flex; justify-content: space-between;">
        <div style="width:40%; margin-left:25px;">
          <q-input v-if="!isEdit" prefix="SDIP" outlined v-model="key" label="Product Key" placeholder="00" />
          <q-input v-else outlined v-model="key" label="Product Key" readonly />
          <q-input outlined v-model="name" label="Product Name" />
          <q-input outlined v-model="price" label="Product Price" />
          <q-input outlined v-model="validity" label="Product Validity" />
          <q-input outlined v-model="daily_commission" label="Commission" />
          <q-input outlined v-model="total_revenue" label="Purchase Limit" />
        </div>
        <div style="width:40%; margin-right:25px;">
          <q-input type="textarea" outlined v-model="desc" label="Description" />
          <q-input type="textarea" outlined v-model="detail" label="Details" />
          <q-btn @click="add()" color="green">SAVE</q-btn> &nbsp;&nbsp;&nbsp;
          <q-btn @click="editadd=false; clr(); isEdit=false;" color="red">CANCEl</q-btn>
        </div>
      </div>


    </div>
    <div v-if="!editadd && !imgUp">
      <q-btn @click="editadd=true" style="margin-left:25px;" color="blue">ADD Product</q-btn>
      <br><br>
      <div style="margin:25px; width: fit-content; overflow: scroll;">

        <table style="width: max-content; overflow: scroll;">
          <tr>
            <th class="head">Sr. No.</th>
            <th class="head">Product Key</th>
            <th class="head">Name</th>
            <th class="head">Price</th>
            <th class="head">Image</th>
            <th class="head">Commission</th>
            <th class="head">Validity</th>
            <th class="head">Total Revenue</th>
            <th class="head">Purchase Limit</th>
            <th class="head">Description</th>
            <th class="head">Details</th>
            <th class="head">Status</th>
            <th class="head">Op</th>
          </tr>
          <tr v-for="u,i in user" :key="u.key">
            <td class="data">{{i+1}}</td>
           <td class="data">{{u.key}}</td>
            <td class="data">{{u.name}}</td>
            <td class="data">{{u.price}}</td>
            <td class="data">
              <q-btn v-if="u.img==null" @click="tmp(u); imgUp=true;" color="pink">upload img</q-btn>
              <q-img v-else :src="u.img" />
            </td>
            <td class="data">{{u.daily_commission}}</td>
            <td class="data">{{u.validity}}</td>
            <td class="data">{{u.validity * u.daily_commission}}</td>
            <td class="data">{{u.total_revenue}}</td>
            <td class="data" style="max-width:150px;">{{u.desc}}</td>
            <td class="data" style="max-width:150px;">{{u.detail}}</td>
            <td class="data">
              <span v-if="u.status==1">Active</span>
              <span v-if="u.status==0">DeActive</span>
            </td>
            <td class="data">
              <q-btn color="red" @click="chngStatus(u.key)" v-if="u.status==1">DeActive</q-btn>
              <q-btn color="green" @click="chngStatus(u.key)" v-if="u.status==0">Active</q-btn><br /><br />
              <q-btn color="blue" @click="tmp(u); editadd=true; isEdit=true;">EDIT</q-btn> <br /><br />
              <q-btn color="purple" @click="tmp(u); imgUp=true;">EDIT IMG</q-btn><br /><br />
              <q-btn color="red" @click="del(u.key)" >DELETE</q-btn>
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
        user: {},
        editadd:false,
        isEdit:false,
        imgUp:false,
        daily_commission: 0,
        desc: '',
        detail: '',
        img: null,
        name: '',
        price: 0,
        status: 1,
        total_revenue: 0,
        validity: 0,
        key: '',
        files:'',
      }
    },
    mounted() {
      axios.get('https://sdi-api.deta.dev/product').then(r => {
        console.log(r.data.items);
        this.user = r.data.items
      })
    },
    methods: {
      imgsave(){
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('key', '5418d01ef0b2a8bdfc04a65c2955877d');
data.append('image', this.files, this.files.name);

var config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://api.imgbb.com/1/upload',
  data : data
};

axios(config)
.then((response)=> {
  console.log(response.data.data);
  this.img = response.data.data.url;

})
.catch(function (error) {
  console.log(error);
});

        console.log(this.files);
      },
      tmp(d){
        this.daily_commission=d.daily_commission
         this.desc=d.desc
         this.detail=d.detail
          this.img=d.img
         this.name=d.name
          this.price=d.price
          this.status=d.status
          this.total_revenue=d.total_revenue
          this.validity=d.validity
        this.key=d.key
      },
      clr(){
        this.daily_commission=0
         this.desc=''
         this.detail=''
          this.img=null
         this.name=''
          this.price=0
          this.status=1
          this.total_revenue=0
          this.validity=0
        this.key=''
      },
      add() {
        this.key = this.key.replace('SDIP','')
        var data = JSON.stringify({
          daily_commission:this.daily_commission,
          desc:this.desc,
          detail:this.detail,
          img:this.img,
          name:this.name,
          price:this.price,
          status:this.status,
          total_revenue:this.total_revenue,
          validity:this.validity,
          key:"SDIP"+this.key
        });

        var config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://sdi-api.deta.dev/product',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };

        axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            location.reload();
          })
          .catch(function (error) {
            console.log(error);
          });

      },
      del(k){
        
var data = JSON.stringify({
  "key":k
});

var config = {
  method: 'delete',
maxBodyLength: Infinity,
  url: 'https://sdi-api.deta.dev/prodt',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  location.reload();
})
.catch(function (error) {
  console.log(error);
});

      },
      chngStatus(key) {

        axios.post('https://sdi-api.deta.dev/prod-status', { "key": key }).then(r => {
          console.log(r.data.items);
          this.user = r.data.items;
          this.$forceUpdate();
          location.reload()

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