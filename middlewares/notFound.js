function notFound(req, res, next) {
    res.status(404).json({
        success: false,
        message: "Errore 404: Rotta non trovata",
    });
}

module.exports = notFound;
