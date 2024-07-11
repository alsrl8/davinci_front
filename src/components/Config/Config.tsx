import "./Config.css"
import DarkModeSwitch from "../DrakModeSwitch/DarkModeSwitch";
import NewUser from "../NewUser/NewUser";
import Ping from "../Ping/Ping";

interface ConfigProps {
    toggleTheme: () => void;
}

const Config = (props: ConfigProps) => {
    return (
        <div className="config-container">
            <Ping />
            <NewUser />
            <DarkModeSwitch toggleTheme={props.toggleTheme}/>
        </div>

    )
}

export default Config;