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

    updateChart(currentStandingCharge, breakEven, currentUnitRate, averageUsage, alternativeStandingCharge, alternativeUnitRate);
}

function updateChart(currentStandingCharge, breakEven, currentUnitRate, averageUsage, alternativeStandingCharge, alternativeUnitRate) {
    if (isNaN(averageUsage)) {
        averageUsage = 0;
    }
    const currentPoints = [{
        x: 0,
        y: currentStandingCharge
    }, {
        x: breakEven,
        y: currentStandingCharge + (breakEven * currentUnitRate)
    }, {
        x: averageUsage,
        y: currentStandingCharge + (averageUsage * currentUnitRate)
    }, {
        x: (averageUsage + breakEven) * 3,
        y: currentStandingCharge + ((averageUsage + breakEven) * 3 * currentUnitRate)
    }];
    currentPoints.sort(p => p.x);
    const alternativePoints = [{
        x: 0,
        y: alternativeStandingCharge
    }, {
        x: breakEven,
        y: alternativeStandingCharge + (breakEven * alternativeUnitRate)
    }, {
        x: averageUsage,
        y: alternativeStandingCharge + (averageUsage * alternativeUnitRate)
    }, {
        x: (averageUsage + breakEven) * 3,
        y: alternativeStandingCharge + ((averageUsage + breakEven) * 3 * alternativeUnitRate)
    }];
    alternativePoints.sort(p => p.x);
    chart.data.datasets[0].data = currentPoints;
    chart.data.datasets[1].data = alternativePoints;
    chart.options.scales.x.max = Math.max(breakEven * 2, averageUsage * 1.5);
    chart.options.scales.y.max = Math.max(
        (alternativeStandingCharge + (breakEven * alternativeUnitRate)) * 2,
        (currentStandingCharge + (breakEven * currentUnitRate)) * 2,
        (alternativeStandingCharge + (averageUsage * alternativeUnitRate)) * 1.5,
        (currentStandingCharge + (averageUsage * currentUnitRate)) * 1.5
    );
    chart.data.datasets[2].data = [
        {
            x: breakEven,
            y: -10
        },
        {
            x: breakEven,
            y: Math.max(...currentPoints.map(p => p.y), ...alternativePoints.map(p => p.y)) * 2
        }
    ];
    chart.data.datasets[3].data = [
        {
            x: averageUsage,
            y: -10
        },
        {
            x: averageUsage,
            y: Math.max(...currentPoints.map(p => p.y), ...alternativePoints.map(p => p.y)) * 2
        }
    ];
    chart.update();
}

const ctx = document.getElementById('myChart');
const chart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Current',
            data: [],
            borderWidth: 1,
            showLine: true
        }, {
            label: 'New',
            data: [],
            borderWidth: 1,
            showLine: true
        }, {
            label: 'Break even',
            data: [],
            borderWidth: 1,
            showLine: true
        }, {
            label: 'Daily usage',
            data: [],
            borderWidth: 1,
            showLine: true
        }]
    },
    options: {
        scales: {
            x: {
                beginAtZero: true,
                min: 0,
                max: 10,
                title: {
                    display: true,
                    text: 'Daily usage in kWh'
                }
            },
            y: {
                beginAtZero: true,
                min: 0,
                max: 10,
                title: {
                    display: true,
                    text: 'Price in pence'
                }
            }
        }
    }
});

document.querySelectorAll('input[inputmode=numeric]').forEach(e => e.addEventListener('keyup', numericValidate));
document.querySelectorAll('input[inputmode=numeric]').forEach(e => e.addEventListener('keyup', processForm));
processForm();
