// Զեղչի դրույքաչափ
const DISCOUNT_RATE = 0.10; // 10%

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

    // Զեղչի տրամաբանություն: (Քանակ > 1) ? Գումար * 0.9 : Գումար
    let finalPrint = (printCount > 1) ? printSum * (1 - DISCOUNT_RATE) : printSum;
    let finalPdf = (pdfCount > 1) ? pdfSum * (1 - DISCOUNT_RATE) : pdfSum;

    let total = finalPrint + finalPdf;

    // UI թարմացում
    totalPriceEl.textContent = Math.ceil(total) + " ֏";
    
    if (printCount > 1 || pdfCount > 1) {
        discountMsgEl.textContent = "Զեղչը կիրառված է (10%)";
        discountMsgEl.classList.add("text-tradeGreen");
    } else {
        discountMsgEl.textContent = "Ընտրեք 2 կամ ավել գիրք (նույն տիպի) զեղչի համար";
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
function openModal(id) {
    const modal = document.getElementById('bookModal');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const img = document.getElementById('modal-img');

    if(id === 1) {
        title.textContent = "ՊԱՐԶ Թրեյդինգի ուղեցույց";
        desc.textContent = "Այս գիրքը սկսնակների համար է: Սովորեք մոմային մոդելները, հիմնական հասկացությունները և ինչպես կարդալ գրաֆիկները պարզ լեզվով:";
        img.src = "https://i.postimg.cc/YSxwN717/01.jpg";
    } else if(id === 2) {
        title.textContent = "Գնային շարժում և կառուցվածքներ";
        desc.textContent = "Price Action-ի խորացված ուսումնասիրություն: Իմացեք, թե ինչպես են շուկայի մեծ խաղացողները շարժում գները և ինչպես միանալ նրանց:";
        img.src = "https://i.postimg.cc/YqmKnY1V/02.jpg";
    } else {
        title.textContent = "Տեխնիկական վերլուծություն";
        desc.textContent = "Գրաֆիկական ֆիգուրներ, ինդիկատորներ և շուկայի հոգեբանություն: Ամբողջական ձեռնարկ պրոֆեսիոնալ վերլուծության համար:";
        img.src = "https://i.postimg.cc/FKNMH6wy/03.jpg";
    }
    modal.classList.remove('hidden');
}

/**
 * Փակում է մոդալը
 */
function closeModal() {
    document.getElementById('bookModal').classList.add('hidden');
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
