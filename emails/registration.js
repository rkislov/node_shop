const keys = require('../keys')


module.exports = function(to) {
    return {
        to: to,
        from: keys.EMAIL_FROM,
        subject: 'Аккаунт создан',
        html: `
            <h1>Добро пожаловать в наш магазин</h1>
            <p>Вы успешно создали аккаунт с email - ${to}</p>
            <hr />

            <a href="${keys.BASE_URL}">Магазин курсов</a> 
        `
    }
}