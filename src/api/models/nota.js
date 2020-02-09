import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notaSchema = new Schema({
    name: { type: String, required: [true, 'Nombre obligatorio'] },
    description: String,
    userid: String,
    date: { type: Date, default: Date.now },
    enable: { type: Boolean, default: true }
});

const Nota = mongoose.model('Nota', notaSchema);

export default Nota;