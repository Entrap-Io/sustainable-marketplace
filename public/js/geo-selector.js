function turkishToUpper(str) {
    return str.replace(/i/g, "İ").replace(/ı/g, "I").toUpperCase();
}

function turkishToLower(str) {
    return str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
}

function turkishTitleCase(str) {
    if (!str) return "";
    return str.split(' ').map(word => {
        if (!word) return "";
        let firstChar = word.charAt(0);
        let upperFirst;
        if (firstChar === 'i') upperFirst = 'İ';
        else if (firstChar === 'ı') upperFirst = 'I';
        else upperFirst = firstChar.toUpperCase();
        
        return upperFirst + turkishToLower(word.slice(1));
    }).join(' ');
}

document.addEventListener('DOMContentLoaded', async () => {
    const citySelect = document.querySelector('select[name="city"]');
    const districtSelect = document.querySelector('select[name="district"]');

    if (!citySelect || !districtSelect) return;

    // Load current values if they exist (for profile pages)
    const currentCity = citySelect.getAttribute('data-current');
    const currentDistrict = districtSelect.getAttribute('data-current');

    try {
        const response = await fetch('/data/turkey_geo.json');
        const data = await response.json();

        // Clear and populate cities
        citySelect.innerHTML = '<option value="">Select City</option>';
        data.forEach(city => {
            const cityName = turkishTitleCase(city.name);
            const option = document.createElement('option');
            option.value = cityName;
            option.textContent = cityName;
            if (cityName === currentCity) option.selected = true;
            citySelect.appendChild(option);
        });

        const updateDistricts = (cityName, selectedDistrict) => {
            districtSelect.innerHTML = '<option value="">Select District</option>';
            const cityData = data.find(c => turkishTitleCase(c.name) === cityName);
            if (cityData) {
                cityData.counties.forEach(county => {
                    const countyName = turkishTitleCase(county);
                    const option = document.createElement('option');
                    option.value = countyName;
                    option.textContent = countyName;
                    if (countyName === selectedDistrict) option.selected = true;
                    districtSelect.appendChild(option);
                });
            }
        };

        citySelect.addEventListener('change', (e) => {
            updateDistricts(e.target.value);
        });

        // Initialize districts if city is already selected
        if (citySelect.value) {
            updateDistricts(citySelect.value, currentDistrict);
        }

    } catch (error) {
        console.error('Error loading city data:', error);
    }
});
