'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const header = document.querySelector('.header');

// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// adds openModal event on click for all same buttons
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));



for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth scrolling

// button scrolling
btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  /* OLD WAY

    // gets the rectangle from DOM size of the element
    const s1coords = section1.getBoundingClientRect();
    console.log(s1coords);

    console.log(e.target.getBoundingClientRect());
    // current scroll position
    console.log('Current scroll x/y', window.pageXOffset, window.pageYOffset);
    console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

    // scrolling, old way
    // window.scrollTo({left: s1coords.left + window.pageXOffset, top: s1coords.top + window.pageYOffset, behavior: 'smooth',});
  */

  // new way
  section1.scrollIntoView({behavior: 'smooth'});
});

////////////////////////////////////
// Page navigation
/*

// with many links it will be problem
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    // gets href attribute from link href
    const id = this.getAttribute('href');
    // creates section selector based on id attribute we get
    const section = document.querySelector(id);
    // smooth scroll to given section
    section.scrollIntoView({behavior: 'smooth'});
  });
});
*/

// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // if id is not # apply smooth scrolling
    if (id !== '#') {
      const section = document.querySelector(id);
      section.scrollIntoView({behavior: 'smooth'});
    }
  }
})

////////////////////////////////////
// Tabbing component

tabsContainer.addEventListener('click', function (el) {
  el.preventDefault();

  const clicked = el.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause, if nothing clicked dont do anything
  if (!clicked) return;

  // remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  // active tab
  clicked.classList.add('operations__tab--active');

  // active content area
  // console.log(clicked.dataset.tab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


///////////////////////////////////////////
// passing arguments into event handlers

// Menu fade animation
const fadeOut = function (e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

// passing "argument" into handler
// workaround that event handler functions can get only one argument
nav.addEventListener('mouseover', fadeOut.bind(0.5));
nav.addEventListener('mouseout', fadeOut.bind(1));


///////////////////////////////////////
// sticky navigation

// window.addEventListener('scroll', function (e) {
//
//   // sticky navigation
//   const initialCoords = section1.getBoundingClientRect();
//
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// observation api, intersection

/*

// call each time the section1 hits 10% of observed section
const obsCallback = function f(entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  })
};

// options for observer, root will look for whole document, threshold is tolerance
const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

const navHeight = nav.getBoundingClientRect().height;

// callback function for observer
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

// observer for header section
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // gets nav height sooner as the intersection threshold starts
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
// revealing elements on scroll

// reveal section

const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
  }
  observer.unobserve(entry.target);
};

// reveal section when is visible on 15%
const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
// adds to all sections intersection observer
allSections.forEach((function (section) {
  sectionsObserver.observe(section);
  // section.classList.add('section--hidden');
}))


///////////////////////////////////////
// lazy loading images

// select only with data-src parameter
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // guard class
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // remove only when finished loading
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);

};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// slider component

const slider = function () {

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;

// functions
// dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend',
          `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

// activate dot
  const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };
// activate dot after reload, default


  const goToSlide = function (slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${(i - slide) * 100}%)`);
  }

// adds transform x by % to place one to each other
// slides.forEach((s, i) => s.style.transform = `translateX(${100 * i}%)`);
// 0%, 100%, 200%, 300%


// slider.style.transform = 'scale(0.5) translateX(-1200px)';
// slider.style.overflow = 'visible';

// adds event listeners to buttons
// next slide


  const nextSlide = function () {
    if (curSlide === slides.length - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    // subtracts current slide from actual slide
    // slides.forEach((s, i) => s.style.transform = `translateX(${(i - curSlide) * 100}%)`);
    goToSlide(curSlide);
    activateDot(curSlide);
  }

// previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = slides.length - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  }

// initialise slider
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

// event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

// map key buttons to slide
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

// map dots events
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const {slide} = e.target.dataset;
      // console.log('DOT');
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();


// {
//
//   if(e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');
//
//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 1;
//     });
//     logo.style.opacity = 1;
//   }
//
//   fadeOut(e, 1);
//
// });
/*

// selecting, creating and deleting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

// selects first with matched selector
const header = document.querySelector('.header');

// returns node list with all matched selector
const allSelectors = document.querySelectorAll('.section');
console.log(allSelectors);

// select with chosen id, returns HTML collection, dont updates
document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

// gets based on class name, returns live collection, updates automatically if not in variable
console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
// .insertAdjacentHTML

// just create element div
const message = document.createElement('div');
// add classes
message.classList.add('cookie-message');
// add text
// message.textContent = 'We use cookies for improved functionality and analytics.';
// insert HTML
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// add element as first child of the parent element
// header.prepend(message);
// can use not only for inserting but also moving elements
header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);  // sibling
// header.after(message);   // sibling

// delete element
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
  // removes the element from DOM
  // message.remove();
  message.parentElement.removeChild(message);
});


// styles, attributes and classes
// styles
message.style.backgroundColor = '#37383d';
message.style.width = '98vw';

console.log(message.style.color);
console.log(message.style.backgroundColor);

// gets computed style, as is in final HTML page
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

// increased height based on calculated
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// css :root is equivalent to javascript document
// by selecting css variable we can change color everywhere
document.documentElement.style.setProperty('--color-primary', 'orangered');

// attributes
// when selecting creates all attributes for selected object, we can then access them
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);

// absolute path
console.log(logo.src);
// relative path
console.log(logo.getAttribute('src'));

logo.alt = 'Minimalist logo';
logo.setAttribute('company', 'Bankist');

console.log(logo.classList);
console.log(logo.className);

const link = document.querySelector('.btn--show-modal');
console.log(link.href);
console.log(link.getAttribute('href'));

// data attribute, is always in dataset
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c')
logo.classList.remove('c');
logo.classList.toggle('c');
console.log(logo.classList.contains('c'));

*/




// types of events and event handlers
/*

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading');

  h1.removeEventListener('mouseenter', alertH1);
}

const h1 = document.querySelector('h1');
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// another way, old way to do it
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading')
// };
*/

/*

// Bubbling and Capturing events
// event propagation
// bubbling
// rgb(0 , 0, 0)
const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const rndColor = () => `rgb(${rndInt(0, 255)}, ${rndInt(0, 255)}, ${rndInt(0, 255)})`;
console.log(rndColor());

const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelector('.nav__link');

navLink.addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = rndColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // stop propagation
  // event applies only on first element not on the parent elements
  e.stopPropagation();
});

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = rndColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});


// third parameter, capture parameter, will not listen to bubbling but capture event
nav.addEventListener('click', function (e) {
  e.preventDefault();
  this.style.backgroundColor = rndColor();
  console.log('NAV', e.target, e.currentTarget);
}
// , true
);

*/

// dom traversing
/*

const h1 = document.querySelector('h1');
// going downwards: child
// works no matter how depp they are into the DOM tree
console.log(h1.querySelectorAll('.highlight'));
// returns all child nodes inc text
console.log(h1.childNodes);
// live children nodes, only direct children
console.log(h1.children);
h1.firstElementChild.style.color = 'white';

// going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// we need to find parent element no matter how far is
h1.closest('.header').style.background = 'var(--gradient-primary)';

// going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
// we can work as with array
// scale all siblings except h1
[...h1.parentElement.children].forEach(function (el) {
  if(el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
})
*/

