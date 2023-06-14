**該Project為模仿YouTube影片網頁**<br/>
使用SCSS+VUE.js
## 展示網址:https://voidjkk.github.io/sideproject-video-site/cp_YT_VUE_github.html<br/>
#### 有實作的功能:
* RWD響應式設計，有分mobile和PC版本<br/>
* 使用debounce設計，上方搜尋框輸入文字約1秒之後，透過Axios抓取youtube API，回傳搜尋結果，可以點選結果再按右側進行搜尋<br/>
* 在搜尋框打字時右側會出現"X"，點選可以直接刪除輸入文字<br/>
* 側欄相關影片的資訊也是透過Axios抓取youtube API，並加以整理後的結果<br/>
* 側欄影片滑鼠懸停後會有放大效果<br/>
* 網頁往下捲動至一定距離時，使用AJAX抓取youtube API，取得"原YouTube影片下方的最新留言"，從最新的開始顯示；第一則留言是作者留言<br/> 
* 每次進行留言載入時，會短暫出現提示:正在載入中的動畫效果<br/> 
* 左上角Youtube的logo若滑鼠停留在上面會撥放動畫效果<br/> 
* 資訊說明區域可點選"更多內容"展開&摺疊，有使用stopPropagation防止重疊元素觸發<br/>
* 若留言超過4行，會在第四行後面顯示"..."，還有出現"顯示完整內容"按鈕供展開&摺疊(每項留言獨立)<br/>
* 左上角選單按鈕可叫出側邊選單(類似TODO list)，滑鼠停留的選項會反白<br/>
* 側邊欄位出現時，背景調暗幫助聚焦至選單，並且無法捲動背景頁<br/>
* 側邊欄位有獨立卷軸和美化樣式<br/>
<br/>

