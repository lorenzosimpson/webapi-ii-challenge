const router = require('express').Router();
const db = require('./data/db');


router.get('/', (req, res) => {
    db.find()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ error: "The posts information could not be retrieved." }))
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    db.findById(id)
    .then(post => {
        post.length ? res.status(200).json(post) : res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .catch(err => res.status(500).json({ error: "The post information could not be retrieved." }))
})

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(post => {
        if (post.length) {
        db.findPostComments(id)
        .then(comments => res.status(200).json(comments))
        .catch(err => console.log(err))
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => res.status(500).json({ error: "The comments information could not be retrieved." }))

})

router.post('/', (req, res) => {
    const newPost = req.body;
    !newPost.title || !newPost.contents ? res.status(400).json({ error: "Please provide title and contents for the post." })
    :
    db.insert(newPost)
    .then(post => res.status(201).json(newPost))
    .catch(err => res.status(500).json({ error: "There was an error while saving the post to the database" }))
})

router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const post_id = id;
    const commentObj = {...req.body, post_id};

    !commentObj.text ? res.status(400).json({ errorMessage: "Please provide text for the comment." })

    : 

    db.findById(id)
    .then(post => {
        post.length ? 
        db.insertComment(commentObj)
        .then(insertedComment => res.status(201).json(commentObj))
        :
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .catch(err => res.status(500).json({ error: "There was an error while saving the comment to the database" }))
})


router.put('/:id', (req, res) => {
    const id = req.params.id;
    const newObj = req.body;
    // if no title or contents fields in request body
    !newObj.title || !newObj.contents ? res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    : 
    // if both present, move forward
    db.findById(id)
    .then(post => {
        post.length ? 
        db.update(id, newObj)
        .then(updated => 
            db.findById(id)
            .then(newPost => res.status(200).json(newPost))
            ) 
        : res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .catch(err => res.status(500).json({ error: "The post information could not be modified." }))
})

router.delete('/:id', (req, res) => {
    // db.remove(id) => no. of records deleted
    const id = req.params.id;
    //find post with the given id
    db.findById(id)
    .then(post => {
        post.length ? // do something
        db.remove(id)
        .then(deleted => res.status(200).json(post))
        : 
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    })
    .catch(err => res.status(500).json({ error: "The post could not be removed" }))

})




module.exports = router;