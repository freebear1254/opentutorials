module.exports =  {  
    createTemplet: function (title, data, list, control,author) {
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
      <p>..by ${author}</p>
      <p>${sanitizedData}</p>
      </body>
      </html>        
      `;
      return templete;
    },
    list: function (fileName) {
      let fileList = '';
      for (i = 0; i < fileName.length; i++) {
        fileList = fileList + `<li><a href = '/?id=${fileName[i].id}'>${fileName[i].title}</a></li>`
      }
      return fileList;
    },
  };

 
