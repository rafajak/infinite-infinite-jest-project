scrollIsPaused = 1;
screenIsTouched = 0;
booksScrollY = 0;
videoSpeed = 0.45;
apiCallInProgress = 0;
timerScroll = undefined;
timeBetweenQueries = 4000;  // miliseconds

function toggleClass(element, toggleClass){
   var currentClass = element.className;
   var newClass;
   if(currentClass.split(" ").indexOf(toggleClass) > -1){ //has class
      newClass = currentClass.replace(new RegExp('\\b'+toggleClass+'\\b','g'),"")
   }
   else{
      newClass = currentClass + " " + toggleClass;
   }
   element.className = newClass.trim();
}

function goToBook() {
   toggleLinks();
   toggleMainContent();
   window.scrollTo(0,booksScrollY);
   bookStart();
   if (!timerScroll && scrollIsPaused == 0) {
      timerScroll = setPageScroll(parseInt(document.getElementById('scrollSpeed').value));
   }
   toggleClass(document.body, "body--cursor-auto");
}

function goToAbout() {
   toggleLinks();
   booksScrollY = window.pageYOffset;
   window.scrollTo(0,0);
   toggleMainContent();
   if (timerScroll) {
      clearInterval(timerScroll);
      timerScroll = undefined;
   }
   document.body.removeEventListener('click', tPB_handler);
   toggleClass(document.body, "body--cursor-auto");
}

function toggleLinks() {
   toggleClass(document.getElementById("menu"), "menu--ij-book");
   toggleClass(document.getElementById("menu"), "menu--ij-about");
}

function toggleMainContent(){
   toggleClass(document.getElementById("main"), "main--ij-book");
   toggleClass(document.getElementById("main"), "main--ij-about");
   toggleClass(document.getElementById("footer"), "footer--ij-book");
   toggleClass(document.getElementById("footer"), "footer--ij-about");
}

function bookStart(){
   timerCheckEndOfPage = setInterval(checkIfNearEndOfPage, 200);
   scrollSpeed = parseInt(document.getElementById('scrollSpeed').value);
   document.getElementById('ij-book-loading').style.display='none';
   document.body.addEventListener('click', tPB_handler);
   fixMargins();
}

function headerPngToMp4(){
   document.getElementById("headerPlayer").playbackRate = videoSpeed;
   document.getElementById("headerPlayer").style = "";
   document.getElementById("headerImage").remove();
   fixMargins();
   headerPngToMp4 = function(){}
}

function checkIfNearEndOfPage(){
   if(apiCallInProgress == 1 || (new Date - lastQueryTs) < timeBetweenQueries)
      return;
   if (document.body.scrollHeight - window.pageYOffset < window.innerHeight * 5.5) {
      document.getElementById('ij-book-loading').style.display='block';
   xhr = new XMLHttpRequest();
//   xhr.open('GET', 'https://www.infinite-infinite-jest.com/generate?next_page=' + pageIndex);
   xhr.open('GET', '/generate?next_page=' + pageIndex);
   apiCallInProgress = 1;
   lastQueryTs = new Date;
   xhr.onload = function() {
      if (xhr.status === 200) {
         zxc = this.responseText;
         var result = JSON.parse(this.responseText);
         nextPage = '';
         for(par in result['data']) {
            nextPage += result['data'][par]['content'].replace(/(?:\r\n|\r|\n)/g, '<br/>');
         }
         wrapper = document.createElement('div');
         wrapper.innerHTML= '<div id ="page' + pageIndex + '" class="ij-book-pages__page">'+nextPage+'</div>';
         document.getElementById('ij-book-pages').appendChild(wrapper.firstChild);
         wrapper = undefined;
         document.getElementById('ij-book-loading').style.display='hide';
         pageIndex++;
         if(pageToBeRemoved = document.getElementById('page' + (pageIndex - 30)))
            pageToBeRemoved.parentNode.removeChild(pageToBeRemoved);
      }
      else {
         console.warn('Request to server failed.  Returned status of ' + xhr.status);
      }
      apiCallInProgress = 0;
   }
   xhr.send();
   }
}

function togglePageScroll() {
   if (!timerScroll) {
      timerScroll = setPageScroll(parseInt(document.getElementById('scrollSpeed').value));
   }
   else {
      clearInterval(timerScroll);
      timerScroll = undefined;
   }
}

function setPageScroll(scrollSp) {
   scrollPx = 1;
   return setInterval(function(){
       if(screenIsTouched != 1)
          window.scrollBy(0,scrollPx)
   }, scrollSp);
}

tPB_handler = function togglePlayButton(e, el) {
   if(e.target.id.indexOf("scrollSpeed") > -1 || (footer.contains(e.target) && !(playButton.contains(e.target))))
      return 0;      // don't change scrolling if clicked element is scrollSpeed or footer
   else if(document.getElementById("menu").contains(e.target) && !(document.getElementById("menuAutoplay").contains(e.target)))
      return 0;      // don't change scrolling if clicked element is top menu and not the "ON/OFF" text
   else if (main.contains(e.target) && !(document.getElementById("playerBefore").contains(e.target) || document.getElementById("playerBefore2").contains(e.target)) && !(document.getElementById("playerAfter").contains(e.target) || document.getElementById("playerAfter2").contains(e.target)))
      return 0;      // don't change scrolling if clicked element is main and not the before/after player overlay
   e.stopPropagation();
   togglePageScroll();
   toggleClass(playButton, "paused");
   toggleClass(document.getElementById("menuAutoplay"), "menu__autoplay--on");
   toggleClass(document.getElementById("menuAutoplay"), "menu__autoplay--off");
   if(playButton.className.split(" ").indexOf("paused") > -1)
      scrollIsPaused = 1;
   else
      scrollIsPaused = 0;
}

function scrollSpeedChange(){
   scrollSpeed = parseInt(document.getElementById('scrollSpeed').value);
   if(!scrollIsPaused) {
      clearInterval(timerScroll);
      timerScroll = undefined;
      scrollSpeed == 0 ? timerScroll = undefined : timerScroll = setPageScroll(scrollSpeed);
   }
}

function fixMargins() {
   fixedTopHeight = window.getComputedStyle(document.getElementById('header')).getPropertyValue('top');
   document.getElementById("playerBefore").style.marginTop = fixedTopHeight;
   document.getElementById("playerBefore").style.height = 0.236556*document.getElementById("header").clientHeight + "px";
   document.getElementById("playerBefore2").style.marginTop = fixedTopHeight;
   document.getElementById("playerBefore2").style.height = 0.236556*document.getElementById("header").clientHeight + "px";
   fixedTopHeight = parseFloat(fixedTopHeight.replace("px","")) + document.getElementById("header").clientHeight +1;
   document.getElementById("playerAfter").style.height = Math.floor(0.236556*document.getElementById("header").clientHeight) + "px";
   document.getElementById("playerAfter").style.marginTop = fixedTopHeight - document.getElementById("playerAfter").style.height.replace("px","") + "px";
   document.getElementById("playerAfter2").style.height = Math.floor(0.236556*document.getElementById("header").clientHeight) + "px";
   document.getElementById("playerAfter2").style.marginTop = fixedTopHeight - document.getElementById("playerAfter2").style.height.replace("px","") + "px";
   document.getElementById("ij-about").style.marginTop = fixedTopHeight + "px";
   document.getElementById("ij-book-pages-before").style.marginTop = fixedTopHeight + "px";
   document.getElementById("ij-book-pages").style.marginTop = fixedTopHeight /*+ document.getElementById("ij-book-pages-before").clientHeight + 5 */ + 18 + "px";

   fixedBotHeight = document.getElementById("footer").clientHeight;
   document.getElementById("ij-book-pages-after").style.marginBottom = fixedBotHeight + "px";
}

function checkPageFocus() {
   if (document.hidden) // stop video and scroll if website in background
      if(scrollIsPaused == 0)
      {
         playButton.click();
         document.getElementById("headerPlayer").pause();
      }
}

function touchStarted(){
    screenIsTouched = 1;
}

function touchEnded(){
    screenIsTouched = 0;
}

document.addEventListener("touchstart", touchStarted);
document.addEventListener("touchend", touchEnded);
document.addEventListener("touchcancel", touchEnded);

document.addEventListener('DOMContentLoaded', function(){
   pageIndex = Math.floor(Math.random() * (3000 + 1));
   main = document.getElementById("main");
   footer = document.getElementById("footer");
   playButton = document.getElementById("playButton");

   lastQueryTs = new Date - 1000000000;
   bookStart();
   fixMargins();

   document.getElementById("footerMenu").addEventListener('mouseover', function(){ toggleClass(document.getElementById("menuLabel"), "hovered")},false);
   document.getElementById("footerMenu").addEventListener('mouseout', function(){ toggleClass(document.getElementById("menuLabel"), "hovered")},false);

   window.addEventListener('resize', function(){fixMargins();});

   timerPageFocused = setInterval(checkPageFocus, 500);
});

