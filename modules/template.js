const tem ={
    setTemplate :function (title, list, description,linkOption) {    


        if (linkOption === 'create') {
            linkOption = `<a href ="/create">create</a>`;
        } else if(linkOption === 'update'){
            linkOption = `<a href ="/update?id=${title}">update</a>     <a href ="/delete?id=${title}">delete</a>`;
        }else{
            linkOption ='';
        }

        const seniDescription = description.replace(/<script>/g,"&lt;script$gt;").replace(/<\/script>/g,"&lt;\/script$gt;");
    
        return `    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body> 
                    <h1><a href="/">WEB</a></h1>
                    <ol>
                    ${list}                
                    </ol>
                    ${linkOption}
                    <h2>${title}</h2>
                    <div>
                    ${seniDescription}
                    </div>
                    </body>
                    </html>
                    `;
    },
    setList :function (fileList){
        let list = '';
        fileList.forEach(function (fileName) {
            list = list + `<li><a href="/?id=${fileName}">${fileName}</a></li>`
        });
        return list;
    }
    
}

module.exports=tem;