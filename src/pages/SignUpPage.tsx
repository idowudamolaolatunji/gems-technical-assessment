import SignupForm from "../components/auth/SignupForm";
import AuthText from "../components/elements/AuthText";
import AuthModal from "../components/layout/AuthModal";

export default function SignUpPage() {
	return (
		<AuthModal>
			<div className="form--container">
				<h4 className="form--heading">Create an account!</h4>
				<SignupForm />
				<AuthText />
			</div>
		</AuthModal>
	);
}
