import express from 'express'
import 'dotenv/config'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json()) // parse JSON bodies from POST requests
app.use(express.static('public'))

app.post('/generate-image', async (req, res) => {
  const apiKey = process.env.API_KEY
  const apiUrl = 'https://api.openai.com/v1/images/generations'

  try {
    const openAIResponse = await axios.post(apiUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    })

    res.json(openAIResponse.data) // send data back to the client
  } catch (error) {
    console.error(
      'Error calling OpenAI:',
      error.response ? error.response.data : error.message,
    )
    res.status(500).json({ error: 'Failed to generate image' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
