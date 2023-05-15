<template>

  <q-page class="">
    <q-header elevated>
      <q-toolbar>
        <!-- <q-btn
        v-if="show"
          flat
          dense
          round
          label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        /> -->

        <q-toolbar-title>
          Network King
        </q-toolbar-title>

        <div style="float: right;">

          <q-btn-dropdown color="black" :label="show">
            <q-list>
              <q-item clickable v-close-popup @click="show='user'; tree={}; filter='';">
                <q-item-section>
                  <q-item-label>User</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="show='recharge'">
                <q-item-section>
                  <q-item-label>Recharge</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="show='withdraw'">
                <q-item-section>
                  <q-item-label>Withdraw</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>


      </q-toolbar>
    </q-header>
    <h5 v-if="show=='user'" class="text-center text-accent">USER</h5>
    <h5 v-if="show=='recharge'" class="text-center text-accent">RECHARGE</h5>
    <h5 v-if="show=='withdraw'" class="text-center text-accent">WITHDRAW</h5>

    <div v-if="show=='user'" style="margin:25px; width: fit-content; overflow: scroll;">
      <table style="width: max-content; overflow: scroll;">
        <tr>
          <th class="head">Sr. No.</th>
          <th class="head">Code</th>
          <th class="head">Mobile</th>
          <th class="head">Name</th>
          <th class="head">Refer By</th>
          <th class="head">Refer To</th>
          <th class="head">Fee</th>
          <th class="head">Fee Credit</th>
          <th class="head">Earn Credit</th>
          <th class="head">UPI</th>
          <th class="head">#</th>
          <th class="head">#</th>
          <th class="head">#</th>
        </tr>
        <tr v-for="u,i in user" :key="u.key">
          <td class="data">{{i+1}}</td>
          <td class="data" >{{u.key}}</td>
          <td class="data">{{u.mobile}}</td>
          <td class="data">{{u.name}}</td>
          <td class="data">{{u.refer_by}}</td>
          <td class="data">

            <div v-for="i in u.refer_to" :key="i.code">{{
              i.code+" - - - - - "+i.name
              }}</div>

          </td>
          <td class="data">{{u.fee?'PAID':'UNPAID'}}</td>
          <td class="data">{{u.credit.recharge}}</td>
          <td class="data">{{u.credit.earn}}</td>
          <td class="data">{{u.upi}}</td>
          <td @click="getLevelone(u)" class="data" style="color: palevioletred; font-weight: bold;"> Click to get levels </td>
          <td @click="show='recharge'; filter=u.key" class="data" style="color: rgb(42, 139, 7); font-weight: bold;"> Recharge Details </td>
          <td @click="show='withdraw'; filter=u.key" class="data" style="color: rgb(222, 11, 11); font-weight: bold;"> Withdraw Details </td>
        </tr>
      </table>
    </div>

    <div v-if="show=='user'" style="margin:25px; width: fit-content; overflow: scroll;">
      <table style="width: max-content; overflow: scroll;">
        <tr>
          <th class="head" style="width: 100px;">Level</th>
          <th class="head">Members</th>
        </tr>
        <tr v-for="t,o in tree" :key="o" v-show="t.length">
          <td class="data" style="width: 100px; font-size: xx-large;">{{o}}</td>
          <td class="data"><ol>
              <li v-for="x in t" :key="x"><b style="margin: 10px;">{{x}}</b></li>
            </ol>
          </td>
        </tr>
      </table>
    </div>


    <div v-if="show=='recharge'" style="margin:25px; width: fit-content; overflow: scroll;">
      <table style="width: max-content; overflow: scroll;">
        <tr>
          <th class="head">Sr. No.</th>
          <th class="head">Date</th>
          <th class="head">User Id</th>
          <th class="head">User Mobile</th>
          <th class="head">Refs</th>
          <th class="head">Status</th>
          <th class="head">Approved on</th>
          <th class="head">Activation Link</th>
          <th class="head">#</th>
          <th class="head">#</th>
        </tr>
        <tr v-for="r,i in recharge" :key="r.key" v-show="filter==r.user_id || filter==''">
          <td class="data">{{i+1}}</td>
          <td class="data">{{r.date}}</td>
          <td class="data">{{r.user_id}}</td>
          <td class="data">{{r.mobile}}</td>
          <td class="data">{{r.ref}}</td>

          <td class="data">{{r.status?"APPROVED":"UNAPPROVED"}}
          </td>
          <td class="data">{{r.approved_on}}</td>
         <td class="data"> <a :href="getWAlink(r.mobile,r.user_id)">Click</a>
          </td>
          <td class="data">
            <q-btn @click="Rec(r.key)" style="background:green; color:white;" v-if="!r.status">Approve</q-btn>
          </td>

          <td class="data">
            <q-btn @click="RecD(r.key)" style="background:red; color:white;" v-if="!r.status">Declined</q-btn>
          </td>
        </tr>
      </table>
    </div>

    <div v-if="show=='withdraw'" style="margin:25px; width: fit-content; overflow: scroll;">
      <table style="width: max-content; overflow: scroll;">
        <tr>
          <th class="head">Sr. No.</th>
          <th class="head">Date</th>
          <th class="head">User Id</th>
          <th class="head">UPI</th>
          <th class="head">Points</th>
          <th class="head">Status</th>
          <th class="head">Approved on</th>
          <th class="head">#</th>
        </tr>
        <tr v-for="w,i in withdraw" :key="w.key" v-show="filter==w.user_id || filter==''">
          <td class="data">{{i+1}}</td>
          <td class="data">{{w.date}}</td>
          <td class="data">{{w.user_id}}</td>
          <td class="data">{{w.upi}}</td>
          <td class="data">{{w.points}}</td>
          <td class="data">{{w.status?"PAID":"UNPAID"}}
          </td>
          <td class="data">{{w.approved_on}}</td>
          <td class="data">
            <q-btn @click="Wid(w.key)" style="background:pink; color:red;" v-if="!w.status">Approve</q-btn>
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
        user: {},
        recharge: {},
        withdraw: {},
        show: "user",
        tree: {},
        filter:'',
      }
    },
    mounted() {
      axios.get('https://api.network-king.in/users').then(r => {
        // console.log(r.data.items);
        this.user = r.data.items
      })

      axios.get('https://api.network-king.in/recharge').then(r => {
        // console.log(r.data.items);
        this.recharge = r.data.items
      })

      axios.get('https://api.network-king.in/withdraw').then(r => {
        // console.log(r.data.items);
        this.withdraw = r.data.items
      })
    },
    methods: {
      getWAlink(number,key){
        let code = key.split("").reverse().join("");
        let text = encodeURI("Your Network-king account activation code is *"+code+"*")
        let url = "https://wa.me/91"+number+"?text="+text
        return url
      },
      getLevelone(udata) {
        this.tree = {}
        this.$forceUpdate();
        let userData = udata;
        let us = []

        userData.refer_to.forEach(element => {
          us.push(element.code);
        });
        this.tree[0] = [userData.key];
        if (us != []) {
          this.tree[1] = us;
          this.getTree(us, 2)
        }

      },
      getTree(key, i) {
        this.tree[i] = [];
        let trr = []
        key.forEach(async (k) => {
          this.$forceUpdate();
          axios.get('https://api.network-king.in/user/' + k).then((u) => {
            let dt = u;
            dt.data.refer_to.forEach(e => {
              trr.push(e.code)
            });
            this.tree[i] = trr;
            this.$forceUpdate();
            if (i + 1 < 4) {
              this.getTree(trr, i + 1);
            }
            else {
              this.load = true;
            }
          })
        });
        this.$forceUpdate();
      },
      getComm() {
        let t = 0
        this.user.forEach(d => {
          t = t + parseFloat(d.wallet.earn_commission)
        })
        return t.toFixed(2);
      },
      Rec(key) {
        axios.post("https://api.network-king.in/recharge-request-approved", { "k": key }).then((d) => {
          console.log(d);
          this.recharge = d.data.items;
          this.$forceUpdate();
          // location.reload();
        })
      },
      RecD(key) {
        axios.post("https://api.network-king.in/recharge-request-dec", { "k": key }).then((d) => {
          console.log(d);
          this.recharge = d.data.items;
          this.$forceUpdate();
          // location.reload();
        })
      },
      Wid(key) {
        axios.post("https://api.network-king.in/withdraw-request-approved", { "k": key }).then((d) => {
          console.log(d);
          this.withdraw = d.data.items;
          this.$forceUpdate();
          // location.reload();
        })
      },
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