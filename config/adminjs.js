const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')
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

AdminJS.registerAdapter(AdminJSMongoose)

const adminJs = new AdminJS({
    resources: [User, Appointment, Chatroom, FitnessCenter, Location, Post, PushSchedule, ReportedPost, ReportedUser, Review, UserTrace, ReviewCandidate, FitnessPart],
    dashboard: {
        component: AdminJS.bundle('./my-dashboard-component')
    },
    rootPath: '/admin'


})
const adminRouter = AdminJSExpress.buildRouter(adminJs)


module.exports = {
    adminJs,
    adminRouter
}