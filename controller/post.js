const { Post } = require('../model/Post');
const { User } = require('../model/User');
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');
const { uploadImg } = require('../middleware/multer')
const fitnesscenterController = require('./fitnesscenter');
const matchController = require('./match');
const reviewController = require('./review');
const { replaceS3toCloudFront } = require('../config/aws_s3');
const { originAgentCluster } = require('helmet');
// cloudwatch

const postController = {
  /**
  * @path {GET} http://localhost:8000/v1/posts/
  * @description 사용자와 연관된 모든 매칭글을 조회하는 GET Method
  */
  getAllPosts: async (req, res) => {
    try {
      let { page, limit = 10 } = req.query;

      if (req.query.page) {
        page = parseInt(req.query.page);
      }
      else {
        page = 1;
        // Should Change
        limit = 100;
      };

      const options = {
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
      await Post.paginate({is_deleted: false, user_id: { $ne: req.user.id }}, options, (err, result)=>{
        console.log(result);
        ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result.docs, 'SuccessOK', STATUS_CODE.SuccessOK);
      });
    } catch (error) {
      console.error(error);
      ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },

  getMyPost: async (req, res) => {
    try {
      const {
        params: { userId },
      } = req;
      const posts = await Post.find({ is_deleted: false, user_id: userId });
      posts.forEach((post) => {
        post.post_img = replaceS3toCloudFront(post.post_img)
      })
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](posts, 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
    }
  },
  /**
  * @path {GET} http://localhost:8000/v1/posts/:postId
  * @description 사용자와 연관된 특정 매칭글을 조회하는 GET Method
  */
  getOnePost: async (req, res) => {
    try {
      const {
        params: { postId },
      } = req;
      const post = await Post.find({ _id: postId, is_deleted: false });
      post.forEach((post) => {
        post.post_img = replaceS3toCloudFront(post.post_img)
      })
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
      const center_id = await fitnesscenterController.getFitnessCenterId(promise_location);
      const post = await Post.create({
        user_id,
        location_id,
        post_fitness_part,
        post_title,
        promise_location: center_id,
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
      post.post_img = replaceS3toCloudFront(post.post_img);
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](post, 'SuccessOK', STATUS_CODE.SuccessOK);
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
  },

  uploadPostImg: async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findByIdAndUpdate(postId, { post_img: replaceS3toCloudFront(req.file.location), post_original_img: req.file.location} ,{ new: true, runValidators: true });
      return ResponseManager.getDefaultResponseHandler(res)['onSuccess'](replaceS3toCloudFront(req.file.location), 'SuccessOK', STATUS_CODE.SuccessOK);
    } catch (error) {
      console.log(error)
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    };
  },

  deleteManyPostByUser: async (user_id) => {
    try {
      const result = await Post.updateMany({ user_id: user_id }, { is_deleted: true });
      return result;
    } catch (e) {
      console.log(e)
      return (e)
    }
  },
  makeUserUrl: async (req, res) => {
    try{
      const posts = await Post.find().populate('promise_location');
      ResponseManager.getDefaultResponseHandler(res)['onSuccess'](posts, 'SuccessOK', STATUS_CODE.SuccessOK);
   
    }catch(err){
      ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
    }
  },

    /**
  * @path {GET} http://localhost:8000/v1/posts/
  * @description 사용자와 연관된 모든 매칭글을 조회하는 GET Method
  */
     getAllPostsWithNoLogin: async (req, res) => {
      try {
        let { page, limit = 10 } = req.query;
  
        if (req.query.page) {
          page = parseInt(req.query.page);
        }
        else {
          page = 1;
          // Should Change
          limit = 100;
        };
  
        const options = {
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
          ResponseManager.getDefaultResponseHandler(res)['onSuccess'](result.docs, 'SuccessOK', STATUS_CODE.SuccessOK);
        });
      } catch (error) {
        console.error(error);
        ResponseManager.getDefaultResponseHandler(res)['onError']('ClientErrorNotFound', STATUS_CODE.ClientErrorNotFound);
      }
    },
  
}

module.exports = postController;