import { decode } from 'html-entities';
import { WaterData } from '@/app/types/types'

interface Props {
    data : WaterData;
}

const Stat = (props: Props) => {
    return (
        <div>
            <b>{props.data.name}</b>
            <br/>
            {props.data.variables.map ( (variable) =>
                <p key={variable.oid}>
                <b>{decode(variable.variableName)}:</b> {variable.value}
                </p>
            )}
        </div>
    )
}

export default Stat;