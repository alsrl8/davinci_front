import "./DarkModeSwitch.css"

interface DarkModeSwitchProps {
    toggleTheme: () => void;
}


const DarkModeSwitch = (props: DarkModeSwitchProps) => {
    return (
        <button className="dark-mode-switch" onClick={props.toggleTheme}>
            Toggle Dark Mode
        </button>
    )
}

export default DarkModeSwitch;