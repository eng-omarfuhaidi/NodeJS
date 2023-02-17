const http= require('http');
const fs=require('fs');
const path=require('path')
const hostname ='localhost';
const port =3000;

const server=http.createServer((req,res)=>{
   console.log("request  for "+req.url +' by method ' + req.method);

   if(req.method == 'GET')
   {
      var filUrl;
      if(req.url == '/') filUrl ='/index.html';
      else filUrl = req.url;

      var filePath =path.resolve('./public'+filUrl);
      const fileExt =path.extname(filePath);
      if(fileExt == '.html')
      {
         fs.exists(filePath,(exists)=>
         {
            if(!exists)
            {
               res.statusCode=404;
               res.setHeader('Content-Type','text/html');
               res.end('<html><body><h1>Erorr 404: '+filUrl + ' not found<h1></body></html>');

               return;
            }
            res.statusCode=200;
            res.setHeader('Content-Type','text/html')
            fs.createReadStream(filePath).pipe(res);
         })
      }
      else
      {
         res.statusCode=404;
         res.setHeader('Content-Type','text/html');
         res.end('<html><body><h1>Erorr 404: '+filUrl + ' not an html file <h1></body></html>');

         return;
      }
   }else
   {
      res.statusCode=404;
      res.setHeader('Content-Type','text/html');
      res.end('<html><body><h1>Erorr 404: '+req.method + ' not supported <h1></body></html>');

      return;
   }
});

server.listen(port,hostname,()=>{
console.log(`Server running at http://${hostname}:${port}`)
});

