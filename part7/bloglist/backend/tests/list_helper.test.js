const { describe, it } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../api/utils/list_helper.js');

const blogs = [
  {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];

describe('total likes', () => {
  it('should return 0 with empty blog list', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  it('should return the likes of a blog with a list of a single blog', () => {
    assert.strictEqual(listHelper.totalLikes([blogs[1]]), 5);
  });

  it('should sum all blogs likes', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36);
  });
});

describe('favorite blog', () => {
  it('should return null with empty blog list', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null);
  });

  it('should return the most liked blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2]);
  });
});

describe('most blogs', () => {
  it('should return null with empty blog list', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null);
  });

  it('should return the author with the largest amount of blogs', () => {
    const expected = { author: 'Robert C. Martin', blogs: 3 };
    const actual = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(actual, expected);
  });
});

describe('most likes', () => {
  it('should return null with empty blog list', () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });

  it('should return the author with the most liked blog', () => {
    const expected = { author: 'Edsger W. Dijkstra', likes: 12 };
    const actual = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(actual, expected);
  });
});
