const searchBtn = document.querySelector('.search__btn')
const searchInput = document.querySelector('.search__input')
const list = document.querySelector('.game-list-container__games-list')
const pageControlPanel = document.querySelector('.page-control-panel')
const previousPageBtn = document.querySelector('.page-control-panel__previous')
const nextPageBtn = document.querySelector('.page-control-panel__next')
const currentPageDisplay = document.querySelector('.page-control-panel__page-current')
const conectionStatusDispaly = document.querySelector('.connection-status')
const conectionStatusText = document.querySelector('.connection-status__info')
const settingsBtn = document.querySelector('.settings-btn')
const settingsMenu = document.querySelector('.settings')
const settingsApiInput = document.querySelector('.settings__input-box-input')
const settingsSubmitApiKey = document.querySelector('.settings__input-box-btn')
const settingsApiKeys = document.querySelectorAll('.settings__info-two-api-key')

let currentApiKey = '94eeb6fbc3msh379313f565ba29bp1c0d10jsnb352d77edfdc'

const turnActiveApiKeyToGreen = () => {
	settingsApiKeys.forEach(key => {
		if (key.textContent.includes(currentApiKey)) {
			key.classList.add('settings__info-two-api-key--active')
		} else {
			key.classList.remove('settings__info-two-api-key--active')
		}
	})
}
const changeCurrentApikey = () => {
	console.log(settingsApiInput.value)
	currentApiKey = settingsApiInput.value
	turnActiveApiKeyToGreen()
}

const createElement = (tagOfElement, arrayOfClasses) => {
	let newElement = document.createElement(tagOfElement)
	arrayOfClasses.forEach(classToAdd => {
		newElement.classList.add(classToAdd)
	})

	return newElement
}
function fetchApi(searchedPhrase, nrOfPage) {
	const url = `https://steam2.p.rapidapi.com/search/${searchedPhrase}/page/${nrOfPage}`

	return fetch(url, {
		method: 'GET',
		headers: {
			'x-rapidapi-host': 'steam2.p.rapidapi.com',
			'x-rapidapi-key': `${currentApiKey}`,
		},
	})
		.then(response => response.json())
		.catch(err => err)
}
const reviewsValidation = review => {
	if (review === undefined) {
		return 'There is no reviews for this game yet'
	}
	return review.replace('<br>', '\r\n')
}
const priceValidation = price => {
	if (price == 0) {
		return 'Unknown'
	}
	return price
}
const createItemToDisplay = data => {
	let listItem = createElement('li', ['game'])

	listItem.setAttribute('onclick', `location.href='${data.url}'`)

	//creating img for a game
	let img = createElement('img', ['game__img'])
	img.setAttribute('src', data.imgUrl)
	img.setAttribute('alt', `steam image provided for a ${data.title} game`)

	//creating basic info for a game
	let gameInfo = createElement('div', ['game__info'])
	let gameTitle = createElement('p', ['game__info-title'])
	gameTitle.textContent = data.title

	let gameReviews = createElement('p', ['game__info-reviews'])
	let reviews = reviewsValidation(data.reviewSummary)
	gameReviews.innerText = reviews

	let gamePrice = createElement('p', ['game__info-price'])
	gamePrice.textContent = priceValidation(data.price)
	gameInfo.appendChild(gameTitle)
	gameInfo.appendChild(gameReviews)
	gameInfo.appendChild(gamePrice)

	listItem.appendChild(img)
	listItem.appendChild(gameInfo)
	return listItem
}
const showPageControlPanel = () => {
	pageControlPanel.classList.add('page-control-panel--active')
}
const handleConnectionStatusDisplay = connectionText => {
	conectionStatusText.textContent = connectionText
	conectionStatusDispaly.classList.toggle('connection-status--active')
}
const searchGames = async page => {
	const searchedPhrase = searchInput.value
	if (searchedPhrase != '') {
		currentPageDisplay.textContent = page
		let nrOfPage = page
		handleConnectionStatusDisplay('loading...')
		const data = await fetchApi(searchedPhrase, nrOfPage)
		if (data.length === undefined) {
			alert(data.message)
			handleConnectionStatusDisplay('')
		} else {
			handleConnectionStatusDisplay('')
			data.forEach(element => {
				let listItem = createItemToDisplay(element)
				list.appendChild(listItem)
			})
			showPageControlPanel()
		}
	} else {
		alert('U must type a phrase to search')
	}
}
const clearSearchResults = () => {
	for (let i = 0; i < list.children.length; i++) {
		list.children[i].remove()
		i--
	}
}
const handleSettingsMenu = () => {
	if (settingsMenu.classList.contains('settings--active')) {
		settingsMenu.classList.remove('slide-to-right-anim')
		settingsMenu.classList.add('slide-to-left-anim')
		setTimeout(() => {
			settingsMenu.classList.remove('settings--active')
		}, 500)
	} else {
		turnActiveApiKeyToGreen()
		settingsMenu.classList.remove('slide-to-left-anim')
		settingsMenu.classList.add('settings--active')
		settingsMenu.classList.toggle('slide-to-right-anim')
		settingsMenu.classList.add('settings--active')
	}
}
searchBtn.addEventListener('click', () => {
	clearSearchResults()
	searchGames('1')
})
previousPageBtn.addEventListener('click', () => {
	if (currentPageDisplay.textContent > 0) {
		currentPageDisplay.textContent--
		clearSearchResults()
		searchGames(currentPageDisplay.textContent)
	}
})
nextPageBtn.addEventListener('click', () => {
	currentPageDisplay.textContent++
	clearSearchResults()
	searchGames(currentPageDisplay.textContent)
})
settingsBtn.addEventListener('click', handleSettingsMenu)
settingsSubmitApiKey.addEventListener('click', changeCurrentApikey)
