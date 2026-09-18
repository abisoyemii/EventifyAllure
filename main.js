/* Confirms JS actually ran. See the matching .js-ready rule in style.css.
   Also force-reveals everything after 2.5s no matter what, as a second safety net. */
document.documentElement.classList.add('js-ready');
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
}, 2500);

/* ============ MOBILE MENU (every page) ============ */
const burger = document.getElementById('burgerBtn');
const menu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
if (burger && menu) {
  function openMobileMenu(){
    menu.classList.add('open'); burger.classList.add('open');
    burger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden';
  }
  function closeMobileMenu(){
    menu.classList.remove('open'); burger.classList.remove('open');
    burger.setAttribute('aria-expanded','false'); document.body.style.overflow='';
  }
  burger.addEventListener('click', () => { menu.classList.contains('open') ? closeMobileMenu() : openMobileMenu(); });
  if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
  menu.querySelectorAll('a,button').forEach(a => a.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
}

/* ============ SCROLL REVEAL (every page) ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
}, { threshold:0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ============ SERVICES: touch tap toggles the image fade (About / Services pages) ============ */
const svcList = document.getElementById('svcList');
if (svcList) {
  const svcItems = svcList.querySelectorAll('.svc-item');
  const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!canHover) {
    svcItems.forEach(item => {
      item.addEventListener('click', () => {
        const wasActive = item.classList.contains('is-active');
        svcItems.forEach(i => i.classList.remove('is-active'));
        if (!wasActive) item.classList.add('is-active');
      });
    });
  }
}

/* ============ HERO IMAGE SLIDESHOW ============ */

const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));

if (heroSlides.length > 1) {

  let heroIndex = 0;

  setInterval(() => {

    heroSlides[heroIndex].classList.remove('active');

    heroIndex = (heroIndex + 1) % heroSlides.length;

    heroSlides[heroIndex].classList.add('active');

  }, 3500);

}

/* ============ TESTIMONIAL CAROUSEL (Home page only) ============ */
const quotes = document.querySelectorAll('[data-quote]');
const testiCite = document.getElementById('testiCite');
const testiNext = document.getElementById('testiNext');
const testiPrev = document.getElementById('testiPrev');
if (quotes.length && testiNext && testiPrev) {
  const testiCount = document.getElementById('testiCount');
  let ti = 0;
  function showTesti(i){
    ti = (i + quotes.length) % quotes.length;
    quotes.forEach((q, idx) => q.classList.toggle('active', idx === ti));
    if (testiCite) testiCite.textContent = 'EventifyAllure Client';
    if (testiCount) testiCount.textContent = String(ti+1).padStart(2,'0') + ' / ' + String(quotes.length).padStart(2,'0');
  }
  testiNext.addEventListener('click', () => showTesti(ti+1));
  testiPrev.addEventListener('click', () => showTesti(ti-1));
}

/* ============ FAQ ACCORDION (Home / Booking pages) ============ */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if (other !== item) { other.classList.remove('open'); const ob = other.querySelector('.faq-q'); if (ob) ob.setAttribute('aria-expanded','false'); }
    });
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ============ PORTFOLIO LIGHTBOX (Home / Portfolio pages) ============ */
const lbTiles = Array.from(document.querySelectorAll('[data-lightbox]'));
const lightbox = document.getElementById('lightbox');
if (lbTiles.length && lightbox) {
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCat = document.getElementById('lightboxCat');
  let lbIndex = 0;
  function openLightbox(i){
    lbIndex = i;
    const tile = lbTiles[lbIndex];
    const img = tile.querySelector('.folio-image');
    const cat = tile.querySelector('.cat');
    lightboxImg.classList.remove('active');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCat) lightboxCat.textContent = cat ? cat.textContent : '';
    requestAnimationFrame(() => lightboxImg.classList.add('active'));
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){ lightbox.classList.remove('open'); document.body.style.overflow=''; }
  function showLightbox(delta){ openLightbox((lbIndex + delta + lbTiles.length) % lbTiles.length); }
  lbTiles.forEach((tile, i) => {
    tile.addEventListener('click', () => openLightbox(i));
    tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } });
  });
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNextBtn = document.getElementById('lightboxNext');
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightbox(-1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => showLightbox(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(-1);
    if (e.key === 'ArrowRight') showLightbox(1);
  });
}

/* ============ INQUIRY MODAL (every page: the quick popup version) ============ */
const overlay = document.getElementById('modalOverlay');
if (overlay) {
  const modalSteps = overlay.querySelectorAll('[data-modal-step]');
  const progressDots = overlay.querySelectorAll('#modalProgress span');
  let currentStep = 0;
  function openModal(){ overlay.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeModalFn(){ overlay.classList.remove('open'); document.body.style.overflow=''; }
  function goToStep(n){
    modalSteps.forEach((s,i)=> s.classList.toggle('active', i===n));
    progressDots.forEach((d,i)=>{ d.classList.toggle('done', i<n); d.classList.toggle('current', i===n); });
    currentStep = n;
  }
  document.querySelectorAll('[data-open-modal]').forEach(b => b.addEventListener('click', () => { openModal(); goToStep(0); }));
  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModalFn);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModalFn(); });
  overlay.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => goToStep(Math.min(currentStep+1, modalSteps.length-1))));
  overlay.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => goToStep(Math.max(currentStep-1, 0))));
  const submitBtn = overlay.querySelector('[data-submit]');
  if (submitBtn) submitBtn.addEventListener('click', () => goToStep(modalSteps.length-1));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModalFn(); });
} else {
  // Even without the popup modal on this page, "data-open-modal" buttons should still
  // Go somewhere useful: send them to the dedicated Booking page.
  document.querySelectorAll('[data-open-modal]').forEach(b => {
    b.addEventListener('click', () => { window.location.href = 'booking.html'; });
  });
}

/* ============ INLINE BOOKING STEPPER (Booking page: full page version, not a popup) ============ */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  const steps = bookingForm.querySelectorAll('[data-modal-step]');
  const dots = bookingForm.querySelectorAll('#bookingProgress span');
  let step = 0;
  function goTo(n){
    steps.forEach((s,i)=> s.classList.toggle('active', i===n));
    dots.forEach((d,i)=>{ d.classList.toggle('done', i<n); d.classList.toggle('current', i===n); });
    step = n;
    bookingForm.scrollIntoView({ behavior:'smooth', block:'start' });
  }
  bookingForm.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => goTo(Math.min(step+1, steps.length-1))));
  bookingForm.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => goTo(Math.max(step-1, 0))));
  const submitBtn = bookingForm.querySelector('[data-submit]');
  if (submitBtn) submitBtn.addEventListener('click', () => goTo(steps.length-1));
}