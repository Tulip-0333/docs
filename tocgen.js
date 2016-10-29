"use strict"
// This file generates TOCs for all the documentation files that want it.
var toc   = require('markdown-toc')
var fs    = require('fs')
var uslug = require('uslug')

function readRecursive(dir, callback) {
	fs.readdir(dir, (err, files) => {
		files.forEach(val => {
			if (val == ".git" || val == "node_modules")
				return
			fs.lstat(dir + "/" + val, (err, stats) => {
				if (err) {
					console.log(err)
					return
				}
				if (stats.isFile() && val.slice(-3) == ".md") {
					callback(dir + "/" + val)
				}
				else if (stats.isDirectory())
					readRecursive(dir + "/" + val, callback)
			})
		})
	})
}

function slugger(w) {
	return uslug(w, {
		allowedChars: "-_~/()"
	})
}

readRecursive(".", (file) => {
	console.log("=> ", file)
	fs.readFile(file, (err, data) => {
		data = data.toString()
		if (err) {
			console.log(err)
			return
		}
		var newData = toc.insert(data, {
			filter: (str, ele, arr) => {
				// remove []
				return str.replace(/[\[\]]/ig, "")
			},
			slugify: slugger,
			bullets: ["*"],
			maxdepth: 3
		})
		fs.writeFile(file, newData.trimRight() + "\n", (err) => {
			if (err)
				console.log(file, err)
		})
	})
})
