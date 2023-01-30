**該Project為模仿YouTube影片網頁的練習**<br/>
目前只有電腦網頁版，使用google、IE EDGE瀏覽器觀看較佳
## 展示網址: https://voidjkk.github.io/YT-practice-DEMO/cp_YT.html<br/>
#### 有實作的功能:
* "每次"網頁往下捲動到接近底部時，會透過ajax抓取"原YouTube影片下方的最新留言"，從最新的開始顯示；第一則留言是作者留言<br/> 
* 每次進行留言載入時，會短暫出現提示:正在載入中的動畫效果<br/> 
* 左上角Youtube的logo若滑鼠停留在上面會撥放動畫效果<br/> 
* 影片的視窗會隨瀏覽器寬度變化而放大縮小<br/> 
* 點選搜尋框會有highlight效果<br/>
* 在搜尋框打字時右側會出現"X"，點選可以直接刪除輸入文字<br/>
* 資訊說明區域可點選"更多內容"展開&摺疊，有使用stopPropagation防止重疊元素觸發<br/>
* 若留言超過4行，會在第四行後面顯示"..."，還有出現"顯示完整內容"按鈕供展開&摺疊(每項留言獨立)<br/>
* 左上角選單按鈕可叫出側邊選單(類似TODO list的樣子)，滑鼠停留的選項會反白<br/>
* 側邊欄位出現時，背景模糊幫助聚焦至選單，並且無法捲動影片頁<br/>
* 側邊欄位有獨立卷軸和美化樣式<br/>
目前正在打算將CSS改成SCSS，還有學習Vue
