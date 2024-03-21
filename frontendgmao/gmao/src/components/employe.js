function Empoyer(props)
{
    return (
        <div>
            <h1>{props.name} </h1>
            <h1>{props.role ? props.role: <h2>'no role'</h2>}</h1>
        </div>
    

    ) ;

}
export default Empoyer