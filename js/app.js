// Ֆիքսված գներ երբ ընտրված են 3 գրքերը
const PRINT_BUNDLE_PRICE = 18900;
const PDF_BUNDLE_PRICE = 6900;

// DOM էլեմենտներ
const checkboxes = document.querySelectorAll('.item-check');
const totalPriceEl = document.getElementById('total-price');
const discountMsgEl = document.getElementById('discount-msg');
const orderBtn = document.getElementById('btn-order-start');

// Իրադարձությունների լսարկում
checkboxes.forEach(cb => {
    cb.addEventListener('change', calculateTotal);
});

/**
 * Հաշվարկում է ընդհանուր գինը զեղչերով
 */
function calculateTotal() {
    let printSum = 0;
    let printCount = 0;
    let pdfSum = 0;
    let pdfCount = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) {
            const price = parseFloat(cb.getAttribute('data-price'));
            const type = cb.getAttribute('data-type');
            
            if (type === 'print') {
                printSum += price;
                printCount++;
            } else {
                pdfSum += price;
                pdfCount++;
            }
        }
    });

    // Զեղչի տրամաբանություն: Եթե ընտրված են 3 Տպագիր -> 18900, 3 PDF -> 6900
    let finalPrint = (printCount === 3) ? PRINT_BUNDLE_PRICE : printSum;
    let finalPdf = (pdfCount === 3) ? PDF_BUNDLE_PRICE : pdfSum;

    let total = finalPrint + finalPdf;

    // UI թարմացում
    totalPriceEl.textContent = Math.ceil(total) + " ֏";
    
    if (printCount === 3 || pdfCount === 3) {
        discountMsgEl.textContent = "Զեղչը կիրառված է";
        discountMsgEl.classList.add("text-tradeGreen");
    } else {
        discountMsgEl.textContent = "Ընտրեք 3 գիրք (նույն տիպի) զեղչի համար";
        discountMsgEl.classList.remove("text-tradeGreen");
    }

    if (total > 0) {
        orderBtn.disabled = false;
    } else {
        orderBtn.disabled = true;
        document.getElementById('order-form').classList.add('hidden');
    }
}

/**
 * Ցույց է տալիս պատվերի ձևը
 */
function showOrderForm() {
    const form = document.getElementById('order-form');
    form.classList.remove('hidden');
    // Հապաղում՝ DOM-ի թարմացման համար մոբայլում
    setTimeout(() => {
        form.scrollIntoView({behavior: 'smooth'});
    }, 100);
}

/**
 * Բացում է գրքի մանրամասների մոդալը
 * @param {number} id - Գրքի ID
 */
let currentBookId = 1;
let currentSlide = 0;
const totalSlides = 5;
let preloadedImages = {};

/**
 * Նախապես բեռնում է բոլոր սլայդերի նկարները
 * @param {number} bookId - Գրքի ID
 */
function preloadImages(bookId) {
    if (preloadedImages[bookId]) return;
    
    preloadedImages[bookId] = [];
    const bookFolder = `book ${bookId}`;
    
    for (let i = 1; i <= totalSlides; i++) {
        const img = new Image();
        const photoNumber = String(i).padStart(2, '0');
        img.src = `img/${bookFolder}/photo_${photoNumber}.jpg`;
        preloadedImages[bookId].push(img);
    }
}

function openModal(id) {
    currentBookId = id;
    currentSlide = 0;
    
    const modal = document.getElementById('bookModal');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    desc.style.whiteSpace = "pre-line";
    
    preloadImages(id);

    if(id === 1) {
        title.textContent = "ՊԱՐԶ Թրեյդինգի ուղեցույց";
        desc.textContent =
  "Հիմքը, առանց որի անհնար է։\n" +
  "✅ 7 հզոր և փորձարկված ռազմավարություն։\n" +
  "✅ 100+ գրաֆիկներ՝ բարդը պարզ դարձնող բացատրություններով։\n" +
  "✅ Ինչպես խուսափել ավելորդ կորուստներից։";
    } else if(id === 2) {
        title.textContent = "Գնային շարժում և կառուցվածքներ";
       desc.textContent =
  "Հասկացիր շուկայի լեզուն:\n" +
  "✅ 15 հիմնական ստրատեգիա՝ գնի շարժը կանխատեսելու համար։\n" +
  "✅ 15 տեխնիկական կառուցվածքներ։\n" +
  "✅ Ռիսկի կառավարում (Risk Management)՝ կապիտալը պաշտպանելու համար։\n" +
  "✅ 120+ իրական շուկայի օրինակներ՝ ճշգրիտ մուտքի և ելքի կետերով։";
    } else {
        title.textContent = "Տեխնիկական վերլուծություն";
        desc.textContent =
  "Վերլուծության բարձրագույն մակարդակ։\n" +
  "✅ Շուկայի տեխնիկական պատկերի խորքային վերլուծություն։\n" +
  "✅ 15 տեխնիկական կառուցվածքներ։\n" +
  "✅ Գրաֆիկական մոդելներ, որոնք ազդարարում են թրենդի փոփոխությունը։\n" +
  "✅ Ինդիկատորներ, որոնք օգնում են կայացնել օբյեկտիվ որոշումներ։";
    }
    
    createDots();
    updateSlider();
    modal.classList.remove('hidden');
}

// Предзагрузка всех изображений при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 3; i++) {
        preloadImages(i);
    }
});

/**
 * Փակում է մոդալը
 */
function closeModal() {
    document.getElementById('bookModal').classList.add('hidden');
    currentSlide = 0;
}

/**
 * Փոխում է ընթացիկ սլայդը
 * @param {number} direction - Ուղղություն: -1 = հետ, 1 = առաջ
 */
function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    
    updateSlider();
}

/**
 * Թարմացնում է սլայդերի պատկերը և ինդիկատորները
 */
function updateSlider() {
    const img = document.getElementById('modal-img');
    const bookFolder = `book ${currentBookId}`;
    const photoNumber = String(currentSlide + 1).padStart(2, '0');
    
    img.src = `img/${bookFolder}/photo_${photoNumber}.jpg`;
    
    updateDots();
}

/**
 * Ստեղծում է ինդիկատորների կետերը
 */
function createDots() {
    const dotsContainer = document.getElementById('slider-dots');
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'w-2 h-2 rounded-full transition';
        dot.onclick = () => {
            currentSlide = i;
            updateSlider();
        };
        dotsContainer.appendChild(dot);
    }
}

/**
 * Թարմացնում է ինդիկատորների վիզուալ վիճակը
 */
function updateDots() {
    const dots = document.getElementById('slider-dots').children;
    
    for (let i = 0; i < dots.length; i++) {
        if (i === currentSlide) {
            dots[i].classList.add('bg-tradeYellow', 'w-8');
            dots[i].classList.remove('bg-gray-500');
        } else {
            dots[i].classList.add('bg-gray-500');
            dots[i].classList.remove('bg-tradeYellow', 'w-8');
        }
    }
}

/**
 * Բացում/փակում է մոբայլ մենյուն
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const burgerIcon = document.getElementById('burger-icon');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        // Փոխում ենք բուրգերի իկոնը X-ի
        burgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
    } else {
        mobileMenu.classList.add('hidden');
        // Վերադարձնում ենք բուրգերի իկոնը
        burgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
    }
}

/**
 * Բացում/փակում է FAQ հարցերը
 * @param {number} id - FAQ-ի ID
 */
function toggleFaq(id) {
    const currentFaq = document.getElementById(`faq-${id}`);
    const currentArrow = document.getElementById(`arrow-${id}`);
    const isHidden = currentFaq.classList.contains('hidden');
    
    // Փակում ենք բոլոր FAQ-ները
    for (let i = 1; i <= 5; i++) {
        const faq = document.getElementById(`faq-${i}`);
        const arrow = document.getElementById(`arrow-${i}`);
        if (faq && arrow) {
            faq.classList.add('hidden');
            arrow.classList.remove('rotate-180');
        }
    }
    
    // Բացում ենք ընթացիկը, եթե այն փակ էր
    if (isHidden) {
        currentFaq.classList.remove('hidden');
        currentArrow.classList.add('rotate-180');
    }
}

/**
 * Ուղարկում է պատվերը Telegram-ի միջոցով
 * @param {Event} e - Submit իրադարձություն
 */
async function sendOrder(e) {
    e.preventDefault();

    const name = document.getElementById('u_name').value;
    const phone = document.getElementById('u_phone').value;
    const contact = document.getElementById('u_contact').value;
    const total = totalPriceEl.textContent;
    
    let items = [];
    checkboxes.forEach(cb => {
        if(cb.checked) {
            items.push(cb.getAttribute('data-name'));
        }
    });

    // Անջատում ենք ուղարկման կոճակը
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Ուղարկվում է...';

    try {
        const response = await fetch('/api/send-telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                phone,
                contact,
                items,
                total
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Հաջող ուղարկում
            alert('✅ Պատվերը հաջողությամբ ուղարկվեց! Մենք կկապվենք ձեզ հետ մոտ ժամանակներում:');
            
            // Մաքրում ենք ձևը
            document.getElementById('contactForm').reset();
            checkboxes.forEach(cb => cb.checked = false);
            calculateTotal();
            document.getElementById('order-form').classList.add('hidden');
        } else {
            // Սխալ սերվերից
            alert('❌ Սխալ: ' + (data.error || 'Չհաջողվեց ուղարկել պատվերը'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Կապի սխալ: Ստուգեք ինտերնետը և փորձեք կրկին:');
    } finally {
        // Միացնում ենք կոճակը հետ
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}