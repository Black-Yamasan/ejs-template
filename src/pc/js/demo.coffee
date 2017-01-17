$ ->
  ## --- vars
  $win = $(window)
  $wrapper = $('#wrapper')
  pageTopCss = {
    background: 'rgb(26, 19, 156)',
    width: '80px',
    height: '80px',
    cursor: 'pointer',
    bottom: '-200px'
  }

  ## --- append pageTop
  $wrapper.append('<div id="pagetop"></div>')
  $pageTop = $('#pagetop')
  $pageTop.css(pageTopCss)

  ## --- scrollTop
  $win.on 'scroll', ->
    if $(this).scrollTop() > 100
      $pageTop.stop().animate({
        bottom: '50px'
        }, 200)
    else
      $pageTop.stop().animate({
        bottom: '-200px'
        }, 200)


  $pageTop.on 'click', ->
    $('body, html').stop().animate({
      scrollTop: 0
      }, 500)
    return false





  console.log 'demo script'
