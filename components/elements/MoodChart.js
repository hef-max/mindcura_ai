import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function MoodChart({data, XValue, YValue, dataKey}) {
    return (
        <ResponsiveContainer width="100%" height="80%">
            <LineChart data={data} margin={{ top: 5, right: 0, bottom: 5, left: -40 }}>
                <Line type="monotone" dataKey={dataKey} dot={false} stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey={XValue} />
                <YAxis dataKey={YValue}/>
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    )
}