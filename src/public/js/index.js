//单击返回顶部按钮时
function upTop() {
  (function smoothscroll() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
      window.requestAnimationFrame(smoothscroll);
      window.scrollTo(0, currentScroll - (currentScroll / 5));
    }
  })();
  return true;
}
//滑动屏幕时
window.onscroll = function(){
	const t = document.documentElement.scrollTop || document.body.scrollTop //获取距离页面顶部的距离
  let i = t / (document.body.offsetHeight - window.innerHeight);
  const navAppbar = this.document.getElementsByClassName('nav-appbar')[0]
  const upTopE = this.document.getElementById('upTop')
	if (t >= 120) navAppbar.className += ' navbar-fixed-top top-bg'
  else if (t < 120)  navAppbar.className = 'nav-appbar'
  //当距离顶部超过300px时
  //使div距离底部30px，也就是向上出现
	if (t >= 300)
  upTopE.style.bottom = '15px'
  //如果距离顶部小于300px
	else upTopE.style.bottom = '-75px' //使div向下隐藏
  i = Math.round(i * 100)
  const circle_right = this.document.getElementsByClassName('circle_right')[0],
    circle_left = this.document.getElementsByClassName('circle_left')[0]
	if (i <= 50) {
		circle_right.style.transform = 'rotate(' + i * 3.6 + 'deg)'
		circle_right.style["background"] = "#eee"
		circle_left.style["transform"] = "rotate(0)"
	} else {
    circle_right.style.transform = 'rotate(0)'
		circle_right.style["background"] = "#FF4081"
		circle_left.style["transform"] = 'rotate(' + (i - 51) * 3.6 + 'deg)'
	}
}

// 搜索栏目
const searchFot = document.getElementsByClassName('search-fot')[0]
const searchShow = function(){searchFot.style.display = 'block'}
searchFot.addEventListener('click', ()=> searchFot.style.display ='')
searchFot.getElementsByTagName("form")[0].addEventListener('click', function(e){return e.stopPropagation()})