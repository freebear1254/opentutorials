const tem ={
    setTemplate :function (id,user,title, list, description,linkOption) {    
        if (linkOption === 'create') {
            linkOption = `<a href ="/topic/create">create</a>`;
        } else if(linkOption === 'update'){
            linkOption = `<a href ="/topic/update?id=${id}">update</a>  
            <form action="/topic/delete"  method="post" >
                <input type="hidden" name="id" value ="${id}">               
                <input type="submit" value="delete">
            </form>  `;
        }else{
            linkOption ='';
        }

        let isLogin = ``;

        if (user === null) {
            isLogin = ` <form action="/topic/login" method="post">
                            <div>
                                <label>Username:</label>
                                <input type="text" name="username" placeholder="email"/>
                            </div>
                            <div>
                                <label>Password:</label>
                                <input type="password" name="password" placeholder = "password"/>
                            </div>
                            <div>
                                <input type="submit" value="Log In"/>
                            </div>
                        </form>`
        } else {
            isLogin = `<div><h2>Hello ${user.userName}</h2></div><a href = /topic/logout>Log Out</a>`;
        }


      
       const senitizerDescription = description.replace(/<script>/g,"&lt;script$gt;").replace(/<\/script>/g,"&lt;\/script$gt;");
    
        return `    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body> 
                    <h1><a href="/topic">WEB</a></h1>
                    ${isLogin}
                    <ol>
                    ${list}                
                    </ol>
                    ${linkOption}
                    <h2>${title}</h2>
                    <div>
                    ${senitizerDescription}
                    </div>
                    </body>
                    </html>
                    `;
    },
    setList :function (topics){
        let list = '';
        topics.forEach(function (topic) {
            list = list + `<li><a href="/topic/?id=${topic.id}">${topic.title}</a></li>`
        });
        return list;
    }
    
}

module.exports=tem;