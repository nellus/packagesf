exports.createPackage = () => {
	
	const fs = require('fs');
	const csv = require('csv-parser');
	const readline = require('readline');
	const chalk = require('chalk');

	let version = '47.0';
	const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
	});

	rl.question(chalk.yellow("API Salesforce Version ? "), function(name) {
		version = name.includes('.0') ? name : name + '.0';
		rl.close();
	});

	rl.on("close", function() {
		//process.exit(0);
		console.log(chalk.yellow('Start reading csv file'));

		let metadatatypes = [];
		fs.createReadStream('data.csv')
		.pipe(csv())
		.on('data', (row) => {
			//console.log(row);
			metadatatypes.push(row);
		})
		.on('end', () => {
			console.log(chalk.green('CSV file successfully processed'));
			console.log(chalk.yellow('Writing package.xml for SF'));
			fs.open('package.xml', 'w', (err, fd) => {      
				writeMyData(metadatatypes, version);
			});
		});
	});

	function writeMyData(metadata, versionPkg){
		let filestr = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n';
		filestr += '<Package xmlns="http://soap.sforce.com/2006/04/metadata">\r\n';
		metadata.forEach(m => {
			filestr += '\t<types>\r\n';
			filestr += '\t\t<members>*</members>\r\n';
			filestr += '\t\t<name>'+m.Metadata+'</name>\r\n';
			filestr += '\t</types>\r\n';
		});

		filestr += '\t<version>'+versionPkg+'</version>\r\n';
		filestr += '</Package>';
		const data = new Uint8Array(Buffer.from(filestr));
		fs.writeFile('package.xml', data, (err) => {
			if (err){
				console.log(chalk.red('Error'));
				throw err;
			}
			console.log(chalk.green('The file has been saved!'));
		});
	}
}