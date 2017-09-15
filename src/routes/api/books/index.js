import { Router } from 'express';
import wrap from 'express-wrap-async';

import logger from '../../../utils/logger';

import Book from '../../../models/book';

const router = Router();


async function booksGet(req, res) {
  const books = await Book.find();
  res.json(books);
}
// curl -H "Content-Type: application/json" -X GET localhost:5000/api/books
router.get('/', booksGet);

async function booksPost(req, res) {
  const book = new Book();
  book.title = req.body.name;
  book.author = req.body.author;
  book.published_date = new Date(req.body.published_date);

  await book.save();
  res.json({result: 1});
}
// curl -H "Content-Type: application/json" -X POST -d '{"name": "test", "author": "ys", "published_date": "2017-09-15"}' localhost:5000/api/books
router.post('/', wrap(booksPost));

router.get('/:book_id', wrap(async (req, res) => {
  const book = await Book.findOne({_id: req.params.book_id});
  if (!book) return res.status(404).json({error: 'not founded'});
  res.json(book);
}));
// curl -H "Content-Type: application/json" -X GET localhost:5000/api/books/1

router.get('/author/:author', wrap(async (req, res) => {
  const books = await Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1});
  if(books.length === 0) return res.status(404).json({error: 'not founded'});
  res.json(books);
}));
// curl -H "Content-Type: application/json" -X GET localhost:5000/api/books/author/1

router.put('/:book_id', wrap(async (req, res) => {
  const book = await Book.findById(req.params.book_id);
  
  if(!book) return res.status(404).json({error: 'not founded'});
  if(req.body.title) book.title = req.body.title;
  if(req.body.author) book.author = req.body.author;
  if(req.body.published_date) book.published_date = req.body.published_date;
  
  await book.save();
  return res.json({message: 'book updated'});
}));
router.delete('/:book_id', wrap((req, res) => { res.end(); }));
// curl -H "Content-Type: application/json" -X PUT -d '{"title": "testChange", "author": "ysChange", "published_date": "2017-09-16"}' localhost:5000/api/books/1


// error handling
router.use((err, req, res, next) => {
  logger.error(`/api/books - url: ${req.originalUrl}, error:`, err);
  res.status(500);
  res.json({
    Error: err.message,
  });
  next();
});
export default router;
