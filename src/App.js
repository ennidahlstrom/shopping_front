
import './App.css';
import {useState, useEffect} from 'react';

const URL = 'http://localhost/shoppinglist/';


function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    let status = 0;
    fetch(URL + 'retrieve.php')
    .then(res => {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          setProducts(res);
        } else {
          alert(res.error);
        }
        
      }, (error) => {
        alert("Häiriö järjestelmässä, yritä kohta uudelleen!");
      }
    )
  }, [])

function save(e) {
  e.preventDefault();
  let status = 0;
  fetch(URL + 'create.php',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: product,
      amount: amount
    })
  })
  .then(res => {
    status = parseInt(res.status);
    return res.json();
  })
  .then(
    (res) => {
      if (status === 200) {
        setProducts(products => [...products,res]);
        setProduct('');
        setAmount('');
      } else {
        alert(res.error);
      }
    }, (error) => {
      alert('Häiriö järjestelmässä, yritä kohta uudelleen!')
    }
  )
}

function remove(id) {
  let status = 0;
  fetch(URL + 'delete.php',{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({
      id: id
    })
  })
  .then(res => {
    status = parseInt(res.status);
    return res.json();
  })
  .then(
    (res) => {
    	if (status === 200) {
    	  const newListWithoutRemoved = products.filter((item) => item.id !== id);
        setProducts(newListWithoutRemoved);
      } else {
        alert(res.error);
    	}
    }, (error) => {
        alert(error);
    }
  )
}

  return (
    <div className='container'>
        <h3 className="mb-4">Shopping list</h3>
        <form onSubmit={save}>
          <label>New product</label>
          <input value={product} type="text" onChange={e => setProduct(e.target.value)} placeholder="description" required></input>
          <input value={amount} type="number" onChange={e => setAmount(e.target.value)} placeholder="amount of product" required></input>
          <button>Add</button>
        </form>
        <ul className="list">
          {products.map(product => (
            <li key={product.id} className="row">
              <p className="col">{product.description}</p>
              <p className="col">{product.amount}</p> 
              <p className="col">
                <a className="delete" onClick={() => remove(product.id)} href="#">Delete</a>
              </p>           
            </li>
          ))} 
        </ul> 
    </div>
  );
}

export default App;
