import { useContext, useEffect, useState } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import { Context } from './index.js'
import { observer } from 'mobx-react-lite'
import UserService from './service/UserService.js'

function App() {
  const { store } = useContext(Context)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  if (store.isLoading) {
    return <div>Loading.....</div>
  }

  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
        <div>
          <button onClick={getUsers}>GetUsers</button>
        </div>
      </>
    )
  }

  return (
    <div className="App">
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.email}`
          : 'АВТОРИЗУЙТЕСЬ'}
      </h1>
      <h1>
        {store.user.isActivated
          ? `Аккаунт подтвержден`
          : 'ПОДТВЕРДИТЕ АККАУНТ!'}
      </h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={getUsers}>GetUsers</button>
      </div>
      {users.map((user) => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  )
}

export default observer(App)
