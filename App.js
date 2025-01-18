import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './screens/AuthScreen';
import TransacaoListScreen from './screens/TransacaoListScreen';
import NovaTransacaoScreen from './screens/NovaTransacaoScreen';
import EditarTransacaoScreen from './screens/EditarTransacaoScreen';
import TransacaoProvider from './context/TransacaoContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <TransacaoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="TransacaoList" component={TransacaoListScreen} options={{ title: 'Transações' }} />
          <Stack.Screen name="NovaTransacao" component={NovaTransacaoScreen} options={{ title: 'Nova Transação' }} />
          <Stack.Screen name="EditarTransacao" component={EditarTransacaoScreen} options={{ title: 'Editar Transação' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TransacaoProvider>
  );
}
