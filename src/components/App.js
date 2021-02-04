import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomeScreen from '../screens/HomeScreen';
import AddressScreen from '../screens/AddressScreen';
import MapScreen from '../screens/MapScreen';

function App() {
  return (
    <Router>
      <Switch>
        {/* HomeScreen */}
        <Route exact path="/" component={HomeScreen} />
        <Route path="/informatii-adrese" component={AddressScreen} />
        <Route path="/informatii-harta/:id" component={MapScreen} />
      </Switch>
    </Router>
  );
}

export default App;
