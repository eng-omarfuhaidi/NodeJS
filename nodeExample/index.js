var rect ={
premeter:(x,y)=>(2*(x+y)),
area:(x,y)=>(x*y)
};

function solveRect(l,b)
{
    console.log("Solving for Rectangular with L = "+l+"and b = "+b);
    if(l <= 0||b<=0)
    {
        console.log("Rectangular Dimensions shoud be greater than zero : L = "+l+"b = "+b);
    }
    else
    {
        console.log("the area of the rectangular is " +rect.area(l,b));
        console.log("the perimeter  of the rectangular is " +rect.premeter(l,b));

    }
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);