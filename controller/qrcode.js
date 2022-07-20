
const ResponseManager = require('../config/response');
const STATUS_CODE = require('../config/http_status_code');


const qrcodeController = {
    /**
     * @path {GET} http://fitmate.co.kr/v1/qrcode/:qr
     * @description 사용자의 qrcode 요청
     */
      getUserQrcode: async (req, res) => {
        try {
            Qrcode.toDataURL(req.params.qr , function(err , url) {
                // res.send(url);
                var data = url.replace(/.*,/ , '');
                console.log(data);
                var img = new Buffer(data , 'base64');
                res.writeHead(200 , {'Content-Type':'image/png'});
                res.end(img);
            });
            //ResponseManager.getDefaultResponseHandler(res)['onSuccess'](reviewCandidates, 'SuccessOK', STATUS_CODE.SuccessOK);
        } catch (error) {
            ResponseManager.getDefaultResponseHandler(res)['onError'](error, 'ClientErrorBadRequest', STATUS_CODE.ClientErrorBadRequest);
        }    
      },
  };
  module.exports = qrcodeController;