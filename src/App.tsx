import { useRoutes } from "react-router-dom";
import Error from "./Pages/Error";
import routeConfig from "./Routes";

function App() {
  const element = useRoutes(routeConfig);
  return <div>{element ? element : <Error text="抱歉，您访问的页面不存在"/>}</div>;
}
export default App;
