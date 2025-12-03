module.exports = (err, req, res, _next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.message || 'Algo salió mal en el servidor',
    });
};
