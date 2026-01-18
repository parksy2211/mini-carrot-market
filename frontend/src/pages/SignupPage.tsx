import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import { styles } from "../styles/authStyles";

export default function SignupPage() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const v = useMemo(() => {
    const nameOk = name.trim().length >= 2;
    const nickOk = nickname.trim().length >= 2;
    const emailOk = /^\S+@\S+\.\S+$/.test(email);
    const phoneOk = /^[0-9\-+ ]{8,20}$/.test(phone); // 너무 빡세지 않게
    const pwOk = password.length >= 6;
    const matchOk = password === confirmPassword;
    const all = nameOk && nickOk && emailOk && phoneOk && pwOk && matchOk;
    return { nameOk, nickOk, emailOk, phoneOk, pwOk, matchOk, all };
  }, [name, nickname, email, phone, password, confirmPassword]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!v.all || loading) return;

    setLoading(true);
    setError("");
    setOkMsg("");

    try {
      await signup({ name, email, nickname, phone, password });

      setOkMsg("회원가입 완료! 로그인 해주세요.");
    } catch (err: any) {
      setError(err?.message ?? "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🥕</div>
          <h1 style={styles.title}>회원가입</h1>
          <p style={styles.sub}>필수 정보를 입력해주세요</p>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>
            이름
            <input
              value={name}
              onChange={(e) => {
                setError("");
                setOkMsg("");
                setName(e.target.value);
              }}
              placeholder="2자 이상"
              style={styles.input}
            />
            {!v.nameOk && name.length > 0 && <span style={styles.hint}>이름은 2자 이상</span>}
          </label>

          <label style={styles.label}>
            닉네임
            <input
              value={nickname}
              onChange={(e) => {
                setError("");
                setOkMsg("");
                setNickname(e.target.value);
              }}
              placeholder="2자 이상"
              style={styles.input}
            />
            {!v.nickOk && nickname.length > 0 && (
              <span style={styles.hint}>닉네임은 2자 이상</span>
            )}
          </label>

          <label style={styles.label}>
            전화번호
            <input
              value={phone}
              onChange={(e) => {
                setError("");
                setOkMsg("");
                setPhone(e.target.value);
              }}
              placeholder="010-1234-5678"
              style={styles.input}
            />
            {!v.phoneOk && phone.length > 0 && (
              <span style={styles.hint}>전화번호 형식을 확인해주세요</span>
            )}
          </label>

          <label style={styles.label}>
            이메일
            <input
              value={email}
              onChange={(e) => {
                setError("");
                setOkMsg("");
                setEmail(e.target.value);
              }}
              placeholder="example@email.com"
              style={styles.input}
            />
            {!v.emailOk && email.length > 0 && (
              <span style={styles.hint}>이메일 형식이 올바르지 않아요</span>
            )}
          </label>

          <label style={styles.label}>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setError("");
                setOkMsg("");
                setPassword(e.target.value);
              }}
              placeholder="6자 이상"
              style={styles.input}
            />
            {!v.pwOk && password.length > 0 && (
              <span style={styles.hint}>비밀번호는 6자 이상</span>
            )}
          </label>

          <label style={styles.label}>
            비밀번호 확인
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setError("");
                setOkMsg("");
                setConfirmPassword(e.target.value);
              }}
              placeholder="비밀번호 다시 입력"
              style={styles.input}
            />
            {!v.matchOk && confirmPassword.length > 0 && (
              <span style={styles.hint}>비밀번호가 일치하지 않아요</span>
            )}
          </label>

          {error && <div style={styles.error}>{error}</div>}
          {okMsg && (
            <div style={styles.ok}>
              {okMsg}
              <button type="button" onClick={() => nav("/login")} style={styles.inlineBtn}>
                로그인 하러가기
              </button>
            </div>
          )}

          <button type="submit" disabled={!v.all || loading} style={styles.button}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div style={styles.footer}>
          <span>이미 계정이 있나요?</span>{" "}
          <Link to="/login" style={styles.link}>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
