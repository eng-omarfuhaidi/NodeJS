const rectangular = require('./rectangular');
var rect =require('./rectangular');

function solveRect(l,b)
{
    console.log("Solving for Rectangular with L = "+l+"and b = "+b);
   rect(l,b,(err,rectangular)=>
   {
    if(err)
    {
        console.log("ERORR: ",err.message);
       
    }
    else
    {
        console.log("The area of the rectangle of dimension L= "+l+" and b = "+b+" is "+ rectangular.area())
        console.log("The perimeter of the rectangle of dimension L= "+l+" and b = "+b+" is "+ rectangular.perimeter())

    }
   });
   console.log("This statement is after the call to rect ")
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);

//git branch -M main
//git push -u origin main