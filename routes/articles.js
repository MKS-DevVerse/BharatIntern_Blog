const express =require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res)=>{
    res.render('articles/new',{ article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article})
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug})
    if (article==null) res.redirect('/')
    res.render('articles/show', { article: article })
})

router.post('/', async (req,res, next)=> {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

//_method='DELETE'
router.delete('/:id', async (req, res, next) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path) {
    return async (req,res) => {
        let article = req.article
        article.title = req.body.title,
        article.author = req.body.author,
        article.description = req.body.description,
        article.markdown = req.body.markdown,
        article.image[0] = req.body.image1,
        article.image[1] = req.body.image2,
        article.image[2] = req.body.image3
    
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch(e){
            res.render(`articles/${path}`, { article: article})
        }
    }
}

module.exports = router