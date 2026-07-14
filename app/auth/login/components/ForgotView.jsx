import classes from "../Login.module.css";
import AuthWrap from "./AuthWrap";
import { useLogin } from "../LoginContext";
import { SuccessMsg } from "../../../utils/Messages";

const ForgotView = () => {
  const { goTo } = useLogin();
  return (
    <AuthWrap>
      <div className={classes.card} style={{ maxWidth: 420, width: "100%" }}>
        <div className={classes.cardHeader}>
          <div className={classes.cardIconWrap + " " + classes.iconGreen}>
            <i className="bi bi-envelope-check" />
          </div>
          <div>
            <h3 className={classes.cardTitle}>Forgot Password</h3>
            <p className={classes.cardSub}>Reset your account password</p>
          </div>
        </div>
        <div className={classes.shieldWrap}>
          <div className={classes.shieldArt}>
            <i className="bi bi-shield-lock-fill" />
          </div>
          <h2 className={classes.forgotBigTitle}>Recover Your Account</h2>
          <p className={classes.forgotBigSub}>
            Enter your email and we'll send you instructions to reset your
            password.
          </p>
        </div>
        <div className={classes.field}>
          <label className={classes.fieldLabel}>Email Address</label>
          <div className={classes.inputRow}>
            <i className={"bi bi-person " + classes.inputIcon} />
            <input
              type="email"
              placeholder="Enter your registered email"
              required
              className={classes.fieldInput}
            />
          </div>
        </div>
        <div className={classes.infoNote}>
          <i className="bi bi-info-circle" /> We'll send you a link to reset
          your password. Please check your inbox and follow the instructions.
        </div>
        <button
          className={classes.signInBtn}
          onClick={() => {
            SuccessMsg("Reset link sent! Please check your email.");
            goTo("login");
          }}
        >
          Send Reset Link
        </button>
        <p className={classes.switchText}>
          Remember your password?{" "}
          <button
            type="button"
            className={classes.switchLink}
            onClick={() => goTo("login")}
          >
            Sign in here
          </button>
        </p>
      </div>
    </AuthWrap>
  );
};

export default ForgotView;
