const _ = require('lodash');

module.exports = {
  totalLikes(blogs) {
    return _.sumBy(blogs, 'likes');
  },

  favoriteBlog(blogs) {
    return !blogs.length ? null : _.maxBy(blogs, 'likes');
  },

  mostBlogs(blogs) {
    if (!blogs.length) return null;
    const mapper = (blogs, author) => ({ author, blogs });
    return _.maxBy(_.map(_.countBy(blogs, 'author'), mapper), 'blogs');
  },

  mostLikes(blogs) {
    if (!blogs.length) return null;
    const mostLikedBlog = this.favoriteBlog(blogs);
    return { author: mostLikedBlog.author, likes: mostLikedBlog.likes };
  },
};
