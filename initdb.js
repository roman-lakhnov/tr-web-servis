const sql = require('better-sqlite3')
const db = sql('data.db')

const dummyData = [
	{
		title: 'title1',
		slug: 'slug1',
		image: 'image1',
		summary: 'summary1',
		instructions: 'instructions1',
		creator: 'John Doe',
		creator_email: 'johndoe@example.com'
	},
	{
		title: 'title2',
		slug: 'slug2',
		image: 'image2',
		summary: 'summary2',
		instructions: 'instructions2',
		creator: 'Max Schwarz',
		creator_email: 'max@example.com'
	},
	{
		title: 'title3',
		slug: 'slug3',
		image: 'image3',
		summary: 'summary3',
		instructions: 'instructions3',
		creator: 'Emily Chen',
		creator_email: 'emilychen@example.com'
	}
]

db.prepare(
	`
   CREATE TABLE IF NOT EXISTS data (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug TEXT NOT NULL UNIQUE,
       title TEXT NOT NULL,
       image TEXT NOT NULL,
       summary TEXT NOT NULL,
       instructions TEXT NOT NULL,
       creator TEXT NOT NULL,
       creator_email TEXT NOT NULL
    )
`
).run()

async function initData() {
	const stmt = db.prepare(`
      INSERT INTO data VALUES (
         null,
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
      )
   `)

	for (const data of dummyData) {
		stmt.run(data)
	}
}

initData()
