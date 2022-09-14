const { Review } = require('../model/Review');
const { Appointment } = require('../model/Appointment');
const { ReviewCandidate } = require('../model/ReviewCandidate');
const { FitnessCenterReview } = require('../model/FitnessCenterReview');
const { FitnessCenterReviewCandidate } = require('../model/FitnessCenterReviewCandidate');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const {ObjectId} = require("mongodb");
const reviewController = {
  /**
   * @path {GET} http://fitmate.co.kr/v1/reviews/candidates
   * @description 리뷰 후보를 제공하는 GET Method
   */
  getReviewCandidates: async (req, res) => {
    try {
      const reviewCandidates = await ReviewCandidate.find({}).lean();
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

      const {
        body: { review_recv_id, user_rating, review_body, review_candidates, appointmentId },
      } = req;

      const review = await Review.create({
        review_send_id: req.user.id,
        review_recv_id: review_recv_id,
        user_rating: user_rating,
        review_body: review_body,
        review_candidates: review_candidates,
        appointment_id: appointmentId
      });

      await Appointment.findByIdAndUpdate(appointmentId, { isReviewed: true }).lean();
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
      const review = await Review.find({ "review_recv_id": review_recv_id })
          .populate('review_send_id')
          .populate('review_candidates')
          .lean();
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
      return result;
    } catch (e) {
      console.log(e)
      return (e)
    }
  },
  getAverageFitnessCenterReview: async (req, res) => {
    try{
      const result = await FitnessCenterReview.aggregate()
          .match({center_id: ObjectId(req.params.fitnesscenterId)});
      if(result.length != 0){
        let data = {}
        data.review_count = result.length;
        data.center_rating = 0;
        data.center_review_count = {
          "6319e2c3821cfa1d84516cd9": 0,
          "6319e2d4821cfa1d84516cdb": 0,
          "6319e3db821cfa1d84516cdd": 0,
          "6319e3fc821cfa1d84516cdf": 0,
          "6319e6e529188e0099d9ec14": 0
        };
        result.forEach((rev)=>{
          data.center_rating += rev.center_rating;
          rev.center_review_by_select.forEach((aa) => {
            data.center_review_count[aa] += 1;
          });
        });
        data.center_rating /= data.review_count;
        // data.center_rating = Math.ceil(data.center_rating);
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](data, 'SuccessOK', STATUS_CODE.SuccessOK);
      }else{
        ResponseManager.getDefaultResponseHandler(res)['onSuccess']({}, 'SuccessNoContent', STATUS_CODE.SuccessOK);
      }
    }catch(error){
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },
  getFitnessCenterReviewByUser: async (req, res) => {
    try{
      const reviews = await FitnessCenterReview.find({center_id:req.params.fitnesscenterId})
          .populate('review_send_id', 'user_nickname user_profile_img')
          .lean();
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](reviews, 'SuccessOK', STATUS_CODE.SuccessOK);
    }catch(error){

    }
  },
  writeFitnessCenterReview: async (req, res) => {
    try{
      const {
        body: { center_rating, center_review, center_review_by_select },
      } = req;

      const findDuplicate = await FitnessCenterReview.find({
        center_id: req.params.fitnesscenterId,
        review_send_id:req.user.id
      }).lean();
      if(findDuplicate.length != 0){
        ResponseManager.getDefaultResponseHandler(res)['onError'](findDuplicate, '이미 해당 피트니스 센터 리뷰를 등록했습니다.', STATUS_CODE.ClientErrorBadRequest);
      }else{
        const result = await FitnessCenterReview.create({
          center_id: req.params.fitnesscenterId,
          review_send_id: req.user.id,
          center_rating:center_rating,
          center_review:center_review,
          center_review_by_select:center_review_by_select
        });
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessCreated', STATUS_CODE.SuccessCreated);
      }
    }catch(error){
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },
  writeFitnessCenterReviewCandidates: async (req, res) => {
    try{
      const result = await FitnessCenterReviewCandidate.create({candidate_body: req.body.candidate});
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'Candidate Review Created', STATUS_CODE.SuccessCreated);
    }catch(error){
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },
  getFitnessCenterReviewCandidates: async (req, res) => {
    try{
      const result = await FitnessCenterReviewCandidate.find().lean();
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result, 'SuccessOK', STATUS_CODE.SuccessOK);
    }catch(error){
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },
};
module.exports = reviewController;