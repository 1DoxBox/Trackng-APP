const axios = require('axios');
const tesseract = require("tesseract.js")
const endPoint = 'https://fast.etrackings.com/api/v3'
const apiKey = '1eabf263654386183f84fbf0a81feb30c745eafb'
const secretKey = 'ef3bfd37b2befa27473b341a342da2b67388cdf2a79177c0bc3b294d30523be2902d68c049d129d8e73ef6a3c7525af756d85ae962a1482329abd7d50706e53e435491994f9c0c49c07dad'
const header = {
    headers:{
        'Content-Type':'application/json',
        'Etrackings-api-key':apiKey,
        'Etrackings-key-secret':secretKey,
        'Accept-Language':'th'
    }
}
 
///for thailand post api
const TP_key = "APR7U4FqJ7IOP2NLHUR=ZSV~HcTNYzI4S2Z1AVSbMOC7K*O$DJStI:KaL2BsQHAsZnC0GeMMITFHQETaOGHDKXU0YRKfUpLlWQUV";
let TP_token = "";
const TP_endpoint = "https://trackapi.thailandpost.co.th/post/api/v1";
const TP_header = {
    headers: {  
        'Authorization': 'Token '+TP_key, 
        'Content-Type': 'application/json'
    },
}




const fs = require('fs');

const fn = {};
module.exports = fn;
 
  // fixed Couriers
fn.getCouriers = async (req,res,next) => { 
    let data = require("../json/Couriers.json") 
    return res.status(200).send({
        status: true,
        list: data.list
    });  
} 

// get all Couriers  from fast.etracking
fn.findAllCouriers = async (req,res,next) => { 
    await axios.get(`${endPoint}/couriers`, header).then(result => { 
        if(result.data?.meta?.code == 200){
            const list = result.data.data
            return res.status(200).send({
                status:true,
                list
            });  
        }else{
            console.log(result)
            return res.status(200).send({
                status:false,
                list
            });  
        }
    }).catch(err => {
        console.log(err) 
        return res.status(400).send(err)
    }) 
}
  

// OCR an Img with request path
fn.OcrImage = async(req,res,next) => { 
    let myarry = []    
    if(!req.file.path){
        return res.status(200).send({
            track: [], 
            status:false
        });  
    }else{
            tesseract.recognize(
                req.file.path,
                'eng',
                {logger:m=>console.log(m)}
            ).then(({data:{text}})=>{
                var string = text;
                let trackandtrace = / \w\w \d{4} (\d{4} \d|\d{5}}) (\w\w|\d\w\w)| \w\w \d{8} \w{3}| \w\w \d{4} \d{5}\w\w| \w\w\d{9}TH| \w\w \d{9}} TH| \w\w \d{9} TH/g;
                let flash = / (TH|IH)\w{13}| (TH|IH)\w{12}| (TH|IH)\w{11}| (TH|IH)\w{10}/g;
                let jandt = /\d{12}/g;
                let ninjankerry = /[A-Z][A-Z][A-Z][A-Z]\d{9}|[A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z]\d{9}|[A-Z][A-Z][A-Z][A-Z]\w\d{8}/g;
                let kerry = /[A-Z][A-Z][A-Z]\d{12}|[A-Z][A-Z]\w\d{12}|[A-Z][A-Z]\w\d{10}|[A-Z][A-Z][A-Z][A-Z]\w{11}/g;
                let dhl = /[A-Z][A-Z][A-Z][A-Z][A-Z]\d{13}|[A-Z][A-Z][A-Z][A-Z][A-Z][A-Z]\d{14}|[A-Z][A-Z]\d{14}|[A-Z][A-Z][A-Z][A-Z][A-Z]\d{12}/g;
            
            
                if (trackandtrace.exec(string) != null){
                    trackandtrace = / \w\w \d{4} (\d{4} \d|\d{5}}) (\w\w|\d\w\w)| \w\w \d{8} \w{3}| \w\w \d{4} \d{5}\w\w| \w\w\d{9}TH| \w\w \d{9}} TH| \w\w \d{9} TH/g;
                    myarry = string.match(trackandtrace)
                    if(myarry.length){
                        myarry.forEach((trackingno,idx)=>{ 
                            myarry[idx] = trackingno.replace(/0B/g,'OB')  
                        })
                    }  
                    if(myarry.length){
                        myarry.forEach((trackingno,idx)=>{ 
                            myarry[idx] = trackingno.replace(/EDB/g,'ED8')  
                        })
                    }
                    if(myarry.length){
                        myarry.forEach((trackingno,idx)=>{ 
                            myarry[idx] = trackingno.replace(/7H/g,'TH')  
                        })
                    }
            
                } else if (flash.exec(string) != null){   
                    flash = / (TH|IH)\w{13}| (TH|IH)\w{12}| (TH|IH)\w{11}| (TH|IH)\w{10}/g;
                    myarry = string.match(flash)
                    if(myarry.length){
                        myarry.forEach((trackingno,idx)=>{ 
                            myarry[idx] = trackingno.replace(/THO/g,'TH0')  
                        })
                    }
                    if(myarry.length){
                        myarry.forEach((trackingno,idx)=>{ 
                            myarry[idx] = trackingno.replace(/THs|THS/g,'TH5')  
                        })
                    }
                    if(myarry.length){
                        myarry.forEach((trackingno,idx)=>{ 
                            myarry[idx] = trackingno.replace(/IH/g,'TH')  
                        })
                    }
                    
                } else if (dhl.exec(string) != null){ 
                    dhl = /[A-Z][A-Z][A-Z][A-Z][A-Z]\d{13}|[A-Z][A-Z][A-Z][A-Z][A-Z][A-Z]\d{14}|[A-Z][A-Z]\d{14}|[A-Z][A-Z][A-Z][A-Z][A-Z]\d{12}/g;
                    myarry = string.match(dhl)
                    
            
                } else if (ninjankerry.exec(string) != null){   
                    ninjankerry = /[A-Z][A-Z][A-Z][A-Z]\d{9}|[A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z][A-Z]\d{9}|[A-Z][A-Z][A-Z][A-Z]\w\d{8}/g;
                    myarry = string.match(ninjankerry)
            
                  
            
                } else if (kerry.exec(string) != null){   
                    kerry = /[A-Z][A-Z][A-Z]\d{12}|[A-Z][A-Z]\w\d{12}|[A-Z][A-Z]\w\d{10}|[A-Z][A-Z][A-Z][A-Z]\w{11}/g;
                    myarry = string.match(kerry)
                    if(myarry.length){
                        myarry.forEach((trackingno,idx)=>{ 
                            myarry[idx] = trackingno.replace(/SPD/g,'SP0')  
                        })
                    }
                    if(myarry.length){
                        myarry.forEach((trackingno,idx)=>{ 
                            myarry[idx] = trackingno.replace(/BRS/g,'BR5')  
                        })
                    }
            
                } else if (jandt.exec(string) != null){   
                    jandt = /\d{12}/g;
                    myarry = string.match(jandt)
            
                } else {  
                    console.log("No Data")
                }

                if(myarry.length){
                    myarry.forEach((trackingno,idx)=>{ 
                        myarry[idx] = trackingno.replace(/\s/g,'')  
                    })
                }
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path)  
                } 
                return res.status(200).send({
                    track: myarry, 
                    status:true
                });  
            }) 
        }
}


fn.findCouriersWithTrackingNo = async(req,res,next) => { 
    const trackingNo = req.body.trackingNo
    if(trackingNo !== null && trackingNo !== undefined){
        const body = {
            "trackingNo": trackingNo
        }
        console.log(body)
        await axios.post(`${endPoint}/couriers/detect`, body ,header).then(result => {
            console.log(result)
            // if(result.data?.meta?.code == 200){
            //     let couriersTrackingNo = result.data.data
            //     console.log('couriersTrackingNo ',couriersTrackingNo)
            // }else{
            //     console.log(res.meta)
            // }
            return res.status(200).send({
                status:true,
                msg:'OKOK'
            }); 
        }).catch(err => {
            console.log(err)
            return res.status(400).send(err);
        })
    }   

    return res.status(200).send({
        message: 'Please enter a tracking number'
    });  
}
 
  
fn.ThailandPostTraking = async(req,res,next) => {   

        await axios.post(`${TP_endpoint}/authenticate/token`, {}, TP_header).then(async (result) => {    
            if(result.data.token){ 
                TP_token = result.data.token 
                //start tracking 
                var data = JSON.stringify({
                    "status": "all",
                    "language": "TH",
                    "barcode": req.body.trackingNo
                }); 
                console.log(data)
                var config = {
                        method: 'post',
                        url: `${TP_endpoint}/track`,
                        headers: { 
                          'Authorization': 'Token '+TP_token, 
                          'Content-Type': 'application/json'
                        },
                        data : data
                };
                await axios(config).then(function (response){ 
                          return res.status(200).send({
                                status:true,
                                result: response.data.response, 
                          });
                      })
                      .catch(function (err) {
                          console.log(err);
                          return res.status(400).send(err)
                      }); 
            }  
        }).catch(err => {
            console.log(err)  
        })   
}

fn.etrackingAPI = async(req,res,next) => {  
    console.log('etracking----> work')
    const trackingNo = req.body.trackingNo
    const courierKey = req.body.courierKey  
        if(trackingNo !== null && courierKey !== null){
            const body = {
                "trackingNo": trackingNo,
                "courier":courierKey
            } 
            await axios.post(`${endPoint}/tracks/find`, body ,header).then(result => {
                if(result.data?.meta?.code == 200){
                    // let tracksFind = result.data.data
                    // let tracksFindDetail = result.data.data.detail
                     let tracksFindTimeLine = result.data.data.timelines 
                    // console.log('tracksFind ',tracksFind)
                    // console.log('tracksFindDetail ',tracksFindDetail)
                    // console.log('tracksFindTimeLine ',tracksFindTimeLine)
                    let timeline = []
                    tracksFindTimeLine.forEach(e => { 
                        e.details.forEach(details => {
                            timeline.push(details)
                        }) 
                    }); 
                    return res.status(200).send({
                        status:true,
                        tracking: trackingNo,
                        message: 'something went wrongxxx',
                        timeline
                    });
                }else{ 
                    return res.status(200).send({
                        tracking: trackingNo,
                        status:false,
                        message: 'something went wrong',
                        timeline: {}
                    });
                }
            }).catch(err => {  
                return res.status(200).send({
                    tracking: trackingNo,
                    status:false,
                    message: err.response.statusText,
                    timeline: []
                });
            })
            
        }   
}
