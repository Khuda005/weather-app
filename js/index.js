import dictionary from './dictionary.js';

const api_key = '3a98326940d64caabe6182641240211';

const form = document.querySelector('#form')
const inputCity = document.querySelector('#inputCity')
const weatherSection = document.querySelector('.weather__container')

let city;

function createCard({ city, country, temp, description, img }) {
    const card = `
            <article class="card">
                <h2 class="card__city">${city} <span class="card__country">${country}</span></h2>
                <div class="card__weather">
                    <div class="card__temp">${temp}°С</div>
                    <div class="card__img">
                        <img src="${img}" alt="weather">
                    </div>
                </div>
                <p class="card__desc">${description}</p>
            </article>
        `
    weatherSection.insertAdjacentHTML('beforeend', card)
}

function removePrevCard() {
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
    const html = `<p class="form__error">${errorMessage}</p>`
    form.insertAdjacentHTML('afterend', html)
};

async function getWeather(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${city}`

    const response = await fetch(url, {
        referrerPolicy: "unsafe-url"
    });
    const data = await response.json();
    return data;
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    city = inputCity.value.trim();

    const data = await getWeather(city);

    if (data.error) {
        removePrevCard();
        showError(data.error.message)
    } else {
        const errorElement = document.querySelector('.form__error');
        if (errorElement) errorElement.remove();

        removePrevCard();

        const info = dictionary.find((el) => {
            if (el.code === data.current.condition.code) return true;
        })

        const filePath = `./img/${data.current.is_day ? 'day' : 'night'}/`;
        const fileName = `${data.current.is_day ? info.day : info.night}.png`;

        const weatherInfo = {
            city: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            description: data.current.is_day ? info.languages[23]['day_text'] : info.languages[23]['night_text'],
            img: filePath + fileName,
        }

        createCard(weatherInfo);
    }

})