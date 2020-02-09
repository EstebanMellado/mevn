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
        });
    }
});

router.get('/nota/:id', async (req, res) => {
    const notaId = req.params.id;
    try {
        const notaDb = await Nota.findOne({ _id: notaId });
        res.json(notaDb);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'ocurrio un error',
            error
        });
    }
});

router.get('/notas', async (req, res) => {
    try {
        const notasDb = await Nota.find();
        res.json(notasDb);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'ocurrio un error',
            error
        });
    }
});

router.delete('/nota/:id', async (req, res) => {
    const notaId = req.params.id;
    try {
        const notaDb = await Nota.findByIdAndDelete({ _id: notaId });
        if (!notaDb) {
            res.status(400).json({
                mensaje: 'no se encontro la nota',
                error: error
            });
        }
        res.json(notaDb);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'ocurrio un error',
            error
        });
    }
});

router.put('/nota/:id', async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const notaDb = await Nota.findByIdAndUpdate(
            _id,
            body,
            { new: true }
        );

        if (!notaDb) {
            res.status(400).json({
                mensaje: 'no se encontro la nota',
                error
            });
        }

        res.json(notaDb);
    } catch (error) {
        return res.status(500).json({
            mensaje: 'ocurrio un error',
            error
        });
    }
});

module.exports = router;