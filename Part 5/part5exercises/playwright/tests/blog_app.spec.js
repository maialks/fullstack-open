const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createUser, createBlog, login } = require('./helper')

describe('blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await createUser('lucas', 'root', 'chama')
    await page.goto('http://localhost:5173')
  })
  test('login form is visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByLabel('Username:')).toBeVisible()
    await expect(page.getByLabel('Password:')).toBeVisible()
  })

  describe('login', () => {
    test('succeds w/ correct credentials', async ({ page }) => {
      login(page, 'root', 'chama')
      await expect(page.getByText('Logged as lucas ')).toBeVisible()
    })
    test('fails w/ wrong credentials', async ({ page }) => {
      login(page, 'root', 'wrongpass')
      await expect(page.getByText('Invalid Username or Password')).toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      login(page, 'root', 'chama')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'Orwell',
        'Brazil is in 1984',
        'http://localhost:5173/'
      )
      await expect(page.getByRole('button', { name: 'Save Blog' })).toHaveCount(
        0
      )
      await expect(page.getByText('Brazil is in 1984 Orwell')).toBeVisible()
    })

    describe('and there is a blog', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'Orwell',
          'Brazil is in 1984',
          'http://localhost:5173/'
        )
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'Show More' }).click()
        const likeCount = page.getByTestId('likes')
        const initalLikes = parseInt(likeCount.textContent())
        await page.getByRole('button', { name: 'Like', exact: true }).click()
        expect(parseInt(likeCount.textContent())).toEqual(initalLikes + 1)
      })

      test('blog creator can delete its blog', async ({ page }) => {
        page.on('dialog', (dialog) => dialog.accept())
        await page.getByRole('button', { name: 'Show More' }).click()
        await page.getByRole('button', { name: 'Delete Blog' }).click()
        await expect(
          page.getByText('Blog Deleted Sucessfully: Brazil is in 1984')
        ).toBeVisible()
      })

      test('delete button hidden if logged user is not the creator', async ({
        page,
      }) => {
        await createUser('maximiliano', 'max', 'pass')
        await page.getByRole('button', { name: 'Logou' }).click()
        await login(page, 'max', 'pass')
        await page.getByRole('button', { name: 'Show More' }).click()
        await expect(
          page.getByRole('button', { name: 'Delete Blog' })
        ).toBeHidden()
      })

      test('when more blogs are added and sorted by likes', async ({
        page,
      }) => {
        const blogsToCreate = [
          { author: 'Lucas', title: 'Blog 1', url: 'url1.com', likes: 5 },
          { author: 'Ana', title: 'Blog 2', url: 'url2.com', likes: 10 },
          { author: 'João', title: 'Blog 3', url: 'url3.com', likes: 7 },
        ]
        await page.route('**/api/blogs', async (route, request) => {
          const postData = request.postDataJSON()
          const match = blogsToCreate.find((b) => b.title === postData.title)
          if (match) {
            postData.likes = match.likes
          }

          await route.continue({
            postData: JSON.stringify(postData),
            headers: {
              ...request.headers(),
              'Content-Type': 'application/json',
            },
          })
        })
        for (const blog of blogsToCreate) {
          await createBlog(page, blog.author, blog.title, blog.url)
        }

        await page.getByRole('button', { name: 'sort by likes' }).click()
        await expect(page.locator('.blogHeader > p').nth(0)).toContainText(
          'Blog 2 Ana'
        )
      })
    })
  })
})
