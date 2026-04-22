'use client';

import React from 'react';
import styles from './login.module.scss';
import AuthSlider from '@/components/authSlider';
import Input from '@/components/input';
import AuthButton from '@/components/authButton';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { adminLoginUser } from '@/store/reducers';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const EmailIcon = '/assets/icons/email.svg';
const EyeIcon = '/assets/icons/eye.svg';
const EyeOffIcon = '/assets/icons/eye-off.svg';
const LockIcon = '/assets/icons/lock.svg';
const RightIcon = '/assets/icons/right.svg';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});
export default function Login() {
  const dispatch = useDispatch();

  const router = useRouter();
  const { isLoading, error } = useSelector((state) => state.login);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const result = await dispatch(adminLoginUser(values));

      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Login Successfully');
        router.push('/dashboard');
      }
      resetForm();
    },
  });

  return (
    <div className={styles.flexbox}>
      <div className={styles.items}>
        <div className={styles.box}>
          <div className={styles.logo}>
            <img src="/assets/logo/sidebar-logo.svg" alt="DailyWealth4You" />
          </div>
          <div className={styles.title}>
            <h1>Sign in</h1>
            <p>Empower Your Projects, Simplify Your Success!</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputgrid}>
              <div>
                <Input
                  label="Email"
                  placeholder="hijuyed@gmail.com"
                  leftIcon={EmailIcon}
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className={styles.error}>{formik.errors.email}</span>
                )}
              </div>
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="• • • • • • • • • • "
                  leftIcon={LockIcon}
                  rightIcon={EyeIcon}
                  rightIconActive={EyeOffIcon}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <span className={styles.error}>{formik.errors.password}</span>
                )}
              </div>
           
              <div style={{ marginTop: '20px' }}>
                <AuthButton
                  text={isLoading ? 'Please wait...' : 'Sign in'}
                  icon={RightIcon}
                  type="submit"
                  disabled={isLoading}
                />
              </div>
            </div>
          </form>
  
        </div>
      </div>
   
    </div>
  );
}
