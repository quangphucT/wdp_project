import { Stack } from "expo-router"

const AuthLayout = () =>{
    return (
        <Stack screenOptions={{headerShown: false}}>
             <Stack.Screen name="login" options={{title: 'Login'}}></Stack.Screen>
        </Stack>
    )
}
export default AuthLayout