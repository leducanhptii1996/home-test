import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './Store/Store'; // Import the store
import ListBooking from './components/ListBooking';
import ScanBooking from './components/ScanBooking';
import { Provider } from 'react-redux';

const Stack = createStackNavigator();

const App = () => {
  return (
        <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListBooking">
        <Stack.Screen
          name="ListBooking"
          component={ListBooking}
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="ScanBooking"
          component={ScanBooking}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};

export default App;
