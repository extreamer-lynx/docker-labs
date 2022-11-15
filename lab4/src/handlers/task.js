const {
    Router
} = require('express')
const userMiddleware = require('../middleware/auth')
const Task = require('../models/Task')

const router = Router()

router.post("/add",userMiddleware, async (req, res) => {
    try {

        if (!req.body.description) {
            return res.status(400).json({
                message: 'Некорректное описание'
            })
        }

        const task = new Task({description: req.body.description, userId: req.user.userId})

        await task.save()

        res.status(201).json({
          message: 'Задача создана'
        })
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})

router.delete("/:id",userMiddleware, async (req, res) => {
    try {
        await Task.deleteOne({
            _id: req.params.id
        })
        res.status(200).json()
    } catch (e) {
        console.log(e.message)
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})

router.put("/:id",userMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(
            req.params.id
        )
        await Task.updateOne({_id: req.params.id}, {complete: !task.complete})
        res.status(200).json()
    } catch (e) {
        console.log(e.message)
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})


router.post("/:id",userMiddleware, async (req, res) => {
    try {
        if(!req.body.complete)
        {
            return res.status(400).json({
                message: 'No complete value'
            })
        }
        if(!req.body.description)
        {
            return res.status(400).json({
                message: 'No description value'
            })
        }
        await Task.updateOne({_id: req.params.id}, {complete: req.body.complete})
        res.status(200).json()
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})

router.get("/*",userMiddleware, async (req, res) => {
    try {
        res.status(200).json(await Task.find({userId: req.user.userId}))
    } catch (e) {
        res.status(500).json({
            message: 'Ошибка в запросе'
        })
    }
})

module.exports = router