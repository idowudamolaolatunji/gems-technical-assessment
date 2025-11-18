import { FaExclamationTriangle } from 'react-icons/fa'

export default function ErrorPage() {
    return (
        <div className="error--container">
            <FaExclamationTriangle />
            <p>Oops, Page not found!</p>
        </div>
    )
}
