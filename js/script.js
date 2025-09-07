function numericValidate(e) {
    if (isNaN(parseFloat(e.target.value))) {
        e.target.setAttribute('aria-invalid', 'true');
    } else {
        e.target.removeAttribute('aria-invalid');
    }
}

function processForm(_) {
    const currentUnitRate = parseFloat(document.getElementById('current-unit-rate').value);
    const currentStandingCharge = parseFloat(document.getElementById('current-standing-charge').value);
    const alternativeUnitRate = parseFloat(document.getElementById('alternative-unit-rate').value);
    const alternativeStandingCharge = parseFloat(document.getElementById('alternative-standing-charge').value);
    const averageUsage = parseFloat(document.getElementById('daily-usage').value);

    if (isNaN(currentUnitRate) || isNaN(currentStandingCharge) || isNaN(alternativeUnitRate) || isNaN(alternativeStandingCharge)) {
        // Let's bail
        document.getElementById('result-text').innerHTML = '&nbsp;';
        return;
    }

    const breakEven = (currentStandingCharge - alternativeStandingCharge) / (alternativeUnitRate - currentUnitRate);
    document.getElementById('result-text').innerHTML = `The break even point is <strong>${breakEven.toFixed(2)}</strong> kWh.`;

    if (!isNaN(averageUsage)) {
        if (breakEven < averageUsage) {
            document.getElementById('result-text').innerHTML += ' Since you use more energy than the break-even point, the new tariff works out better for you.';
        } else {
            document.getElementById('result-text').innerHTML += ' Since you use less energy than the break-even point, your current tariff works out better for you.';
        }
    }
}

document.querySelectorAll('input[inputmode=numeric]').forEach(e => e.addEventListener('change', numericValidate));
document.querySelectorAll('input[inputmode=numeric]').forEach(e => e.addEventListener('change', processForm));
processForm();
