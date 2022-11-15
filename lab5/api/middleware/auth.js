const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                message: 'Нет авторизации'
            })
        }

        const decoded = jwt.verify(token, config.get('jwt'))

        const user = await User.findOne({
            _id: decoded.userId
        })

        if (user.session.filter((value) => value == token).length == 0) {
            return res.status(401).json({
                message: 'Не верный токен'
            })
        }

        if(decoded.userAgent != req.headers['user-agent']) {
            return res.status(401).json({
                message: 'Не верный токен'
            })
        }

        req.user = decoded
        next()

    } catch (e) {
        res.status(401).json({
            message: 'Нет авторизации'
        })
    }
}