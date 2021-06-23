

var item = {

    createTemplet: function (title, data, fileList, control) {
        title = title.replace(/<script>/g, '&lt;script;&gt;');
        title = title.replace(/<\/script>/g, '&lt;/script;&gt;');
        data = data.replace(/<\/script>/g, '&lt;/script&gt;');
        data = data.replace(/<script>/g, '&lt;script&gt;');
        templete = `
      <!doctype html>
      <html>
      <head>
      <title>${title}</title>
      <meta charset="utf-8">
      </head>
      <body>
      <h1><a href="/">${title}</a></h1>
      <ol>
      ${fileList}
      </ol>        
      ${control}  
      <h2>${title}</h2>
      <p>${data}</p>
      </body>
      </html>        
      `;
        response.writeHead(200);
    },
    list: function (title, data, control) {
        fs.readdir(`./data`, (err, fileName) => {
            let fileList = '';
            for (i = 0; i < fileName.length; i++) {
                fileList = fileList + `<li><a href = '/?id=${fileName[i]}'>${fileName[i]}</a></li>`
            }
            this.createTemplet(title, data, fileList, control);
            response.end(templete);
        });
    },
}

module.exports = item;