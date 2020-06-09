let allUsers = [];
let foundUsers = [];

let inputFind = null;
let btnSearch = null;

let statistics = null;

let countFoundUsers = 0;
let countMen = 0;
let countWomen = 0;
let sumAges = 0;
let averageAges = 0;

let tabFoundUsers = null;

let numberFormat = null;
window.addEventListener('load', () => {
    inputFind = document.querySelector('#txtFind');
    btnSearch = document.querySelector('#btnSearch');
    countFoundUsers = document.querySelector('#countFoundUsers');
    countMen = document.querySelector('#countMen');
    countWomen = document.querySelector('#countWomen');
    sumAges = document.querySelector('#sumAges');
    averageAges = document.querySelector('#averageAges');
    tabFoundUsers = document.querySelector('#tabFoundUsers');
    statistics = document.querySelector('#statistics');

    numberFormat = Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 4 });

    preventFormSubmit();
    fetchUsers();

    particlesJS.load('particles-js', 'js/particlesjs-config.json', function () {
        console.log('callback - particles.js config loaded');
    });
});

function preventFormSubmit() {
    var form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
    });
}

async function fetchUsers() {
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await res.json();

    allUsers = json.results.map((user) => {
        const { name, picture, dob, gender } = user;

        return {
            name: `${name.first} ${name.last}`,
            picture: picture,
            age: dob.age,
            gender: gender,
        };
    });

    render();
    handleUsersButtons();
}

function render() {
    renderFoundUsers();
    renderStatistics();
}

function renderFoundUsers() {
    let usersHTML = '';
    let textInfo = 'Nenhum usuário encontrado';

    if (inputFind.value != '') {
        foundUsers = allUsers.filter((user) => {
            return user.name.toLowerCase().includes(inputFind.value.toLowerCase());
        });

        foundUsers.forEach((user) => {
            const { picture: img, name, age } = user;

            usersHTML += `
            <div class='user'>
                <img src="${img.medium}" alt="${name}">
                <span class="userName">${name}</span>
                <span class="userAge">${age} anos</span>
            </div>
            `;
        });

        if (foundUsers.length > 0) textInfo = foundUsers.length + ' usuário(s) encontrado(s)';
    } else foundUsers = [];

    tabFoundUsers.innerHTML = usersHTML;
    countFoundUsers.textContent = textInfo;
}

function renderStatistics() {
    if (foundUsers.length > 0) {
        document.querySelector('article').scrollIntoView({ behavior: 'smooth' });
        titleStatistics.textContent = 'Estatísticas';
        statistics.style.display = 'block';
        countMen.textContent = foundUsers.filter((user) => {
            return user.gender == 'male';
        }).length;
        countWomen.textContent = foundUsers.filter((user) => {
            return user.gender == 'female';
        }).length;
        sumAges.textContent = foundUsers.reduce((accumulator, current) => {
            return accumulator + current.age;
        }, 0);
        averageAges.textContent = formatNumber(sumAges.textContent / foundUsers.length);
    } else {
        titleStatistics.textContent = 'Sem estatísticas';
        statistics.style.display = 'none';
    }
}

function handleUsersButtons() {
    inputFind.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            render();
        }
        if (inputFind.value.length > 0) {
            btnSearch.removeAttribute('disabled');
        } else {
            btnSearch.setAttribute('disabled', '');
        }
    });

    btnSearch.addEventListener('click', () => {
        if (!btnSearch.hasAttribute('disabled')) render();
    });
}

function formatNumber(number) {
    return numberFormat.format(number);
}
