import { type FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { setTokens } from "../auth/tokenStore";
import { styles } from "../styles/authStyles";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const isValid = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (!/^\S+@\S+\.\S+$/.test(email)) return false;
    if (password.length < 6) return false;
    return true;
  }, [email, password]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError("");
    setOkMsg("");

    try {
      const res = await login({ email, password });

      // ✅ JWT 저장
      setTokens(res.accessToken, res.refreshToken);

      setOkMsg("로그인 성공!");
      // TODO: 메인 페이지 만들면 이동
      // nav("/home");
    } catch (err: any) {
      setError(err?.message ?? "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 420 }}>
        <div style={styles.header}>
          <div style={styles.logo}>🥕</div>
          <h1 style={styles.title}>미니 당근마켓</h1>
          <p style={styles.sub}>이메일로 로그인</p>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
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
              autoComplete="email"
              style={styles.input}
            />
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
              autoComplete="current-password"
              style={styles.input}
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}
          {okMsg && <div style={styles.ok}>{okMsg}</div>}

          <button type="submit" disabled={!isValid || loading} style={styles.button}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div style={styles.footer}>
          <span>처음이신가요?</span>{" "}
          <Link to="/signup" style={styles.link}>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
