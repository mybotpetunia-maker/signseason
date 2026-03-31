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

  // Close on link click
  var links = mobileMenu.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', closeMenu);
  }
})();
