import React from 'react'
interface Props {
    data: [any];
    date: string;
}
interface PropsSingle {
    data: any;
}

const SingleElement: React.FC<PropsSingle> = ({ data }) => {
    return (
        <div style={{backgroundColor: data.is_potentially_hazardous_asteroid ? 'red' : 'green', padding: '10px'}}>
            <p>{data.name}</p>
        </div>
    )
}
const Element: React.FC<Props> = ({ data, date }) => {
    return (
        <div >
            <p>Date is {date}</p>
            <div style={{display: 'flex', columnGap: '12px'}}>
                {data.map((key) => <SingleElement key={key.id} data={key} />)}
            </div>
        </div>
    )
}

export default Element