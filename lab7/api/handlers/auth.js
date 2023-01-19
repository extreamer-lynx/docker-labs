'use strict'
const {
  Router
} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {
  check,
  validationResult
} = require('express-validator')
const User = require('../models/User')
const userMiddleware = require('../middleware/auth')

const router = Router()

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
    .isLength({
      min: 3
    }),
    check('age', 'Не верный возраст').exists(),
    check('name', 'Введите имя').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }

      const {
        email,
        password,
        name,
        age
      } = req.body

      const candidate = await User.findOne({
        email
      })
      if (candidate) {
        return res.status(400).json({
          message: 'Такой пользователь уже существует'
        })
      }

      const candidateName = await User.findOne({
        name
      })
      if (candidateName) {
        return res.status(400).json({
          message: 'Такой пользователь уже существует'
        })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({
        email,
        password: hashedPassword,
        name,
        age
      })

      await user.save()

      res.status(201).json({
        message: 'Пользователь создан'
      })

    } catch (e) {
      console.log(e.message);
      res.status(500).json({
        message: 'Что-то пошло не так, попробуйте снова'
      })
    }
  })

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при входе в систему'
        })
      }

      const {
        email,
        password
      } = req.body

      const user = await User.findOne({
        email
      })

      if (!user) {
        return res.status(400).json({
          message: 'Пользователь не найден'
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({
          message: 'Неверный пароль, попробуйте снова'
        })
      }

      const token = jwt.sign({
          userId: user.id,
          userAgent: req.headers['user-agent']
        },
        config.get('jwt'), {
          expiresIn: '7d'
        }
      )
        let sessionList = user.session
        sessionList.push(token)

      await User.updateOne({
        _id: user.id

      }, {
        session: sessionList
      })

      return res.status(201).json({
        token,
        userId: user.id,
        name: user.name
      })

    } catch (e) {
      console.log(e.message)
      res.status(500).json({
        message: 'Что-то пошло не так, попробуйте снова'
      })
    }
  })

router.delete('/logout', userMiddleware, async (req, res) => {
  try {
    const user = await User.findById({
      _id: req.user.userId
    })

    await User.updateOne({
      _id: req.user.userId
    }, {
      session: user.session.filter((value) => value != req.headers.authorization.split(' ')[1])
    })
    res.status(200).json({"message":"logout"})
  } catch (e) {
    res.status(500).json({
      message: 'Ошибка в запросе'
    })
  }
})

router.delete('/logoutAll', userMiddleware, async (req, res) => {
  try {
    await User.updateOne({
      _id: req.user.userId
    }, {
      session: [req.headers.authorization.split(' ')[1]]
    })
    res.status(200).json({"message":"logout"})
  } catch (e) {
    res.status(500).json({
      message: 'Ошибка в запросе'
    })
  }
})

module.exports = router