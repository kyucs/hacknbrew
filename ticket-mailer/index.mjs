import "dotenv/config.js"
import nodemailer from "nodemailer"
import { env } from "node:process"
import { readFile } from "node:fs/promises"

const data = await readFile('./data.csv', { encoding: 'utf-8' })
const entries = []
for (const line of data.split('\n')) {
	if (line.startsWith('#')) continue
	entries.push(line.split(','))
}

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: env.SENDER,
		pass: env.SECRET,
	}
})

const createmsg = c => {
	return `Greetings!
	<br/>
	<br/>
	Check out your ticket using this link: <a href="https://kyucs.github.io/hacknbrew/ticket.html?code=${c}">Download Ticket!</a>
	<br/>
	<br/>
	Thank you for your interest in this event.
	`
}

for (const entry of entries) {
    const [email, code] = entry
	const msg = createmsg(code)
	const mailOptions = {
		from: env.SENDER,
		to: email,
		subject: env.SUBJECT,
		text: msg,
		html: msg,
	}
	console.log(entry)
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error("Failed to send email to: ", entry[0])
			console.error(error)
		} else {
			console.log("Sent: ", entry[0])
			console.log(info.response)
		}
	})
}