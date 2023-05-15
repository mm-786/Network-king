const express = require('express');
const cors = require('cors');
const moment = require('moment');
const bodyParser = require('body-parser');
// const crypto = require('crypto');
const { Base, Drive } = require('deta');
const user = Base('user');
const r = Base('recharge');
const w = Base('withdraw');

const nodemailer = require('nodemailer')
const md5 = require("md5");

const app = express();
app.use(bodyParser.json({
    limit: '500mb'
}));


app.use(bodyParser.urlencoded({
    limit: '500mb',
    extended: true
}));
app.use(express.json());
app.use(cors());

app.get('/active/:key',  (req, res) => {
    let id = req.params.key;
    res.redirect('./index.html?'+id)
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'a22.forget.mail@gmail.com',
        pass: 'btmsirofjdhwberb'
    }
});

async function refer(i, r) {
    let i_user = await user.get(i)
    if (r != '') {
        let r_user = await user.get(r);
        if (r_user != undefined) {
            i_user.level = parseInt(r_user.level) + 1;
            r_user.refer_to.push({ name: i_user.name, code: i_user.key });
            await user.put(r_user)
        }
        else {
            i_user.refer_by = null;
        }
    }
    else {
        i_user.refer_by = null;
    }
    await user.put(i_user);
}

async function commission(user_id) {
    for (let index = 0; index < 3; index++) {
        if (user_id != null) {
            const a = await user.get(user_id)
            if (index == 0) {
                a.credit.earn = parseInt(a.credit.earn) + 50;
            }
            a.credit.earn = parseInt(a.credit.earn) + 50;
            await user.put(a)
            user_id = a.refer_by;
        }
        else {
            break;
        }
    }
}

app.get('/', (req, res) => {
    res.send('ok')
});

app.post('/forget-password', async (req, res) => {
    const { username } = req.body;
    var data = await user.fetch({ username: username })
    if (data.count != 0) {
        data = data.items[0]
        const pass = Math.floor(100000 + Math.random() * 900000)
        const enc = md5(pass.toString())
        data.password = enc;
        const fp = await user.put(data)
        var mailOptions = {
            from: 'a22.forget.mail@gmail.com',
            to: data.email,
            subject: 'Your new password for a22 app',
            text: 'Now login in this:- ' + pass + " \n Do not reply on this E-mail address"
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.send(error)
            } else {
                res.status(201).json({ 'message': 'Password is sent to ' + data.email })
            }
        });
    }
    else {
        res.status(404).json({ "message": "not found" })
    }

})


app.put('/change-password/:id', async (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    var data = await user.get(id);
    data.password = password;
    await user.put(data);
    res.status(201).json({ 'result': 'changed' })

})


app.get('/user/:key', async (req, res) => {
    const id = req.params.key;
    const data = await user.get(id);
    res.json(data)

})

app.get('/users', async (req, res) => {
    var data = await user.fetch({ "username?ne": "admin" })
    res.json(data)

})

app.get('/recharge', async (req, res) => {
    var data = await r.fetch()
    res.json(data)
})

app.get('/withdraw', async (req, res) => {
    var data = await w.fetch()
    res.json(data)
})

app.get('/withdraw-user/:key', async (req, res) => {
    const k = req.params.key;
    var data = await w.fetch({"user_id":k});
    res.json(data)
})

app.get('/activemyaccount/:key',  async (req, res) => {
    const str = req.params.key;
    let id = str.split("").reverse().join("");
    const u = await user.get(id)
    u.status = 1;
    var e = new Date();
    e = new Date(e).toLocaleString("en-US", { timeZone: 'Asia/Kolkata' });
    u.updated = e;
    const uu = await user.put(u)
    res.send(uu)
})

app.post('/login', async (req, res) => {
    const { mobile, password } = req.body;
    const data = await user.fetch({ mobile: mobile })
    if (data.count == 1) {
        var usr = data.items[0];
        if (password == usr.password) {
            res.json(usr);
        }
        else {
            res.status(401).json({ "msg": "Invalid Credentials" })
        }
    }
    else {
        res.status(401).send({ "msg": "Invalid Credentials" })
    }
})

app.post('/recharge-request', async (req, res) => {
    const { user_id, ref } = req.body;
    const data = await user.get(user_id);
    // res.send(data)
    data.fee = 1;
    var e = new Date();
    e = new Date(e).toLocaleString("en-US", { timeZone: 'Asia/Kolkata' });
    data.updated = e;
    await user.put(data);
    const status = 0;
    const date = e;
    const approved_on = null;
    const mobile = data.mobile;
    const to = { user_id, ref, mobile, status, date, approved_on };
    const inst = await r.put(to)
    res.send({ inst, data })
})

app.get('/withdraw-request/:key', async (req, res) => {
    // const {user_id} = req.body;
    const user_id = req.params.key
    const data = await user.get(user_id);
    const points = 200;
    var e = new Date();
    e = new Date(e).toLocaleString("en-US", { timeZone: 'Asia/Kolkata' });
    data.updated = e;
    data.credit.earn = parseInt(data.credit.earn) - parseInt(points);
    await user.put(data);
    const upi = data.upi;
    const status = 0;

    const date = e;
    const approved_on = null;
    const to = { user_id, points, status, date, approved_on, upi };
    const inst = await w.put(to)
    res.send(data)
})

app.post('/withdraw-request-approved', async (req, res) => {
    const { k } = req.body;
    const data = await w.get(k);
    data.status = 1;
    data.approved_on = new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata' });
    const a = await w.put(data);
    const dt = await w.fetch();
    res.send(dt)
})

app.post('/recharge-request-approved', async (req, res) => {
    const { k } = req.body;
    const data = await r.get(k);
    data.status = 1;
    data.approved_on = new Date().toLocaleString("en-US", { timeZone: 'Asia/Kolkata' });
    const a = await r.put(data);
    const u = await user.get(data.user_id);
    u.credit.recharge = 500;
    await user.put(u)
    await commission(u.refer_by)
    const dt = await r.fetch();
    res.send(dt)
})

app.post('/recharge-request-dec', async (req, res) => {
    const { k } = req.body;
    const data = await r.get(k);
    data.status = 0;
    data.approved_on = null;
    const u = await user.get(data.user_id);
    u.fee = 0;
    await user.put(u);
    await r.delete(k);
    const dt = await r.fetch();
    res.send(dt)
})


app.post('/register', async (req, res) => {
    let { name, mobile, password, refer_by, upi } = req.body;
    const aluser = await user.fetch({ mobile: mobile });
    if (aluser.count == 0) {
        let level = 0;
        const refer_to = [];
        const credit = {
            recharge: 0,
            earn: 0
        };
        var e = new Date();
        e = new Date(e).toLocaleString("en-US", { timeZone: 'Asia/Kolkata' });
        const created = e;
        const updated = e;
        const fee = 0;
        const status = 0;
        const toCreate = { name, mobile, password, status, upi, refer_by, refer_to, credit, created, updated, fee, level };
        const insertedUser = await user.put(toCreate);
        // const insertedUser0 = await user.put(insertedUser);
        await refer(insertedUser.key, refer_by)
        const iu = await user.get(insertedUser.key)
        res.json(iu);

    }
    else {
        res.status(403).send({ 'msg': 'Mobile number is already registered!' })
    }
})

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
});


// module.exports = app
