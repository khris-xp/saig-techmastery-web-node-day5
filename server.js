const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

const log = async (req, res, next) => {
    console.log('Hello World!');
    next();
}
app.use(log)
app.use(express.json());

try{
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
}catch(error){
    console.log(error);
}

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    }
})

const userModel = mongoose.model('user', userSchema);

let user = []

app.get('/', async (req, res) => {
    res.send(await userModel.find());
});

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.send(await userModel.findById(id));
});

const PORT = process.env.PORT

app.post('/', async (req,res) => {
    const user = await new userModel(req.body).save();
    res.status(201).send(req.body);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});