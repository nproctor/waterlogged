import { decode } from 'html-entities';

interface Props {
    name : string,
    dataPair : {
        variable : string,
        variableCode : number,
        value : string,
        unit : string,
    }[]
}

const Stat = (props: Props) => {
    return (
        <div>
            <b>{props.name}</b>
            <br/>
            {props.dataPair.map( (pair) => 
            <p key={pair.variableCode}>
                <b>{decode(pair.variable)}:</b> 
                {pair.value}
            </p>)}
        </div>
    )
}

export default Stat;