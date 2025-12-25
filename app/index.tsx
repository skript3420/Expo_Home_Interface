import { useEffect, useState } from "react";
import { View } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import ActhorGauge from "../components/ActhorGauge";
import { blockPending } from '../utils/blockPending';

export default function Index() {
  const [isInit, setIsInit] = useState(false);
  const [data, setData] = useState({
    "temp1": 0,
    "power_act": 0,
    "boostactive": 0
  });
  const [isConn, setIsConn] = useState(false);


  interface RequestParams {
    [key: string]: string | number | boolean;
  }
  const _sendRequest = async (paramsObj: RequestParams = {}) => {
    try {
      // 1. Parse object to URL parameters
      const queryString = new URLSearchParams(paramsObj as any).toString();

      // 2. Construct URL
      const url = `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}/data.jsn${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      const json = await response.json();

      // 3. Update State 
      setData(json);
      setIsConn(true);
      if(!isInit) setIsInit(true);

    } catch (error) {
      console.log("Fetch error:", error);
      setIsConn(false);
    }
  };

  const sendRequest = blockPending(_sendRequest);


  const fetchData = () => {
    sendRequest({});
  };

  const onBoostPress = () => {
    const value = data?.boostactive === 2 ? 0 : 1;
    sendRequest({bststrt: value})
  }

  useEffect(() => {
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "darkgray",
      }}
    >
      <Spinner
        visible={!isInit}
        textContent={'Lade Daten...'}
        textStyle={{ color: "orange" }}
        color="orange"
        animation="fade"
        overlayColor={"rgba(0,0,0,0.5)"}
      />
      <ActhorGauge
        isConnected={isConn}
        temperature={data?.temp1 / 10}
        power={data?.power_act}
        boostactive={data?.boostactive}
        onBoostPress={onBoostPress}
      />
    </View>
  );
}
