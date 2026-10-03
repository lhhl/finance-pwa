import { useState } from 'react';
import {
  Page,
  LoginScreenTitle,
  List,
  ListInput,
  ListButton,
  BlockFooter,
} from 'framework7-react';
import { supabase } from '../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On success AuthProvider receives the new session and App swaps this screen out
  const signIn = async () => {
    if (submitting || !email || !password) return;
    setSubmitting(true);
    setError(null);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('Email hoặc mật khẩu không đúng');
    } else {
      console.log('Logged in user:', data.user);
    }
    setSubmitting(false);
  };

  return (
    <Page noToolbar noNavbar noSwipeback loginScreen>
      <LoginScreenTitle>Quản Lý Chi Tiêu</LoginScreenTitle>
      <List form onSubmit={(e) => { e.preventDefault(); signIn(); }}>
        <ListInput
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="Nhập email..."
          value={email}
          onInput={(e) => setEmail(e.target.value)}
        />
        <ListInput
          label="Mật khẩu"
          type="password"
          autocomplete="current-password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onInput={(e) => setPassword(e.target.value)}
        />
      </List>
      <List inset>
        <ListButton onClick={signIn}>
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </ListButton>
        {error && (
          <BlockFooter>
            <span style={{ color: 'var(--f7-color-red)' }}>{error}</span>
          </BlockFooter>
        )}
      </List>
    </Page>
  );
};

export default Login;