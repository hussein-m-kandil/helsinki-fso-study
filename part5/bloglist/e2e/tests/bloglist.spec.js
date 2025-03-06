const {
  test,
  expect,
  describe,
  beforeEach,
  afterAll,
} = require('@playwright/test');

const ROOT_URL = '/';
const USERS_URL = '/api/users';
const RESET_URL = '/api/testing/reset';

const userMock = {
  name: 'Superman',
  username: 'superman',
  password: 'Ss@12312',
};

const blogsMock = [
  { author: 'Nowhere-Man', title: 'Nowhere Plans', url: 'https://nowhere.com' },
  { author: 'Spider-Man', title: 'Threads', url: 'https://threadsy.com' },
];

const login = async (page, user) => {
  await page.getByRole('textbox', { name: /username/i }).fill(user.username);
  await page.getByRole('textbox', { name: /password/i }).fill(user.password);
  await page.getByRole('button', { name: /log ?in/i }).click();
};

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: /blog/i }).click();
  await page.getByRole('textbox', { name: /url/i }).fill(url);
  await page.getByRole('textbox', { name: /title/i }).fill(title);
  await page.getByRole('textbox', { name: /author/i }).fill(author);
  await page.getByRole('button', { name: /create/i }).click();
};

const createManyBlogs = async (page, blogs) => {
  for (const blog of blogs) await createBlog(page, blog);
};

beforeEach(async ({ page, request }) => {
  await request.post(RESET_URL);
  await request.post(USERS_URL, { data: userMock });
  await page.goto(ROOT_URL);
});

afterAll(async ({ request }) => await request.post(RESET_URL));

describe('Login form', () => {
  test('should have a title', async ({ page }) => {
    await expect(page).toHaveTitle(/Bloglist/i);
  });

  test('should display the login form on start', async ({ page }) => {
    await expect(page.getByRole('form', { name: /log ?in/i })).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /username/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /password/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /log ?in/i })).toBeVisible();
  });

  test('should login button be of type `submit`', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /log ?in/i }),
    ).toHaveAttribute('type', 'submit');
  });

  test('should login button be disabled while there is an empty field', async ({
    page,
  }) => {
    await expect(page.getByRole('button', { name: /log ?in/i })).toBeDisabled();
  });

  test('should login button NOT be disabled while there is No field empty', async ({
    page,
  }) => {
    const inputs = page.getByRole('textbox');
    const inputsCount = await inputs.count();
    for (let i = 0; i < inputsCount; i++) {
      await inputs.nth(i).fill('Blah blah ...');
    }
    await expect(
      page.getByRole('button', { name: /log ?in/i }),
    ).not.toBeDisabled();
  });
});

describe('Login', () => {
  test('should succeed with correct credentials', async ({ page }) => {
    await login(page, userMock);
    await expect(page.getByRole('button', { name: /log ?out/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /blogs/i })).toBeVisible();
  });

  test('should fail with wrong credentials', async ({ page }) => {
    const badUsername = 'not_user';
    const badPassword = 'Xx@12345';
    await page.getByRole('textbox', { name: /username/i }).fill(badUsername);
    await page.getByRole('textbox', { name: /password/i }).fill(badPassword);
    await page.getByRole('button', { name: /log ?in/i }).click();
    await expect(page.getByRole('form', { name: /log ?in/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /username/i })).toHaveValue(
      badUsername,
    );
    await expect(page.getByRole('textbox', { name: /password/i })).toHaveValue(
      badPassword,
    );
    await expect(page.getByRole('alert')).toHaveText(
      /(invalid|incorrect) username or password/i,
    );
  });
});

describe('Blogs', () => {
  test('should create a new blog', async ({ page }) => {
    await login(page, userMock);
    const { name, username } = userMock;
    await createManyBlogs(page, blogsMock);
    for (let i = 0; i < blogsMock.length; i++) {
      const { author, title, url } = blogsMock[i];
      const blogItem = page.getByRole('listitem').nth(i);
      await blogItem.getByRole('button', { name: /show/i }).click();
      await expect(blogItem.getByText(/0/)).toBeVisible();
      await expect(
        blogItem.getByRole('link', { name: new RegExp(url, 'i') }),
      ).toBeVisible();
      await expect(
        blogItem.getByRole('heading', { name: new RegExp(title, 'i') }),
      ).toBeVisible();
      await expect(
        blogItem.getByRole('heading', { name: new RegExp(author, 'i') }),
      ).toBeVisible();
      await expect(
        blogItem.getByText(new RegExp(`(${name})|(${username})`, 'i')),
      ).toBeVisible();
    }
  });

  test('should like a blog multiple times', async ({ page }) => {
    await login(page, userMock);
    await createBlog(page, blogsMock[0]);
    await page.getByRole('button', { name: /show/i }).click();
    const blogItem = page.getByRole('listitem');
    const likeBtn = blogItem.getByRole('button', { name: /like/i });
    for (let i = 1; i <= 3; i++) {
      await likeBtn.click();
      await expect(blogItem.getByText(new RegExp(i))).toBeVisible();
    }
  });

  test('should remove a blog', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept()); // Confirm removal
    const blog = blogsMock[0];
    await login(page, userMock);
    await createBlog(page, blog);
    const blogTitle = page.getByRole('heading', {
      name: new RegExp(blog.title, 'i'),
    });
    await page.getByRole('button', { name: /show/i }).click();
    await expect(blogTitle).toBeVisible();
    await page.getByRole('button', { name: /remove/i }).click();
    await expect(blogTitle).toBeHidden();
  });

  test('should dismiss a blog removal', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.dismiss()); // dismiss removal
    const blog = blogsMock[0];
    await login(page, userMock);
    await createBlog(page, blog);
    const blogTitle = page.getByRole('heading', {
      name: new RegExp(blog.title, 'i'),
    });
    await page.getByRole('button', { name: /show/i }).click();
    await expect(blogTitle).toBeVisible();
    await page.getByRole('button', { name: /remove/i }).click();
    await expect(blogTitle).toBeVisible();
  });

  test('should only blog creator can see remove button', async ({
    page,
    request,
  }) => {
    const otherUserMock = {
      name: 'Other User',
      username: 'other_user',
      password: 'Oo@12312',
    };
    request.post(USERS_URL, { data: otherUserMock });
    const blog = blogsMock[0];
    await login(page, userMock);
    await createBlog(page, blog);
    await page.getByRole('button', { name: /show/i }).click();
    await expect(page.getByRole('button', { name: /remove/i })).toBeVisible();
    await page.getByRole('button', { name: /log ?out/i }).click();
    await login(page, otherUserMock);
    await page.getByRole('button', { name: /show/i }).click();
    await expect(page.getByRole('button', { name: /remove/i })).toBeHidden();
  });

  test('should be ordered descendingly by likes', async ({ page }) => {
    await login(page, userMock);
    await createManyBlogs(page, blogsMock);
    for (let i = 0; i < blogsMock.length; i++) {
      await page
        .getByRole('listitem')
        .nth(i)
        .getByRole('button', { name: /show/i })
        .click();
    }
    const blogItems = page.getByRole('listitem');
    expect(await blogItems.count()).toBe(blogsMock.length);
    const firstTitleAtStart = page.getByRole('heading', {
      name: new RegExp(blogsMock[0].title, 'i'),
    });
    const lastTitleAtStart = page.getByRole('heading', {
      name: new RegExp(blogsMock[1].title, 'i'),
    });
    for (let i = 0; i < 2; i++) {
      await blogItems
        .filter({ has: lastTitleAtStart })
        .getByRole('button', { name: /like/i })
        .click();
    }
    await expect(blogItems.first().getByText(/2/)).toBeVisible();
    await expect(blogItems.last().getByText(/0/)).toBeVisible();
    for (let i = 0; i < 3; i++) {
      await blogItems
        .filter({ has: firstTitleAtStart })
        .getByRole('button', { name: /like/i })
        .click();
    }
    await expect(blogItems.first().getByText(/3/)).toBeVisible();
    await expect(blogItems.last().getByText(/2/)).toBeVisible();
  });
});
