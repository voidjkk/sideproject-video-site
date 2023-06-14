const { ref , reactive , onMounted ,onUnmounted  ,  toRefs ,watchEffect ,nextTick  } = Vue;
const { useWindowSize  } = VueUse;

const app = Vue.createApp({
 
  setup(){
   
  const related_video_tag = ref(null)
  const related_video_pc_flag = ref(null)
  const Comment_Area_Flag = ref(null)

  onMounted( ()=>{ 
    window.addEventListener("resize", function(){
      window_width.value = window.innerWidth
    })
  })

  onUnmounted( () => {  })

  const window_width = ref(window.innerWidth)

  watchEffect( ()=> {  
    if (window_width.value <= 768 ||  document.documentElement.clientWidth <=768          ) {
      //確保DOM更新完畢才執行
      nextTick(() => {
        Comment_Area_Flag.value.appendChild( related_video_tag.value.$el );
      })
        console.log("手機版本")
    } 
    else {
      nextTick(() => {
        related_video_pc_flag.value.appendChild( related_video_tag.value.$el )
      })
        console.log("PC版本")
    }

  })

  return {   
    related_video_pc_flag , Comment_Area_Flag , related_video_tag ,
        }
  },
  
});


app.component('search_bar',{
  setup (){

    var user_input = ref("")
    const clean_text = function(){
      user_input.value = ""
    }

    const query_debounce = function( func ,delay ){
      let time_count
      
      //(...para)代表抓取func需要的全部參數，以利在計時器裡呼叫func時使用
      return (...para) => {

          clearTimeout(time_count)
          time_count = setTimeout( ()=>{
            console.log( "緩衝結束，送出查詢")
       // 確保func是函式
            if( typeof func === 'function' ){
              func(para)
            }    
          } , delay )
      }

    }
    
    const results = ref([])
    const results_filter = function(query_str , raw_results){
      //先把str轉陣列再利用join一次可查詢多個關鍵字    
      let query_Arr = query_str.split(/\s+/)
      let query_regex = new RegExp(query_Arr.join("|"), "gi")    
      return  raw_results.filter(x => query_regex.test(x.snippet.title) )
    }

    const searching = function(Qstr){
   
      axios.get(`https://www.googleapis.com/youtube/v3/search`,
       {  
        params: {
          part: "snippet",
          q: Qstr[0].target.value, 
          maxResults: "30",
          type: "video" ,
          key: "AIzaSyBr4a_SgSz6ngGuBLEPRaEDd9EoVbV9KaQ" 
        } 
       })
       .then( (response) => {
         console.log("得到查詢結果")
         console.log(response.data.items)
         results.value = results_filter(user_input.value , response.data.items)
         console.log("結果過濾完成")

         console.log(results.value)
       }) 
       .catch(  (err) => {
        console.log(err)
       })
    
    }

    const do_query = query_debounce( searching , 600 ) 
    const click_result = (str)=>{ 
      user_input.value = str
    }
    const youtube_search = function(){
      if (user_input.value == "")
        return 
      location.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(user_input.value)}`
    }

    onMounted( ()=>{    })

    return{ user_input, results ,
       do_query  , searching , query_debounce, youtube_search,
      click_result,clean_text,
    }
  },

  template:`
  <div class="X_Arrange">
    <div  class="SearchBar">
      <div class="L_SearchIcon">
         <svg viewBox="0 0 24 24" >
            <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path>
         </svg>
      </div>
       <!-- autocomplete="off" 搜尋欄不存紀錄 | required 需要輸入值才可送出 -->
      <input v-model=user_input @input="do_query" type="input" required id='search' autocomplete="off" placeholder="輸入文字後請待2秒即可自動查詢...，點右側可以搜尋" />
      <button class="SearchClose_btn" @click="clean_text"></button>
     
        <ul  class="SearchBarList ScrollBar" >
          <li v-for="x in results" @mousedown="click_result(x.snippet.title)"  >
            <div class="X_Arrange SearchBarListRow ">
              <div class="IconShape">
                <svg viewBox="0 0 24 24">
                   <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path>
                </svg>
              </div>
              <p>{{x.snippet.title}}</p>
            </div> 
          </li>
        </ul>
  
    </div>
    <button class="R_SearchIcon" @click="youtube_search">
      <div class="IconShape">
         <svg viewBox="0 0 24 24" >
          <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"></path>
         </svg>
      </div>
    </button>
  </div>`

})
 


app.component('related_video',{

  setup (props) {

    const rv_isloading = ref(false)
    const rv_loading_spin = ref(null)
    const related_video_list = ref(null)
    const rv_observer = null


    var next_token = ref("")
    const rv_datas = ref([])

    const rv_getlist = async function() {

      await axios.get(`https://www.googleapis.com/youtube/v3/videos`,
      {  
       params: {
        part: "snippet,statistics",
        chart: "mostPopular" ,
        maxResults: "10",
        videoCategoryId: 10,
        pageToken:  next_token.value  ,
        key: "AIzaSyBr4a_SgSz6ngGuBLEPRaEDd9EoVbV9KaQ" 
       } 
      })
      .then( (response) => {
      rv_datas.value.push(...response.data.items) 
        next_token.value = response.data.nextPageToken  
      }) 
      .catch(  (err) => {
       console.log(err)
      })
      
      rv_isloading.value = false
      
    }


    //輸入格式為ISO 8601 date : YYYY-MM-DDTHH:MM:SSZ
    const diff_date = (uptime)=>{
      let rv_get_nowtime = Date.now()
      let rv_get_uptime = Date.parse(uptime)  //轉成DATE函式接受格式
      const diff_hours =  Math.floor((rv_get_nowtime - rv_get_uptime) / (1000*60*60) )

      if( diff_hours < 24 )
        return  `${diff_hours}小時前`      
      else if( diff_hours >= 24 && diff_hours <= (24*7)   )
        return  `${Math.floor(diff_hours/24)}天前`
      else if( diff_hours >= (24*7) && diff_hours <= (24*30)   )
        return  `${Math.floor( diff_hours/(24*7) )}週前`
      else if( diff_hours >= (24*30) && diff_hours <= (24*365 )  )
        return  `${Math.floor( diff_hours/(24*30) )}月前`
      else
        return  `${Math.floor( diff_hours/(24*365) )}年前`
    }
    const views_format = (views)=>{
      if(views > 0 && views < 10000)
        return  views
      else if (views >= 10000 && views < 10000000){
        return  `${Math.floor(views/10000)}.${ Math.floor( (views%10000) /1000)   }萬`
      }
      else if (views >= 10000000 )
        return  `超人氣`
    }
    const move_forward = function(){
      let per_move = 500
      //移動+平滑效果
      related_video_list.value.scrollBy({
        left: per_move,
        behavior:"smooth",
      })
    /*
    有卷軸時，包含可視範圍以外的長寬  scrollWidth 
    水平卷軸到起點的距離  scrollLeft 
    */
    } 

      onMounted( ()=>{

          const opts = {
            root: null ,
            rootMargin: "0px 0px 0px 0px", //(上右下左)
            threshold: 1  //觀察物全進入視窗範圍才會觸發
          }
          const rv_observer  = new IntersectionObserver( (entries, observer)=>  {
            entries.forEach( entry => {
              if( rv_isloading.value == false && entry.isIntersecting  ){
               
                rv_isloading.value = true       
                console.log("+1")
                rv_getlist()
              }
              else{                                  
                console.log("no")       
              }
            })       
          }, opts  )
        
        rv_observer.observe(rv_loading_spin.value);
   
      } )
      watchEffect( ()=>{     })
    
    return  {
        rv_datas ,rv_getlist , rv_observer , rv_loading_spin , rv_isloading ,
        diff_date ,views_format, next_token  , related_video_list ,move_forward  }  
  },
 
  template:`
        <div  class="btn_position" >
          <div class="related_video_list ScrollBar" ref="related_video_list" >
            <div   v-for="data in rv_datas"  :key=data.id class="related_video_row"  > 
              <a href="#">
                <div class="thumbnail_scale">
                  <img class="related_video_thumbnail" alt="video_thumbnail" :src="data.snippet.thumbnails.medium.url">
                </div>
              </a>  
              <a href="#">             
                <div class="related_video_info">
                    <div class="User_Comment_Content" style=" -webkit-line-clamp: 2 ;"> 
                    <p> {{data.snippet.title}}</p>
                    </div>
                    <div class="related_video_ch" > 
                     <p> {{data.snippet.channelTitle}}</p>
                    </div>
                    <div class="Small_Text_Style"> 
                      <span>觀看次數：{{ views_format(data.statistics.viewCount) }}</span>
                      <span>．{{ diff_date(data.snippet.publishedAt) }}</span>
                    </div>
                </div>   
              </a> 
            </div> 
            <div  class="rv_loading_spin"  ref="rv_loading_spin" > </div>
            <div class="rv_more_Btn" @click="move_forward" > <p>>></p> </div>
          </div> 
        </div>` ,
  })

app.mount('#app');



$(document).ready(function(){
  var NextPageToken = "" ;
  var IsWaitingAjax = true;
  var IsAuthorShowed = false;

//clientHeight元素高度(含padding)
//offsetHeight includes padding, scrollBar and borders.
  $(window).scroll(function(){
    var ScrollTop = $(this).scrollTop(); //卷軸頂端到視窗頂端距離
    var ScrollLength = window.innerHeight //網頁高度(不包含瀏覽器工具列等地方)，當作卷軸本身的長度
    let BodyHeight =   document.body.scrollHeight //整個body高，包含捲軸以外的地方
    
      if (  ( ( (ScrollTop + ScrollLength ) / BodyHeight ) * 100  > 55 ) &&  IsWaitingAjax == true   ){
        IsWaitingAjax = false;
        console.log("loading comm!!!");

        Start_Loading_Comment();
      }
  })

function Start_Loading_Comment(){

  console.log("start add loading gif");

  setTimeout(function(){
    
    console.log("loading gif END passed 0.2s"); 
    $('.Loading_Svg').addClass('Loading_Svg_Show');

    setTimeout(function() {
      $('.Loading_Svg').removeClass('Loading_Svg_Show')
      console.log("add NEW COMment"); 
     DO_AJAX();

      IsWaitingAjax = true;

    }, 1000); 
     
  } , 200 )
}

  function DO_AJAX(){

    const Comment_Url ="https://www.googleapis.com/youtube/v3/commentThreads";
    const Gold_Key = "AIzaSyBr4a_SgSz6ngGuBLEPRaEDd9EoVbV9KaQ";
    const video_ID = "grd-K33tOSM" //影片id在播放影片的v=後面

    let send_URL = `${Comment_Url}?part=snippet,replies&videoId=${video_ID}&key=${Gold_Key}&maxResults=5&pageToken=${NextPageToken}` ;
    $.ajax({
      url: send_URL,                       
      type: "GET", 
      datatype:JSON,            //網頁預期從Server接收的資料型態      
      data: ""       
            })    
      .done( function(response) { 
        console.log(response);  
        if(response=="") return false;

        let {nextPageToken : Next_Page }  = response ;
        NextPageToken = Next_Page ; 

        let Raw_Data = [];
        Object.keys(response).forEach( x => {
          if(x == "items" ){ Raw_Data.push(response[x]) }   
          }) 

         
        GetComment(Raw_Data.flat());    /*用[].concat(response) or ...運算符 也行把多餘中括號去掉*/
        HideShowMoreBtn();      
      }) 

      .fail(function ( xhr, status, ThrownError ) { 
        console.log("fail");
        console.log(ThrownError);
      })
    
      .always( function( xhr, status) {
        console.log( "完成" );
        console.log( ' status: ' +  status );
      })
    

    function GetComment(Data){
      console.log(Data);
      const Comment_Data = Data.map(x => {
        const { authorProfileImageUrl : User_Icon ,
                authorDisplayName : User_Name ,
                updatedAt : User_Uptime ,
                likeCount : LikeCount ,
                textDisplay : Comm_TEXT ,
                authorChannelUrl : Author_URL
              } = x.snippet.topLevelComment.snippet
        const  {  totalReplyCount : ReplyCount } = x.snippet

        let Return_Data =  `
    <div class="User_Area_Shape">
          <div class="CircleIconShape" >
             <a href="#">
                <img style="width: 40px;" src="${User_Icon}" alt="留言者頭像">
             </a>
          </div>
          <div class="Main_Comment_Area" >
  
             <div class="User_Comment_ID">
                  <a href="#"  >${User_Name}</a>
                  <span class="Small_Text_Style">${User_Uptime.substr(0, 10)}</span>
             </div>
             <div  class="User_Comment_Content">
                <p>${Comm_TEXT}</p>
             </div>
             <button class="Small_Text_Style Common_Btn_Style User_More_Text"></button>

             <div class="X_Arrange" >
                <a class="For_Hover" href="#" >
                   <div class="IconShape Btn_White" >
                      <svg viewBox="0 0 24 24">
                         <path d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z">
                      </svg>
                   </div>
                </a>
                <p class="Small_Text_Style Comment_Offset">${LikeCount}</p>
       
                <a class="For_Hover" href="#" >
                   <div  class="IconShape Btn_White" >
                      <svg viewBox="0 0 24 24" >
                         <path d="M17,4h-1H6.57C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21 c0.58,0,1.14-0.24,1.52-0.65L17,14h4V4H17z M10.4,19.67C10.21,19.88,9.92,20,9.62,20c-0.26,0-0.5-0.11-0.63-0.3 c-0.07-0.1-0.15-0.26-0.09-0.47l1.52-4.94l0.4-1.29H9.46H5.23c-0.41,0-0.8-0.17-1.03-0.46c-0.12-0.15-0.25-0.4-0.18-0.72l1.34-6 C5.46,5.35,5.97,5,6.57,5H16v8.61L10.4,19.67z M20,13h-3V5h3V13z">
                      </svg>
                   </div>            
                </a>
                <p class="Small_Text_Style Comment_Offset"></p>
                <button class="Common_Btn_Style  Response_Btn" onclick="window.location.href='https://www.youtube.com/' ">回覆</button>
            </div>
          </div>
    </div>`        
        //防止置頂文章再抓一次
        if ( Author_URL == "http://www.youtube.com/channel/UCjGfaP-eiT-XGeCRjGM9fGQ" )
          {
            if ((IsAuthorShowed == false)){
              IsAuthorShowed = true;
              return Return_Data;
            }

            return ;
          }
        else if (ReplyCount > 0  )
        {
          return Return_Data  + 
          `
        <a   href="#" >
          <div class="X_Arrange Common_Btn_Style  User_Comment_Reply">
            <div class="Center_Arrange IconShape ">
              <div class="D_triangle"> </div>
            </div>
            <p>${ReplyCount} 則回覆</p>
          </div>
        </a>
          ` 
        }
        else 
        { return Return_Data ; }
 
        }).join("");  //防止預設用逗號分隔

        //在該class之內 插入評論到最後
        $('.Comment_Area').append(Comment_Data) ;

      }

  }

function HideShowMoreBtn(){
//取得評論內文高度判斷是否刪除"顯示更多按鈕"
  console.log(" start DELETE btn");
  var OneComm = document.getElementsByClassName('Main_Comment_Area');
  for (var i = 0; i < OneComm.length; i++){
//先抓出每個留言的大HTML區域，然後再逐一取得每個留言的長度，再判斷要不要刪除
    let CommLength = OneComm[i].querySelector('.User_Comment_Content')
    let Btn = OneComm[i].querySelector('.Small_Text_Style.Common_Btn_Style.User_More_Text')
//按鈕抓出來如果是null代表已經刪除過了
     if ( (CommLength.scrollHeight <= 80) &&  (Btn !== null)  ){
       
         Btn.remove();
         console.log( "dele more btn");
     }
  }
}


  /*點擊按鈕出現選單、其餘部分半透明遮罩，且不能捲動 */
  $('.Btn_style').click(function(event){ 

    $('body').toggleClass('AsideMenuShow');

    var Bg_Mask = document.querySelector('.Bg_Mask')
    Bg_Mask.addEventListener('click',function(){
    
      $('body').removeClass('AsideMenuShow');  
      console.log(`remove[AsideMenuShow]`)

    });

  });
  //顯示更多留言的按鈕的動態監聽click(要一個父元素/已存在的當載體)，因為後來用程式插入的HTML不會被套用到
  $('.Comment_Area').on('click','.User_More_Text',function(e){  
    
    $(this).toggleClass('User_More_Text_Tog');
    $(this).prev().toggleClass('User_All_Comment');

  });
  

//資訊欄折疊相關
  var Desc_Text =  document.querySelector('.Description_InnerText');
  var Desc_Container = document.querySelector('.Description');
  var MoreText = document.querySelector('.Close_MoreText');
  $('.Description').click(function(event){ 
   Desc_Text.style.height = "auto" ;
   Desc_Container.style.cursor = "default";
   $('.Description').removeClass('Desc_BgCtrl');   /*防止展開時外框hover啟動*/
   MoreText.textContent = "只顯示部分資訊";
   MoreText.style["pointer-events"] ="auto" ;

  });

  /*阻止事件冒泡導致外層div判斷一起觸發*/
  $('.Close_MoreText').click(function(event){ 
      Desc_Text.style.height = "40px" ;
      Desc_Container.style.cursor = "pointer";
      $('.Description').addClass('Desc_BgCtrl');  
      MoreText.textContent = "...更多內容";
      MoreText.style["pointer-events"] ="none" ;
  
    event.stopPropagation();  

  
   });

});


