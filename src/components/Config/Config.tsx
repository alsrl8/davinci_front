import "./Config.css"
import DarkModeSwitch from "../DrakModeSwitch/DarkModeSwitch";
import NewUser from "../NewUser/NewUser";

interface ConfigProps {
    toggleTheme: () => void;
}

const Config = (props: ConfigProps) => {
    return (
        <div className="config-container">
            <NewUser />
            <DarkModeSwitch toggleTheme={props.toggleTheme}/>
        </div>

    )
}

export default Config;