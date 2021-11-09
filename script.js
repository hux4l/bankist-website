'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

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

