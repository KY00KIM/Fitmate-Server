const {Review} = require('../model/Review');
const {ReviewCandidate} = require('../model/ReviewCandidate');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const reviewController = {
    /**
   * @path {GET} http://localhost:8000/v1/reviews/candidates
   * @description 리뷰 후보를 제공하는 GET Method
   */
    getReviewCandidates: async (req, res) => {
        try {
            const reviewCandidates = await ReviewCandidate.find({});
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](reviewCandidates, 'SUCCESS_OK', STATUS_CODE.SUCCESS_OK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
          
    },
    /**
    * @path {POST} http://localhost:8000/v1/reviews/:review_send_id
    * @description 리뷰를 등록하는 POST Method
    */
    writeReview: async (req, res) => {
        try {
            const {
                params: { review_send_id },
                body: { review_recv_id, user_rating, review_body},
              } = req;
            const review = await Review.create({
                review_send_id,
                review_recv_id,
                user_rating,
                review_body
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess']({}, 'SUCCESS_NO_CONTENT', STATUS_CODE.SUCCESS_NO_CONTENT);
          } catch (error) {       
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
          }
    }
};
module.exports = reviewController;