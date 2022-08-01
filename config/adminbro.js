const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const { User } = require('../model/User')
const { Appointment } = require('../model/Appointment')
const { Chatroom } = require('../model/Chatroom')
const { Location } = require('../model/Location')
const { Post } = require('../model/Post')
const { PushSchedule } = require('../model/PushSchedule')
const { ReportedPost } = require('../model/ReportedPost')
const { ReportedUser } = require('../model/ReportedUser')
const { Review } = require('../model/Review')
const { ReviewCandidate } = require('../model/ReviewCandidate')
const { UserTrace } = require('../model/UserTrace')
const { FitnessCenter } = require('../model/FitnessCenter')
const { FitnessPart } = require('../model/FitnessPart')
const { PROCESSING } = require('http-status-codes')

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
    resources: [User, Appointment, Chatroom, FitnessCenter, Location, Post, PushSchedule, ReportedPost, ReportedUser, Review, UserTrace, ReviewCandidate, FitnessPart],
    rootPath: '/admin',
})


const ADMIN = {
    email: process.env.ADMINBRO_EMAIL,
    password: process.env.ADMINBRO_PWD
}


const adminBroRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        if (ADMIN.password === password && ADMIN.email === email) {
            return ADMIN
        }
        return null
    },
    cookieName: 'adminBro',
    cookiePassword: 'testtest'
});

// const adminBroRouter = AdminBroExpress.buildRouter(adminBro)


module.exports = { adminBro, adminBroRouter };