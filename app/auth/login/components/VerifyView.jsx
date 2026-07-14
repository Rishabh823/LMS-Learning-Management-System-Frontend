import classes from "../Login.module.css";
import AuthWrap from "./AuthWrap";
import { useLogin } from "../LoginContext";
import { ErrorMsg } from "../../../utils/Messages";

const VerifyView = () => {
  const { formData, otp, setOtp, otpTimer, setOtpTimer, goTo } = useLogin();

  const handleOtp = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById("otp" + (i + 1))?.focus();
  };

  const handleVerify = () => {
    if (otp.join("").length < 6) { ErrorMsg("Please enter the complete 6-digit code."); return; }
    const dest = formData.role === "user" ? "user-onboard" : formData.role === "trainer" ? "trainer-onboard" : "org-onboard";
    goTo(dest);
  };

  return (
    <AuthWrap>
      <div className={classes.card} style={{ maxWidth: 420, width: "100%" }}>
        <div className={classes.cardHeader}>
          <div className={classes.cardIconWrap + " " + classes.iconGreen}><i className="bi bi-phone" /></div>
          <div>
            <h3 className={classes.cardTitle}>Verify Your Email</h3>
            <p className={classes.cardSub}>Enter the 6-digit code sent to {formData.email || "your email"}</p>
          </div>
        </div>
        <div className={classes.otpIllus}><i className="bi bi-envelope-open-fill" /></div>
        <div className={classes.otpRow}>
          {otp.map((d, i) => (
            <input key={i} id={"otp" + i} type="text" maxLength={1} value={d}
              onChange={(e) => handleOtp(i, e.target.value)} className={classes.otpBox} />
          ))}
        </div>
        <div className={classes.otpTimerRow}>
          <span>{"Didn't receive the code?"}</span>
          {otpTimer > 0
            ? <span className={classes.otpTimer}>{"Resend in 0:" + String(otpTimer).padStart(2, "0")}</span>
            : <button type="button" className={classes.switchLink} onClick={() => setOtpTimer(45)}>Resend Code</button>
          }
        </div>
        <button className={classes.signInBtn} onClick={handleVerify}>Verify Email</button>
      </div>
    </AuthWrap>
  );
};

export default VerifyView;
