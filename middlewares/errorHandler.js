function errorHandler(err, req, res, next) {
    console.error(err.stack);

    res.statuts(500).json({
        succes: false,
        message: "Errore interno del server",
    });
}

module.exports = errorHandler;
