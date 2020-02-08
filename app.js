const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const history = require('connect-history-api-fallback');
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/mevn';
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(uri, options).then(
    () => { console.log('conectado a mongoDb') },
    err => { err }
);

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/hola', function (req, res) {
    res.send('Hola mundoloco');
});

app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), function () {
    console.log('escuchando puerto', app.get('puerto'));
});
