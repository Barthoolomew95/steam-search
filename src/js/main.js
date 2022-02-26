const searchBtn = document.querySelector('.search__btn')
const searchInput = document.querySelector('.search__input')
const list = document.querySelector('.game-list-container__games-list')
const pageControlPanel = document.querySelector('.page-control-panel')
const previousPageBtn = document.querySelector('.page-control-panel__previous')
const nextPageBtn = document.querySelector('.page-control-panel__next')
const currentPageDisplay = document.querySelector('.page-control-panel__page-current')
const conectionStatusDispaly = document.querySelector('.connection-status__info')

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
			'x-rapidapi-key': '94eeb6fbc3msh379313f565ba29bp1c0d10jsnb352d77edfdc',
		},
	})
		.then(response => response.json())
		.catch(err => (conectionStatusDispaly.textContent = err.message))
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
const searchGames = async () => {
	showPageControlPanel()
	const searchedPhrase = searchInput.value
	let nrOfPage = currentPageDisplay.textContent
	conectionStatusDispaly.textContent = 'loading...'
	conectionStatusDispaly.classList.add('connection-status--active')
	const data = await fetchApi(searchedPhrase, nrOfPage)
	conectionStatusDispaly.classList.remove('connection-status--active')
	data.forEach(element => {
		let listItem = createItemToDisplay(element)
		list.appendChild(listItem)
	})
}
const clearSearchResults = params => {
	console.log(list.children.length)
	for (let i = 0; i < list.children.length; i++) {
		list.children[i].remove()
		i--
	}
}
searchBtn.addEventListener('click', searchGames)
previousPageBtn.addEventListener('click', () => {
	if (currentPageDisplay > 0) {
		currentPageDisplay.textContent--
	}
})
nextPageBtn.addEventListener('click', () => {
	currentPageDisplay.textContent++
	console.log(list.children)
	clearSearchResults()
	searchGames()
})
