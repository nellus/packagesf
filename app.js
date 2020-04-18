exports.createPackage = () => {
	
	const fs = require('fs');
	const csv = require('csv-parser');

	console.log('Start reading csv file');

	let metadatatypes = [];
	fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
		console.log(row);
		metadatatypes.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
	});
	
	console.log('Writing package.xml for SF');
	fs.open('package.xml', 'w', (err, fd) => {      
		writeMyData(metadatatypes);
	});

	function writeMyData(metadata){
		let filestr = '';
		metadata.forEach(m => {
			filestr += '<'+m.Metadata+'></'+m.Metadata+'>';
		});
		console.log('filestr ' + filestr);
		const data = new Uint8Array(Buffer.from(filestr));
		fs.writeFile('package.xml', data, (err) => {
			if (err) throw err;
			console.log('The file has been saved!');
		});
	}
}