module.exports = function(req, res, next) {
    if (!req.session.isAthenticated) {
        return res.redirect('/auth/login')
    }

    next()
}