import { StyleSheet } from "react-native";
import { BallsToy } from "./toys/BallsToy";

export default function App() {
  return <BallsToy />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
