import { ToastAndroid } from "react-native";

const NetworkErrorToast = () => {
    ToastAndroid.show('Network Error! Try again later.', ToastAndroid.LONG);
  };

export default NetworkErrorToast;