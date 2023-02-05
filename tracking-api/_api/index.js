const express = require('express');
const router = express.Router();
const eTrack = require('./tracking');   
module.exports = router;
 

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
   
    filename: function(req, file, cb) {
        let pre_filename = path.parse(file.originalname).name
            pre_filename = pre_filename.replace(/ /g, "-")
        cb(null, pre_filename+ '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage }) 
  
   

router.get('/shipment/allcouriers', eTrack.findAllCouriers);  
router.get('/shipment/couriers', eTrack.getCouriers);  

//get couriers by tracking number
router.post('/shipment/getcourier', eTrack.findCouriersWithTrackingNo);   

//get timeline by tracking number and courierKey
router.post('/shipment/timeline', eTrack.etrackingAPI);  
 

router.post('/shipment/ocrimg', upload.single('image'), eTrack.OcrImage);  
 
// router.get('/shipment/test', eTrack.test);  



router.post('/thailand-post/timeline', eTrack.ThailandPostTraking);  