const connection = require("../db/connection.js");

function index(req, res) {
    const sql = "SELECT * FROM posts";

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore del database" });
        }
        res.json(results);
    });
}

function show(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM posts WHERE id = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore del database" });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Post con id ${id} non trovato`,
            });
        }

        const post = results[0];

        const sqlTags = `
        SELECT tags.id, tags.label
        FROM tags
        JOIN post_tag ON tags.id = post_tag.tag_id
        WHERE post_tag.post_id = ?
        `;

        connection.query(sqlTags, [id], (err, tagsResults) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: `Errore nel recupero dei tag` });
            }

            post.tags = tagsResults;

            res.json(post);
        });
    });
}

function create(req, res) {
    const validationResult = validatePostBody(req.body);
    if (!validationResult.success) {
        return res.status(400).json(validationResult);
    }

    let maxId = 0;
    postsData.forEach((post) => {
        if (post.id > maxId) maxId = post.id;
    });
    const newId = maxId + 1;

    // Costruisco il nuovo oggetto post
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags || [],
    };

    postsData.push(newPost);
    // Costruisco il nuovo oggetto della risposta!?

    res.status(201).json(newPost);
}

function update(req, res) {
    const validationResult = validatePostBody(req.body);
    if (!validationResult.success) {
        return res.status(400).json(validationResult);
    }

    const postToUpdate = postsData.find(
        (post) => id === parseInt(req.params.id),
    );

    if (!postToUpdate) {
        return res.status(404).json({
            success: false,
            message: `Impossibile modificare: Post con id ${postId} non trovato`,
        });
    }

    // Aggiorno i dati
    postToUpdate.title = req.body.title;
    postToUpdate.content = req.body.content;
    postToUpdate.image = req.body.image;
    postToUpdate.tags = req.body.tags;

    // Costruisco il nuovo oggetto della risposta!?
    res.json(postToUpdate);
}

function destroy(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM posts WHERE id = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore del database" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Impossibile eliminare: Post con id ${postId} non trovato`,
            });
        }

        res.sendStatus(204);
    });
}

const validatePostBody = (body) => {
    if (!body) {
        return {
            message: `Payload non leggibile`,
            success: false,
        };
    }

    const { title, content, image, tags } = body;
    let posts = [...postsData];

    if (!title || typeof title !== "string") {
        return {
            success: false,
            message: "Il 'title' è obbligatorio e deve essere una stringa",
        };
    }

    if (!content || typeof content !== "string") {
        return {
            success: false,
            message: "Il 'content' è obbligatorio e deve essere una stringa",
        };
    }

    if (!image || typeof image !== "string") {
        return {
            success: false,
            message:
                "L' 'image' è obbligatoria e il percorso deve essere una stringa",
        };
    }

    if (!tags || !Array.isArray(tags)) {
        return {
            success: false,
            message: "I 'tags' sono obbligatori e devono essere in un array",
        };
    }

    return { success: true, message: "Tutti i parametri sono validi" };
};

module.exports = {
    index,
    show,
    create,
    update,
    destroy,
};
