
import { SideBar } from './main/components/SideBar';
import { Error } from './main/components/Error';
import { FilesTable } from './main/components/Drive/FilesTable';
import { Footer } from './main/components/Footer';
import { ListContainer } from './main/components/Trello/ListContainer';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Board } from './main/components/Conversor/MainBoard';
import { Main } from './main/components/Tetris/components/TetrisMain';
import { Login } from './main/components/Login/Login';
import { Register } from './main/components/Login/Register';
import { isTokenValid } from './main/components/Login/TokenHandler';
import './assets/css/nucleo-icons.css'
import './assets/css/nucleo-svg.css'
import './assets/css/material-dashboard.css'
import './assets/css/main.css'
import { ChatWindow } from './main/components/Chat/ChatWindow';
import { About } from './main/components/About';
import { Weather } from './main/components/Weather/Weather';
import {CalendarMain} from './main/components/Calendar/CalendarMain';
import { ProfileGeneral } from './main/components/Profile/ProfileGeneral';
import LoginListMain from './main/components/WorkHours/Views/LoginListMain';


const handleLogin: any = () => {
  return (
    <div className='App Site bg-gray-200'>
      <Switch>
        <Route path='/' exact>
          <Redirect to='/login' />
        </Route>

        <Route path='/login' exact>
          <Login />
          <Footer />
        </Route>
        
        <Route path='/register'>
          <Register />
        </Route>

        {/* Ruta comodín que coincidirá con cualquier ruta que no coincida con las anteriores */}
        <Route>
          <Error />
        </Route>
      </Switch>
      <Footer />
    </div>
  )
}

const global: any = () => {

  return (
    <div className='App Site bg-gray-200'>
      <Switch>

        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>

        <Route path='/home'>
          <SideBar />
          <FilesTable />
        </Route>

        <Route path='/register'>
          <Register />
        </Route>

        <Route path='/trello'>
          <SideBar />
          <ListContainer />
        </Route>

        <Route path='/conversor'>
          <SideBar />
          <Board />
        </Route>

        <Route path='/tetris'>
          <SideBar />
          <Main />
        </Route>

        <Route path='/calendar'>
          <SideBar />
          <CalendarMain />
        </Route>
      

        <Route path='/login'>
          <Login />
        </Route>

        <Route path='/messages'>
         <SideBar/>
          <ChatWindow/>
        </Route>

        <Route path='/about'>
        <SideBar/>
        <About/>
       </Route>

       <Route path='/weather'>
        <SideBar/>
        <Weather/>
       </Route>

       <Route path='/profile'>
        <SideBar/>
        <ProfileGeneral/>
       </Route>

       <Route path='/loginList'>
        <SideBar/>
       <LoginListMain/>
       </Route>


        <Route>
          <Error />
        </Route>

      
      </Switch>
      <Footer />
    </div>
  );


}


const App = () => {
  return (
    isTokenValid ? global() : handleLogin()
  )
}

export default App;
