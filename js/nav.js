// Mobile nav toggle
(function() {
  var hamburger = document.querySelector('.site-nav-hamburger');
  var mobileMenu = document.querySelector('.site-nav-mobile');
  var closeBtn = document.querySelector('.site-nav-mobile-close');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) closeMenu();
  });

  // Close on link click, then scroll if it's a hash link on current page
  var links = mobileMenu.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      closeMenu();
      // If it's a same-page hash link, scroll after menu closes
      if (href && href.startsWith('#')) {
        e.preventDefault();
        setTimeout(function() {
          var target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    });
  }
})();
