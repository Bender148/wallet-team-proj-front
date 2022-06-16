import React, { useEffect, lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { IntlProvider } from 'react-intl'

import { sessionOperations } from './redux/session'
import { globalSelectors } from './redux/globall'
import WithAuthRedirect from './hoc/withAuthRedirect'
import PrivateRoute from './routes/PrivateRoute'
import Loader from './components/Loader'

const DashboardPage = lazy(() => import('./views/DashboardPage'))
const LoginPage = lazy(() => import('./views/LoginPage'))
const RegistrationPage = lazy(() => import('./views/RegistrationPage'))

function App() {
  const isLoading = useSelector(globalSelectors.getIsLoading)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(sessionOperations.refreshCurrentUser())
  }, [dispatch])

  return (
    <IntlProvider message={{}} locale='en' defaultLocale='en'>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route path="/login">{WithAuthRedirect(<LoginPage />)}</Route>

          <Route path="/registration">
            {WithAuthRedirect(<RegistrationPage />)}
          </Route>

          <Route exact path="/*">
            {PrivateRoute(<DashboardPage />)}
          </Route>
        </Switch>
      </Suspense>

      {isLoading && <Loader />}

      <ToastContainer />
    </IntlProvider>
  )
}

export default App
