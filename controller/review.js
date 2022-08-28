const { Review } = require('../model/Review');
const { Appointment } = require('../model/Appointment');
const { ReviewCandidate } = require('../model/ReviewCandidate');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const reviewController = {
  /**
   * @path {GET} http://fitmate.co.kr/v1/reviews/candidates
   * @description 리뷰 후보를 제공하는 GET Method
   */
  getReviewCandidates: async (req, res) => {
    try {
      const reviewCandidates = await ReviewCandidate.find({});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](reviewCandidates, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }

  },
  /**
  * @path {POST} http://fitmate.co.kr/v1/reviews/candidates
  * @description 리뷰 후보를 등록하는 POST Method
  */
  writeReviewCandidate: async (req, res) => {
    try {
      const {
        body: { candidate_body },
      } = req;
      const review = await Review.create({
        candidate_body
      });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](review, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  /**
  * @path {POST} http://localhost:8000/v1/reviews/
  * @description 리뷰를 등록하는 POST Method
  */
  writeReview: async (req, res) => {
    try {

      console.log("Fine");

      const {
        body: { review_recv_id, user_rating, review_body, review_candidates, appointmentId },
      } = req;

      const review = await Review.create({
        review_send_id: req.user.id,
        review_recv_id: review_recv_id,
        user_rating: user_rating,
        review_body: review_body,
        review_candidates: review_candidates
      });

      await Appointment.updateOne({ _id: appointmentId }, { $set: { isReviewed: true } });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](review, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {

      console.log('\n', error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  /**
  * @path {GET} http://fitmate.co.kr/v1/reviews/:review_recv_id
  * @description 특정 사용자의 리뷰를 조회하는 GET Method
  */
  getOneReview: async (req, res) => {
    try {
      const {
        params: { review_recv_id },
      } = req;
      const review = await Review.find({ "review_recv_id": review_recv_id }).populate('review_send_id').populate('review_candidates');
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](review, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.error(error);
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },
  /**
  * @path {DELETE} http://fitmate.co.kr/v1/reviews/:review_id
  * @description 특정 리뷰를 삭제하는 DELETE Method
  */
  deleteOneReview: async (req, res) => {
    try {
      const {
        params: { review_id },
      } = req;
      const review = await Review.deleteOne({ "_id": review_id });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](review, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },
  deleteManyReviewByUser: async (user_id) => {
    try {
      const result = await Review.updateMany({ $or: [{ 'review_recv_id': user_id }, { 'review_send_id': user_id }] }, { is_deleted: true });
      return result
    } catch (e) {
      console.log(e)
      return (e)
    }
  }
};
module.exports = reviewController;