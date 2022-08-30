const fs = require("fs");

// console.log(fs.readFileSync('./1.js').toString());
fs.readdir("./", (err, files) => {
	let lineNum = 0, lines = '';
	files.forEach(x => {
		// console.log(x, x !== files[0] && x !== files[1] , !x.includes("tojson") );
		if(x !== files[0] && x !== files[1] && !x.includes("tojson") && !x.toUpperCase().includes("ALLLOC")){
		// if(x === files[2]){
			let fileContent = fs.readFileSync(x).toString();
			lines = fileContent.replace(/locDb\[/g, '\t');
			lines = lines.replace(/] = /g, ': ');
			lines = lines.replace(/;/g, ',');
			lines = lines.split('\n');
			lines[0] = "{"; //first line delete
			lines[lines.length - 2] = lines[lines.length - 2].replace('],', ']\n}');
			lines = lines.join('\n');
			fs.writeFileSync(x+"on", lines, (a) => console.log(x, "written"));
			// console.log(lines, '\n======\n\n');
		}
	})
});