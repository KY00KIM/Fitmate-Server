const Review = require('../model/Review');
const ReviewCandidate = require('../model/ReviewCandidate');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const reviewController = {
    /**
   * @path {GET} http://localhost:8000/v1/reviews
   * @description 사용자의 모든 약속을 조회하는 GET Method
   */
    getReviewCandidates: async (req, res) => {

    }
};

module.exports = reviewController;