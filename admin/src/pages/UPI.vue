<template>
  <q-page class="">

    <h5 class="text-center text-accent">UPIs</h5>



    <div style="margin:25px; width: fit-content; overflow: scroll; display:flex; justify-content: space-between; ">
      <div style="width: 50%;">
        <div class="q-gutter-sm">
          <q-radio v-model="grp" val="A" label="A" />
          <q-radio v-model="grp" val="B" label="B" />
          <q-radio v-model="grp" val="C" label="C" />
          <q-radio v-model="grp" val="D" label="D" />
          <q-radio v-model="grp" val="E" label="E" />
        </div>
        <q-input v-model="upi" label="Upi" stack-label  />
        <div style="display: flex; justify-content: space-between;">
          <q-btn style="width: 45%; margin: 5px;" @click="addUpi()" color="purple" label="ADD" />
          <q-btn  style="width: 45%; margin: 5px;" @click="saveUpi()" color="green" label="Save" />
        </div>
        <br>
      </div>

      <table style="width: max-content; overflow: scroll; width:50% ;">
        <tr>
          <th class="head">Group</th>
          <th class="head">UPIs</th>
        </tr>
        <tr v-for="u,i in upiObj" :key="u">
          <td class="data text-center">
            {{i}}
          </td>
          <td class="data">
            <ol>
              <li v-for="k,p in u" :key="k" class="flex" style="justify-content:space-between; border-bottom:1px solid #1976D2;"> 
                  <span>{{k}}</span><span class="text-red" @click="remove(i,p)">DELETE</span> 
              </li>
            </ol>
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
  
        grp: 'A',
        upi: '',
        grpList: ['A', 'B', 'C', 'D', 'E'],
        upiObj: {}
      }
    },
    mounted() {
      axios.get('https://sdi-api.deta.dev/upi').then(r => {
        console.log(r.data);
        this.upiObj = r.data.upi
      })
    },
    methods: {
      remove(g,i){
        let a = this.upiObj[g];
        a.splice(i,1);
        this.upiObj[g]=a
        this.$forceUpdate();
      },
      saveUpi(){
        axios.post('https://sdi-api.deta.dev/upi', {"upi":this.upiObj}).then(r => {
         console.log(r.data.items);
        this.upiObj = r.data.upi
       
      })
      },
      addUpi() {
        if(this.upi!=''){
        if (this.upiObj[this.grp] == undefined) {
          this.upiObj[this.grp] = [this.upi];
        }
        else {
          this.upiObj[this.grp].push(this.upi)
        }}
        this.upi=""

        console.log(this.upiObj);

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