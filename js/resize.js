 function setRem(doc, win) {
    let docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        let clientHeight = docEl.clientHeight;
        let clientWidth = docEl.clientWidth;
        if(clientWidth>(clientHeight*16/9))
        {
          doc.getElementsByTagName("html")[0].style.fontSize = 16*clientHeight*6.25/1080 +'px';
        }
        else
        {
          doc.getElementsByTagName("html")[0].style.fontSize = 16*clientWidth*6.25/1920 +'px';
        }

      };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
  }
  window.onload = setRem(document,window);