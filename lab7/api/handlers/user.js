const {
    Router
} = require('express')
const User = require('../models/User')
const userMiddleware = require('../middleware/auth');
const router = Router()

router.get('/me', userMiddleware, async (req, res) => {
    try {
        res.status(200).json(await User.findOne({
            _id: req.user.userId
        }))
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})

router.post('/change', userMiddleware, async (req, res) => {
    try {
        let arr = {};
        for (let pair in req.body) {
            if (req.body[pair] !== "") {
                arr[pair] = req.body[pair]

            }
        }
        res.status(201).json(await User.updateOne({
            _id: req.user.userId
        }, {
            $set: arr
        }))

    } catch (e) {
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})

router.delete('/me', userMiddleware, async (req, res) => {
    try {
        await User.deleteOne({
            _id: req.user.userId
        })
        res.status(200)
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})

router.get('/:id', userMiddleware, async (req, res) => {
    try {
        const {
            name,
            age
        } = await User.findOne({
            _id: req.user.userId
        })
        res.status(200).json({
            name,
            age
        })
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})

module.exports = router