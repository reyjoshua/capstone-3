import React, {useState, useContext, useEffect} from 'react'
import {Form, Button} from 'react-bootstrap'
import localStorage from 'localStorage'
import AppHelper from '../../app-helper';
import Swal from 'sweetalert2';
import Router from 'next/router';
import Head from 'next/head';
import moment from 'moment'
import UserContext from '../../UserContext';

function index() {
    const [text, setText] = useState('')
    const [amount, setAmount] = useState('')
    const [history, setHistory] = useState([]) 
    const [sortBy, setSortBy] = useState('');
    let accessToken = localStorage.getItem("token");
    const {user} = useContext(UserContext);

  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)

function computeBalance () {
  return computeIncome() + computeExpense()
} 

function computeIncome () {
  return history.reduce((total, item) => 
    (item.amount >= 0) ? total + item.amount : total, 0
  )
}

function computeExpense () {
  return history.reduce((total, item) => 
    (item.amount < 0) ? total + item.amount : 0, 0
  )
}

function onSubmit(e) {
  e.preventDefault();
  const options = {
    headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
    method: 'POST',
    body: JSON.stringify({text:text, amount:amount})
  }
  fetch (`${AppHelper.API_URL}/expenses`, options)
  .then(AppHelper.toJSON)
  .then(data=>{
    if(data) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
      })
      .then(() => {
        setAmount('')
        setText('')
        //history.push({text:text, amount: Number(amount)})
        
          //setHistory(history);
          //console.log(history);
        Router.reload()
        
      }) 
    }
    console.log(data);  
  })
}


//SEARCH BAR
const [searchItem, setSearchItem] = useState('');
const [records, setRecords] = useState(history);
const [historyList, setHistoryList] = useState('');

useEffect(() => {

  const getHistory = async() => {
    console.log('getting history');
    let accessToken = localStorage.getItem("token");
    const options = {
      headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
      method: 'GET',
    }
    const history = await fetch(`${AppHelper.API_URL}/expenses`, options) 
    const json = await history.json();
    setHistory(json);
  }

  if (searchItem === '') {
    getHistory();
  }


  setBalance(computeBalance());
  setIncome(computeIncome());
  setExpense(computeExpense());
}, [searchItem, sortBy])
//END OF SEARCH BAR

  if (localStorage.getItem('token') === null) {
    return (
      <div className="text-center">
      <h1>Your session has time out please login</h1>
      <a href="./login">Login Here</a>
      </div>
    )
  }

  return (
    <React.Fragment> 
      <Head>
        <title>Budget Tracker</title>
      </Head>
      <div className="container">
        <h4 className="text-center">Your Balance</h4>
        {/* <h1 className="text-center">{moneyFormatter(balance)}</h1> */}
        <YourBalance history={history} />
        <div className="inc-exp-container">
          {/* <div>
            <h4>Income</h4>
            <p  className="money plus">+{moneyFormatter(income)}</p>
          </div> */}
          <YourIncome history={history} />
          <YourExpense history={history} />
          {/* <div>
            <h4>Expense</h4>
            <p  className="money minus">-{moneyFormatter(expense)}</p>
          </div> */}
        </div>
      </div>
    
    <div>
      <h3 className="text-center">History</h3>
      {/* search bar */}
      <Form.Group controlId="search">
        <Form.Control 
          type="text" 
          placeholder="Search Here..."
          onChange={(e) => setSearchItem(e.currentTarget.value)}
          required
        />
      </Form.Group>
      {/* sort bar */}
      {/* <div className="btn-group">
        <button type="button" className="btn btn-success">Sort</button>
        <button type="button" className="btn btn-success dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" id="dropdownSortButton">
            <span className="sr-only">Toggle Dropdown</span>
            Sort
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownSortButton">
            <li>Income</li>
            <li>Expenses</li>
            <li>Recently Added</li>
        </div>
      </div> */}

      <Form.Group>
        <Form.Control as="select" className="w-25 p-2 rounded bg-success text-white" onChange={(e) => setSortBy(e.currentTarget.value)}>
          <option className="bg-white text-dark" value="">Sort</option>
          <option className="bg-white text-dark" value="income">Income</option>
          <option className="bg-white text-dark" value="expenses">Expenses</option>
          <option className="bg-white text-dark" value="name">Title</option>
          <option className="bg-white text-dark" value="recentlyAdded">Recently Added</option>
        </Form.Control>
      </Form.Group>

      <ExpenseHistory history={history} searchItem={searchItem} sortBy={sortBy}/>
      {/* <ul className="list">
      {history.map((transaction) => {
        return <li className={transaction.amount < 0 ? 'minus' : 'plus'}>{transaction.text}<span>{transaction.amount < 0 ? '-' : '+'}{moneyFormatter(transaction.amount)}</span><button type="button" className="delete-btn" onClick={(e) => onDelete(transaction._id)}>x</button></li>
      })}
      </ul> */}
    </div>
    <h3 className="text-center">New transaction</h3>
      <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label htmlFor="text">Title:</Form.Label>
            <Form.Control type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter Title" required/>
          </Form.Group>
          <h3 className="text-center">Category</h3>
          <Form.Group>
            <Form.Label htmlFor="amount">Income:</Form.Label>
            <Form.Control type="number"  onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount ₱"/>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="amount">Expense:</Form.Label>
            <Form.Control type="number"  onChange={(e) => setAmount(-e.target.value)} placeholder="Enter amount - ₱"/>
          </Form.Group>
          <div className="text-center">
          <Button type="submit" className="btn" variant="primary">Add transaction</Button>
          </div>
        </Form>
    </React.Fragment>
    )
}

// index.getInitialProps = async({ req }) => {
//     let result = []
//     let accessToken = localStorage.getItem("token");
//     const options = {
//       headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
//       method: 'GET',
//     }
//     const history = await fetch(`${AppHelper.API_URL}/expenses`, options) 
//     const json = await history.json()
                    
//     if (json) result = json 
    
//     return  {
//       trans: result,
//       status: history.status
//     }
// }

function moneyFormatter(num) {
  let p = num.toFixed(2).split('.');
  return (
    '₱' +
    p[0]
      .split('')
      .reverse()
      .reduce(function (acc, num, i, orig) {
        return num === '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
      }, '') +
    '.' +
    p[1]
  );
}

function onDelete(expenseId) {
  let accessToken = localStorage.getItem("token");
  const options = {
    headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
    method: 'DELETE',
  }
  console.log(expenseId)
  fetch (`${AppHelper.API_URL}/expenses/${expenseId}`, options)
  .then(AppHelper.toJSON)
  .then(data=>{
    console.log(data);
    if(data) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Your work has been deleted',
        showConfirmButton: false,
      })
      Router.reload();
    } 
  })
}

function ExpenseHistory({ history, searchItem, sortBy }) {
  let date = history.createdOn;

  if (sortBy != '') {
    history = history.sort((a, b) => {
      if (sortBy === 'income') return b.amount - a.amount;
      if (sortBy === 'expenses') return a.amount - b.amount;
      if (sortBy === 'name') {
        const aName = a.text.toUpperCase();
        const bName = b.text.toUpperCase();
        if (aName < bName) return -1;
        if (aName > bName) return 0;
        return 0;
      }
      if (sortBy === 'recentlyAdded') return Date.parse(b.createdOn) - Date.parse(a.createdOn);
    })
  }

  console.log(history);

  return (
    <ul className="list">
      {history.map((transaction) => {
        if (transaction.text.includes(searchItem)) {
          return <li className={transaction.amount < 0 ? 'minus' : 'plus'}>{transaction.text}<span className="text-">{transaction.amount < 0 ? '-' : '+'}{moneyFormatter(transaction.amount)}<br/>{moment(transaction.createdOn).format('MMMM-DD-YYYY')}</span><button type="button" className="delete-btn" onClick={(e) => onDelete(transaction._id)}>x</button></li>
        }
      })}
    </ul>
  );
}

function YourBalance({history}) {
  const income = history.reduce((total, item) => 
    (item.amount >= 0) ? total + item.amount : total, 0
  );
  const expense = history.reduce((total, item) => 
    (item.amount < 0) ? total + item.amount : total, 0
  )
  return (
    <h1 className="text-center">{moneyFormatter(income + expense)}</h1>
  )
}

function YourIncome({history}){
  const income = history.reduce((total, item) => 
    (item.amount >= 0) ? total + item.amount : total, 0
  )
  return (
    <div>
      <h4>Income</h4>
      <p  className="money plus">+{moneyFormatter(income)}</p>
    </div>
  )
}

function YourExpense({history}) {
  const expense = history.reduce((total, item) => 
    (item.amount < 0) ? total + item.amount : total, 0
  );
  return (
    <div>
      <h4>Expense</h4>
      <p  className="money minus">-{moneyFormatter(expense)}</p>
    </div>
  )
}
          
export default index