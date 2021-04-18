import React, {useState, useEffect} from 'react'
import Head from 'next/head';
import {Line} from 'react-chartjs-2'
import localStorage from 'localStorage'
import AppHelper from '../../app-helper';
import getRandomColor from 'randomcolor';
import moment from 'moment';

function index() {
    const [dailyExpense, setDailyExpense] = useState([])
    const [startDate, setStartDate] = useState(moment().subtract(7, "days"))
    const [endDate, setEndDate] = useState(moment())

    const accessToken = localStorage.getItem("token");
    useEffect(() => {
        endDate.add(23, "hours");
        const computeDailyExpenses = async () => {
            const response =  await fetch(`${AppHelper.API_URL}/expenses/daily?startdate=` + startDate.toISOString() + `&enddate=` + endDate.toISOString(), {
                headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
                method: 'GET',
            });
            const json = await response.json();
            setDailyExpense(json);
            endDate.subtract(23, "hours");
        }

        computeDailyExpenses();
    }, [accessToken, startDate, endDate]);

    return (
        <div>
        <Head>
            <title>Trend</title>
        </Head>
        <h1 className="text-center">TREND</h1>
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
        <Line data={{
            datasets: [
            {
                label: "Income",
                data: dailyExpense.map((e) => e.income),
                borderColor: getRandomColor(),
                fill: false,
                tension: 0.1
            },
            {
                label: "Expense",
                data: dailyExpense.map((e) => -e.expense),
                borderColor: getRandomColor(),
                fill: false,
                tension: 0.1
            }],
            labels: dailyExpense.map((e) => moment(e._id).format('MMMM-DD-YYYY'))
        }} redraw={true}/>
        {/* <Line data={{
            datasets: [{
                data: [-expense],
                backgroundColor: [ getRandomColor()]
            }],
            labels: ["Expense"]
        }} redraw={true}/> */}
        </div>
    )
}

export default index

