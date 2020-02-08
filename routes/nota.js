import express from 'express';

const router = express.Router();

import Nota from '../models/nota';

router.post('/nueva-nota', async (req, res) => {
    const body = req.body;
    try {
        const notaDb = await Nota.create(body);
        res.status(200).json(notaDb);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'ocurrio un error',
            error
        })
    }
});

router.get('/nota/:id', async (req, res) => {
    const notaId = req.params.id;
    try {
        const notaDb = await Nota.findOne({ _id: notaId });
        console.log(notaDb);
        res.json(notaDb);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'ocurrio un error',
            error
        })
    }
})

module.exports = router;