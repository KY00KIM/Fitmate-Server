const { Post } = require('../model/Post');
const { FitnessCenter } = require('../model/FitnessCenter');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const {User} = require("../model/User");
const {FitnessCenterReview} = require("../model/FitnessCenterReview");

const visitorController = {
    getPosts: async (req, res) => {
        try {
            let { page, limit = 10 } = req.query;

            if (req.query.page) {
                page = parseInt(req.query.page);
            }
            else {
                page = 1;
                // Should Change
                limit = 10;
            };

            let options = {
                page: page,
                limit: limit,
                populate:
                    [
                        {
                            path : 'user_id',
                            select : {user_nickname : 1, user_profile_img : 1}
                        },
                        {
                            path : 'promise_location',
                        }
                    ],
                collation: {
                    locale: 'en',
                },
                sort: { createdAt: -1 },
            };
            await Post.paginate({is_deleted: false}, options, (err, result)=>{
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
            });
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
    },
    getFitnessCenter: async (req, res) => {
        try{
            let { page, limit = 10 } = req.query;
            if (page) {
                page = parseInt(req.query.page);
            }
            else {
                page = 1;
                // Should Change
                limit = 10;
            };

            const options = {
                page: page,
                limit: limit
            };
            var aggregate = await User.aggregate([
                { "$group": {
                        "_id": '$fitness_center_id',
                        "userCount": { "$sum": 1 }
                    }},

                { "$sort": { "userCount": -1 } }
            ]);

            if(req.query.first_longitude && req.query.first_latitude && req.query.second_longitude && req.query.second_latitude){
                const first_longitude = parseInt(req.query.first_longitude);
                const second_longitude = parseInt(req.query.second_longitude);
                const first_latitude = parseInt(req.query.first_latitude);
                const second_latitude = parseInt(req.query.second_latitude);
                if(first_latitude > second_latitude || first_longitude > second_longitude){
                    return ResponseManager.getDefaultResponseHandler(res)['onError'](
                        {first_latitude, second_latitude, first_longitude, second_longitude},
                        'first is bigger than second', STATUS_CODE.ClientErrorBadRequest
                    );
                }
                let result = await FitnessCenter.aggregatePaginate({$and: [
                        {"fitness_longitude": {"gte":first_longitude}},
                        {"fitness_longitude": {"lte":second_longitude}},
                        {"fitness_latitude": {"gte":first_latitude}},
                        {"fitness_latitude": {"lte":second_latitude}}
                    ]}, options);

                result.userCount = [];
                for(let i = 0; i < result.docs.length; ++i){
                    let fitnessCenter = result.docs[i];
                    const reviews = await FitnessCenterReview.find({center_id: fitnessCenter._id});
                    result.docs[i].reviews = reviews;
                    const searchResult = aggregate.find(o => o._id == fitnessCenter._id);
                    if(searchResult){
                        result.userCount.push({'centerId':searchResult['_id'], 'counts':searchResult['userCount']});
                    }else{
                        result.userCount.push({'centerId': fitnessCenter._id, 'counts': 0})
                    }
                };

                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
            }else{
                let result = await FitnessCenter.aggregatePaginate(aggregate, options);

                result.userCount = [];
                result.docs.forEach((fitnessCenter) => {
                    const searchResult = aggregate.find(o => o._id == fitnessCenter._id);
                    if(searchResult){
                        result.userCount.push({'centerId':searchResult['_id'], 'counts':searchResult['userCount']});
                    }else{
                        result.userCount.push({'centerId': fitnessCenter._id, 'counts': 0})
                    }
                });
                ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
            }
        }catch(error){
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'Fitness Center Error', STATUS_CODE.ClientErrorBadRequest);
        }
    }
}

module.exports = visitorController;