$(document).ready(function(){
  var NextPageToken = "" ;
  var IsWaitingAjax = true;
  var IsAuthorShowed = false;

  $(window).scroll(function(){
    var ScrollTop = $(this).scrollTop(); //卷軸頂端到視窗頂端距離
    var ScrollLength = window.innerHeight //網頁高度(不包含瀏覽器工具列等第方)，當作卷軸本身的長度
    let BodyHeight =   document.body.scrollHeight //整個body高，包含捲軸以外的地方

      if (  ( ( (ScrollTop + ScrollLength ) / BodyHeight ) * 100  > 99 ) &&  IsWaitingAjax == true   ){
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

    
    

    
 // https://cwpeng.github.io/live-records-samples/data/products.json
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
        console.log("成功");  
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
/*
function GetSingle_Obj(data){
  
  let x = data.flat(Infinity); //扁平化，去除JSON外面多餘中括號
  for (i = 0 ; i < x.length ; i++){
    var One_Comm_Obj = x[i]
    
// 抓某位置的key(中括號選位子)  let key = Object.keys(One_Comm_Obj)[0]
//下面代表這還不是最內層 (應該能弄迴圈一路拆到最內層，還未想到)
    Object.values(One_Comm_Obj).forEach(keyname => 
    {  if (keyname == "object")
    { 
    }  

    })
  }
};  
*/
      
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



  }  //doajax

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
    /*    Bg_Mask.addEventListener('touchmove',function(e){
         e.preventDefault
    }
    */
    });

  });
  //顯示更多留言的按鈕的動態監聽click(要一個父元素/已存在的當載體)，因為後來用程式插入的HTML不會被套用到
  $('.Comment_Area').on('click','.User_More_Text',function(e){  
    
    $(this).toggleClass('User_More_Text_Tog');
    $(this).prev().toggleClass('User_All_Comment');

  });



 // $('.User_More_Text').click(function(event){   });
  

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

//clientHeight元素高度(含padding) ，offsetHeight includes padding, scrollBar and borders.
 

/* document.querySelector('.Bg_Mask').addEventListener('scroll',function(){
windowScrollTop =$(window).scrollTop()
console.log(`AAA:${windowScrollTop}`)
}); */



/*       var Raw_Data = [];
         getkeys(response);
         function getkeys(raw){
           Object.keys(raw).forEach( x => {
           if(x == "items" ){ Raw_Data.push(raw[x]) }   
           })
         }
        為何Raw_Data  是undefine ? 確定response內有"items"
*/

/*readyState:
  0	UNSENT	          客戶端已被建立，但 open() 方法尚未被呼叫。
  1	OPENED	          open() 方法已被呼叫。
  2	HEADERS_RECEIVED	send() 方法已被呼叫，而且可取得 header 與狀態。
  3	LOADING	          回應資料下載中，此時 responseText 會擁有部分資料。
  4	DONE  	          完成下載操作。


*/