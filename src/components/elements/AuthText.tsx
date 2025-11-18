import { Link } from 'react-router-dom'

export default function AuthText() {
    return (
        <span className="auth--text">
            Please visit <Link to="/">Afrikobo Privacy Statement</Link> to learn more about personal data processing at Afrikobo. The Afrikobo <Link to="/">Privacy Policy</Link> and <Link to="/">Terms of Service</Link> apply.
        </span>
    )
}
