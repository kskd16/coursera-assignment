// Plantify.jsx
// Single-file React + Redux Toolkit app. Paste into a Vite/CRA project src/Plantify.jsx
// Then set src/main.jsx to render this component, or replace App.jsx contents.

import React from 'react'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

/* -------------------- Sample product data -------------------- */
const PRODUCTS = [
  { id: 'p1', name: 'Snake Plant', category: 'Air Purifier', price: 799, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=60' },
  { id: 'p2', name: 'Monstera Deliciosa', category: 'Large', price: 1599, img: 'https://images.unsplash.com/photo-1524594154901-6b3c1247d6b2?auto=format&fit=crop&w=400&q=60' },
  { id: 'p3', name: 'ZZ Plant', category: 'Low Light', price: 699, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=60' },
  { id: 'p4', name: 'Pothos', category: 'Trailing', price: 499, img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=60' },
  { id: 'p5', name: 'Fiddle Leaf Fig', category: 'Large', price: 2499, img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=400&q=60' },
  { id: 'p6', name: 'Peace Lily', category: 'Flowering', price: 899, img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=60' }
]

/* -------------------- Redux: cart slice -------------------- */
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {} // {productId: quantity}
  },
  reducers: {
    addToCart(state, action) {
      const id = action.payload
      if (!state.items[id]) state.items[id] = 0
      state.items[id]++
    },
    increase(state, action) {
      const id = action.payload
      if (!state.items[id]) state.items[id] = 0
      state.items[id]++
    },
    decrease(state, action) {
      const id = action.payload
      if (state.items[id]) {
        state.items[id]--
        if (state.items[id] <= 0) delete state.items[id]
      }
    },
    remove(state, action) {
      const id = action.payload
      if (state.items[id]) delete state.items[id]
    },
    clearCart(state) {
      state.items = {}
    }
  }
})

const { addToCart, increase, decrease, remove, clearCart } = cartSlice.actions

const store = configureStore({ reducer: { cart: cartSlice.reducer } })

/* -------------------- Helper selectors -------------------- */
function useCartSummary() {
  const items = useSelector(s => s.cart.items)
  const list = Object.entries(items).map(([id, qty]) => {
    const product = PRODUCTS.find(p => p.id === id)
    return { ...product, qty }
  })
  const totalItems = list.reduce((s, p) => s + p.qty, 0)
  const totalPrice = list.reduce((s, p) => s + p.qty * p.price, 0)
  return { list, totalItems, totalPrice }
}

/* -------------------- Components -------------------- */

function Header({ onGoto }) {
  const { totalItems } = useCartSummary()
  return (
    <header style={styles.header}>
      <div style={styles.brand} onClick={() => onGoto('landing')}>Plantify</div>
      <nav>
        <button style={styles.navbtn} onClick={() => onGoto('products')}>Products</button>
        <button style={styles.navbtn} onClick={() => onGoto('cart')}>Cart</button>
        <span style={styles.cartIcon} onClick={() => onGoto('cart')}>🛒 <strong>{totalItems}</strong></span>
      </nav>
    </header>
  )
}

function Landing({ onGoto }) {
  return (
    <div style={styles.landing}>
      <div style={styles.landingInner}>
        <h1>Welcome to Plantify</h1>
        <p>We curate beautiful houseplants to make your home greener and healthier.</p>
        <button style={styles.cta} onClick={() => onGoto('products')}>Get Started</button>
      </div>
    </div>
  )
}

function Products() {
  const dispatch = useDispatch()
  const cartItems = useSelector(s => s.cart.items)

  // Grouping products by category for display
  const categories = {}
  PRODUCTS.forEach(p => { categories[p.category] = categories[p.category] || []; categories[p.category].push(p) })

  return (
    <div style={styles.page}>
      <h2>Products</h2>
      {Object.entries(categories).map(([cat, items]) => (
        <section key={cat}>
          <h3>{cat}</h3>
          <div style={styles.grid}>
            {items.map(p => (
              <div key={p.id} style={styles.card}>
                <img src={p.img} alt="" style={styles.thumb} />
                <h4>{p.name}</h4>
                <p>₹{p.price}</p>
                <button
                  onClick={() => dispatch(addToCart(p.id))}
                  disabled={cartItems[p.id] > 0}
                  style={cartItems[p.id] > 0 ? styles.disabledBtn : styles.addBtn}
                >{cartItems[p.id] > 0 ? 'Added' : 'Add to Cart'}</button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function CartPage() {
  const dispatch = useDispatch()
  const { list, totalItems, totalPrice } = useCartSummary()

  return (
    <div style={styles.page}>
      <h2>Your Cart</h2>
      <p><strong>Total items:</strong> {totalItems}</p>
      <p><strong>Total price:</strong> ₹{totalPrice}</p>

      <div>
        {list.length === 0 && <p>Your cart is empty.</p>}
        {list.map(item => (
          <div key={item.id} style={styles.cartRow}>
            <img src={item.img} style={styles.cartThumb} />
            <div style={{flex:1}}>
              <h4>{item.name}</h4>
              <p>Unit: ₹{item.price}</p>
            </div>
            <div style={styles.qtyControls}>
              <button onClick={() => dispatch(increase(item.id))}>+</button>
              <span style={{margin: '0 8px'}}>{item.qty}</span>
              <button onClick={() => dispatch(decrease(item.id))}>-</button>
            </div>
            <div style={{width:120, textAlign:'right'}}>
              <p>₹{item.qty * item.price}</p>
              <button onClick={() => dispatch(remove(item.id))} style={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:20}}>
        <button onClick={() => alert('Coming Soon!')} style={styles.checkoutBtn}>Checkout</button>
        <button onClick={() => window.location.hash = '#/products'} style={styles.continueBtn}>Continue Shopping</button>
      </div>
    </div>
  )
}

/* -------------------- Main App -------------------- */
function InnerApp() {
  const [route, setRoute] = React.useState('landing')

  React.useEffect(() => {
    const h = () => {
      const hash = window.location.hash.replace('#/','')
      if (hash === 'products' || hash === 'cart' || hash === 'landing') setRoute(hash || 'landing')
    }
    window.addEventListener('hashchange', h)
    h()
    return () => window.removeEventListener('hashchange', h)
  }, [])

  const goto = (r) => {
    setRoute(r)
    window.location.hash = `#/${r}`
  }

  return (
    <div>
      <Header onGoto={goto} />
      <main>
        {route === 'landing' && <Landing onGoto={goto} />}
        {route === 'products' && <Products />}
        {route === 'cart' && <CartPage />}
      </main>
    </div>
  )
}

export default function PlantifyApp() {
  return (
    <Provider store={store}>
      <InnerApp />
    </Provider>
  )
}

/* -------------------- Minimal inline styles -------------------- */
const styles = {
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', padding: '12px 20px', background: '#124', color:'#fff' },
  brand: { fontSize:20, fontWeight:700, cursor:'pointer' },
  navbtn: { marginRight:10, background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#fff', padding:'6px 10px', borderRadius:6, cursor:'pointer' },
  cartIcon: { marginLeft:10, cursor:'pointer' },
  landing: { backgroundImage:'url(https://images.unsplash.com/photo-1524594154901-6b3c1247d6b2?auto=format&fit=crop&w=1400&q=80)', minHeight: '60vh', backgroundSize:'cover', display:'flex', alignItems:'center', justifyContent:'center' },
  landingInner: { background:'rgba(255,255,255,0.85)', padding:20, borderRadius:8, textAlign:'center', maxWidth:600 },
  cta: { marginTop:12, padding:'10px 18px', fontSize:16, cursor:'pointer' },
  page: { padding:20 },
  grid: { display:'flex', gap:16, flexWrap:'wrap' },
  card: { width:220, border:'1px solid #ddd', padding:12, borderRadius:8, textAlign:'center' },
  thumb: { width:'100%', height:120, objectFit:'cover', borderRadius:6 },
  addBtn: { marginTop:8, padding:'8px 12px', cursor:'pointer' },
  disabledBtn: { marginTop:8, padding:'8px 12px', background:'#ccc', cursor:'not-allowed' },
  cartRow: { display:'flex', alignItems:'center', gap:12, padding:12, borderBottom:'1px solid #eee' },
  cartThumb: { width:80, height:60, objectFit:'cover', borderRadius:6 },
  qtyControls: { display:'flex', alignItems:'center' },
  deleteBtn: { marginTop:8, background:'#f66', color:'#fff', border:'none', padding:'6px 8px', cursor:'pointer' },
  checkoutBtn: { background:'#28a745', color:'#fff', padding:'8px 12px', border:'none', marginRight:8, cursor:'pointer' },
  continueBtn: { padding:'8px 12px', cursor:'pointer' }
}
