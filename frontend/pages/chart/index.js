import React, {useState, useEffect} from 'react'
import Head from 'next/head';
import {Doughnut} from 'react-chartjs-2'
import localStorage from 'localStorage'
import AppHelper from '../../app-helper';
import getRandomColor from 'randomcolor';
import moment from 'moment';

function index() {
    const [startDate, setStartDate] = useState(moment().subtract(7, "days"))
    const [endDate, setEndDate] = useState(moment())
    const [income, setIncome] = useState(0)
    const [expense, setExpense] = useState(0)

    let accessToken = localStorage.getItem("token");

    useEffect(() => {
        endDate.add(23, "hours");
        console.log(endDate);
        const computeExpenses = async () => {
            const response =  await fetch(`${AppHelper.API_URL}/expenses?startdate=` + startDate.toISOString() + `&enddate=` + endDate.toISOString(), {
                headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
                method: 'GET',
            });
            const json = await response.json();
            setIncome(json.reduce((total, item) => 
                (item.amount >= 0) ? total + item.amount : total, 0
            ));
            setExpense(json.reduce((total, item) => 
                (item.amount < 0) ? total + item.amount : total, 0
            ));
            endDate.subtract(23, "hours");
        }
        computeExpenses();
        
    }, [accessToken, startDate, endDate]);

    return (
        <div>
        <Head>
            <title>Chart</title>
        </Head>
        <h1 className="text-center">CHART</h1>
            <div className="form-group row">
                <label for="example-date-input" className="col-2 col-form-label">Date</label>
                <div className="container-fluid row">
                    <div className="col-6">
                    <input className="form-control" type="date" onChange={(e) => setStartDate(moment(e.currentTarget.value))} value={startDate.format("YYYY-MM-DD")}/>
                    </div>
                    <div className="col-6">
                    <input className="form-control" type="date" onChange={(e) => setEndDate(moment(e.currentTarget.value))} value={endDate.format("YYYY-MM-DD")}/>
                    </div>
                </div>
            </div>
        <Doughnut data={{
            datasets: [{
                data: [income, -expense],
                backgroundColor: [ getRandomColor(), getRandomColor() ]
            }],
            labels: ["Income", "Expense"]
        }} redraw={true}/>
        </div>
    )
}



export default index
