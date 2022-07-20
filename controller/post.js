const { Post } = require('../model/Post');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');

const postController = {
  /**
  * @path {GET} http://localhost:8000/v1/posts/
  * @description 사용자와 연관된 모든 매칭글을 조회하는 GET Method
  */
  // user_id 추가
  getAllPosts: async (req, res) => {
    try {
      const { body: { userId } } = req
      const posts = await Post.find({ user_id: userId, is_deleted: false });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](posts, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },
  /**
  * @path {GET} http://localhost:8000/v1/posts/:postId
  * @description 사용자와 연관된 특정 매칭글을 조회하는 GET Method
  */
  // user_id 추가
  getOnePost: async (req, res) => {
    try {
      const {
        params: { postId },
      } = req;
      const post = await Post.find({ _id: postId, is_deleted: false });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](post, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },

  /**
  * @path {POST} http://localhost:8000/v1/posts
  * @description 특정 매칭글을 등록하는 POST Method
  */
  writePost: async (req, res) => {
    try {
      const {
        body: { user_id, location_id, post_fitness_part, post_title, promise_location, promise_date, post_img, post_main_text },
      } = req;
      const post = await Post.create({
        user_id,
        location_id,
        post_fitness_part,
        post_title,
        promise_location,
        promise_date,
        post_img,
        post_main_text
      });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](post, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  /**
  * @path {PATCH} http://localhost:8000/v1/posts/:postId
  * @description 특정 매칭글을 수정하는 PATCH Method
  */
  updatePost: async (req, res) => {
    try {
      const {
        params: { postId }
      } = req;
      const post = await Post.findByIdAndUpdate(postId, req.body, { new: true, runValidators: true });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](post, 'SuccessCreated', STATUS_CODE.SuccessCreated);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

  /**
  * @path {DELETE} http://localhost:8000/v1/posts/:postId
  * @description 특정 매칭글을 삭제하는 PATCH Method
  */
  deletePost: async (req, res) => {
    try {
      const {
        params: { postId }
      } = req;
      const post = await Post.findByIdAndUpdate(postId, { is_deleted: true }, { new: true, runValidators: true });
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](post, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  }

}

module.exports = postController;