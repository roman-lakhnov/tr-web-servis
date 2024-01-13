const sql = require('better-sqlite3')

const db = sql('data.db')

function getData() {
	return db.prepare('SELECT * FROM data').all()
}

function getSingleData(slug) {
	return db.prepare('SELECT * FROM data WHERE slug = ?').get(slug)
}
module.exports = { getData, getSingleData }
