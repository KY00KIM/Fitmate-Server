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
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](reviewCandidates, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }
          
    },
    writeReviewCandidate: async (req, res) =>{
        try {
            const {
                body: {candidate_body },
              } = req;
            const review = await Review.create({
                candidate_body
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](review, 'SuccessCreated', STATUS_CODE.SuccessCreated);
          } catch (error) {       
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
          }
    }
    ,
    /**
    * @path {POST} http://localhost:8000/v1/reviews/:review_send_id
    * @description 리뷰를 등록하는 POST Method
    */
    writeReview: async (req, res) => {
        try {
            const {
                params: { review_send_id },
                body: { review_recv_id, user_rating, review_body, review_candidate},
              } = req;
            const review = await Review.create({
                review_send_id,
                review_recv_id,
                user_rating,
                review_body,
                review_candidate
            });
            ResponseManager.getDefaultResponseHandler(res)['onSuccess'](review, 'SuccessCreated', STATUS_CODE.SuccessCreated);
          } catch (error) {       
            ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
          }
    }
};
module.exports = reviewController;