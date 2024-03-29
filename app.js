const $jobRoleSpan = $('.jobRoleGroup')
const $titleSelect = $('#title')
const colorSelect = document.getElementById('color')
const designSelect = document.getElementById('design')
const colorDiv = document.getElementById('colors-js-puns')
const activitiesField = document.querySelector('.activities')
const costSpan = document.getElementById('cost')
const paymentSelect = document.getElementById('payment')
const creditCardEntry = document.getElementById('credit-card')
const paypalText = document.getElementById('paypalDiv')
const bitcoinText = document.getElementById('bitcoinDiv')
const form = document.querySelector('form')
const activitiesLabel = document.querySelectorAll('.activities input')
const emailInput = document.getElementById('mail')

//adding html label for total cost (calculated in event listener below)
const costLabel = document.createElement('label')
costLabel.textContent = 'Total cost: $0'
costSpan.appendChild(costLabel)
let userCost = 0

//jQuery: hide the job role function on page load
$(document).ready(function() {
    $jobRoleSpan.hide();
})

//jQuery: show the job role input if user selects 'Other' from title dropdown
$titleSelect.change(function() {
    if ($("select ").val()==="other") {
        $jobRoleSpan.show();
    } else {
        $jobRoleSpan.hide()
    }
});

//function to hide elements on page
var hideElement = (elementName, trueOrFalse) => {
    trueOrFalse ? elementName.style.display = 'none' : elementName.style.display = '';
}

//initializes color drop down as hidden
hideElement(colorDiv, true)

//events that spring from t-shirt design selections
designSelect.addEventListener('change', e => {
    //displays color dropdown when design is selected
    if(e.target.value !== designSelect[0].textContent) {
        hideElement(colorDiv, false)
    } else {
        hideElement(colorDiv, true)
    }

    //populates color dropdown with themed shirts
    for (i=0; i<colorSelect.children.length; i++) {
        colorSelect.children[i].className = 'is-hidden'
    }

    if(e.target.value === 'js puns') {
        for(i=0; i<3; i++) {
            colorSelect.children[0].selected = true
            colorSelect.children[i].className = ''
        }
    } else if (e.target.value === 'heart js') {
        colorSelect.children[3].selected = true
        for(i=3; i<6; i++) {
            colorSelect.children[i].className = ''
        }
    }
})

//events that result from activity registration selections
activitiesField.addEventListener('change', e => {
    const date = e.target.attributes['data-day-and-time'].value
    if (e.target.tagName === 'INPUT') { //check for checkbox
        if (e.target.checked === true) {
            //add cost of selection to subtotal
            let itemCost = e.target.attributes['data-cost'].value.substring(1)
            userCost += parseInt(itemCost)
            //disable conflicting checkboxes
            for (i=1; i<activitiesLabel.length; i++) {
                if (activitiesLabel[i].attributes['data-day-and-time'].value === date) {
                    activitiesLabel[i].disabled = true
                }
            e.target.disabled = false
            }
        } else if (e.target.checked === false) {
            //subtract cost of selection to subtotal
            let itemCost = e.target.attributes['data-cost'].value.substring(1)
            userCost -= parseInt(itemCost)
            //enable other checkboxes
            for (i=1; i<activitiesLabel.length; i++) {
                if (activitiesLabel[i].attributes['data-day-and-time'].value === date) {
                    activitiesLabel[i].disabled = false
                }
            }
            
        }
        costLabel.textContent = 'Total cost: $' + userCost
    }
});

//events that result from payment selections
paymentSelect.addEventListener('change', e => {
    if (e.target.value === 'credit card') {
        hideElement(creditCardEntry, false)
        hideElement(paypalText, true)
        hideElement(bitcoinText, true)
    } else if (e.target.value === 'paypal') {
        hideElement(creditCardEntry, true)
        hideElement(paypalText, false)
        hideElement(bitcoinText, true)
    } else if (e.target.value === 'bitcoin') {
        hideElement(creditCardEntry, true)
        hideElement(paypalText, true)
        hideElement(bitcoinText, false)
    }
});

//initializes payment screen without paypal or bitcoin
hideElement(paypalText, true)
hideElement(bitcoinText, true)

//DRY for validation and error indication
var validateField = (criteria, elementId) => {
    element = document.getElementById(elementId)
    if (criteria.test(element.value)) {
        element.className = ''
        return true
    } else {
        element.className = 'invalid-input'
        return false
    }
}
//validations
form.addEventListener('submit', e => {
    e.preventDefault()
    invalidResponse = 0
    if (!validateField(/\w+/, 'name')) {
        invalidResponse += 1
    }
    if (!validateField(/\S+@\S+\.\S+/, 'mail')) {
        invalidResponse += 1
    }
    if (paymentSelect.value === 'credit card') {
        if (!validateField(/\d{13,16}/, 'cc-num')) {
            invalidResponse += 1
        }
        if (!validateField(/^\d{5}$/, 'zip')) {
            invalidResponse += 1
        }
        if (!validateField(/^\d{3}$/, 'cvv')) {
            invalidResponse += 1
        }
    } else if (paymentSelect.value === 'select method') {
        invalidResponse += 1
    }
    activitiesField.className = 'invalid-input'
    checked = 0
    for (i = 0; i < activitiesLabel.length; i++) {
        if (activitiesLabel[i].checked) {
            checked += 1
            activitiesField.className = ''
        }
    }
    if (invalidResponse > 0 || checked === 0) {
        e.preventDefault()
    } else {
        form.submit()
    }
});

//real time error report
emailInput.addEventListener('blur', e => {
    if (validateField(/^$/, 'mail')) {
        blankError = document.createElement('h2')
        blankError.textContent = 'You need to add text!'
        emailInput.parentNode.insertBefore(blankError, emailInput)
        $(blankError).fadeOut(3000)
    } else if (!validateField(/@/, 'mail')) {
        atError = document.createElement('h2')
        atError.textContent = 'You forgot an @'
        emailInput.parentNode.insertBefore(atError, emailInput)
        $(atError).fadeOut(3000)
    } else if (!validateField(/\w+\.\S+/, 'mail')) {
        domainError = document.createElement('h2')
        domainError.textContent = 'Add a domain (.com/.net.edu)!'
        emailInput.parentNode.insertBefore(domainError, emailInput)
        $(domainError).fadeOut(3000)
    }
});
