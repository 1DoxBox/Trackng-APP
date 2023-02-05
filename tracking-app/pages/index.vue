<template>
   <div data-app>
      <section class="navbar" >
         <div class="logo ">
            <h4>Tracking <br> with OCR</h4>
               <img src="bar.jpg" class="center">
            
         </div>
            
      </section>

      <section class = "topic">
            <div class="row pt-6">
               <div class="col-lg-3"> 
                  <label  class="mb-3"> <div class="text-color"><h1>เลือกบริษัทขนส่ง</h1> </div> </label>  
                  <v-select v-model="courier" :items="courierList" item-text="name"  item-value="val" return-object solo color = "#000000" >
                     <template #selection="{ item }">
                           <img :src="`${item.imageURL}`" width="50">&nbsp;{{ item.name }}
                     </template>  
                     <template #item="{ item }">
                           <img :src="`${item.imageURL}`" width="50">&nbsp;{{ item.name }}
                     </template>  
                  </v-select>
               </div> 
               
               <div class="col-lg-6">
                  <div class="row">
                     <div class="col-lg-4"> 
                        <div class="text-color">
                           <label><h1>&nbsp;เช็คเลขพัสดุ</h1></label>
                        </div>
                     </div>
                     <div class="col-lg-12 p-0">
                        <div class="row"> 
                           <div class="col-lg-10 ">
                              <v-textarea 
                                 v-model="myTrack"
                                 solo 
                                 label="ตรวจได้หลายหมายเลขในคราวเดียว โดยคั่นด้วยเครื่องหมาย ','" 
                                 rows="1"
                                 class="pt-3"
                              ></v-textarea>
                           </div>
                           <div class="col-lg-2 text-left">
                              <v-btn color="priamry" class="bg-primary" @click="getTimeline"> ค้นหา </v-btn>
                           </div>
                        </div>
                     </div>
                    

                  </div>  
               </div>

               <div class="col-lg-3">  
                  <label  class="mb-3"><div class="text-color"><h2>อัพโหลดใบเสร็จ</h2></div></label>
                  <!-- loading -->
                  <div v-if="loading" class="mb-3">
                     <div class="text-color">
                        <span class="lds-ellipsis"><div></div><div></div><div></div><div></div></span> <span> กำลังประมวลผล</span>
                     </div>
                  </div>
                  <input v-else ref="fileInput" type="file" name="" class="btn-block" @change="onFileSelected">
                  <!-- <button v-if="allowAddImg" class="btn btn-no-radius w-100 btn-light txt-s" @click="$refs.fileInput.click()"><v-icon>mdi-pencil</v-icon> </button>
                  <button v-else class="btn btn-no-radius w-100 btn-warning txt-sm py-2" @click="removeIconImg()"> REMOVE </button> -->
               </div>
            </div>
         
      </section>

      <section class = "showinfo">
         <div>
            <div class="rows"> 
               <div  v-if="ShowTimeline.deliveryStatus"  class="col-lg-12" >   
                     <div class="mb-3">
                        <div class=""> 
                           <table width="100%">
                              <tr>
                                 <td>  รายการค้นหา " {{selectedTrackingNo.length}} " รายการ </td>
                                 <td>
                                    <ul class="trackinglist">
                                       <li v-for="(trackingno,i) in Timeline" :key="`_${i}`">
                                          <v-btn  :class="selected===i ? 'active' : 'deactive'" @click="swapInfo(i)"> {{Timeline[i].tracking}} </v-btn>
                                       </li>
                                    </ul>
                                 </td>
                              </tr>
                           </table> 
                        </div> 
                     </div> 
                     <div >   
                        <div class="rb-container">  
                           <div  class="row bdr-btm" > 
                              <div class="col-lg-2"> 
                                  <div class="txt-xl">เลขพัสดุ {{ShowTimeline.tracking}}</div> 
                                  <div> 
                                     <ul class="checksta">
                                        <li v-for="idx in 3" :key="`_${idx}`"> 
                                           <img v-if="ShowTimeline.deliveryStatus>= (4-idx)" :src="`/images/ico-${4-idx}-active.png`" alt=""  width="50"> 
                                           <img v-else :src="`./images/ico-${4-idx}.png`" width="50"> 
                                        </li>
                                     </ul>
                                  </div>
                              </div>
                              <div class="col-lg-10 pt-4">   
                                    timeline tracking number 
                                        <ul class="rb">
                                          <li v-for="(item,ii) in ShowTimeline.timeline" :key="ii" class="rb-item" ng-repeat="itembx">
                                             <span v-if="item.date" class="timestamp"> {{item.date|Dayformat}}  </span>
                                             <span class="item-title">{{item.description}}</span> 
                                          </li>  
                                       </ul>
                              </div>
                           </div> 
                        </div>
                     </div> 
                     <div v-if="loadingResult" class="mb-3">
                        <span class="lds-ellipsis"><div></div><div></div><div></div><div></div></span> <span> loading...</span>
                     </div> 
               </div>  
            </div>
         </div>  
      </section>
  </div>
</template>

<script> 
export default {
   filters:{
      Dayformat(day){
         return day.split('-').reverse().join('/')
      }, 
   } , 
   data() {
      return{
         courier:{ key:null },
         courierList: [], 
         allowAddImg:true,
         selectedFile:null,
         myTrack:null,
         Timeline:[],
         selectedTrackingNo : [] ,
         loading:false,
         loadingResult:false,
         ShowTimeline:[],
         selected:0,
      }
   }, 
   mounted(){
     this.getCourier()
   } ,
   methods: {
      async getCourier(){
            try{   
                const items = await this.$axios.$get('/shipment/couriers');  
                this.courierList = items.list   
            }catch(error){
                console.log(error)
            }  
        },
      async getTimeline(){
            this.selectedTrackingNo = []
              console.log("mytrack:"+this.myTrack)
             if(this.myTrack!==undefined&&this.myTrack!==null&&this.myTrack.length){
               this.selectedTrackingNo = this.myTrack.split(",")
             } 
             
             if(!this.selectedTrackingNo.length||this.selectedTrackingNo.length<1||!this.courier.key||this.courier.key===0){
               alert("กรุณาเลือกขนส่งหรือเพิ่มหมายเลขพัสดุ")
             }else{ 
               this.loadingResult = true
                  try{    
                     this.Timeline = []
                     let items = []
                        // for thailand-post 
                        if(this.courier.key==='thailand-post'){  
                              await this.$axios.$post('/thailand-post/timeline',{
                                 trackingNo: this.selectedTrackingNo,
                                 courierKey : this.courier.key
                              }).then((resp)=>{  
                                 console.log(resp)
                                    items = resp.result.items
                                    const keys = Object.keys(items)
                                    const values = Object.values(items) 
                                    values.forEach((itm,i)=>{
                                       const lastItem = itm.pop();
                                       console.log(lastItem)
                                       if(lastItem!==undefined){
                                             let deliveryStatus = 0
                                          if(!deliveryStatus&&lastItem.status.substring(0,1)>=5){ 
                                             deliveryStatus=3
                                          }else if(!deliveryStatus&&lastItem.status.substring(0,1)>=3){ 
                                             deliveryStatus=2
                                          }else if(!deliveryStatus&&lastItem.status.substring(0,1)>=2){ 
                                             deliveryStatus=1
                                          }
                                          const detail = []
                                          itm.forEach((arr,ii)=>{
                                             let day = arr.status_date
                                                day = day.split(" ")
                                                day[0] = day[0].split('/')
                                                day[0][2] = parseInt(day[0][2])-543
                                                day[0] = day[0].reverse().join('-')
                                                let time = day[1].split('/+')
                                                   time[0] = time[0].split(':')
                                                   time =  time[0][0]+":"+time[0][1] 
                                                detail.push({
                                                   "dateTime": day.join('T'),
                                                   "date" : day[0],
                                                   time,
                                                   "status" : null,
                                                   "status_code" : arr.status,
                                                   "description" : time+" "+arr.status_description+"("+arr.location+")",
                                                })
                                          }) 
                                          this.Timeline.push({ 
                                             deliveryStatus,
                                             tracking: keys[i],
                                             timeline: detail,
                                             length: itm.length,
                                          }); 
                                       } 
                                    }) 
                                    console.log(keys)  
                              });   
                        // for other ourier  
                        }else{
                           this.selectedTrackingNo.forEach(async(trackingNo,i) => {
                              items = await this.$axios.$post('/shipment/timeline',{
                                 trackingNo,
                                 courierKey : this.courier.key
                              });    
                              if(items.status){  
                                 let deliveryStatus = 0
                                 items.timeline.forEach((itm,i)=>{
                                    if(!deliveryStatus&&itm.status==='ON_DELIVERED'){ 
                                       deliveryStatus=3
                                    }else if(!deliveryStatus&&itm.status==='ON_SHIPPING'){ 
                                       deliveryStatus=2
                                    }else if(!deliveryStatus&&itm.status==='ON_PICKED_UP'){ 
                                       deliveryStatus=1
                                    }
                                    items.timeline[i].status_code = null
                                 })
                                 this.Timeline.push({ 
                                    deliveryStatus,
                                    tracking: items.tracking,
                                    timeline: items.timeline
                                 });  
                              }else{
                                 this.Timeline.push({
                                    deliveryStatus:null,
                                       tracking: items.tracking,
                                       timeline: [{
                                          description: items.message
                                       }] 
                                 });  
                                 console.log("Not found")
                              }  
                           }); 
                        } 
                        if(this.Timeline.length){
                           console.log("----- resp------ timeline----")
                           console.log(this.Timeline)
                                 this.ShowTimeline = this.Timeline[0];
                        }
                  }catch(error){
                           console.log(error)
                  }  
                  this.loadingResult = false
             } 
      },
      async onFileSelected(event){
         this.myTrack = null
         this.selectedFile = event.target.files[0] 
         if(this.selectedFile){  
                const fd = new FormData();
                fd.append('image',this.selectedFile,this.selectedFile.name)
                this.loading = true
                await this.$axios.$post('/shipment/ocrimg',fd)
                .then(res => {   
                   this.loading = false
                   console.log(res)
                   if(res.status){
                     this.myTrack = res.track.join(",") 
                   } 
                }) 
             }else{
                return true
         }
      },
      swapInfo(index){
            this.ShowTimeline = this.Timeline[index]
            this.selected = index
      }
   }
}
</script>

<style lang="scss"> 
@import url("https://fonts.googleapis.com/css2?family=Prompt:wght@200;400;600&display=swap");
.bdr-test{
   border:#EC0000 1px solid;
}
.txt-xl{
   font-size:18px;
}
.text-right{
   text-align: right; 
}
.bdr-btm{ border-bottom: #c2c2c2 1px solid; }
section{
   padding:20px;
   font-family: 'Prompt', sans-serif;
} 
  label{   
   font-weight:bold;
   display: block;
  }
  .mb-3{
    margin-bottom:15px; 
  }
  .bg-primary{ 
     background:#fefefe!important;
     color:rgb(0, 0, 0)!important;
  }
  input[type="file"]{
   -webkit-appearance: none;
   text-align: left;
   -webkit-rtl-ordering:  left;
}
input[type="file"]::-webkit-file-upload-button{
   -webkit-appearance: none;
   float: right;
   margin: 0 0 0 0px;
   border: 1px solid #aaaaaa;
   border-radius: 4px;
   background-image: -webkit-gradient(linear, left bottom, left top, from(#d2d0d0), to(#f0f0f0));
   background-image: -moz-linear-gradient(90deg, #d2d0d0 0%, #f0f0f0 100%);
}
button.active{
   background:#0000009b!important;
   color:#FFF!important;
   font-weight:bold;
}
.trackinglist{
   li{
      display: inline-block;
      width:fit-content;
      list-style: none;
      margin:3px;

   }
}
.rb-container{
   display: block!important;  
      width:100%!important;
   .rb{
      display: block!important;   
      margin:0 auto!important;
      margin-top:50px!important;
   }
}
.p-5{ padding:5px; }
ul.checksta{
   margin:20px; 
   margin-left:0px;
   padding-left:0px;
   width:150px;
   li{ 
      list-style: none;
      height:80px;
      text-align:center;
      padding:10px;
      img{
         width:50px;
         height:50px;
      }
      &::before{
         border-left:2px solid green!important;
      }
      &::after{
         border-left:2px solid green;
      }
   }
}
.item-title,.timestamp{
   font-size:16px!important;
}
/* Add a black background color to the top navigation */
.text-color {
//   color: rgb(255, 255, 255);
  color: #fdfdfd; text-shadow: rgb(12, 12, 12) 0.1em 0.1em 0.2em
}
.text-color2 {
   color: #0e0e0e; text-shadow: rgb(241, 235, 235) 0.1em 0.1em 0.2em
}
.topic {
   height: 300px;
   // border: 1px solid red;
   background: url("https://www.pttdigitalconnect.com/images/Product/10101021/logistic-tracking-platform-banner.png");

   background-size: 1950px 550px;
   background-position: 2%;
   display: flex;
   justify-content: center;
   align-items: center;
}
.navbar {
   display: flex;
   // justify-content: center;
   // align-items: center;
   background: #ffffff;
   color: #000000;
}
.logo {
   display: flex;
   justify-content: center;
   align-items: center;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}

// .container-fluid {
   // border: 1px solid rgb(0, 0, 0);
   
// }
.col-lg-3 {
   // border: 1px solid rgb(34, 0, 255);
   margin-top: 10px;
   
   
}
.col-lg-4 {
   // border: 1px solid rgb(229, 255, 0);
   margin-top: 2px;
}
// .col-lg-5 {
//    border: 1px solid rgb(0, 255, 51);
//    margin-top: 35px;
// }
// .col-lg-6 {
//    border: 1px solid rgb(47, 0, 255);
// }
// .showinfo {
//    border: 1px solid rgb(34, 0, 255);
// }
</style>