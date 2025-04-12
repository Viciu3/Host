// scripts/script.js

function updateMSKTime() {
  const now = new Date();
  const mskOffset = 3 * 60 * 60 * 1000;
  const mskTime = new Date(now.getTime() + mskOffset);

  const hours = String(mskTime.getHours()).padStart(2, '0').slice(-2);
  const minutes = String(mskTime.getMinutes()).padStart(2, '0').slice(-2);
  const seconds = String(mskTime.getSeconds()).padStart(2, '0').slice(-2);

  document.getElementById('msk-time').textContent = `MSK-Time: ${hours}:${minutes}:${seconds}`;
}

setInterval(updateMSKTime, 1000);
updateMSKTime();

const navLinks = document.querySelectorAll('.main-nav .nav-icon');
const contentSections = document.querySelectorAll('[class^="content-section"]');
const mainContent = document.getElementById('main-content');
const loginButton = document.getElementById('login-button');
const headerElement = document.querySelector('header');
const homeLogoContainer = document.querySelector('.home-logo-container');
const developerCard = document.querySelector('.developer-card'); // Получаем элемент карточки разработчика

function showSection(targetId) {
  contentSections.forEach(section => {
    section.style.display = 'none';
  });
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.style.display = 'block';
    mainContent.style.display = 'block';
  }

  headerElement.style.display = targetId === 'home-section' ? 'none' : 'flex';

  if (homeLogoContainer) {
    homeLogoContainer.style.display = targetId === 'home-section' ? 'flex' : 'none';
  }

  // Показываем карточку разработчика только на странице "Contact"
  if (developerCard) {
    developerCard.style.display = targetId === 'contact-section' ? 'block' : 'none';
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    const targetId = this.dataset.target;
    showSection(targetId);
  });
});

if (loginButton) {
  loginButton.addEventListener('click', function(event) {
    showSection('profile-section');
  });
}

showSection('home-section');
headerElement.style.display = 'none';
if (homeLogoContainer) {
  homeLogoContainer.style.display = 'flex';
}

// Синхронизация полей конфигурации и пользователя
const subModeUser = document.getElementById('subscription-mode');
const customMonthsUserDiv = document.getElementById('custom-months-user');
const monthsUser = document.getElementById('months-user');
const currencyUser = document.getElementById('currency');
const priceUser = document.getElementById('price-user');

const subModeConfig = document.getElementById('config-subscription-days');
const customMonthsConfigDiv = document.getElementById('config-custom-months');
const monthsConfig = document.getElementById('config-months');
const currencyConfig = document.getElementById('config-currency');
const configSection = document.getElementById('Config');

function syncConfigToUser() {
  subModeUser.value = subModeConfig.value;
  if (subModeConfig.value === '0') {
    customMonthsUserDiv.style.display = 'block';
    monthsUser.value = monthsConfig.value;
  } else {
    customMonthsUserDiv.style.display = 'none';
  }
  currencyUser.value = currencyConfig.value;
  calculatePriceUser();
}

function syncUserToConfig() {
  subModeConfig.value = subModeUser.value;
  if (subModeUser.value === '0') {
    customMonthsConfigDiv.style.display = 'block';
    monthsConfig.value = monthsUser.value;
  } else {
    customMonthsConfigDiv.style.display = 'none';
  }
  currencyConfig.value = currencyUser.value;
  calculatePriceUser();
}

subModeConfig.addEventListener('change', syncConfigToUser);
monthsConfig.addEventListener('input', syncConfigToUser);
currencyConfig.addEventListener('change', syncConfigToUser);

subModeUser.addEventListener('change', syncUserToConfig);
monthsUser.addEventListener('input', syncUserToConfig);
currencyUser.addEventListener('change', syncUserToConfig);

// JavaScript для обработки цен
const nameInput = document.getElementById('name');
const idInput = document.getElementById('id');
const numberBotsInput = document.getElementById('number-bots');
const pricePerBotMonthRub = 100;
const pricePerBotMonthUah = 50;
const pricePerBotMonthStars = 200;

function calculatePriceUser() {
  const numBots = parseInt(numberBotsInput.value) || 0;
  let numMonths = 0;
  const selectedMode = subModeUser.value;

  if (selectedMode === '0') {
    numMonths = parseInt(monthsUser.value) || 0;
  } else {
    numMonths = parseInt(selectedMode) || 0;
  }

  let price = 0;
  const selectedCurrency = currencyUser.value;

  if (numBots >= 1 && numBots <= 100 && numMonths >= 1) {
    if (selectedCurrency === '1') {
      price = numBots * numMonths * pricePerBotMonthStars;
    } else if (selectedCurrency === '2') {
      price = numBots * numMonths * pricePerBotMonthRub;
    } else if (selectedCurrency === '3') {
      price = numBots * numMonths * pricePerBotMonthUah;
    }
  }

  document.getElementById('price-user').value = price.toFixed(2);
}

subModeUser.addEventListener('change', function() {
  document.getElementById('custom-months-user').style.display = this.value === '0' ? 'block' : 'none';
  calculatePriceUser();
});

document.getElementById('months-user').addEventListener('input', calculatePriceUser);
document.getElementById('number-bots').addEventListener('input', calculatePriceUser);
document.getElementById('currency').addEventListener('change', calculatePriceUser);

// Всплывающее окно с информацией
const startButton = document.getElementById('start-button');
const infoModal = document.getElementById('info-modal');
const modalInfo = document.getElementById('modal-info');
const closeButton = document.querySelector('.close-button');
const copyButton = document.getElementById('copy-button');

startButton.addEventListener('click', function() {
  const name = document.getElementById('name').value;
  const id = document.getElementById('id').value;
  const bots = document.getElementById('number-bots').value;
  const subMode = document.getElementById('subscription-mode');
  const subText = subMode.options[subMode.selectedIndex].text;
  const months = subMode.value === '0' ? document.getElementById('months-user').value : '';
  const currency = document.getElementById('currency');
  const currencyText = currency.options[currency.selectedIndex].text;
  const price = document.getElementById('price-user').value;

  const infoText = `Name: ${name}<br>ID: ${id}<br>Number of Bots: ${bots}<br>Subscription: ${subText} ${months ? '(' + months + ' months)' : ''}<br>Currency: ${currencyText}<br>Price: ${price}`;
  modalInfo.innerHTML = infoText; // Используем innerHTML для отображения HTML-тегов
  infoModal.style.display = 'block';
});

closeButton.addEventListener('click', function() {
  infoModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target == infoModal) {
    infoModal.style.display = 'none';
  }
});

copyButton.addEventListener('click', function() {
  const textToCopy = modalInfo.textContent;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('Information copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
});

// Сброс данных
const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', function() {
  nameInput.value = '';
  idInput.value = '';
  numberBotsInput.value = '';
  subModeUser.value = '0';
  document.getElementById('custom-months-user').style.display = 'none';
  monthsUser.value = '';
  currencyUser.value = '1';
  calculatePriceUser();
  syncUserToConfig(); // Обновляем и конфиг тоже
});

// Показать/скрыть настройки конфигурации
const configButton = document.getElementById('config-button');
configSection.style.display = 'none'; // Скрываем по умолчанию

configButton.addEventListener('click', function() {
  configSection.style.display = configSection.style.display === 'none' ? 'block' : 'none';
});

// Скрываем карточку разработчика при загрузке
if (developerCard) {
  developerCard.style.display = 'none';
}
