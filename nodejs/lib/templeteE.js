module.exports = {
  createTemplet: function (title, data, list, control, author) {
    const sanitizeHtml = require('sanitize-html');
    const sanitizedData = sanitizeHtml(data, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['form', 'input', 'p', 'textarea']),
      disallowedTagsMode: 'escape',
      allowedAttributes: {
        input: ['type', 'name', 'placeholder', 'value'],
        form: ['action', 'method'],
        textarea: ['placeholder', 'value', 'name']
      },
      selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
    });
    templete = `
      <!doctype html>
      <html>
      <head>
      <title>${title}</title>
      <meta charset="utf-8">
      </head>
      <body>
      <h1><a href="/">Web</a></h1>
      <ol>
      ${list}
      </ol>         
      ${control}  
      <h2>${title}</h2>
      <p>${author}</p>
      <p>${sanitizedData}</p>
      <div>
        <a href = "/author">authorList</a>
      </div>
      </body>
      </html>        
      `;
    return templete;
  },
  list: function (fileName) {
    let fileList = '';
    for (i = 0; i < fileName.length; i++) {
      fileList = fileList + `<li><a href = '/page/${fileName[i].id}'>${fileName[i].title}</a></li>`
    }
    return fileList;
  },
  authorList: function (results) {
    let list = `
      <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>profile</th>
              <th>update</th>
              <th>delete</th>
            </tr>           
          </thead>
          <tbody>      
      `;
    for (i = 0; i < results.length; i++) {
      list = list + `
      <tr>
        <td>${results[i].id}</td>
        <td>${results[i].name}</td>
        <td>${results[i].profile}</td>
        <td>
          <a href="/update_author/${results[i].id}">update</a>
        </td>
        <td>
          <form action="/delete_author" method="post">
            <input type="hidden" name="id" value="${results[i].id}">
            <input type="submit" value="Delete">
          </form>
        </td>
      </tr>
      `
    };
    list += `
      </tbody>
      </table>
      `
    return list;
  },
  authorTemplete: function (list, form) {
    templete =
      `<!doctype html>
      <html>
      <head>
        <title>web</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB.Home</a></h1>
        ${list}
        ${form}       
      </body>
      </html>`
    return templete;
  }
};


