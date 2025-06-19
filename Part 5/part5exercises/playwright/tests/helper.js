const createUser = async (name, username, password) => {
  try {
    const response = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        username,
        password,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar usuário: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Usuário criado:', data)
    return data
  } catch (error) {
    console.error('Erro:', error)
  }
}

const createBlog = async (page, author, title, url) => {
  await page.getByRole('button', { name: 'Show Form' }).click()
  await page.getByRole('textbox').nth(0).fill(author)
  await page.getByRole('textbox').nth(1).fill(title)
  await page.getByRole('textbox').nth(2).fill(url)
  await page.getByRole('button', { name: 'Save Blog' }).click()
}

const login = async (page, user, pass) => {
  await page.getByRole('button', { name: 'Login' }).click()
  await page.getByLabel('Username:').fill(user)
  await page.getByLabel('Password:').fill(pass)
  await page.getByRole('button', { name: 'Login' }).click()
}

module.exports = { createUser, createBlog, login }
