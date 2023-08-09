const form = document.querySelector('form')
const inputPrompt = document.querySelector('input')

const recents = document.querySelector('section.recents')
const recentsUL = recents.querySelector('ul')

const main = document.querySelector('main')

const recentImages = []

form.addEventListener('submit', (e) => {
  e.preventDefault()
  generateImage(inputPrompt.value)
})

function generateImage(prompt) {
  form.classList.add('disabled')

  main.style.display = 'block'
  main.innerHTML = `<p>Generating image for <span>${prompt}</span></p>`

  fetch('/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'image-alpha-001',
      prompt: prompt,
      num_images: 1,
      size: '512x512',
      response_format: 'url',
    }),
  })
    .then((response) => response.json())
    .then((data) => handleImage(data.data[0].url, prompt))
    .catch((error) => handleError(error))
}

function handleImage(img, prompt) {
  main.style.display = 'block'
  main.innerHTML = `
  <p>${prompt}</p>
  <img src="${img}" alt="Generated Image of ${prompt}" />
  `

  inputPrompt.value = ''
  form.classList.remove('disabled')
  handleRecents(img, prompt)
}

function handleRecents(image, prompt) {
  recents.style.display = 'block'
  recentsUL.innerHTML = ''
  recentImages.reverse()
  recentImages.push({ image, prompt })
  recentImages.reverse().forEach((recent) => {
    recentsUL.innerHTML += `
    <li>
      <a href="${recent.image}" target="_blank" title="${recent.prompt}">
        <img src="${recent.image}" alt="Generated Image of ${recent.prompt}" />
      </a>
    </li>
    `
  })
}

function handleError(msg) {
  main.style.display = 'block'
  main.innerHTML = `
  <p>There was an error with your request. <br> <span>${msg}</span></p>
  `
}
