import AuthModal from '../components/layout/AuthModal'
import LoginForm from '../components/auth/LoginForm'
import AuthText from '../components/elements/AuthText'

export default function LoginPage() {
    return (
        <AuthModal>
            <div className="form--container">
                <h4 className='form--heading'>Sign into your account!</h4>

                <LoginForm />

                <AuthText />
            </div>
        </AuthModal>
    )
}
