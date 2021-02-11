import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import AddressScreen from '../screens/AddressScreen';
import MapScreen from '../screens/MapScreen';
import GlobalProvider from '../contexts/GlobalContext';

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Switch>
          {/* HomeScreen */}
          <Route exact path="/" component={HomeScreen} />
          <Route path="/informatii-adrese" component={AddressScreen} />
          <Route path="/informatii-harta/:id" component={MapScreen} />
        </Switch>
      </GlobalProvider>
    </Router>
  );
}

export default App;
