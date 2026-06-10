/* =========================
   STUDYSWAP WEBSITE
   JAVASCRIPT FILE
========================= */

/* =========================
   SCROLL REVEAL ANIMATION
========================= */

const reveals =
document.querySelectorAll('.reveal');

function revealElements(){

    reveals.forEach(item => {

        const windowHeight =
        window.innerHeight;

        const revealTop =
        item.getBoundingClientRect().top;

        const revealPoint = 100;

        if(revealTop < windowHeight - revealPoint){

            item.classList.add('active');

        }

    });

}

/* Run On Scroll */

window.addEventListener(
'scroll',
revealElements
);

/* Run On Page Load */

revealElements();


/* =========================
   SMOOTH SCROLL FOR LINKS
========================= */

document
.querySelectorAll('a[href^="#"]')
.forEach(anchor => {

    anchor.addEventListener(
    'click',
    function(e){

        e.preventDefault();

        document
        .querySelector(
        this.getAttribute('href'))
        .scrollIntoView({

            behavior:'smooth'

        });

    });

});


/* =========================
   NAVBAR SHADOW ON SCROLL
========================= */

window.addEventListener(
'scroll',
() => {

    const navbar =
    document.querySelector('.navbar');

    if(window.scrollY > 50){

        navbar.classList.add(
        'navbar-scrolled');

    }else{

        navbar.classList.remove(
        'navbar-scrolled');

    }

});
/* =========================
   COUNTER ANIMATION
========================= */

const counters =
document.querySelectorAll('.stat-box h2');

counters.forEach(counter => {

    const target =
    parseInt(counter.innerText);

    let count = 0;

    const updateCounter = () => {

        const increment =
        target / 100;

        if(count < target){

            count += increment;

            counter.innerText =
            Math.ceil(count) + "+";

            requestAnimationFrame(
            updateCounter);

        }else{

            counter.innerText =
            target + "+";

        }

    };

    updateCounter();

});

const filterButtons =
document.querySelectorAll(".category-filters button");

const products =
document.querySelectorAll(".product-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        products.forEach(product => {

            if (
                filter === "all" ||
                product.dataset.category === filter
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });

    });

});